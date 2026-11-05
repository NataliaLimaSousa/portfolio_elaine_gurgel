"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  KeyRound,
  ShieldCheck,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Lock,
} from "lucide-react";

function DefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validação em tempo real dos critérios de segurança
  const rules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
      match: password.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  // Pontuação de força da senha (0 a 100)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (rules.minLength) score += 20;
    if (rules.uppercase) score += 20;
    if (rules.lowercase) score += 20;
    if (rules.number) score += 20;
    if (rules.specialChar) score += 20;
    return score;
  }, [rules]);

  const allRulesPassed =
    rules.minLength &&
    rules.uppercase &&
    rules.lowercase &&
    rules.number &&
    rules.specialChar &&
    rules.match;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token de validação ausente. Utilize o link enviado ao seu e-mail.");
      return;
    }

    if (!allRulesPassed) {
      setError("Por favor, cumpra todos os requisitos de segurança da senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Erro ao definir senha.");
        return;
      }

      // Redireciona para o dashboard com sessão autenticada
      router.push("/restrito/dashboard");
      router.refresh();
    } catch {
      setError("Falha de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy-800/90 border border-teal-500/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-inner">
          <KeyRound size={26} strokeWidth={2} />
        </div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Definir Senha Segura
        </h1>
        <p className="text-xs sm:text-sm text-teal-100/70 mt-1">
          {emailParam ? (
            <>
              Criando senha para:{" "}
              <strong className="text-teal-300 font-mono">{emailParam}</strong>
            </>
          ) : (
            "Crie sua senha de acesso seguindo as normas padrão de segurança"
          )}
        </p>
      </div>

      {!token && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
          <span>
            Atenção: Nenhum token de acesso foi detectado. Para cadastrar sua senha, solicite um link seguro na página inicial do Acesso Restrito.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
            Nova Senha
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua nova senha"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-navy-900/90 border border-navy-700 text-white placeholder-teal-100/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Barra visual de força da senha */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-teal-100/60">Força da senha:</span>
              <span
                className={`font-semibold ${
                  strengthScore < 60
                    ? "text-red-400"
                    : strengthScore < 100
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {strengthScore < 40
                  ? "Muito Fraca"
                  : strengthScore < 80
                  ? "Média"
                  : strengthScore < 100
                  ? "Forte"
                  : "Excelente"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  strengthScore < 60
                    ? "bg-red-500"
                    : strengthScore < 100
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${strengthScore}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Digite a mesma senha novamente"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/90 border border-navy-700 text-white placeholder-teal-100/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Checklist de Normas de Segurança */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-navy-700/80 space-y-2 text-xs">
          <p className="font-semibold text-teal-300 text-[11px] uppercase tracking-wider mb-2">
            Requisitos Obrigatórios de Segurança:
          </p>

          <div className="flex items-center gap-2">
            {rules.minLength ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.minLength ? "text-emerald-300" : "text-teal-100/60"}>
              Pelo menos 8 caracteres
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rules.uppercase ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.uppercase ? "text-emerald-300" : "text-teal-100/60"}>
              Pelo menos 1 letra maiúscula (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rules.lowercase ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.lowercase ? "text-emerald-300" : "text-teal-100/60"}>
              Pelo menos 1 letra minúscula (a-z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rules.number ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.number ? "text-emerald-300" : "text-teal-100/60"}>
              Pelo menos 1 número (0-9)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rules.specialChar ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.specialChar ? "text-emerald-300" : "text-teal-100/60"}>
              Pelo menos 1 caractere especial (!@#$%...)
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-navy-700/60">
            {rules.match ? (
              <Check size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={14} className="text-teal-100/40 shrink-0" />
            )}
            <span className={rules.match ? "text-emerald-300" : "text-teal-100/60"}>
              As senhas são idênticas
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !allRulesPassed}
          className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando nova senha..." : "Salvar Senha e Entrar"}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}

export default function DefinirSenhaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex flex-col justify-between p-4 sm:p-6 md:p-10 text-white selection:bg-teal-600 selection:text-white">
      <header className="mx-auto w-full max-w-4xl flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md group-hover:bg-white/20 transition-all">
            <Image
              src="/logo-cuidar.png"
              alt="CUIDAR+ logo"
              width={140}
              height={36}
              className="brightness-0 invert h-7 w-auto"
            />
          </div>
        </Link>

        <Link
          href="/restrito"
          className="text-xs sm:text-sm text-teal-200/80 hover:text-white transition-colors"
        >
          ← Voltar para Login
        </Link>
      </header>

      <main className="mx-auto w-full max-w-lg my-8">
        <Suspense
          fallback={
            <div className="bg-navy-800/90 rounded-3xl p-8 text-center text-teal-200">
              Carregando formulário seguro...
            </div>
          }
        >
          <DefinirSenhaForm />
        </Suspense>
      </main>

      <footer className="mx-auto w-full max-w-lg text-center text-xs text-teal-100/40 py-2">
        <div className="flex items-center justify-center gap-2 text-[11px] mb-1">
          <ShieldCheck size={13} className="text-teal-400" />
          <span>Norma de Senhas Seguras NIST SP 800-63B</span>
        </div>
        <p>© 2026 CUIDAR+ · Dra. Elaine Gurgel</p>
      </footer>
    </div>
  );
}

