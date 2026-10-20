import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Gamepad2,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { maskPhone, maskPlayerId } from "@/lib/masks";
import {
  FUNCOES,
  PATENTES_LATAM,
  GUILD_NAME,
  GUILD_MARK,
  GUILD_TAGLINE,
} from "@/lib/recruitment";
import {
  CARGO_CONFIG,
  loadLines,
  loadMembers,
  saveMembers,
  type GuildCargo,
  type GuildLine,
  type GuildMember,
} from "@/lib/guild";
import {
  fetchLinesSupabase,
  isSupabaseConfigured,
  upsertMemberSupabase,
} from "@/lib/supabase";
import {
  playApproveSound,
  playClickSound,
  playDenySound,
  playSuccessSound,
} from "@/lib/sound";

export const Route = createFileRoute("/cadastro-membro")({
  head: () => ({
    meta: [
      { title: "LATAM 友 · Formulário de Membro Oficial" },
      {
        name: "description",
        content:
          "Formulário de cadastro oficial de membros da guilda LATAM 友. Preencha seus dados para entrar no Roster.",
      },
      { property: "og:title", content: "LATAM 友 · Formulário de Membro Oficial" },
      {
        property: "og:description",
        content:
          "Formulário de cadastro oficial de membros da guilda LATAM 友. Preencha seus dados para entrar no Roster.",
      },
      { property: "og:image", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
      { property: "og:image:secure_url", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "600" },
      { property: "og:image:height", content: "600" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://latam2.nyxaria.workers.dev/cadastro-membro" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "LATAM 友 · Formulário de Membro Oficial" },
      {
        name: "twitter:description",
        content:
          "Formulário de cadastro oficial de membros da guilda LATAM 友. Preencha seus dados para entrar no Roster.",
      },
      { name: "twitter:image", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
    ],
  }),
  component: CadastroMembroPage,
});

function CadastroMembroPage() {
  const [lines, setLines] = useState<GuildLine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMember, setSubmittedMember] = useState<GuildMember | null>(null);
  const [copiedFicha, setCopiedFicha] = useState(false);

  // Form states exatamente como solicitado pelo operador
  const [nick, setNick] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [idConta, setIdConta] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [funcao, setFuncao] = useState("rush");
  const [patente, setPatente] = useState("diamente_mestre");
  const [cargo, setCargo] = useState<GuildCargo>("membro");
  const [lineId, setLineId] = useState("");
  const [nota, setNota] = useState("");

  // Erros
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse URL query parameters (?cargo=...&line=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const urlCargo = sp.get("cargo");
      const urlLine = sp.get("line");
      if (urlCargo && urlCargo in CARGO_CONFIG) {
        setCargo(urlCargo as GuildCargo);
      }
      if (urlLine) {
        setLineId(urlLine);
      }
    }
  }, []);

  // Carregar Lines
  useEffect(() => {
    let isMounted = true;
    const local = loadLines();
    if (local.length > 0) setLines(local);

    if (isSupabaseConfigured) {
      fetchLinesSupabase()
        .then((data) => {
          if (isMounted && data && data.length > 0) {
            setLines(data);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  function handleNickChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNick(e.target.value);
    if (errors.nick) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.nick;
        return next;
      });
    }
  }

  function handleIdadeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setIdade(raw);
    if (errors.idade) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.idade;
        return next;
      });
    }
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPlayerId(e.target.value);
    setIdConta(masked);
    if (errors.idConta) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.idConta;
        return next;
      });
    }
  }

  function handleWhatsappChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value);
    setWhatsapp(masked);
    if (errors.whatsapp) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.whatsapp;
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanNick = nick.trim();
    const cleanNome = nome.trim();
    const cleanIdade = idade.trim();
    const cleanId = idConta.replace(/\D/g, "");
    const cleanPhone = whatsapp.replace(/\D/g, "");

    if (!cleanNick || cleanNick.length < 2) {
      newErrors.nick = "Informe seu Nick no Free Fire.";
    }
    if (!cleanNome) {
      newErrors.nome = "Informe seu Nome.";
    }
    if (!cleanIdade || parseInt(cleanIdade, 10) < 10) {
      newErrors.idade = "Informe uma idade válida.";
    }
    if (!cleanId || cleanId.length < 7) {
      newErrors.idConta = "Informe um ID da Conta válido (7 a 12 números).";
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.whatsapp = "Informe um WhatsApp válido com DDD.";
    }

    if (Object.keys(newErrors).length > 0) {
      playDenySound();
      setErrors(newErrors);
      toast.error("Preencha todos os campos da ficha corretamente.");
      return;
    }

    setIsSubmitting(true);
    playClickSound();

    try {
      const now = new Date();
      const enteredFormatted = now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const member: GuildMember = {
        id: `mem-${Date.now()}`,
        nick: cleanNick,
        nome: cleanNome,
        idade: cleanIdade,
        idConta: cleanId,
        whatsapp: whatsapp.trim(),
        cargo: cargo || "membro",
        funcao: funcao || "rush",
        patente: patente || "diamente_mestre",
        lineId: lineId || undefined,
        status: "ativo",
        entrouEm: enteredFormatted,
        nota: nota.trim() || undefined,
      };

      // 1. Salvar no Supabase
      if (isSupabaseConfigured) {
        await upsertMemberSupabase(member);
      }

      // 2. Salvar no cache local para sincronização imediata
      const currentList = loadMembers();
      const filtered = currentList.filter(
        (m) => m.id !== member.id && m.idConta !== member.idConta
      );
      saveMembers([member, ...filtered]);

      playSuccessSound();
      setSubmittedMember(member);
      toast.success(`Ficha de ${cleanNick} registrada no Roster Oficial!`);
    } catch (err) {
      console.error("[Cadastro Membro] Erro ao cadastrar:", err);
      toast.error("Erro ao salvar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyFicha(m: GuildMember) {
    playClickSound();
    const text = [
      `*Nick:* ${m.nick}`,
      `*Nome:* ${m.nome}`,
      `idade: ${m.idade || "—"}`,
      `*ID da Conta:* ${m.idConta}`,
      `*WhatsApp:* ${m.whatsapp}`,
      `*Função:* ${FUNCOES.find((f) => f.value === m.funcao)?.label || m.funcao}`,
      `*Patente:* ${PATENTES_LATAM.find((p) => p.value === m.patente)?.label || m.patente}`,
    ].join("\n");

    void navigator.clipboard.writeText(text);
    setCopiedFicha(true);
    toast.success("Ficha formatada copiada!");
    setTimeout(() => setCopiedFicha(false), 2000);
  }

  function handleReset() {
    playClickSound();
    setSubmittedMember(null);
    setNick("");
    setNome("");
    setIdade("");
    setIdConta("");
    setWhatsapp("");
    setFuncao("rush");
    setPatente("diamente_mestre");
    setNota("");
    setErrors({});
  }

  const selectedLine = lines.find((l) => l.id === lineId);
  const cargoConfig = CARGO_CONFIG[cargo] || CARGO_CONFIG.membro;
  const CargoIcon = cargoConfig.icon;

  return (
    <main className="page-bg min-h-screen flex flex-col justify-between">
      <SiteHeader />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {submittedMember ? (
            /* ── TELA DE CONFIRMAÇÃO DO MEMBRO ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/10 bg-[#0e131b] p-6 text-center relative overflow-hidden shadow-2xl">
                <div
                  className="absolute -top-20 left-1/2 -translate-x-1/2 size-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="mx-auto size-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_25px_rgba(0,180,255,0.3)]">
                  <ShieldCheck size={36} />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
                  <Check size={13} strokeWidth={2.5} />
                  Cadastro Confirmado no Roster
                </span>

                <h1 className="font-display text-3xl sm:text-4xl text-silver tracking-wide">
                  {submittedMember.nick} Oficializado!
                </h1>
                <p className="mt-2 text-sm text-subtle max-w-md mx-auto">
                  Sua ficha foi salva e enviada diretamente para a <strong>Tabela de Membros</strong> da {GUILD_NAME} {GUILD_MARK}.
                </p>
              </div>

              {/* Cartão Holográfico Tático */}
              <TiltCard
                maxTilt={12}
                glareOpacity={0.25}
                className="rounded-2xl p-[1.5px] holographic-foil shadow-[0_20px_45px_rgba(0,0,0,0.65)] select-none"
              >
                <div className="rounded-[15px] bg-gradient-to-b from-[#131c2a] via-[#0c121b] to-[#070a0f] p-6 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                      <img
                        src="/latam-mark.webp"
                        alt="Brasão LATAM"
                        className="size-10 object-contain drop-shadow-[0_0_12px_rgba(0,180,255,0.4)]"
                      />
                      <div>
                        <p className="font-display text-lg tracking-wider text-silver flex items-center gap-1.5">
                          {GUILD_NAME} <span className="text-accent">{GUILD_MARK}</span>
                          <span className="text-xs font-sans text-subtle font-normal">
                            · ROSTER OFICIAL
                          </span>
                        </p>
                        <p className="text-[11px] font-mono text-cyan-400/90 tracking-widest uppercase">
                          ID: {submittedMember.idConta}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          CARGO_CONFIG[submittedMember.cargo]?.badgeClass ||
                          "text-slate-300 border-slate-500/30 bg-slate-500/10"
                        }`}
                      >
                        <CargoIcon size={12} />
                        {CARGO_CONFIG[submittedMember.cargo]?.label || submittedMember.cargo}
                      </span>
                      {selectedLine && (
                        <span className="text-[11px] text-cyan-400 font-semibold mt-1">
                          Line: {selectedLine.nome}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informações da Ficha no Formato Especificado */}
                  <div className="py-4 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">*Nick:*</span>
                      <span className="font-bold text-white text-sm">{submittedMember.nick}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">*Nome:*</span>
                      <span className="text-silver">{submittedMember.nome}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">idade:</span>
                      <span className="text-silver">{submittedMember.idade || "—"} anos</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">*ID da Conta:*</span>
                      <span className="text-cyan-400">{submittedMember.idConta}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">*WhatsApp:*</span>
                      <span className="text-emerald-400">{submittedMember.whatsapp}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-subtle font-sans font-semibold">*Função:*</span>
                      <span className="text-silver capitalize">
                        {FUNCOES.find((f) => f.value === submittedMember.funcao)?.label ||
                          submittedMember.funcao}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-subtle font-sans font-semibold">*Patente:*</span>
                      <span className="text-amber-400">
                        {PATENTES_LATAM.find((p) => p.value === submittedMember.patente)?.label ||
                          submittedMember.patente}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between text-xs text-subtle">
                    <span>Oficializado em: {submittedMember.entrouEm}</span>
                    <span className="text-[11px] text-cyan-400/80 font-mono tracking-wider">
                      STATUS: ATIVO
                    </span>
                  </div>
                </div>
              </TiltCard>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={() => handleCopyFicha(submittedMember)}
                  className="w-full sm:flex-1 gap-2 py-3 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-xl cursor-pointer shadow-[0_0_20px_rgba(0,180,255,0.3)] transition-all"
                >
                  {copiedFicha ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedFicha ? "Ficha Copiada!" : "Copiar Ficha Formatada"}</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="w-full sm:w-auto gap-2 py-3 text-sm rounded-xl border border-white/10 hover:bg-white/5 text-subtle hover:text-foreground cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>Cadastrar Outro</span>
                </Button>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="text-xs text-subtle hover:text-cyan-400 underline underline-offset-4 transition-colors"
                >
                  Voltar para o início
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── FORMULÁRIO DE MEMBRO OFICIAL (LAYOUT SOLICITADO) ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/10 bg-[#0e131b] p-6 relative overflow-hidden shadow-2xl">
                <div
                  className="absolute -top-16 -right-16 size-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                      Roster Oficial da Guilda
                    </span>
                    <h1 className="font-display text-2xl sm:text-3xl text-silver">
                      Ficha de Membro Oficial
                    </h1>
                  </div>
                </div>

                <p className="text-sm text-subtle leading-relaxed">
                  Preencha a sua ficha abaixo. Seus dados irão diretamente para a <strong>Tabela de Membros</strong> da{" "}
                  <strong className="text-silver">{GUILD_NAME} {GUILD_MARK}</strong>.
                </p>

                {(cargo !== "membro" || selectedLine) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/8">
                    {cargo !== "membro" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Crown size={12} />
                        Cargo: {cargoConfig.label}
                      </span>
                    )}
                    {selectedLine && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        <Trophy size={12} />
                        Line: {selectedLine.nome} ({selectedLine.tag})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Form com a sequência exata de campos */}
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-[#0e131b] p-6 sm:p-8 space-y-5 shadow-2xl"
              >
                {/* 1. *Nick:* */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">*Nick:*</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Free Fire</span>
                  </label>
                  <input
                    type="text"
                    value={nick}
                    onChange={handleNickChange}
                    placeholder="Ex: LATAM・Coruja"
                    className={`w-full rounded-xl border bg-[#121821] px-4 py-2.5 text-sm text-foreground placeholder:text-subtle/50 transition-colors focus:outline-none ${
                      errors.nick
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-cyan-400"
                    }`}
                  />
                  {errors.nick && <p className="text-xs text-red-400 mt-1">{errors.nick}</p>}
                </div>

                {/* 2. *Nome:* */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle">
                    <span className="text-silver font-bold">*Nome:*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (errors.nome) setErrors((prev) => ({ ...prev, nome: "" }));
                    }}
                    placeholder="Ex: Lucas Silva"
                    className={`w-full rounded-xl border bg-[#121821] px-4 py-2.5 text-sm text-foreground placeholder:text-subtle/50 transition-colors focus:outline-none ${
                      errors.nome
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-cyan-400"
                    }`}
                  />
                  {errors.nome && <p className="text-xs text-red-400 mt-1">{errors.nome}</p>}
                </div>

                {/* 3. idade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">idade</span>
                    <span className="text-[10px] text-subtle font-mono">Anos</span>
                  </label>
                  <input
                    type="text"
                    value={idade}
                    onChange={handleIdadeChange}
                    placeholder="Ex: 18"
                    maxLength={2}
                    className={`w-full rounded-xl border bg-[#121821] px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-subtle/50 transition-colors focus:outline-none ${
                      errors.idade
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-cyan-400"
                    }`}
                  />
                  {errors.idade && <p className="text-xs text-red-400 mt-1">{errors.idade}</p>}
                </div>

                {/* 4. *ID da Conta:* */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">*ID da Conta:*</span>
                    <span className="text-[10px] text-subtle font-mono">UID Free Fire</span>
                  </label>
                  <input
                    type="text"
                    value={idConta}
                    onChange={handleIdChange}
                    placeholder="Ex: 123456789"
                    maxLength={14}
                    className={`w-full rounded-xl border bg-[#121821] px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-subtle/50 transition-colors focus:outline-none ${
                      errors.idConta
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-cyan-400"
                    }`}
                  />
                  {errors.idConta && <p className="text-xs text-red-400 mt-1">{errors.idConta}</p>}
                </div>

                {/* 5. *WhatsApp:* */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">*WhatsApp:*</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Contato</span>
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="(11) 99999-9999"
                    maxLength={16}
                    className={`w-full rounded-xl border bg-[#121821] px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-subtle/50 transition-colors focus:outline-none ${
                      errors.whatsapp
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-cyan-400"
                    }`}
                  />
                  {errors.whatsapp && (
                    <p className="text-xs text-red-400 mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                {/* 6. *Função:* */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">*Função:*</span>
                    <span className="text-[10px] text-cyan-400">Papel Tático</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FUNCOES.map((f) => {
                      const isSelected = funcao === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setFuncao(f.value);
                          }}
                          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-400/80 text-silver shadow-[0_0_12px_rgba(0,180,255,0.25)]"
                              : "bg-[#121821] border-white/10 text-subtle hover:border-white/20 hover:text-silver"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold">{f.label}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                                isSelected
                                  ? "bg-cyan-400 text-neutral-950 font-bold"
                                  : "bg-white/5 text-subtle"
                              }`}
                            >
                              {f.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-subtle line-clamp-1 leading-tight">
                            {f.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. *Patente:* */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                    <span className="text-silver font-bold">*Patente:*</span>
                    <span className="text-[10px] text-amber-400">Ranqueada</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PATENTES_LATAM.filter((p) => p.value !== "outra").map((p) => {
                      const isSelected = patente === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setPatente(p.value);
                          }}
                          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500/60 text-silver shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                              : "bg-[#121821] border-white/10 text-subtle hover:border-white/20 hover:text-silver"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold">{p.label}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                                isSelected
                                  ? "bg-amber-400 text-neutral-950 font-bold"
                                  : "bg-white/5 text-subtle"
                              }`}
                            >
                              {p.tier}
                            </span>
                          </div>
                          <span className="text-[10px] text-subtle line-clamp-1 leading-tight">
                            {p.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Line opcional se houver */}
                {lines.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center justify-between">
                      <span>Line-up (Opcional)</span>
                      <span className="text-[10px] text-subtle">Competitivo</span>
                    </label>
                    <select
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121821] px-4 py-2.5 text-sm text-foreground focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="">Nenhuma / Membro Geral (Sem Line)</option>
                      {lines.map((l) => (
                        <option key={l.id} value={l.id}>
                          Line {l.nome} ({l.tag}) · Treino: {l.horarioTreino}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Observação Opcional */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-subtle">
                    Observação ou Recado para a Liderança (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Algum recado para a staff..."
                    className="w-full rounded-xl border border-white/10 bg-[#121821] px-4 py-2.5 text-sm text-foreground placeholder:text-subtle/50 transition-colors focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Botão de Envio */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-sm font-semibold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-xl cursor-pointer shadow-[0_0_20px_rgba(0,180,255,0.35)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                        <span>Enviando para a Tabela de Membros...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        <span>Finalizar Cadastro e Entrar no Roster</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SiteFooter />
    </main>
  );
}
