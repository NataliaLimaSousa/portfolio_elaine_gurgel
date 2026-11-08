"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  LogOut,
  ExternalLink,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Phone,
  FileText,
  User,
  Award,
  GraduationCap,
  Calendar,
  Mic,
  Briefcase,
  Layers,
  HelpCircle,
} from "lucide-react";
import { PortfolioData } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega usuário atual e conteúdo
  useEffect(() => {
    async function loadInitialData() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/restrito");
          return;
        }
        const authData = await authRes.json();
        setCurrentUser(authData.user);

        const contentRes = await fetch("/api/content");
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setData(contentData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        showToast(resJson.message || "Erro ao salvar alterações.", "error");
        return;
      }

      showToast("Todas as informações do site foram salvas com sucesso!");
    } catch {
      showToast("Erro na comunicação com o servidor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    const confirmReset = window.confirm(
      "Tem certeza que deseja restaurar todo o conteúdo para o padrão original de fábrica? Todas as customizações atuais serão substituídas."
    );
    if (!confirmReset) return;

    setSaving(true);
    try {
      const res = await fetch("/api/content/reset", { method: "POST" });
      const resJson = await res.json();
      if (res.ok && resJson.content) {
        setData(resJson.content);
        showToast("Conteúdo restaurado para o padrão original!");
      } else {
        showToast("Erro ao restaurar conteúdo.", "error");
      }
    } catch {
      showToast("Erro de rede ao restaurar.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message || "Falha no envio da foto.", "error");
        return;
      }

      // Atualiza a foto do Hero
      if (data) {
        setData({
          ...data,
          hero: {
            ...data.hero,
            photo: json.url,
          },
        });
      }
      showToast("Nova foto enviada com sucesso! Lembre-se de clicar em Salvar.");
    } catch {
      showToast("Erro no upload da foto.", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-teal-200 text-sm font-medium">Carregando painel de gerenciamento...</p>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Apresentação (Hero)", icon: User },
    { id: "stats", label: "Números de Impacto", icon: Sparkles },
    { id: "about", label: "Sobre Mim", icon: FileText },
    { id: "expertise", label: "Áreas de Atuação", icon: Layers },
    { id: "timeline", label: "Trajetória Profissional", icon: Briefcase },
    { id: "education", label: "Formação & Cursos", icon: GraduationCap },
    { id: "teaching", label: "Docência", icon: Award },
    { id: "talks", label: "Palestras & Trabalhos", icon: Mic },
    { id: "events", label: "Eventos Organizados", icon: Calendar },
    { id: "awards", label: "Reconhecimentos", icon: Award },
    { id: "contact", label: "Contato & WhatsApp", icon: Phone },
    { id: "footer", label: "Rodapé & Identidade", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-teal-600 selection:text-white">
      {/* Toast Notifier */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 animate-bounce ${
            toast.type === "success"
              ? "bg-teal-600 text-white border border-teal-400"
              : "bg-red-600 text-white border border-red-400"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-700/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-xl">
            <Image
              src="/logo-cuidar.png"
              alt="CUIDAR+ logo"
              width={120}
              height={32}
              className="brightness-0 invert h-6 w-auto"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              Painel Administrativo CUIDAR+
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                CMS Ativo
              </span>
            </h1>
            <p className="text-[11px] text-teal-200/60 font-mono">
              Conectado como: {currentUser?.email || "Administrador"}
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={saving}
            className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-teal-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restaurar dados de fábrica"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Restaurar Padrão</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-teal-200/80 flex items-center gap-1.5 transition-colors"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Ver Site</span>
            <ExternalLink size={12} className="opacity-70" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-900/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-navy-800 hover:bg-red-950/60 border border-navy-700 hover:border-red-500/40 text-teal-200/70 hover:text-red-300 transition-colors cursor-pointer"
            title="Encerrar Sessão"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Tabs */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Navigation Tabs Sidebar */}
        <aside className="w-full lg:w-72 bg-navy-900/50 border-r border-navy-800/80 p-3 sm:p-4 shrink-0 overflow-x-auto lg:overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300/60 px-3 py-2 hidden lg:block">
            Seções Editáveis do Site
          </p>

          <nav className="flex lg:flex-col gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-950 font-bold"
                      : "text-slate-300 hover:bg-navy-800/80 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-teal-400/70"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Form Editor Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {/* TAB: HERO (APRESENTAÇÃO) */}
          {activeTab === "hero" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Apresentação Principal (Hero)</h2>
                <p className="text-xs text-slate-400">
                  Edite o título principal, textos de introdução, foto de capa e botões de chamada.
                </p>
              </div>

              {/* Foto de Perfil */}
              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5">
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-3">
                  Foto de Perfil Principal
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500/40 shadow-xl bg-navy-950 shrink-0">
                    <Image
                      src={data.hero.photo || "/elaine-photo.jpg"}
                      alt="Foto Elaine Gurgel"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-slate-300">
                      Você pode enviar uma nova foto do seu dispositivo ou informar o caminho/URL da imagem.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={15} />
                        <span>{uploadingPhoto ? "Enviando foto..." : "Fazer Upload de Nova Foto"}</span>
                      </button>

                      <input
                        type="text"
                        value={data.hero.photo || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, photo: e.target.value },
                          })
                        }
                        placeholder="/elaine-photo.jpg"
                        className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Subtítulo Superior (Etiqueta / Label)
                  </label>
                  <input
                    type="text"
                    value={data.hero.label}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, label: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Título Principal em Destaque
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.title}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, title: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white focus:border-teal-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Texto Descritivo (Subtítulo)
                  </label>
                  <textarea
                    rows={4}
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white focus:border-teal-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Botões CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Botão Principal (CTA 1)
                  </h3>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={data.hero.ctaPrimary.text}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            ctaPrimary: { ...data.hero.ctaPrimary, text: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Destino do Link</label>
                    <input
                      type="text"
                      value={data.hero.ctaPrimary.href}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            ctaPrimary: { ...data.hero.ctaPrimary, href: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Botão Secundário (CTA 2)
                  </h3>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={data.hero.ctaSecondary.text}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            ctaSecondary: { ...data.hero.ctaSecondary, text: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Destino do Link</label>
                    <input
                      type="text"
                      value={data.hero.ctaSecondary.href}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            ctaSecondary: { ...data.hero.ctaSecondary, href: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Selos / Badges */}
              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Selos de Especialidade (Badges)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          badges: [...data.hero.badges, "Nova Especialidade"],
                        },
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Adicionar Selo
                  </button>
                </div>

                <div className="space-y-2">
                  {data.hero.badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => {
                          const newBadges = [...data.hero.badges];
                          newBadges[idx] = e.target.value;
                          setData({ ...data, hero: { ...data.hero, badges: newBadges } });
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newBadges = data.hero.badges.filter((_, i) => i !== idx);
                          setData({ ...data, hero: { ...data.hero, badges: newBadges } });
                        }}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS (NÚMEROS DE IMPACTO) */}
          {activeTab === "stats" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Números de Destaque</h2>
                  <p className="text-xs text-slate-400">
                    Edite as estatísticas de impacto exibidas na barra colorida.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      stats: [...data.stats, { value: 1, label: "Novo indicador de impacto" }],
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Adicionar Indicador
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-teal-400">Indicador #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newStats = data.stats.filter((_, i) => i !== idx);
                          setData({ ...data, stats: newStats });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Valor Numérico</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...data.stats];
                          newStats[idx].value = parseInt(e.target.value) || 0;
                          setData({ ...data, stats: newStats });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-sm font-bold text-teal-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...data.stats];
                          newStats[idx].label = e.target.value;
                          setData({ ...data, stats: newStats });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ABOUT (SOBRE MIM) */}
          {activeTab === "about" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Sobre Mim</h2>
                <p className="text-xs text-slate-400">
                  Edite a biografia, parágrafos, citação marcante e links de perfil.
                </p>
              </div>

              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Título da Seção
                  </label>
                  <input
                    type="text"
                    value={data.about.sectionTitle || "Quem sou eu"}
                    onChange={(e) =>
                      setData({
                        ...data,
                        about: { ...data.about, sectionTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white"
                  />
                </div>

                {/* Parágrafos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-teal-300">
                      Parágrafos da Biografia
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            paragraphs: [...data.about.paragraphs, "Novo parágrafo sobre sua trajetória..."],
                          },
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Adicionar Parágrafo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.about.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex gap-2">
                        <textarea
                          rows={3}
                          value={p}
                          onChange={(e) => {
                            const newParagraphs = [...data.about.paragraphs];
                            newParagraphs[idx] = e.target.value;
                            setData({
                              ...data,
                              about: { ...data.about, paragraphs: newParagraphs },
                            });
                          }}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white leading-relaxed resize-none focus:border-teal-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newParagraphs = data.about.paragraphs.filter((_, i) => i !== idx);
                            setData({
                              ...data,
                              about: { ...data.about, paragraphs: newParagraphs },
                            });
                          }}
                          className="p-2 text-red-400 hover:bg-red-950/60 rounded-xl shrink-0 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citação em destaque */}
                <div className="pt-4 border-t border-navy-700">
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Frase de Citação em Destaque
                  </label>
                  <input
                    type="text"
                    value={data.about.quote}
                    onChange={(e) =>
                      setData({ ...data, about: { ...data.about, quote: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white italic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXPERTISE (ÁREAS DE ATUAÇÃO) */}
          {activeTab === "expertise" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Áreas de Atuação</h2>
                  <p className="text-xs text-slate-400">
                    Edite os cards de especialidades, ícones e descrições.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      expertise: [
                        ...data.expertise,
                        {
                          icon: "ShieldCheck",
                          title: "Nova Área de Atuação",
                          description: "Descrição detalhada dos serviços e competências desenvolvidas.",
                        },
                      ],
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Adicionar Área
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.expertise.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-teal-400">Card #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newExp = data.expertise.filter((_, i) => i !== idx);
                          setData({ ...data, expertise: newExp });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Ícone</label>
                        <select
                          value={card.icon}
                          onChange={(e) => {
                            const newExp = [...data.expertise];
                            newExp[idx].icon = e.target.value;
                            setData({ ...data, expertise: newExp });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                        >
                          <option value="ShieldCheck">ShieldCheck (Segurança)</option>
                          <option value="Activity">Activity (Atividade/Monitor)</option>
                          <option value="Cpu">Cpu (Robótica/Tecnologia)</option>
                          <option value="HeartPulse">HeartPulse (Transplante/Coração)</option>
                          <option value="GraduationCap">GraduationCap (Educação)</option>
                          <option value="Workflow">Workflow (Processos)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Título</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const newExp = [...data.expertise];
                            newExp[idx].title = e.target.value;
                            setData({ ...data, expertise: newExp });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Descrição</label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => {
                          const newExp = [...data.expertise];
                          newExp[idx].description = e.target.value;
                          setData({ ...data, expertise: newExp });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-slate-200 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TIMELINE (TRAJETÓRIA) */}
          {activeTab === "timeline" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Trajetória Profissional</h2>
                  <p className="text-xs text-slate-400">
                    Gerencie os marcos da carreira, instituições, períodos e destaques.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      timeline: [
                        {
                          period: "2026 – atual",
                          institution: "Nova Instituição Hospitalar",
                          role: "Cargo / Função",
                          highlights: "Principais realizações e indicadores alcançados.",
                          isCurrent: true,
                        },
                        ...data.timeline,
                      ],
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Adicionar Experiência
                </button>
              </div>

              <div className="space-y-4">
                {data.timeline.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-teal-400 font-bold">
                          #{idx + 1}
                        </span>
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={entry.isCurrent}
                            onChange={(e) => {
                              const newTl = [...data.timeline];
                              newTl[idx].isCurrent = e.target.checked;
                              setData({ ...data, timeline: newTl });
                            }}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Cargo Atual</span>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newTl = data.timeline.filter((_, i) => i !== idx);
                          setData({ ...data, timeline: newTl });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Período</label>
                        <input
                          type="text"
                          value={entry.period}
                          onChange={(e) => {
                            const newTl = [...data.timeline];
                            newTl[idx].period = e.target.value;
                            setData({ ...data, timeline: newTl });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Cargo / Função</label>
                        <input
                          type="text"
                          value={entry.role}
                          onChange={(e) => {
                            const newTl = [...data.timeline];
                            newTl[idx].role = e.target.value;
                            setData({ ...data, timeline: newTl });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Instituição</label>
                        <input
                          type="text"
                          value={entry.institution}
                          onChange={(e) => {
                            const newTl = [...data.timeline];
                            newTl[idx].institution = e.target.value;
                            setData({ ...data, timeline: newTl });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Destaques e Atividades</label>
                      <textarea
                        rows={2}
                        value={entry.highlights}
                        onChange={(e) => {
                          const newTl = [...data.timeline];
                          newTl[idx].highlights = e.target.value;
                          setData({ ...data, timeline: newTl });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-slate-200 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EDUCATION & COURSES (FORMAÇÃO E CURSOS) */}
          {activeTab === "education" && (
            <div className="space-y-8 max-w-4xl">
              {/* Formação Acadêmica */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Formação Acadêmica</h2>
                    <p className="text-xs text-slate-400">
                      Graduações, pós-graduações e especializações com titulação.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        education: [
                          ...data.education,
                          {
                            period: "2025 – 2026",
                            title: "Nova Especialização em Enfermagem",
                            institution: "Nome da Universidade / Instituição",
                          },
                        ],
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} /> Adicionar Formação
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.education.map((ed, idx) => (
                    <div
                      key={idx}
                      className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-teal-400">Formação #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newEd = data.education.filter((_, i) => i !== idx);
                            setData({ ...data, education: newEd });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Período</label>
                        <input
                          type="text"
                          value={ed.period}
                          onChange={(e) => {
                            const newEd = [...data.education];
                            newEd[idx].period = e.target.value;
                            setData({ ...data, education: newEd });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Título do Curso</label>
                        <input
                          type="text"
                          value={ed.title}
                          onChange={(e) => {
                            const newEd = [...data.education];
                            newEd[idx].title = e.target.value;
                            setData({ ...data, education: newEd });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Instituição</label>
                        <input
                          type="text"
                          value={ed.institution}
                          onChange={(e) => {
                            const newEd = [...data.education];
                            newEd[idx].institution = e.target.value;
                            setData({ ...data, education: newEd });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cursos Complementares */}
              <div className="space-y-4 pt-6 border-t border-navy-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Cursos Complementares</h3>
                    <p className="text-xs text-slate-400">
                      Tabela de aperfeiçoamentos e cursos de extensão.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        courses: [
                          {
                            year: "2026",
                            title: "Novo Curso de Aperfeiçoamento",
                            institution: "Instituição de Ensino",
                            hours: "40 h",
                          },
                          ...data.courses,
                        ],
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} /> Adicionar Curso
                  </button>
                </div>

                <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-navy-700 text-teal-300">
                        <th className="py-2.5 px-3">Ano</th>
                        <th className="py-2.5 px-3">Título do Curso</th>
                        <th className="py-2.5 px-3">Instituição</th>
                        <th className="py-2.5 px-3">Carga Horária</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700/50">
                      {data.courses.map((course, idx) => (
                        <tr key={idx} className="hover:bg-navy-700/30">
                          <td className="py-2 px-2 w-24">
                            <input
                              type="text"
                              value={course.year}
                              onChange={(e) => {
                                const newC = [...data.courses];
                                newC[idx].year = e.target.value;
                                setData({ ...data, courses: newC });
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={course.title}
                              onChange={(e) => {
                                const newC = [...data.courses];
                                newC[idx].title = e.target.value;
                                setData({ ...data, courses: newC });
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={course.institution}
                              onChange={(e) => {
                                const newC = [...data.courses];
                                newC[idx].institution = e.target.value;
                                setData({ ...data, courses: newC });
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                            />
                          </td>
                          <td className="py-2 px-2 w-28">
                            <input
                              type="text"
                              value={course.hours}
                              onChange={(e) => {
                                const newC = [...data.courses];
                                newC[idx].hours = e.target.value;
                                setData({ ...data, courses: newC });
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const newC = data.courses.filter((_, i) => i !== idx);
                                setData({ ...data, courses: newC });
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEACHING (DOCÊNCIA) */}
          {activeTab === "teaching" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Docência e Ensino</h2>
                <p className="text-xs text-slate-400">
                  Instituições onde leciona, disciplinas e cursos ministrados.
                </p>
              </div>

              {/* Vínculos Docentes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Vínculos de Ensino
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        teaching: {
                          ...data.teaching,
                          entries: [
                            ...data.teaching.entries,
                            {
                              institution: "Universidade ou Faculdade",
                              period: "2026 – atual",
                              description: "Descrição das disciplinas e atuação docente.",
                            },
                          ],
                        },
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Adicionar Vínculo
                  </button>
                </div>

                <div className="space-y-3">
                  {data.teaching.entries.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-teal-400">Vínculo #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newEntries = data.teaching.entries.filter((_, i) => i !== idx);
                            setData({
                              ...data,
                              teaching: { ...data.teaching, entries: newEntries },
                            });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Instituição</label>
                          <input
                            type="text"
                            value={item.institution}
                            onChange={(e) => {
                              const newEntries = [...data.teaching.entries];
                              newEntries[idx].institution = e.target.value;
                              setData({
                                ...data,
                                teaching: { ...data.teaching, entries: newEntries },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Período</label>
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => {
                              const newEntries = [...data.teaching.entries];
                              newEntries[idx].period = e.target.value;
                              setData({
                                ...data,
                                teaching: { ...data.teaching, entries: newEntries },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Descrição</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const newEntries = [...data.teaching.entries];
                            newEntries[idx].description = e.target.value;
                            setData({
                              ...data,
                              teaching: { ...data.teaching, entries: newEntries },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cursos Ministrados & CTA */}
              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Chamada de Ação (CTA)
                  </label>
                  <input
                    type="text"
                    value={data.teaching.cta}
                    onChange={(e) =>
                      setData({
                        ...data,
                        teaching: { ...data.teaching, cta: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: TALKS (PALESTRAS & PRODUÇÃO) */}
          {activeTab === "talks" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Palestras e Produção Científica</h2>
                  <p className="text-xs text-slate-400">
                    Apresentações, temas, anos e categorias de filtro.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      talks: [
                        {
                          year: "2026",
                          title: "Nova Palestra Científica sobre Boas Práticas em CME",
                          format: "Palestra",
                          filter: "CME",
                        },
                        ...data.talks,
                      ],
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Adicionar Palestra
                </button>
              </div>

              <div className="space-y-3">
                {data.talks.map((talk, idx) => (
                  <div
                    key={idx}
                    className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div className="w-24 shrink-0">
                      <label className="block text-[10px] text-slate-400">Ano</label>
                      <input
                        type="text"
                        value={talk.year}
                        onChange={(e) => {
                          const newTalks = [...data.talks];
                          newTalks[idx].year = e.target.value;
                          setData({ ...data, talks: newTalks });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-[10px] text-slate-400">Título da Palestra / Artigo</label>
                      <input
                        type="text"
                        value={talk.title}
                        onChange={(e) => {
                          const newTalks = [...data.talks];
                          newTalks[idx].title = e.target.value;
                          setData({ ...data, talks: newTalks });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white font-medium"
                      />
                    </div>

                    <div className="w-28 shrink-0">
                      <label className="block text-[10px] text-slate-400">Formato</label>
                      <select
                        value={talk.format}
                        onChange={(e) => {
                          const newTalks = [...data.talks];
                          newTalks[idx].format = e.target.value;
                          setData({ ...data, talks: newTalks });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                      >
                        <option value="Palestra">Palestra</option>
                        <option value="Congresso">Congresso</option>
                        <option value="Pôster">Pôster</option>
                      </select>
                    </div>

                    <div className="w-28 shrink-0">
                      <label className="block text-[10px] text-slate-400">Tema/Filtro</label>
                      <input
                        type="text"
                        value={talk.filter}
                        onChange={(e) => {
                          const newTalks = [...data.talks];
                          newTalks[idx].filter = e.target.value;
                          setData({ ...data, talks: newTalks });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newTalks = data.talks.filter((_, i) => i !== idx);
                        setData({ ...data, talks: newTalks });
                      }}
                      className="p-2 text-red-400 hover:text-red-300 mt-3 sm:mt-0 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EVENTS & AWARDS (EVENTOS E PRÊMIOS) */}
          {(activeTab === "events" || activeTab === "awards") && (
            <div className="space-y-8 max-w-4xl">
              {/* Eventos Organizados */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Eventos Científicos Organizados</h2>
                      <p className="text-xs text-slate-400">
                        Congressos, jornadas e simpósios onde atuou na comissão organizadora.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          events: [
                            { year: "2026", title: "Novo Congresso ou Simpósio de Enfermagem" },
                            ...data.events,
                          ],
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={15} /> Adicionar Evento
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {data.events.map((ev, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-800/60 border border-navy-700 rounded-2xl p-3.5 flex items-center gap-3"
                      >
                        <div className="w-24 shrink-0">
                          <input
                            type="text"
                            value={ev.year}
                            onChange={(e) => {
                              const newEv = [...data.events];
                              newEv[idx].year = e.target.value;
                              setData({ ...data, events: newEv });
                            }}
                            className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => {
                              const newEv = [...data.events];
                              newEv[idx].title = e.target.value;
                              setData({ ...data, events: newEv });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newEv = data.events.filter((_, i) => i !== idx);
                            setData({ ...data, events: newEv });
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reconhecimentos e Prêmios */}
              {activeTab === "awards" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Reconhecimentos & Premiações</h2>
                      <p className="text-xs text-slate-400">
                        Honrarias, prêmios hospitalares e reconhecimentos de sociedades médicas.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          awards: [
                            {
                              year: "2026",
                              title: "Novo Prêmio ou Título de Honra",
                              grantedBy: "Instituição Concessora",
                            },
                            ...data.awards,
                          ],
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={15} /> Adicionar Prêmio
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.awards.map((aw, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-800/60 border border-navy-700 rounded-2xl p-4 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-teal-400">Prêmio #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newAw = data.awards.filter((_, i) => i !== idx);
                              setData({ ...data, awards: newAw });
                            }}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Ano</label>
                          <input
                            type="text"
                            value={aw.year}
                            onChange={(e) => {
                              const newAw = [...data.awards];
                              newAw[idx].year = e.target.value;
                              setData({ ...data, awards: newAw });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Título do Reconhecimento</label>
                          <input
                            type="text"
                            value={aw.title}
                            onChange={(e) => {
                              const newAw = [...data.awards];
                              newAw[idx].title = e.target.value;
                              setData({ ...data, awards: newAw });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Concedido por</label>
                          <input
                            type="text"
                            value={aw.grantedBy}
                            onChange={(e) => {
                              const newAw = [...data.awards];
                              newAw[idx].grantedBy = e.target.value;
                              setData({ ...data, awards: newAw });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CONTACT & WHATSAPP (CONTATO E WHATSAPP) */}
          {activeTab === "contact" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Canais de Contato e WhatsApp</h2>
                <p className="text-xs text-slate-400">
                  Configure o número celular do botão flutuante e formulário de mensagens.
                </p>
              </div>

              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-4">
                <div className="p-4 rounded-xl bg-teal-950/50 border border-teal-500/30 text-xs text-teal-200">
                  <p className="font-semibold text-teal-300 mb-1">
                    Configuração do Botão Flutuante de Comunicação por Celular / WhatsApp:
                  </p>
                  <p>
                    O botão direciona diretamente para o contato solicitado:{" "}
                    <strong className="text-white font-mono">(85) 99940-6173</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Número Celular / WhatsApp (Exibição)
                    </label>
                    <input
                      type="text"
                      value={data.contact.whatsapp}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, whatsapp: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Dígitos Internacionais para Link wa.me
                    </label>
                    <input
                      type="text"
                      value={data.contact.whatsappNumber || "558599406173"}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      E-mail Principal de Contato
                    </label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Perfil no LinkedIn (Texto)
                    </label>
                    <input
                      type="text"
                      value={data.contact.linkedin}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      URL do Perfil no LinkedIn
                    </label>
                    <input
                      type="text"
                      value={data.contact.linkedinUrl}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, linkedinUrl: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      URL do Currículo Lattes
                    </label>
                    <input
                      type="text"
                      value={data.contact.lattesUrl}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, lattesUrl: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOOTER (RODAPÉ) */}
          {activeTab === "footer" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Rodapé & Informações Legais</h2>
                <p className="text-xs text-slate-400">
                  Edite a mensagem do rodapé, COREN e direitos autorais.
                </p>
              </div>

              <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                    Frase de Efeito (Tagline CUIDAR+)
                  </label>
                  <input
                    type="text"
                    value={data.footer.tagline}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: { ...data.footer, tagline: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Nome do Autor
                    </label>
                    <input
                      type="text"
                      value={data.footer.author}
                      onChange={(e) =>
                        setData({
                          ...data,
                          footer: { ...data.footer, author: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Registro Profissional COREN
                    </label>
                    <input
                      type="text"
                      value={data.footer.coren}
                      onChange={(e) =>
                        setData({
                          ...data,
                          footer: { ...data.footer, coren: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1.5">
                      Ano de Copyright
                    </label>
                    <input
                      type="number"
                      value={data.footer.year}
                      onChange={(e) =>
                        setData({
                          ...data,
                          footer: { ...data.footer, year: parseInt(e.target.value) || 2026 },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

