import crypto from "crypto";

// Chave secreta de sessão (usa variável de ambiente ou fallback gerado com salt fixo)
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "elaine-cuidar-portfolio-secret-key-2026-safe-guard-99406173";

// ── Requisitos de Senha ──────────────────────────────────────────────
export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  const errors: string[] = [];
  if (!hasMinLength) errors.push("Pelo menos 8 caracteres.");
  if (!hasUppercase) errors.push("Pelo menos 1 letra maiúscula.");
  if (!hasLowercase) errors.push("Pelo menos 1 letra minúscula.");
  if (!hasNumber) errors.push("Pelo menos 1 número.");
  if (!hasSpecialChar) errors.push("Pelo menos 1 caractere especial (!@#$%...).");

  return {
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errors,
  };
}

// ── Hash & Verificação de Senha (PBKDF2 SHA-512) ───────────────────
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const iterations = 100000;
  const keylen = 64;
  const digest = "sha512";
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  try {
    const { hash } = hashPassword(password, storedSalt);
    const hashBuffer = Buffer.from(hash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

// ── Geração de Tokens Criptográficos ────────────────────────────────
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ── Assinatura & Verificação de Sessão (HMAC-SHA256) ────────────────
export interface SessionPayload {
  email: string;
  createdAt: number;
  expiresAt: number;
  nonce: string;
}

export function createSignedSessionToken(email: string): string {
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

export function verifySignedSessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadString, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadString)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedSigBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadString, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ── Rate Limiting em Memória ────────────────────────────────────────
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(key: string): { allowed: boolean; waitMinutes?: number } {
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (record) {
    if (record.blockedUntil > now) {
      const waitMinutes = Math.ceil((record.blockedUntil - now) / 60000);
      return { allowed: false, waitMinutes };
    }
  }

  return { allowed: true };
}

export function registerFailedAttempt(key: string, maxAttempts = 5, lockDurationMs = 15 * 60 * 1000): void {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { attempts: 0, blockedUntil: 0 };

  record.attempts += 1;
  if (record.attempts >= maxAttempts) {
    record.blockedUntil = now + lockDurationMs;
  }
  rateLimitStore.set(key, record);
}

export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ── Sanitização de Entradas (XSS Protection) ────────────────────────
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:[^"']*/gi, "")
    .trim();
}
