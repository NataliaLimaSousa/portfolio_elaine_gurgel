"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import type { ContactMessage } from "@/lib/contact";

async function fetchMessages(): Promise<{ messages: ContactMessage[]; error: string }> {
  try {
    const res = await fetch("/api/contact/messages", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { messages: [], error: json.message || "Não foi possível carregar as mensagens." };
    }
    return { messages: json.messages, error: "" };
  } catch {
    return { messages: [], error: "Falha de conexão ao carregar as mensagens." };
  }
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const apply = useCallback((result: { messages: ContactMessage[]; error: string }) => {
    setMessages(result.messages);
    setError(result.error);
  }, []);

  const load = useCallback(async () => apply(await fetchMessages()), [apply]);

  useEffect(() => {
    let active = true;
    fetchMessages().then((result) => {
      if (active) apply(result);
    });
    return () => {
      active = false;
    };
  }, [apply]);

  const toggleRead = async (m: ContactMessage) => {
    setBusyId(m.id);
    await fetch("/api/contact/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, read: !m.read }),
    });
    await load();
    setBusyId(null);
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Excluir definitivamente a mensagem de ${m.name}? Esta ação não pode ser desfeita.`)) return;
    setBusyId(m.id);
    await fetch(`/api/contact/messages?id=${encodeURIComponent(m.id)}`, { method: "DELETE" });
    await load();
    setBusyId(null);
  };

  const unread = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Mensagens do formulário</h2>
          <p className="text-xs text-slate-400">
            Contatos enviados pelo site, com o consentimento registrado. Exclua as mensagens que já
            foram atendidas ou quando o titular pedir (LGPD).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-800/60 px-3.5 py-2 text-xs font-semibold text-teal-200 hover:text-white cursor-pointer"
        >
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200">{error}</p>
      )}

      {messages === null && <p className="text-sm text-slate-400">Carregando...</p>}

      {messages && messages.length === 0 && !error && (
        <p className="rounded-2xl border border-navy-700 bg-navy-800/60 p-6 text-sm text-slate-300">
          Nenhuma mensagem recebida ainda.
        </p>
      )}

      {messages && messages.length > 0 && (
        <p className="text-xs text-teal-300">
          {messages.length} mensagem(ns) · {unread} não lida(s)
        </p>
      )}

      <ul className="space-y-4 list-none p-0">
        {messages?.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl border p-5 ${
              m.read ? "border-navy-700 bg-navy-800/40" : "border-teal-500/50 bg-navy-800/80"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-white">
                  {m.name}{" "}
                  {!m.read && (
                    <span className="ml-2 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold uppercase">
                      nova
                    </span>
                  )}
                </p>
                <p className="text-xs text-teal-300">{m.reason}</p>
              </div>
              <p className="text-xs text-slate-400">
                {new Date(m.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>

            {/* Conteúdo exibido como texto (nunca como HTML) */}
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-200">{m.message}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: seu contato pelo site CUIDAR+")}`}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-500"
              >
                <Mail size={14} /> Responder ({m.email})
              </a>
              <button
                type="button"
                disabled={busyId === m.id}
                onClick={() => void toggleRead(m)}
                className="flex items-center gap-2 rounded-xl border border-navy-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {m.read ? <EyeOff size={14} /> : <Eye size={14} />}
                {m.read ? "Marcar como não lida" : "Marcar como lida"}
              </button>
              <button
                type="button"
                disabled={busyId === m.id}
                onClick={() => void remove(m)}
                className="ml-auto flex items-center gap-2 rounded-xl border border-red-500/40 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/60 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
