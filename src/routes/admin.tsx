import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  KeyRound,
  Lock,
  LogOut,
  MapPin,
  Medal,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatWhatsAppUrl, maskPhone, maskPlayerId } from "@/lib/masks";
import {
  displayValue,
  FUNCOES,
  GUILD_MARK,
  GUILD_NAME,
  HORAS_DISPONIBILIDADE,
  PATENTES_LATAM,
  SIM_NAO,
  type RecruitmentValues,
} from "@/lib/recruitment";
import {
  isSoundMuted,
  playApproveSound,
  playClickSound,
  playDenySound,
  playSuccessSound,
  toggleSound,
} from "@/lib/sound";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type StoredCandidate = RecruitmentValues & {
  id: string;
  submittedAt?: string;
  status?: "pendente" | "aprovado" | "recusado";
  staffNote?: string;
};

const INITIAL_DEMO_CANDIDATES: StoredCandidate[] = [
  {
    id: "cand-101",
    nome: "Lucas Souza",
    idade: "19",
    nick: "LUK4S_FF",
    idConta: "189420392",
    cidadeEstado: "São Paulo - SP",
    whatsapp: "(11) 98844-2211",
    funcao: "rush",
    patenteAtual: "diamente_mestre",
    experienciaCompetitiva: "sim",
    experienciaDescricao: "Joguei camps diários pela guilda Black Dragons, foco em invasão rápida e 2v1.",
    tempoDisponivel: "4+h",
    horarioDisponivel: "19h às 00h",
    submittedAt: "Hoje, 19:42",
    status: "aprovado",
    staffNote: "Aprovado para o teste da Line 1. Call rápida e boa mira.",
  },
  {
    id: "cand-102",
    nome: "Gabriel Ferreira",
    idade: "17",
    nick: "GABRIELzx",
    idConta: "273819402",
    cidadeEstado: "Rio de Janeiro - RJ",
    whatsapp: "(21) 97722-3344",
    funcao: "granadeiro",
    patenteAtual: "elite",
    experienciaCompetitiva: "sim",
    experienciaDescricao: "Granadeiro com boa leitura de mapa e controle de gel. Participei da Copa FF amadora.",
    tempoDisponivel: "2-4h",
    horarioDisponivel: "20h às 23h30",
    submittedAt: "Hoje, 18:15",
    status: "pendente",
    staffNote: "Agendar teste em sala personalizada 4v4.",
  },
  {
    id: "cand-103",
    nome: "Matheus Silva",
    idade: "21",
    nick: "M4THEUS_SNIPER",
    idConta: "392019482",
    cidadeEstado: "Belo Horizonte - MG",
    whatsapp: "(31) 99123-4567",
    funcao: "fuzileiro",
    patenteAtual: "platina_diamente",
    experienciaCompetitiva: "nao",
    experienciaDescricao: "",
    tempoDisponivel: "2-4h",
    horarioDisponivel: "18h às 22h",
    submittedAt: "Hoje, 15:30",
    status: "pendente",
    staffNote: "",
  },
];

function getRankBadgeInfo(patente: string) {
  switch (patente) {
    case "elite":
      return {
        label: "Elite+",
        color: "from-amber-400 via-purple-500 to-indigo-500 text-amber-200 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
        icon: Crown,
      };
    case "diamente_mestre":
      return {
        label: "Diamante–Mestre",
        color: "from-rose-500 to-red-600 text-rose-100 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
        icon: Flame,
      };
    case "platina_diamente":
      return {
        label: "Platina–Diamante",
        color: "from-cyan-400 to-blue-600 text-cyan-100 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]",
        icon: Sparkles,
      };
    case "ouro_platina":
      return {
        label: "Ouro–Platina",
        color: "from-yellow-400 to-amber-600 text-yellow-100 border-yellow-400/40 shadow-[0_0_12px_rgba(234,179,8,0.3)]",
        icon: Medal,
      };
    default:
      return {
        label: "Casual / Outra",
        color: "from-slate-400 to-zinc-600 text-slate-200 border-slate-400/30",
        icon: Shield,
      };
  }
}

function getRoleBadgeInfo(funcao: string) {
  const item = FUNCOES.find((f) => f.value === funcao);
  const label = item?.label || funcao;
  const badge = item?.badge || "Tático";

  switch (funcao) {
    case "rush":
      return { label, badge, color: "bg-red-500/15 text-red-300 border-red-500/30", icon: Swords };
    case "suporte":
      return { label, badge, color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", icon: ShieldCheck };
    case "fuzileiro":
      return { label, badge, color: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: Zap };
    case "granadeiro":
      return { label, badge, color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Flame };
    case "full_gas":
      return { label, badge, color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: ShieldAlert };
    default:
      return { label, badge, color: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: Trophy };
  }
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Lista de candidatos e filtros
  const [candidates, setCandidates] = useState<StoredCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "aprovado" | "recusado">("todos");
  const [filterFuncao, setFilterFuncao] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<"recentes" | "patente" | "tempo">("recentes");

  // Modal para adicionar candidato manualmente
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    nome: "",
    idade: "",
    nick: "",
    idConta: "",
    cidadeEstado: "",
    whatsapp: "",
    funcao: "rush",
    patenteAtual: "diamente_mestre",
    experienciaCompetitiva: "sim",
    experienciaDescricao: "",
    tempoDisponivel: "2-4h",
    horarioDisponivel: "19h às 23h",
    staffNote: "",
  });

  // Modal de modelos de mensagem do WhatsApp
  const [activeWhatsModal, setActiveWhatsModal] = useState<StoredCandidate | null>(null);

  // Anotações em edição inline
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    setSoundMuted(isSoundMuted());
    if (sessionStorage.getItem("latam-admin-auth") === "true") {
      setIsAuthenticated(true);
    }

    try {
      const stored = localStorage.getItem("latam-admin-candidates");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidates(parsed);
          return;
        }
      }
      setCandidates(INITIAL_DEMO_CANDIDATES);
      localStorage.setItem("latam-admin-candidates", JSON.stringify(INITIAL_DEMO_CANDIDATES));
    } catch {
      setCandidates(INITIAL_DEMO_CANDIDATES);
    }
  }, []);

  function handleSoundToggle() {
    const muted = toggleSound();
    setSoundMuted(muted);
    toast.info(muted ? "Efeitos sonoros desativados" : "Efeitos sonoros ativados");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) {
      playDenySound();
      toast.error("Acesso bloqueado temporariamente por segurança. Aguarde 60 segundos.");
      return;
    }

    const pass = passwordInput.trim().toLowerCase();
    if (!pass) {
      playDenySound();
      toast.error("Informe a chave de segurança.");
      return;
    }

    const VALID_KEYS = ["latam2026", "souza2026", "adminlatam", "souza", "admin"];
    if (VALID_KEYS.includes(pass)) {
      playSuccessSound();
      sessionStorage.setItem("latam-admin-auth", "true");
      setIsAuthenticated(true);
      setFailedAttempts(0);
      toast.success("Credencial confirmada! Bem-vindo à liderança LATAM 友.");
    } else {
      playDenySound();
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= 5) {
        setIsLocked(true);
        toast.error("5 tentativas incorretas. Terminal bloqueado por 60 segundos.");
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
        }, 60000);
      } else {
        toast.error(`Chave incorreta. Tentativa ${next} de 5.`);
      }
    }
  }

  function handleLogout() {
    playClickSound();
    sessionStorage.removeItem("latam-admin-auth");
    setIsAuthenticated(false);
    toast.info("Sessão da liderança encerrada.");
  }

  function persistCandidates(updated: StoredCandidate[]) {
    setCandidates(updated);
    try {
      localStorage.setItem("latam-admin-candidates", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }

  function updateStatus(id: string, newStatus: "pendente" | "aprovado" | "recusado") {
    if (newStatus === "aprovado") {
      playApproveSound();
    } else if (newStatus === "recusado") {
      playDenySound();
    } else {
      playClickSound();
    }

    const updated = candidates.map((cand) =>
      cand.id === id ? { ...cand, status: newStatus } : cand,
    );
    persistCandidates(updated);
    const label =
      newStatus === "aprovado" ? "APROVADO PARA TESTE" : newStatus === "recusado" ? "RECUSADO" : "EM ANÁLISE";
    toast.success(`Candidato alterado para: ${label}`);
  }

  function deleteCandidate(id: string) {
    playDenySound();
    const target = candidates.find((c) => c.id === id);
    const updated = candidates.filter((c) => c.id !== id);
    persistCandidates(updated);
    toast.info(`Candidatura de ${target?.nick || "jogador"} removida do painel.`);
  }

  function handleSaveNote(id: string) {
    playClickSound();
    const updated = candidates.map((cand) =>
      cand.id === id ? { ...cand, staffNote: noteDraft.trim() } : cand,
    );
    persistCandidates(updated);
    setEditingNoteId(null);
    toast.success("Anotação da liderança salva!");
  }

  function handleAddPlayerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayer.nick || !newPlayer.idConta || !newPlayer.whatsapp) {
      toast.error("Preencha ao menos Nick, ID da Conta e WhatsApp.");
      return;
    }

    playApproveSound();
    const added: StoredCandidate = {
      id: `cand-${Date.now()}`,
      nome: newPlayer.nome || newPlayer.nick,
      idade: newPlayer.idade || "18",
      nick: newPlayer.nick,
      idConta: newPlayer.idConta,
      cidadeEstado: newPlayer.cidadeEstado || "Brasil",
      whatsapp: newPlayer.whatsapp,
      funcao: newPlayer.funcao,
      patenteAtual: newPlayer.patenteAtual,
      experienciaCompetitiva: newPlayer.experienciaCompetitiva,
      experienciaDescricao: newPlayer.experienciaDescricao,
      tempoDisponivel: newPlayer.tempoDisponivel,
      horarioDisponivel: newPlayer.horarioDisponivel,
      staffNote: newPlayer.staffNote || "Cadastrado manualmente pela staff.",
      status: "pendente",
      submittedAt: "Adicionado Manualmente",
    };

    persistCandidates([added, ...candidates]);
    setIsAddModalOpen(false);
    setNewPlayer({
      nome: "",
      idade: "",
      nick: "",
      idConta: "",
      cidadeEstado: "",
      whatsapp: "",
      funcao: "rush",
      patenteAtual: "diamente_mestre",
      experienciaCompetitiva: "sim",
      experienciaDescricao: "",
      tempoDisponivel: "2-4h",
      horarioDisponivel: "19h às 23h",
      staffNote: "",
    });
    toast.success(`Jogador ${added.nick} adicionado à lista!`);
  }

  function copyCandidateDossier(c: StoredCandidate) {
    playClickSound();
    const text = [
      `*${GUILD_NAME} ${GUILD_MARK} — Dossiê de Recrutamento*`,
      `Nick: ${c.nick} (ID: ${c.idConta})`,
      `Nome: ${c.nome} (${c.idade} anos) - ${c.cidadeEstado}`,
      `Função: ${displayValue("funcao", c)}`,
      `Patente: ${displayValue("patenteAtual", c)}`,
      `Disponibilidade: ${c.horarioDisponivel} (${displayValue("tempoDisponivel", c)})`,
      c.experienciaDescricao ? `Histórico Competitivo: ${c.experienciaDescricao}` : "",
      c.staffNote ? `Nota da Staff: ${c.staffNote}` : "",
      `WhatsApp: ${c.whatsapp}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    toast.success(`Dossiê de ${c.nick} copiado para a área de transferência!`);
  }

  function exportData() {
    playClickSound();
    const jsonStr = JSON.stringify(candidates, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recrutamento-latam-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Relatório JSON exportado com sucesso!");
  }

  // Filtragem e ordenação
  const filtered = candidates
    .filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        c.nick.toLowerCase().includes(q) ||
        c.nome.toLowerCase().includes(q) ||
        c.idConta.includes(q) ||
        c.whatsapp.includes(q);

      const matchesStatus = filterStatus === "todos" ? true : (c.status || "pendente") === filterStatus;
      const matchesFuncao = filterFuncao === "todos" ? true : c.funcao === filterFuncao;

      return matchesSearch && matchesStatus && matchesFuncao;
    })
    .sort((a, b) => {
      if (sortBy === "patente") {
        const rankPriority: Record<string, number> = {
          elite: 4,
          diamente_mestre: 3,
          platina_diamente: 2,
          ouro_platina: 1,
          outra: 0,
        };
        return (rankPriority[b.patenteAtual] || 0) - (rankPriority[a.patenteAtual] || 0);
      }
      if (sortBy === "tempo") {
        const timePriority: Record<string, number> = { "4+h": 3, "2-4h": 2, "1-2h": 1 };
        return (timePriority[b.tempoDisponivel] || 0) - (timePriority[a.tempoDisponivel] || 0);
      }
      return 0; // "recentes" mantém a ordem de inserção
    });

  const countPendente = candidates.filter((c) => (c.status || "pendente") === "pendente").length;
  const countAprovado = candidates.filter((c) => c.status === "aprovado").length;
  const countRecusado = candidates.filter((c) => c.status === "recusado").length;
  const lineSlotsFilled = Math.min(12, countAprovado);

  // ----------------------------------------------------
  // TELA DE LOGIN: TERMINAL DE SEGURANÇA ESPORTS 3D
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="page-bg min-h-screen flex flex-col justify-between relative overflow-hidden">
        {/* Cyber Runway Floor 3D */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-96 opacity-30 [perspective:600px] overflow-hidden -z-10"
          aria-hidden="true"
        >
          <div
            className="w-full h-full [transform:rotateX(75deg)] origin-bottom"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 180, 255, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 180, 255, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 100%, black 20%, transparent 80%)",
            }}
          />
        </div>

        <header className="site-header backdrop-blur-md bg-background/85 sticky top-0 z-30 border-b border-white/5">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2.5 no-underline group">
              <img
                src="/latam-mark.webp"
                alt=""
                width="32"
                height="32"
                className="size-8 transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl tracking-[0.14em] text-silver group-hover:text-white">
                {GUILD_NAME} <span className="tracking-normal text-accent">{GUILD_MARK}</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-white uppercase tracking-wider transition-colors"
            >
              Voltar ao Site
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md px-5 py-12 flex items-center justify-center">
          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <TiltCard
              maxTilt={8}
              glareOpacity={0.25}
              className="section-card border border-accent/30 p-8 text-center relative overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#121927] via-[#0d121c] to-[#080c13]"
            >
              {/* HUD Corner Brackets */}
              <span className="absolute top-3 left-3 size-3 border-t-2 border-l-2 border-accent/60 pointer-events-none" />
              <span className="absolute top-3 right-3 size-3 border-t-2 border-r-2 border-accent/60 pointer-events-none" />
              <span className="absolute bottom-3 left-3 size-3 border-b-2 border-l-2 border-accent/60 pointer-events-none" />
              <span className="absolute bottom-3 right-3 size-3 border-b-2 border-r-2 border-accent/60 pointer-events-none" />

              {/* Brasão Holográfico com Glow */}
              <div className="relative mx-auto size-20 flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-125 animate-pulse" />
                <img
                  src="/latam-mark.webp"
                  alt="Brasão LATAM"
                  className="size-16 relative z-10 drop-shadow-[0_0_18px_rgba(0,180,255,0.45)]"
                />
              </div>

              {/* Protocol Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
                <span className="size-1.5 rounded-full bg-accent animate-ping" />
                Protocolo Staff v2.6
              </div>

              <h1 className="font-display text-3xl tracking-wide text-silver">Painel da Liderança</h1>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Ambiente restrito aos administradores, recrutadores e capitães da guilda {GUILD_NAME} {GUILD_MARK}.
              </p>

              <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3.5">
                <div className="relative">
                  <KeyRound className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-accent/70 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a chave de segurança..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isLocked}
                    autoFocus
                    className="pl-10 pr-10 text-center font-mono tracking-widest text-sm bg-card-2 border-white/10 focus:border-accent text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full relative overflow-hidden group shadow-[0_0_20px_rgba(0,180,255,0.25)]"
                  disabled={isLocked}
                >
                  <ShieldCheck className="size-4 mr-1.5 transition-transform group-hover:scale-110" />
                  {isLocked ? "Bloqueado Temporariamente" : "Autenticar Liderança"}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-subtle mt-1">
                  <Lock className="size-3 text-accent" />
                  <span>Sessão Criptografada SSL · Acesso Seguro</span>
                </div>
              </form>
            </TiltCard>
          </motion.div>
        </div>

        <footer className="px-5 pb-8 pt-4 text-center text-xs text-subtle">
          {GUILD_NAME} · Sistema Administrativo de Recrutamento Competitivo
        </footer>
      </main>
    );
  }

  // ----------------------------------------------------
  // DASHBOARD DA LIDERANÇA: ESPORTS MANAGEMENT SUITE
  // ----------------------------------------------------
  return (
    <main className="page-bg min-h-screen pb-24">
      {/* Topo Fixo com Indicador de Status */}
      <header className="site-header backdrop-blur-md bg-background/90 sticky top-0 z-40 border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img src="/latam-mark.webp" alt="" width="32" height="32" className="size-8" />
            <span className="font-display text-xl tracking-[0.14em] text-silver">
              {GUILD_NAME} <span className="tracking-normal text-accent">{GUILD_MARK}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/30 shadow-[0_0_10px_rgba(0,180,255,0.2)]">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              Liderança Ativa
            </span>

            {/* Controle de Som */}
            <button
              type="button"
              onClick={handleSoundToggle}
              title={soundMuted ? "Ativar som" : "Desativar som"}
              className="p-2 rounded-lg border border-white/8 bg-white/4 hover:bg-white/8 text-silver transition-colors"
            >
              {soundMuted ? <VolumeX className="size-4 text-subtle" /> : <Volume2 className="size-4 text-accent" />}
            </button>

            {/* Ação Novo Jogador */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/15 text-accent hover:bg-accent hover:text-neutral-950 transition-all active:scale-95 shadow-[0_0_10px_rgba(0,180,255,0.15)]"
            >
              <UserPlus className="size-3.5" />
              <span className="hidden md:inline">Novo</span> Jogador
            </button>

            {/* Ação Exportar */}
            <button
              type="button"
              onClick={exportData}
              title="Exportar Candidaturas (.JSON)"
              className="p-2 rounded-lg border border-white/8 bg-white/4 hover:bg-white/8 text-silver transition-colors"
            >
              <Download className="size-4" />
            </button>

            <Button
              variant="ghost"
              size="default"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-white"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-8">
        {/* Banner de Boas-Vindas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Staff & Recrutamento Competitivo
              </p>
            </div>
            <h1 className="font-display mt-1 text-4xl tracking-wide text-silver sm:text-5xl">
              Candidaturas Recebidas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Gerencie a line-up oficial, convoque jogadores no WhatsApp com mensagens prontas e registre anotações da staff.
            </p>
          </div>

          <Link
            to="/candidatura"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 text-silver transition-all self-start md:self-auto"
          >
            <ExternalLink className="size-3.5 text-accent" />
            Abrir Formulário Público
          </Link>
        </div>

        {/* Grade de Métricas & Medidor da Line-up 3D */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total */}
          <TiltCard
            maxTilt={6}
            glareOpacity={0.15}
            className="section-card p-4 border border-white/10 bg-card/90 rounded-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-subtle">
              <p className="text-[11px] font-bold uppercase tracking-wider">Total Inscritos</p>
              <Users className="size-4 text-accent" />
            </div>
            <p className="font-display text-4xl text-white mt-2">{candidates.length}</p>
            <p className="text-[11px] text-subtle mt-1">Jogadores na base</p>
          </TiltCard>

          {/* Card 2: Em Análise */}
          <TiltCard
            maxTilt={6}
            glareOpacity={0.15}
            className="section-card p-4 border border-amber-500/25 bg-card/90 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.06)]"
          >
            <div className="flex items-center justify-between text-amber-400">
              <p className="text-[11px] font-bold uppercase tracking-wider">Em Análise</p>
              <Clock className="size-4" />
            </div>
            <p className="font-display text-4xl text-amber-300 mt-2">{countPendente}</p>
            <p className="text-[11px] text-amber-400/80 mt-1">Aguardando decisão</p>
          </TiltCard>

          {/* Card 3: Aprovados */}
          <TiltCard
            maxTilt={6}
            glareOpacity={0.15}
            className="section-card p-4 border border-emerald-500/25 bg-card/90 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.06)]"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <p className="text-[11px] font-bold uppercase tracking-wider">Aprovados p/ Teste</p>
              <Trophy className="size-4" />
            </div>
            <p className="font-display text-4xl text-emerald-300 mt-2">{countAprovado}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Prontos para sala</p>
          </TiltCard>

          {/* Card 4: Vagas da Line-up com Segmented Bar */}
          <TiltCard
            maxTilt={6}
            glareOpacity={0.15}
            className="section-card p-4 border border-accent/25 bg-card/90 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(0,180,255,0.06)]"
          >
            <div className="flex items-center justify-between text-accent">
              <p className="text-[11px] font-bold uppercase tracking-wider">Vagas da Line-up</p>
              <Swords className="size-4" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display text-4xl text-accent">{lineSlotsFilled}</span>
              <span className="text-sm font-semibold text-subtle">/ 12</span>
            </div>

            {/* Barra de 12 Slots Segmentados */}
            <div className="mt-2.5 flex gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm transition-all ${
                    i < lineSlotsFilled ? "bg-accent shadow-[0_0_6px_rgba(0,180,255,0.5)]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-subtle mt-1.5">
              {Math.max(0, 12 - lineSlotsFilled)} vagas disponíveis
            </p>
          </TiltCard>
        </div>

        {/* Barra de Busca, Filtros e Ordenação */}
        <div className="mt-8 flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar Nick, Nome, ID ou WhatsApp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-card-2 border border-white/10 text-sm text-foreground focus:outline-none focus:border-accent"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Abas de Status com Contadores Numéricos */}
            <div className="flex rounded-xl border border-white/10 bg-card-2 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setFilterStatus("todos");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "todos"
                    ? "bg-accent text-neutral-950 font-bold shadow-[0_0_10px_rgba(0,180,255,0.3)]"
                    : "text-muted-foreground hover:text-silver"
                }`}
              >
                <span>Todos</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">{candidates.length}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setFilterStatus("pendente");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "pendente"
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    : "text-muted-foreground hover:text-silver"
                }`}
              >
                <span>Pendentes</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">{countPendente}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setFilterStatus("aprovado");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "aprovado"
                    ? "bg-emerald-500 text-neutral-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    : "text-muted-foreground hover:text-silver"
                }`}
              >
                <span>Aprovados</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">{countAprovado}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setFilterStatus("recusado");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "recusado"
                    ? "bg-red-500 text-neutral-950 font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                    : "text-muted-foreground hover:text-silver"
                }`}
              >
                <span>Recusados</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">{countRecusado}</span>
              </button>
            </div>

            {/* Filtro Função */}
            <select
              value={filterFuncao}
              onChange={(e) => {
                playClickSound();
                setFilterFuncao(e.target.value);
              }}
              className="rounded-xl bg-card-2 border border-white/10 px-3 py-2 text-xs font-semibold text-silver focus:outline-none focus:border-accent"
            >
              <option value="todos">Todas as Funções</option>
              {FUNCOES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label} ({f.badge})
                </option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => {
                playClickSound();
                setSortBy(e.target.value as any);
              }}
              className="rounded-xl bg-card-2 border border-white/10 px-3 py-2 text-xs font-semibold text-silver focus:outline-none focus:border-accent"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="patente">Maior Patente</option>
              <option value="tempo">Maior Disponibilidade</option>
            </select>
          </div>
        </div>

        {/* Lista de Dossiês de Candidatos */}
        <div className="mt-6 flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="section-card py-20 text-center text-muted-foreground rounded-2xl border border-white/8">
              <Users className="size-12 mx-auto text-subtle mb-3 opacity-50" />
              <p className="font-semibold text-lg text-silver">Nenhum candidato localizado</p>
              <p className="text-xs mt-1">Ajuste os filtros de busca ou adicione um jogador manualmente.</p>
            </div>
          ) : (
            filtered.map((cand) => {
              const status = cand.status || "pendente";
              const rankInfo = getRankBadgeInfo(cand.patenteAtual);
              const RankIcon = rankInfo.icon;
              const roleInfo = getRoleBadgeInfo(cand.funcao);
              const RoleIcon = roleInfo.icon;

              return (
                <TiltCard
                  key={cand.id}
                  maxTilt={3}
                  glareOpacity={0.1}
                  className="section-card p-5 border border-white/10 bg-gradient-to-br from-[#121824] via-[#0d121b] to-[#090d14] rounded-2xl relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    {/* Bloco de Informações Principais */}
                    <div className="flex items-start gap-4">
                      {/* Avatar com Rank Insignia */}
                      <div className="relative shrink-0">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-[#1a2333] to-[#0f1520] border border-white/15 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(0,180,255,0.2)]">
                          <Users className="size-7" />
                        </div>
                        <div
                          title={rankInfo.label}
                          className="absolute -bottom-1 -right-1 size-6 rounded-lg bg-card-2 border border-white/20 flex items-center justify-center text-amber-300 shadow-md"
                        >
                          <RankIcon className="size-3.5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        {/* Nick & Nome */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-display text-2xl tracking-wide text-white leading-tight">
                            {cand.nick}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            ({cand.nome}, {cand.idade} anos)
                          </span>

                          {/* Status Pill */}
                          {status === "aprovado" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              <CheckCircle2 className="size-3" />
                              Aprovado p/ Teste
                            </span>
                          ) : status === "recusado" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                              <XCircle className="size-3" />
                              Recusado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <Clock className="size-3" />
                              Em Análise
                            </span>
                          )}
                        </div>

                        {/* Localização & Data de Envio */}
                        <p className="text-xs text-subtle mt-1 flex items-center gap-1.5">
                          <MapPin className="size-3 text-accent" />
                          <span>{cand.cidadeEstado}</span>
                          <span>•</span>
                          <span>Enviado: {cand.submittedAt || "Recente"}</span>
                        </p>

                        {/* Badges de Atributos */}
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          {/* Badge Função */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${roleInfo.color}`}
                          >
                            <RoleIcon className="size-3.5" />
                            <span>{roleInfo.label}</span>
                            <span className="text-[10px] opacity-75 font-normal">({roleInfo.badge})</span>
                          </span>

                          {/* Badge Patente */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border bg-gradient-to-r ${rankInfo.color}`}
                          >
                            <RankIcon className="size-3.5" />
                            <span>{displayValue("patenteAtual", cand)}</span>
                          </span>

                          {/* Badge ID com Copiar Rápido */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(cand.idConta);
                              playClickSound();
                              toast.success(`ID ${cand.idConta} copiado!`);
                            }}
                            title="Clique para copiar ID do Free Fire"
                            className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-accent transition-colors"
                          >
                            <span>ID: {cand.idConta}</span>
                            <Copy className="size-3 opacity-60" />
                          </button>

                          {/* Badge Horário */}
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-silver">
                            <Clock className="size-3 text-subtle" />
                            <span>
                              {cand.horarioDisponivel} ({displayValue("tempoDisponivel", cand)})
                            </span>
                          </span>
                        </div>

                        {/* Histórico Competitivo */}
                        {cand.experienciaDescricao ? (
                          <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/8 text-xs text-silver/90 leading-relaxed relative">
                            <span className="text-accent font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                              Histórico Competitivo
                            </span>
                            {cand.experienciaDescricao}
                          </div>
                        ) : null}

                        {/* Bloco de Anotações da Staff */}
                        <div className="mt-3">
                          {editingNoteId === cand.id ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="text"
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                placeholder="Anotação interna (ex: jogou bem no 4v4, aguardando line 2)..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-accent/40 text-xs text-white focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveNote(cand.id)}
                                className="px-3 py-1.5 rounded-lg bg-accent text-neutral-950 font-bold text-xs"
                              >
                                Salvar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="px-2 py-1.5 rounded-lg border border-white/10 text-xs text-subtle"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {cand.staffNote ? (
                                <p className="text-xs text-accent/90 italic bg-accent/10 border border-accent/20 px-3 py-1 rounded-lg flex-1">
                                  <strong>Nota Staff:</strong> {cand.staffNote}
                                </p>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(cand.id);
                                  setNoteDraft(cand.staffNote || "");
                                }}
                                className="text-[11px] font-semibold text-subtle hover:text-accent inline-flex items-center gap-1 transition-colors"
                              >
                                <Pencil className="size-3" />
                                <span>{cand.staffNote ? "Editar Nota" : "+ Adicionar Nota Staff"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações da Liderança */}
                    <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:min-w-[170px] justify-end">
                      {/* Botão Chamar no Zap (Abre Seletor de Mensagens) */}
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setActiveWhatsModal(cand);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                      >
                        <MessageCircle className="size-4" />
                        Chamar no Zap
                      </button>

                      {/* Copiar Ficha */}
                      <button
                        type="button"
                        onClick={() => copyCandidateDossier(cand)}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 text-silver transition-all"
                      >
                        <Copy className="size-3.5" />
                        Copiar Ficha
                      </button>

                      {/* Controles de Status & Exclusão */}
                      <div className="flex items-center gap-1.5 justify-end pt-1">
                        <button
                          type="button"
                          title="Aprovar para Teste de Line"
                          onClick={() => updateStatus(cand.id, "aprovado")}
                          className={`p-2 rounded-lg border transition-all ${
                            status === "aprovado"
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                              : "border-white/8 bg-white/4 text-subtle hover:text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          <CheckCircle2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Colocar Em Análise"
                          onClick={() => updateStatus(cand.id, "pendente")}
                          className={`p-2 rounded-lg border transition-all ${
                            status === "pendente"
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                              : "border-white/8 bg-white/4 text-subtle hover:text-amber-400 hover:bg-amber-500/10"
                          }`}
                        >
                          <Clock className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Recusar Candidatura"
                          onClick={() => updateStatus(cand.id, "recusado")}
                          className={`p-2 rounded-lg border transition-all ${
                            status === "recusado"
                              ? "bg-red-500/20 border-red-500/50 text-red-300"
                              : "border-white/8 bg-white/4 text-subtle hover:text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          <XCircle className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Excluir Jogador do Painel"
                          onClick={() => deleteCandidate(cand.id)}
                          className="p-2 rounded-lg border border-white/8 bg-white/4 text-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: SELETOR DE MENSAGEM DO WHATSAPP             */}
      {/* ---------------------------------------------------- */}
      {activeWhatsModal ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="section-card border border-emerald-500/30 p-6 rounded-3xl max-w-lg w-full bg-[#0c111a] shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveWhatsModal(null)}
              className="absolute top-4 right-4 text-subtle hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white">Chamar no WhatsApp</h3>
                <p className="text-xs text-muted-foreground">
                  Jogador: <strong className="text-emerald-400">{activeWhatsModal.nick}</strong> (
                  {activeWhatsModal.whatsapp})
                </p>
              </div>
            </div>

            <p className="text-xs text-subtle mt-4 mb-3">Escolha o modelo de mensagem pronta:</p>

            <div className="flex flex-col gap-2.5">
              {/* Modelo 1: Teste de Line */}
              {(() => {
                const msg = `Fala ${activeWhatsModal.nick}! Aqui é a liderança da guilda LATAM 友. Analisamos sua candidatura para ${displayValue("funcao", activeWhatsModal)} e queremos agendar seu teste de line-up. Que dia e horário você pode entrar em call?`;
                const url = formatWhatsAppUrl(activeWhatsModal.whatsapp, msg);
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsModal(null)}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                      <span>⚔️ 1. Convocação para Teste de Line</span>
                      <ExternalLink className="size-3.5 opacity-60 group-hover:opacity-100" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{msg}</p>
                  </a>
                );
              })()}

              {/* Modelo 2: Entrevista Rápida */}
              {(() => {
                const msg = `Fala ${activeWhatsModal.nick}, beleza? Aqui é da liderança da LATAM 友. Gostamos do seu perfil de ${displayValue("funcao", activeWhatsModal)}! Queremos trocar uma ideia rápida antes de marcar o teste.`;
                const url = formatWhatsAppUrl(activeWhatsModal.whatsapp, msg);
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsModal(null)}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-accent flex items-center justify-between">
                      <span>🎙️ 2. Entrevista / Alinhamento de Horário</span>
                      <ExternalLink className="size-3.5 opacity-60 group-hover:opacity-100" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{msg}</p>
                  </a>
                );
              })()}

              {/* Modelo 3: Aprovação Oficial */}
              {(() => {
                const msg = `Parabéns ${activeWhatsModal.nick}! Você foi APROVADO para a guilda competitiva LATAM 友! Salva nosso contato para adicionarmos você ao grupo oficial e combinarmos sua line-up.`;
                const url = formatWhatsAppUrl(activeWhatsModal.whatsapp, msg);
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      updateStatus(activeWhatsModal.id, "aprovado");
                      setActiveWhatsModal(null);
                    }}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>🏆 3. Aprovação Oficial na LATAM 友</span>
                      <ExternalLink className="size-3.5 opacity-60 group-hover:opacity-100" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{msg}</p>
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: ADICIONAR JOGADOR MANUALMENTE               */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="section-card border border-accent/40 p-6 rounded-3xl max-w-lg w-full bg-[#0c111a] shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-subtle hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-accent/20 text-accent border border-accent/30 flex items-center justify-center">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white">Cadastrar Jogador Manual</h3>
                <p className="text-xs text-muted-foreground">Adicione um player à base da staff da guilda.</p>
              </div>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">Nick no FF *</label>
                  <Input
                    placeholder="Ex: LUK4S_FF"
                    value={newPlayer.nick}
                    onChange={(e) => setNewPlayer({ ...newPlayer, nick: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">ID da Conta FF *</label>
                  <Input
                    placeholder="Ex: 189420392"
                    value={newPlayer.idConta}
                    onChange={(e) => setNewPlayer({ ...newPlayer, idConta: maskPlayerId(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">Nome Real</label>
                  <Input
                    placeholder="Ex: Lucas Souza"
                    value={newPlayer.nome}
                    onChange={(e) => setNewPlayer({ ...newPlayer, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">WhatsApp (com DDD) *</label>
                  <Input
                    placeholder="Ex: (11) 99999-9999"
                    value={newPlayer.whatsapp}
                    onChange={(e) => setNewPlayer({ ...newPlayer, whatsapp: maskPhone(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">Função</label>
                  <select
                    value={newPlayer.funcao}
                    onChange={(e) => setNewPlayer({ ...newPlayer, funcao: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-card-2 border border-white/10 text-xs text-white"
                  >
                    {FUNCOES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label} ({f.badge})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-subtle uppercase">Patente Atual</label>
                  <select
                    value={newPlayer.patenteAtual}
                    onChange={(e) => setNewPlayer({ ...newPlayer, patenteAtual: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-card-2 border border-white/10 text-xs text-white"
                  >
                    {PATENTES_LATAM.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-subtle uppercase">Horário Disponível</label>
                <Input
                  placeholder="Ex: 19h às 23h"
                  value={newPlayer.horarioDisponivel}
                  onChange={(e) => setNewPlayer({ ...newPlayer, horarioDisponivel: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-subtle uppercase">Nota Interna da Staff</label>
                <Input
                  placeholder="Ex: Chamado via Discord pelo Capitão, já testado."
                  value={newPlayer.staffNote}
                  onChange={(e) => setNewPlayer({ ...newPlayer, staffNote: e.target.value })}
                />
              </div>

              <div className="mt-2 flex gap-2">
                <Button type="submit" size="lg" className="flex-1">
                  Cadastrar na Staff
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
