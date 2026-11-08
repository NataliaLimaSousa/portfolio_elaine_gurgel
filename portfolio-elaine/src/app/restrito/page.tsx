"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function AcessoRestritoPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "forgot">("login");

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Estados do "Esqueceu a senha?"
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || "Falha ao realizar login.");
        return;
      }

      // Primeiro acesso com código inicial → troca obrigatória de senha
      if (data.mustChangePassword && data.redirectTo) {
        router.push(data.redirectTo);
        return;
      }

      router.push("/restrito/dashboard");
      router.refresh();
    } catch {
      setLoginError("Erro de comunicação com o servidor. Tente novamente.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch("/api/auth/first-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.redirectTo) {
        setForgotError(data.message || "Erro ao processar solicitação.");
        return;
      }

      router.push(data.redirectTo);
    } catch {
      setForgotError("Erro ao comunicar com o servidor.");
    } finally {
      setForgotLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 py-3 rounded-xl bg-navy-900/90 border border-navy-700 text-white placeholder-teal-100/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex flex-col justify-between p-4 sm:p-6 md:p-10 text-white selection:bg-teal-600 selection:text-white">
      {/* Top Header */}
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
          href="/"
          className="text-xs sm:text-sm text-teal-200/80 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>← Voltar ao site</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="mx-auto w-full max-w-lg my-8">
        <div className="bg-navy-800/90 border border-teal-500/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
          {/* Badge & Lock Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-inner">
              <Lock size={26} strokeWidth={2} />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#ffffff" }}
            >
              {view === "login" ? "Acesso Restrito" : "Esqueceu a senha?"}
            </h1>
            <p className="text-sm text-teal-100/70 mt-1.5">
              Área de gerenciamento e edição do portfólio
            </p>
          </div>

          {/* LOGIN */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
                  />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="seu.email@gmail.com"
                    className={`${inputClass} pr-4`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Sua senha ou código inicial"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setForgotEmail(loginEmail);
                      setForgotCode("");
                      setForgotError("");
                    }}
                    className="text-xs text-teal-300/80 hover:text-teal-100 underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-100/80 leading-relaxed flex items-start gap-2">
                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-teal-300" />
                <span>
                  <strong className="text-teal-300">Primeiro acesso?</strong> Entre com seu
                  e-mail autorizado e o código inicial fornecido. Em seguida, será solicitado
                  que você crie uma nova senha.
                </span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {loginLoading ? "Verificando credenciais..." : "Acessar Painel"}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* ESQUECEU A SENHA */}
          {view === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Para redefinir sua senha, informe seu e-mail autorizado e o código inicial de
                acesso. Em seguida, você poderá cadastrar uma nova senha.
              </p>

              {forgotError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{forgotError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
                  E-mail autorizado
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
                  />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="seu.email@gmail.com"
                    className={`${inputClass} pr-4`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
                  Código inicial de acesso
                </label>
                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
                  />
                  <input
                    type={showCode ? "text" : "password"}
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder="Digite o código inicial"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    aria-label={showCode ? "Ocultar código" : "Mostrar código"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 cursor-pointer"
                  >
                    {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {forgotLoading ? "Validando código..." : "Redefinir Senha"}
                <ArrowRight size={18} />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setLoginError("");
                  }}
                  className="text-xs text-teal-300/80 hover:text-teal-100 underline cursor-pointer"
                >
                  ← Voltar para o login
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="mx-auto w-full max-w-lg text-center text-xs text-teal-100/40 py-2 space-y-2">
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-teal-400" /> Criptografia PBKDF2
          </span>
          <span>·</span>
          <span>Proteção Anti-Brute Force</span>
          <span>·</span>
          <span>Conformidade LGPD</span>
        </div>
        <p>© 2026 CUIDAR+ · Dra. Elaine Gurgel · Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
