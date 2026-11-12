import fs from "fs";
import path from "path";

/**
 * Armazenamento persistente de documentos JSON.
 *
 * - Produção (Vercel): o sistema de arquivos é somente leitura, então os dados
 *   ficam em um Redis (Upstash) acessado via REST. Basta conectar o Upstash ao
 *   projeto na Vercel (Storage → Upstash / Redis), que cria as variáveis
 *   KV_REST_API_URL / KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL / _TOKEN).
 * - Desenvolvimento local: sem essas variáveis, usa arquivos em src/data/<chave>.json.
 */

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY_PREFIX = "cuidar:";

const DATA_DIR = path.join(process.cwd(), "src", "data");

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Armazenamento não configurado: conecte um banco Redis (Upstash) ao projeto na Vercel para salvar dados."
    );
    this.name = "StorageNotConfiguredError";
  }
}

function isRedisConfigured(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

async function redisCommand(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (!res.ok || json.error) {
    throw new Error(`Falha no Redis: ${json.error || res.status}`);
  }
  return json.result;
}

function filePathFor(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

/** Lê um documento. Retorna null se ainda não existir. */
export async function readDocument<T>(key: string): Promise<T | null> {
  if (isRedisConfigured()) {
    const raw = await redisCommand(["GET", KEY_PREFIX + key]);
    return typeof raw === "string" ? (JSON.parse(raw) as T) : null;
  }

  const file = filePathFor(key);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

/** Grava (substitui) um documento. */
export async function writeDocument<T>(key: string, value: T): Promise<void> {
  if (isRedisConfigured()) {
    await redisCommand(["SET", KEY_PREFIX + key, JSON.stringify(value)]);
    return;
  }

  if (process.env.VERCEL) {
    // Na Vercel o disco é somente leitura: falha com mensagem clara
    throw new StorageNotConfiguredError();
  }

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePathFor(key), JSON.stringify(value, null, 2), "utf-8");
}

// ── Contador com expiração (limite de envios por visitante) ─────────
const memoryCounters = new Map<string, { count: number; expiresAt: number }>();

/**
 * Incrementa um contador que expira após `ttlSeconds` e devolve o novo valor.
 * Com Redis, o contador é compartilhado entre todas as instâncias do servidor;
 * sem Redis (desenvolvimento local), fica em memória.
 */
export async function incrementWithExpiry(key: string, ttlSeconds: number): Promise<number> {
  if (isRedisConfigured()) {
    const redisKey = KEY_PREFIX + "counter:" + key;
    const count = Number(await redisCommand(["INCR", redisKey]));
    if (count === 1) await redisCommand(["EXPIRE", redisKey, ttlSeconds]);
    return count;
  }

  const now = Date.now();
  const current = memoryCounters.get(key);
  if (!current || current.expiresAt < now) {
    memoryCounters.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
    return 1;
  }
  current.count += 1;
  return current.count;
}
