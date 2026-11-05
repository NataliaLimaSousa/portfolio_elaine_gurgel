import fs from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "src", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getAllUsers(): UserRecord[] {
  ensureDirectoryExists(DATA_DIR);

  if (!fs.existsSync(USERS_FILE)) {
    // Inicializa com os usuários pré-cadastrados
    const initialUsers: UserRecord[] = [
      {
        email: "elainecsagurgel@gmail.com",
        name: "Elaine C. S. A. Gurgel",
        hasPassword: false,
        createdAt: new Date().toISOString(),
      },
      {
        email: "sousa.natalialima1@gmail.com",
        name: "Natália Lima",
        hasPassword: false,
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), "utf-8");
    return initialUsers;
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const users: UserRecord[] = JSON.parse(raw);
    
    // Garante que ambos os e-mails pré-cadastrados existam no arquivo
    let modified = false;
    for (const authEmail of AUTHORIZED_EMAILS) {
      if (!users.some((u) => u.email.toLowerCase() === authEmail)) {
        users.push({
          email: authEmail,
          name: authEmail.includes("elaine") ? "Elaine C. S. A. Gurgel" : "Natália Lima",
          hasPassword: false,
          createdAt: new Date().toISOString(),
        });
        modified = true;
      }
    }
    if (modified) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    }
    return users;
  } catch (err) {
    console.error("Erro ao carregar users.json:", err);
    return [];
  }
}

export function saveUsers(users: UserRecord[]): void {
  ensureDirectoryExists(DATA_DIR);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function getUserByEmail(email: string): UserRecord | null {
  const normalized = email.toLowerCase().trim();
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function isEmailAuthorized(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.includes(normalized);
}

// ── Solicitação de Primeiro Acesso / Redefinição de Senha ───────────
export async function generateFirstAccessLink(email: string, origin: string): Promise<{
  success: boolean;
  message: string;
  token?: string;
  link?: string;
}> {
  const normalized = email.toLowerCase().trim();

  // Verifica se o e-mail consta na lista de acesso pré-cadastrado
  if (!isEmailAuthorized(normalized)) {
    return {
      success: false,
      message: "Acesso restrito. Este e-mail não possui autorização de acesso ao sistema.",
    };
  }

  // Verifica rate limit por e-mail
  const rate = checkRateLimit(`first-access:${normalized}`);
  if (!rate.allowed) {
    return {
      success: false,
      message: `Muitas solicitações. Aguarde ${rate.waitMinutes} minutos antes de tentar novamente.`,
    };
  }

  const rawToken = generateSecureToken();
  const hashed = hashToken(rawToken);
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 horas

  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === normalized);

  if (userIndex === -1) {
    users.push({
      email: normalized,
      name: normalized.includes("elaine") ? "Elaine Gurgel" : "Usuário Autorizado",
      hasPassword: false,
      resetTokenHash: hashed,
      resetTokenExpiry: expiry,
      createdAt: new Date().toISOString(),
    });
  } else {
    users[userIndex].resetTokenHash = hashed;
    users[userIndex].resetTokenExpiry = expiry;
  }

  saveUsers(users);

  const link = `${origin}/restrito/definir-senha?token=${rawToken}&email=${encodeURIComponent(normalized)}`;

  return {
    success: true,
    message: "Link de acesso e definição de senha gerado com segurança.",
    token: rawToken,
    link,
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

  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalized);

  if (!user || !user.resetTokenHash || !user.resetTokenExpiry) {
    return { success: false, message: "Token inválido ou não encontrado. Solicite um novo link de acesso." };
  }

  if (Date.now() > user.resetTokenExpiry) {
    return { success: false, message: "O link de acesso expirou (validade de 24h). Solicite um novo link." };
  }

  const hashedIncoming = hashToken(token);
  if (hashedIncoming !== user.resetTokenHash) {
    return { success: false, message: "Token de segurança incorreto ou violado." };
  }

  // Gera hash seguro PBKDF2
  const { hash, salt } = hashPassword(newPassword);

  user.passwordHash = hash;
  user.salt = salt;
  user.hasPassword = true;
  user.resetTokenHash = undefined;
  user.resetTokenExpiry = undefined;

  saveUsers(users);
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
): Promise<{ success: boolean; message: string; sessionToken?: string; user?: { email: string; name: string } }> {
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

  const user = getUserByEmail(normalized);

  if (!user || !user.hasPassword || !user.passwordHash || !user.salt) {
    return {
      success: false,
      message: "Este e-mail é autorizado, mas ainda não possui senha cadastrada. Utilize a aba 'Primeiro Acesso' para definir sua senha.",
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

  const users = getAllUsers();
  const uIndex = users.findIndex((u) => u.email.toLowerCase() === normalized);
  if (uIndex !== -1) {
    users[uIndex].lastLogin = new Date().toISOString();
    saveUsers(users);
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

  const user = getUserByEmail(payload.email);
  return user;
}
