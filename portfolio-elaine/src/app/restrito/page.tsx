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
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AcessoRestritoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "first-access">("login");

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState("elainecsagurgel@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Estados do Primeiro Acesso
  const [firstEmail, setFirstEmail] = useState("elainecsagurgel@gmail.com");
  const [firstLoading, setFirstLoading] = useState(false);
  const [firstSuccess, setFirstSuccess] = useState<{
    message: string;
    link?: string;
    token?: string;
  } | null>(null);
  const [firstError, setFirstError] = useState("");

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

      // Redireciona para o painel administrativo
      router.push("/restrito/dashboard");
      router.refresh();
    } catch {
      setLoginError("Erro de comunicação com o servidor. Tente novamente.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFirstAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirstLoading(true);
    setFirstError("");
    setFirstSuccess(null);

    try {
      const res = await fetch("/api/auth/first-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: firstEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFirstError(data.message || "Erro ao processar solicitação.");
        return;
      }

      setFirstSuccess(data);
    } catch {
      setFirstError("Erro ao comunicar com o servidor.");
    } finally {
      setFirstLoading(false);
    }
  };

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
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Acesso Restrito
            </h1>
            <p className="text-sm text-teal-100/70 mt-1.5">
              Área de gerenciamento e edição do portfólio
            </p>
          </div>

          {/* Abas */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-navy-900/80 border border-navy-700/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === "login"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40"
                  : "text-teal-100/60 hover:text-white"
              }`}
            >
              Entrar com Senha
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("first-access");
                setFirstError("");
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === "first-access"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40"
                  : "text-teal-100/60 hover:text-white"
              }`}
            >
              Primeiro Acesso
            </button>
          </div>

          {/* E-mails Pré-Cadastrados Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-xs text-teal-100/80">
            <p className="font-semibold text-teal-300 mb-1 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Acesso exclusivo para e-mails autorizados:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="font-mono bg-navy-900/80 border border-teal-600/30 px-2.5 py-1 rounded-lg text-teal-200">
                elainecsagurgel@gmail.com
              </span>
              <span className="font-mono bg-navy-900/80 border border-teal-600/30 px-2.5 py-1 rounded-lg text-teal-200">
                sousa.natalialima1@gmail.com
              </span>
            </div>
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === "login" && (
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
                    placeholder="seu.email@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/90 border border-navy-700 text-white placeholder-teal-100/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-sm"
                  />
                </div>
                {/* Seletores rápidos de e-mail */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setLoginEmail("elainecsagurgel@gmail.com")}
                    className="text-[11px] text-teal-400/80 hover:text-teal-200 underline cursor-pointer"
                  >
                    Usar Elaine
                  </button>
                  <span className="text-teal-800">·</span>
                  <button
                    type="button"
                    onClick={() => setLoginEmail("sousa.natalialima1@gmail.com")}
                    className="text-[11px] text-teal-400/80 hover:text-teal-200 underline cursor-pointer"
                  >
                    Usar Natália
                  </button>
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
                    placeholder="Sua senha segura"
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
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {loginLoading ? "Verificando credenciais..." : "Acessar Painel"}
                <ArrowRight size={18} />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("first-access");
                    setFirstEmail(loginEmail);
                  }}
                  className="text-xs text-teal-300/80 hover:text-teal-100 underline cursor-pointer"
                >
                  Primeiro acesso? Clique aqui para definir sua senha
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRIMEIRO ACESSO */}
          {activeTab === "first-access" && (
            <div className="space-y-4">
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Se este for seu primeiro acesso, informe seu e-mail autorizado abaixo para receber o link seguro de validação e cadastrar sua senha conforme os padrões de segurança.
              </p>

              {firstError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{firstError}</span>
                </div>
              )}

              {firstSuccess ? (
                <div className="p-5 rounded-2xl bg-teal-950/60 border border-teal-500/40 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        Link de Segurança Gerado com Sucesso!
                      </h3>
                      <p className="text-xs text-teal-200/80 mt-1">
                        O link de validação tem validade de 24 horas e atende a todas as normas de segurança.
                      </p>
                    </div>
                  </div>

                  {firstSuccess.link && (
                    <div className="pt-2 border-t border-teal-800/40">
                      <p className="text-[11px] text-teal-300 font-semibold mb-2">
                        Clique no botão abaixo para prosseguir com a definição de senha:
                      </p>
                      <Link
                        href={firstSuccess.link}
                        className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <span>Definir Minha Senha Agora</span>
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFirstAccess} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-100/80 mb-1.5">
                      Selecione ou digite seu e-mail autorizado
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60"
                      />
                      <input
                        type="email"
                        value={firstEmail}
                        onChange={(e) => setFirstEmail(e.target.value)}
                        required
                        placeholder="elainecsagurgel@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/90 border border-navy-700 text-white placeholder-teal-100/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setFirstEmail("elainecsagurgel@gmail.com")}
                        className="text-[11px] text-teal-400/80 hover:text-teal-200 underline cursor-pointer"
                      >
                        Selecionar Elaine
                      </button>
                      <span className="text-teal-800">·</span>
                      <button
                        type="button"
                        onClick={() => setFirstEmail("sousa.natalialima1@gmail.com")}
                        className="text-[11px] text-teal-400/80 hover:text-teal-200 underline cursor-pointer"
                      >
                        Selecionar Natália
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={firstLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {firstLoading ? "Gerando link seguro..." : "Gerar Link de Validação"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
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

