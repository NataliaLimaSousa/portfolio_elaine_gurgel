import { NextRequest, NextResponse } from "next/server";
import { StorageNotConfiguredError, incrementWithExpiry } from "@/lib/storage";
import {
  CONTACT_LIMITS,
  addContactMessage,
  hashVisitor,
  validateContact,
} from "@/lib/contact";

const MAX_PER_HOUR = 5;
const MIN_FILL_MS = 3000; // formulários preenchidos em menos de 3 s costumam ser robôs

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf-8") > CONTACT_LIMITS.bodyMaxBytes) {
      return json({ success: false, message: "Mensagem muito grande." }, 413);
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ success: false, message: "Requisição inválida." }, 400);
    }
    if (!body || typeof body !== "object") {
      return json({ success: false, message: "Requisição inválida." }, 400);
    }

    // Consentimento é obrigatório e precisa ser explícito
    if (body.consent !== true) {
      return json(
        { success: false, message: "É necessário concordar com o tratamento dos dados para enviar a mensagem." },
        400
      );
    }

    // Anti-spam silencioso: campo-isca preenchido ou envio rápido demais → finge sucesso, não grava
    const startedAt = Number(body.startedAt);
    const tooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS;
    if ((typeof body.website === "string" && body.website.trim() !== "") || tooFast) {
      return json({ success: true, message: "Mensagem enviada." });
    }

    const parsed = validateContact(body);
    if (!parsed.ok) {
      return json({ success: false, message: parsed.error }, 400);
    }

    // Limite de envios por visitante (IP guardado apenas como hash, com expiração de 1 h)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const attempts = await incrementWithExpiry(`contact:${hashVisitor(ip)}`, 60 * 60);
    if (attempts > MAX_PER_HOUR) {
      return json(
        { success: false, message: "Muitas mensagens em pouco tempo. Tente novamente mais tarde ou fale pelo WhatsApp." },
        429
      );
    }

    await addContactMessage(parsed.value);
    return json({ success: true, message: "Mensagem enviada. Obrigada pelo contato!" });
  } catch (error) {
    // Não registra o conteúdo da mensagem nos logs (dados pessoais)
    console.error("Erro na API contact:", error instanceof Error ? error.message : "desconhecido");
    if (error instanceof StorageNotConfiguredError) {
      return json(
        { success: false, message: "O formulário está temporariamente indisponível. Por favor, fale pelo WhatsApp ou e-mail." },
        503
      );
    }
    return json({ success: false, message: "Não foi possível enviar agora. Tente pelo WhatsApp ou e-mail." }, 500);
  }
}
