import crypto from "crypto";
import { readDocument, writeDocument } from "./storage";

export const CONTACT_CONSENT_VERSION = "2026-11-v1";
const MESSAGES_KEY = "contact-messages";
const MAX_STORED_MESSAGES = 500;

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  /** Registro do consentimento dado pelo visitante ao enviar o formulário */
  consent: { givenAt: string; version: string };
  read?: boolean;
}

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  reasonMax: 80,
  messageMin: 10,
  messageMax: 2000,
  bodyMaxBytes: 12 * 1024,
};

const EMAIL_REGEX = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Remove caracteres de controle e normaliza espaços; o texto é sempre exibido escapado. */
export function cleanText(value: unknown, keepNewlines = false): string {
  if (typeof value !== "string") return "";
  const noControl = value.replace(keepNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  return noControl.replace(/[ \t]+/g, " ").trim();
}

export interface ContactInput {
  name: string;
  email: string;
  reason: string;
  message: string;
}

export function validateContact(body: Record<string, unknown>):
  | { ok: true; value: ContactInput }
  | { ok: false; error: string } {
  const name = cleanText(body.name);
  const email = cleanText(body.email).toLowerCase();
  const reason = cleanText(body.reason);
  const message = cleanText(body.message, true);

  if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax) {
    return { ok: false, error: "Informe seu nome (até 100 caracteres)." };
  }
  if (email.length > CONTACT_LIMITS.emailMax || !EMAIL_REGEX.test(email)) {
    return { ok: false, error: "Informe um e-mail válido." };
  }
  if (!reason || reason.length > CONTACT_LIMITS.reasonMax) {
    return { ok: false, error: "Selecione o assunto." };
  }
  if (message.length < CONTACT_LIMITS.messageMin || message.length > CONTACT_LIMITS.messageMax) {
    return {
      ok: false,
      error: `Escreva uma mensagem entre ${CONTACT_LIMITS.messageMin} e ${CONTACT_LIMITS.messageMax} caracteres.`,
    };
  }
  return { ok: true, value: { name, email, reason, message } };
}

/** Hash do IP apenas para limitar abusos; o IP em si nunca é gravado. */
export function hashVisitor(ip: string): string {
  const salt = process.env.SESSION_SECRET || "cuidar-contact";
  return crypto.createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32);
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  return (await readDocument<ContactMessage[]>(MESSAGES_KEY)) || [];
}

export async function addContactMessage(input: ContactInput): Promise<void> {
  const now = new Date().toISOString();
  const messages = await listContactMessages();
  messages.unshift({
    id: crypto.randomUUID(),
    createdAt: now,
    ...input,
    consent: { givenAt: now, version: CONTACT_CONSENT_VERSION },
    read: false,
  });
  await writeDocument(MESSAGES_KEY, messages.slice(0, MAX_STORED_MESSAGES));
}

export async function setMessageRead(id: string, read: boolean): Promise<boolean> {
  const messages = await listContactMessages();
  const target = messages.find((m) => m.id === id);
  if (!target) return false;
  target.read = read;
  await writeDocument(MESSAGES_KEY, messages);
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const messages = await listContactMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  await writeDocument(MESSAGES_KEY, next);
  return true;
}
