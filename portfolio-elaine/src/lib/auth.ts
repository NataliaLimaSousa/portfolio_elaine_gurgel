import crypto from "crypto";
import { cookies } from "next/headers";
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
  createSignedSessionToken,
  verifySignedSessionToken,
  checkRateLimit,
  registerFailedAttempt,
  clearRateLimit,
  validatePasswordStrength,
} from "./security";
import { readDocument, writeDocument } from "./storage";

export const AUTHORIZED_EMAILS = [
  "elainecsagurgel@gmail.com",
  "sousa.natalialima1@gmail.com",
].map((e) => e.toLowerCase().trim());

export interface UserRecord {
  email: string;
  name: string;
  hasPassword: boolean;
  passwordHash?: string;
  salt?: string;
  resetTokenHash?: string;
  resetTokenExpiry?: number;
  lastLogin?: string;
  createdAt: string;
}

const USERS_KEY = "users";

function defaultUserName(email: string): string {
  return email.includes("elaine") ? "Elaine C. S. A. Gurgel" : "Natália Lima";
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const users = (await readDocument<UserRecord[]>(USERS_KEY)) || [];

  // Garante que todos os e-mails autorizados existam (sem senha → primeiro acesso)
  for (const authEmail of AUTHORIZED_EMAILS) {
    if (!users.some((u) => u.email.toLowerCase() === authEmail)) {
      users.push({
        email: authEmail,
        name: defaultUserName(authEmail),
        hasPassword: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
  return users;
}

export async function saveUsers(users: UserRecord[]): Promise<void> {
  await writeDocument(USERS_KEY, users);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.toLowerCase().trim();
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function isEmailAuthorized(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.includes(normalized);
}

// ── Código Inicial de Acesso ────────────────────────────────────────
// Usado no primeiro acesso e na opção "Esqueceu a senha?".
export const INITIAL_ACCESS_CODE =
  process.env.INITIAL_ACCESS_CODE || "primeiroacesso123";

function isInitialAccessCode(code: string): boolean {
  const a = Buffer.from(hashToken(code), "hex");
  const b = Buffer.from(hashToken(INITIAL_ACCESS_CODE), "hex");
  return crypto.timingSafeEqual(a, b);
}

// Gera um token temporário (15 min) que autoriza a troca de senha
async function issuePasswordChangeToken(normalizedEmail: string): Promise<string> {
  const rawToken = generateSecureToken();
  const users = await getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) throw new Error("Usuário não encontrado");
  user.resetTokenHash = hashToken(rawToken);
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await saveUsers(users);
  return rawToken;
}

function buildChangePasswordPath(email: string, token: string): string {
  return `/restrito/definir-senha?token=${token}&email=${encodeURIComponent(email)}`;
}

// ── Esqueceu a Senha: valida e-mail + código inicial ────────────────
export async function requestPasswordResetWithCode(
  email: string,
  code: string,
  ip = "unknown"
): Promise<{ success: boolean; message: string; redirectTo?: string }> {
  const normalized = email.toLowerCase().trim();
  const rateKey = `reset:${normalized}:${ip}`;

  const rate = checkRateLimit(rateKey);
  if (!rate.allowed) {
    return {
      success: false,
      message: `Muitas tentativas incorretas. Aguarde ${rate.waitMinutes} minutos antes de tentar novamente.`,
    };
  }

  if (!isEmailAuthorized(normalized) || !isInitialAccessCode(code)) {
    registerFailedAttempt(rateKey);
    return { success: false, message: "E-mail não autorizado ou código inicial incorreto." };
  }

  clearRateLimit(rateKey);
  const token = await issuePasswordChangeToken(normalized);

  return {
    success: true,
    message: "Código validado. Defina sua nova senha.",
    redirectTo: buildChangePasswordPath(normalized, token),
  };
}

// ── Definição de Senha com Token Seguro ─────────────────────────────
export async function setUserPasswordWithToken(
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const normalized = email.toLowerCase().trim();

  if (!isEmailAuthorized(normalized)) {
    return { success: false, message: "E-mail não autorizado." };
  }

  // Validação estrita de normas de segurança de senha
  const strength = validatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return {
      success: false,
      message: `A senha não atende aos requisitos de segurança: ${strength.errors.join(" ")}`,
    };
  }

  const users = await getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalized);

  if (!user || !user.resetTokenHash || !user.resetTokenExpiry) {
    return { success: false, message: "Solicitação inválida ou já utilizada. Entre novamente com o código inicial." };
  }

  if (Date.now() > user.resetTokenExpiry) {
    return { success: false, message: "O tempo para alterar a senha expirou (15 min). Entre novamente com o código inicial." };
  }

  const hashedIncoming = hashToken(token);
  if (hashedIncoming !== user.resetTokenHash) {
    return { success: false, message: "Solicitação inválida. Entre novamente com o código inicial." };
  }

  // Gera hash seguro PBKDF2
  const { hash, salt } = hashPassword(newPassword);

  user.passwordHash = hash;
  user.salt = salt;
  user.hasPassword = true;
  user.resetTokenHash = undefined;
  user.resetTokenExpiry = undefined;

  await saveUsers(users);
  clearRateLimit(`login:${normalized}`);

  return {
    success: true,
    message: "Senha definida com sucesso! Agora você já pode acessar com seu e-mail e senha.",
  };
}

// ── Validação de Login ──────────────────────────────────────────────
export async function authenticateUser(
  email: string,
  password: string,
  ip = "unknown"
): Promise<{
  success: boolean;
  message: string;
  sessionToken?: string;
  mustChangePassword?: boolean;
  redirectTo?: string;
  user?: { email: string; name: string };
}> {
  const normalized = email.toLowerCase().trim();

  // Verifica rate limit
  const rateKey = `login:${normalized}:${ip}`;
  const rate = checkRateLimit(rateKey);
  if (!rate.allowed) {
    return {
      success: false,
      message: `Muitas tentativas incorretas. Conta temporariamente bloqueada por segurança. Tente novamente em ${rate.waitMinutes} minutos.`,
    };
  }

  if (!isEmailAuthorized(normalized)) {
    registerFailedAttempt(rateKey);
    return {
      success: false,
      message: "Credenciais inválidas ou e-mail não autorizado.",
    };
  }

  const user = await getUserByEmail(normalized);

  // Primeiro acesso: ainda sem senha própria → exige o código inicial
  if (!user || !user.hasPassword || !user.passwordHash || !user.salt) {
    if (!isInitialAccessCode(password)) {
      registerFailedAttempt(rateKey);
      return {
        success: false,
        message: "Primeiro acesso: utilize o código inicial fornecido para entrar.",
      };
    }
    clearRateLimit(rateKey);
    const token = await issuePasswordChangeToken(normalized);
    return {
      success: true,
      mustChangePassword: true,
      message: "Primeiro acesso identificado. Crie uma nova senha para continuar.",
      redirectTo: buildChangePasswordPath(normalized, token),
    };
  }

  const isValidPassword = verifyPassword(password, user.passwordHash, user.salt);

  if (!isValidPassword) {
    registerFailedAttempt(rateKey);
    return {
      success: false,
      message: "E-mail ou senha incorretos.",
    };
  }

  // Sucesso: limpa tentativas e cria sessão assinada
  clearRateLimit(rateKey);

  // Registra último acesso (não impede o login se a gravação falhar)
  try {
    const users = await getAllUsers();
    const uIndex = users.findIndex((u) => u.email.toLowerCase() === normalized);
    if (uIndex !== -1) {
      users[uIndex].lastLogin = new Date().toISOString();
      await saveUsers(users);
    }
  } catch (err) {
    console.error("Não foi possível registrar o último acesso:", err);
  }

  const sessionToken = createSignedSessionToken(normalized);

  return {
    success: true,
    message: "Login realizado com sucesso.",
    sessionToken,
    user: {
      email: user.email,
      name: user.name,
    },
  };
}

// ── Verificação de Sessão Atual ─────────────────────────────────────
export async function getCurrentSessionUser(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cuidar_session")?.value;

  if (!sessionCookie) return null;

  const payload = verifySignedSessionToken(sessionCookie);
  if (!payload) return null;

  const user = await getUserByEmail(payload.email);
  return user;
}
