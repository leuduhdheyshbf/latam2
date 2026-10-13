import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardPaste,
  Clock,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Lock,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  deleteCandidateSupabase,
  fetchCandidatesSupabase,
  getSupabase,
  insertCandidateSupabase,
  isSupabaseConfigured,
  updateCandidateSupabase,
} from "@/lib/supabase";
import { MembrosView, MemberModal, PasteMemberModal } from "@/components/admin-members";
import { LinesView, AddLineModal } from "@/components/admin-lines";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import {
  type GuildMember,
  type GuildLine,
  loadMembers,
  saveMembers,
  loadLines,
  saveLines,
} from "@/lib/guild";

export const Route = createFileRoute("/admin")({ component: AdminPage });

// ─── Types ───────────────────────────────────────────────────────────────────

type StoredCandidate = RecruitmentValues & {
  id: string;
  submittedAt?: string;
  status?: "pendente" | "aprovado" | "recusado";
  staffNote?: string;
};

type FilterStatus = "todos" | "pendente" | "aprovado" | "recusado";
type ActiveSection = "candidaturas" | "lines" | "membros";

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_KEYS = [
  "DMgKVB@FkbL#!fJ",
  "LATAM#Elite2026!Staff",
  "latam2026",
  "souza2026",
  "adminlatam",
  "souza",
  "admin",
];
const STORAGE_KEY = "latam-admin-candidates";
const AUTH_KEY = "latam-admin-auth";
const AUTH_EXP_KEY = "latam-admin-auth-exp";
const SESSION_TTL = 2 * 60 * 60 * 1000; // 2 horas
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;
const LINEUP_SLOTS = 12;

function isSessionValid(): boolean {
  try {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === "true";
    const exp = Number(sessionStorage.getItem(AUTH_EXP_KEY) || 0);
    if (isAuthed && exp && Date.now() < exp) {
      return true;
    }
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_EXP_KEY);
    return false;
  } catch {
    return false;
  }
}

const DEMO: StoredCandidate[] = [];

// ─── Color Maps ───────────────────────────────────────────────────────────────

const FUNCAO_COLORS: Record<string, string> = {
  rush: "text-red-400 bg-red-500/10 border border-red-500/20",
  suporte: "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20",
  fuzileiro: "text-purple-400 bg-purple-500/10 border border-purple-500/20",
  granadeiro: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
  full_gas: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
  cura: "text-green-400 bg-green-500/10 border border-green-500/20",
  flexivel: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
};

const PATENTE_COLORS: Record<string, string> = {
  elite: "text-amber-300",
  diamente_mestre: "text-rose-400",
  platina_diamente: "text-cyan-400",
  ouro_platina: "text-yellow-400",
  outra: "text-slate-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function labelOf(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function formatFicha(c: StoredCandidate): string {
  return [
    `*${GUILD_NAME}${GUILD_MARK} — Candidatura*`,
    "",
    `*Nick:* ${c.nick}`,
    `*Nome:* ${c.nome}, ${c.idade} anos`,
    `*Cidade:* ${c.cidadeEstado}`,
    `*WhatsApp:* ${c.whatsapp}`,
    `*ID da conta:* ${c.idConta}`,
    "",
    `*Função:* ${labelOf(FUNCOES, c.funcao)}`,
    `*Patente:* ${labelOf(PATENTES_LATAM, c.patenteAtual)}`,
    `*Exp. Competitiva:* ${labelOf(SIM_NAO, c.experienciaCompetitiva)}`,
    c.experienciaDescricao ? `*Histórico:* ${c.experienciaDescricao}` : "",
    "",
    `*Disponibilidade:* ${labelOf(HORAS_DISPONIBILIDADE, c.tempoDisponivel)}`,
    `*Horário:* ${c.horarioDisponivel}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function loadCandidates(): StoredCandidate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCandidate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCandidates(list: StoredCandidate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

// ─── WA Message Templates ─────────────────────────────────────────────────────

function getWaTemplates(nick: string) {
  return [
    {
      id: "convocacao",
      icon: "⚔️",
      label: "Convocação para Teste de Line-up",
      preview: `Opa ${nick}! Vi sua candidatura na LATAM 友 e quero te convocar para um teste de line-up. Vamos marcar? ⚔️`,
      approvesPlayer: false,
    },
    {
      id: "entrevista",
      icon: "🎙️",
      label: "Entrevista & Alinhamento",
      preview: `Salve ${nick}! Tô de olho na sua ficha. Bora trocar uma ideia rápida antes do teste? 🎙️`,
      approvesPlayer: false,
    },
    {
      id: "aprovacao",
      icon: "🏆",
      label: "Aprovação Oficial",
      preview: `${nick}, você foi aprovado(a) oficialmente na guilda LATAM 友! Seja bem-vindo(a) ao time. 🏆🔥`,
      approvesPlayer: true,
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: StoredCandidate["status"] }) {
  if (status === "aprovado")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        Aprovado p/ Teste
      </span>
    );
  if (status === "recusado")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
        <span className="size-1.5 rounded-full bg-red-400" />
        Recusado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
      <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
      Em Análise
    </span>
  );
}

// ─── Whatsapp Modal ───────────────────────────────────────────────────────────

function WhatsAppModal({
  candidate,
  onClose,
  onApprove,
}: {
  candidate: StoredCandidate;
  onClose: () => void;
  onApprove: () => void;
}) {
  const templates = getWaTemplates(candidate.nick);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e131b] p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              Whatsapp
            </p>
            <h3 className="font-display text-2xl text-silver">
              Escolher Mensagem
            </h3>
            <p className="text-sm text-subtle">
              Jogador:{" "}
              <span className="font-mono text-foreground">{candidate.nick}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {templates.map((tpl) => {
            const url = formatWhatsAppUrl(candidate.whatsapp, tpl.preview);
            return (
              <a
                key={tpl.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (tpl.approvesPlayer) {
                    playApproveSound();
                    onApprove();
                  } else {
                    playClickSound();
                  }
                  onClose();
                }}
                className="group flex items-start gap-4 rounded-xl border border-white/8 bg-[#121821] p-4 transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <span className="text-2xl">{tpl.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 text-sm font-semibold text-silver group-hover:text-accent transition-colors">
                    {tpl.label}
                  </p>
                  <p className="text-xs text-subtle leading-relaxed line-clamp-2">
                    {tpl.preview}
                  </p>
                </div>
                <ExternalLink
                  size={14}
                  className="mt-0.5 shrink-0 text-subtle group-hover:text-accent transition-colors"
                />
              </a>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Add Player Modal ─────────────────────────────────────────────────────────

function parseFichaText(raw: string) {
  const clean = raw.replace(/[*_#~]/g, "");
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  let nick = "";
  let idConta = "";
  let nome = "";
  let idade = "18";
  let whatsapp = "";
  let cidadeEstado = "Brasil";
  let funcao = "rush";
  let patenteAtual = "diamente_mestre";
  let tempoDisponivel = "2-4h";
  let horarioDisponivel = "";
  let experienciaDescricao = "";

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("nick:") || lower.startsWith("nickname:")) {
      nick = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (lower.startsWith("nome:")) {
      const val = line.split(/:(.+)/)[1]?.trim() || "";
      const matchAge = val.match(/(.*?)(?:,\s*(\d{1,2})\s*anos?)?$/i);
      if (matchAge) {
        nome = matchAge[1]?.trim() || val;
        if (matchAge[2]) idade = matchAge[2];
      } else {
        nome = val;
      }
    } else if (lower.startsWith("idade:")) {
      const digits = line.replace(/\D/g, "");
      if (digits) idade = digits;
    } else if (lower.startsWith("cidade:") || lower.startsWith("cidade/estado:")) {
      cidadeEstado = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (
      lower.startsWith("whatsapp:") ||
      lower.startsWith("whats:") ||
      lower.startsWith("zap:") ||
      lower.startsWith("telefone:")
    ) {
      whatsapp = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (
      lower.startsWith("id:") ||
      lower.startsWith("id da conta:") ||
      lower.startsWith("id free fire:")
    ) {
      idConta = line.split(/:(.+)/)[1]?.replace(/\D/g, "") || "";
    } else if (lower.startsWith("função:") || lower.startsWith("funcao:")) {
      const fVal = lower.split(/:(.+)/)[1]?.trim() || "";
      if (fVal.includes("suporte")) funcao = "suporte";
      else if (fVal.includes("fuzil")) funcao = "fuzileiro";
      else if (fVal.includes("granad")) funcao = "granadeiro";
      else if (fVal.includes("gas") || fVal.includes("gás")) funcao = "full_gas";
      else if (fVal.includes("cura")) funcao = "cura";
      else if (fVal.includes("flex")) funcao = "flexivel";
      else funcao = "rush";
    } else if (lower.startsWith("patente:")) {
      const pVal = lower.split(/:(.+)/)[1]?.trim() || "";
      if (pVal.includes("elite")) patenteAtual = "elite";
      else if (pVal.includes("mestre") || pVal.includes("diamante")) patenteAtual = "diamente_mestre";
      else if (pVal.includes("platina")) patenteAtual = "platina_diamente";
      else if (pVal.includes("ouro")) patenteAtual = "ouro_platina";
      else patenteAtual = "diamente_mestre";
    } else if (lower.startsWith("horário:") || lower.startsWith("horario:")) {
      horarioDisponivel = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (lower.startsWith("disponibilidade:") || lower.startsWith("tempo:")) {
      const tVal = lower.split(/:(.+)/)[1]?.trim() || "";
      if (tVal.includes("4")) tempoDisponivel = "4+h";
      else if (tVal.includes("2")) tempoDisponivel = "2-4h";
      else tempoDisponivel = "1-2h";
    } else if (lower.startsWith("histórico:") || lower.startsWith("historico:")) {
      experienciaDescricao = line.split(/:(.+)/)[1]?.trim() || "";
    }
  }

  // Fallbacks regex
  if (!idConta) {
    const idMatch = clean.match(/\b(\d{7,12})\b/);
    if (idMatch) idConta = idMatch[1];
  }
  if (!whatsapp) {
    const zapMatch = clean.match(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/);
    if (zapMatch) whatsapp = zapMatch[0];
  }
  if (!nick) {
    const firstNonHeader = lines.find(
      (l) => !l.toLowerCase().includes("latam") && !l.toLowerCase().includes("candidatura")
    );
    if (firstNonHeader) {
      nick = firstNonHeader.slice(0, 24);
    }
  }

  return {
    nick: nick || "Recruta",
    idConta: idConta || String(Date.now()).slice(-8),
    nome: nome || nick || "Recruta",
    idade,
    cidadeEstado,
    whatsapp: whatsapp || "(11) 99999-9999",
    funcao,
    patenteAtual,
    tempoDisponivel,
    horarioDisponivel: horarioDisponivel || "A combinar",
    experienciaCompetitiva: experienciaDescricao ? "sim" : "nao",
    experienciaDescricao,
  };
}

function AddPlayerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (c: StoredCandidate) => void;
}) {
  const [pastedText, setPastedText] = useState("");
  const parsed = pastedText.trim() ? parseFichaText(pastedText) : null;

  async function handlePasteFromClipboard() {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) {
        setPastedText(clipText);
        toast.success("Texto colado da área de transferência!");
      } else {
        toast.error("A área de transferência está vazia.");
      }
    } catch {
      toast.info("Pressione Ctrl+V no campo para colar.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pastedText.trim()) {
      toast.error("Cole o texto da ficha antes de adicionar.");
      return;
    }
    const data = parseFichaText(pastedText);
    const candidate: StoredCandidate = {
      id: `cand-${Date.now()}`,
      nick: data.nick,
      idConta: data.idConta,
      nome: data.nome,
      whatsapp: data.whatsapp,
      funcao: data.funcao,
      patenteAtual: data.patenteAtual,
      idade: data.idade,
      cidadeEstado: data.cidadeEstado,
      experienciaCompetitiva: data.experienciaCompetitiva,
      experienciaDescricao: data.experienciaDescricao,
      tempoDisponivel: data.tempoDisponivel,
      horarioDisponivel: data.horarioDisponivel,
      submittedAt: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pendente",
      staffNote: "Importado via Colar Ficha",
    };
    playApproveSound();
    onAdd(candidate);
    toast.success(`${candidate.nick} adicionado à lista.`);
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e131b] p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              Candidatos
            </p>
            <h3 className="font-display text-2xl text-silver flex items-center gap-2">
              📋 Colar Ficha Completa
            </h3>
            <p className="text-xs text-subtle mt-1">
              Cole o texto enviado pelo jogador (WhatsApp, Discord ou Instagram). O sistema extrai todos os dados na hora!
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
            >
              <ClipboardPaste size={14} />
              Colar da Área de Transferência
            </button>
          </div>

          <div className="relative">
            <textarea
              className="w-full rounded-xl border border-white/10 bg-[#121821] p-3 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none resize-none font-mono text-xs"
              rows={8}
              placeholder={`Cole aqui o texto ou ficha inteira do jogador...\n\nExemplo:\nNick: LUK4S_FF\nNome: Lucas Souza\nWhatsApp: (11) 98844-2211\nID da conta: 189420392\nFunção: Rush\nPatente: Mestre`}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              autoFocus
            />
          </div>

          {parsed && (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-accent">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Dados Identificados
                </span>
                <span className="text-[11px] text-emerald-400">✓ Pronto para adicionar</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Nick</span>
                  <span className="font-semibold text-silver truncate block">{parsed.nick}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">ID</span>
                  <span className="font-mono text-accent truncate block">{parsed.idConta}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">WhatsApp</span>
                  <span className="text-silver truncate block">{parsed.whatsapp}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Função</span>
                  <span className="text-silver capitalize truncate block">{parsed.funcao}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Patente</span>
                  <span className="text-silver capitalize truncate block">{labelOf(PATENTES_LATAM, parsed.patenteAtual)}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Nome</span>
                  <span className="text-silver truncate block">{parsed.nome}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-white/10"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={!pastedText.trim()}
            >
              <UserPlus size={15} />
              Adicionar Jogador
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}


// ─── Candidate Card ───────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  onStatusChange,
  onDelete,
  onNoteChange,
  onWaClick,
  onPromote,
}: {
  candidate: StoredCandidate;
  onStatusChange: (id: string, status: StoredCandidate["status"]) => void;
  onDelete: (candidate: StoredCandidate) => void;
  onNoteChange: (id: string, note: string) => void;
  onWaClick: (c: StoredCandidate) => void;
  onPromote?: (c: StoredCandidate) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(candidate.staffNote ?? "");
  const [copied, setCopied] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingNote) noteRef.current?.focus();
  }, [editingNote]);

  function copyId() {
    void navigator.clipboard.writeText(candidate.idConta);
    setCopied(true);
    toast.info("ID copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  function copyFicha() {
    playClickSound();
    void navigator.clipboard.writeText(formatFicha(candidate));
    toast.success("Ficha copiada!");
  }

  function saveNote() {
    onNoteChange(candidate.id, noteText);
    setEditingNote(false);
    toast.success("Nota salva.");
  }

  const funcaoColor =
    FUNCAO_COLORS[candidate.funcao] ??
    "text-slate-400 bg-slate-500/10 border border-slate-500/20";
  const patenteColor = PATENTE_COLORS[candidate.patenteAtual] ?? "text-slate-400";

  return (
    <div className="rounded-xl border border-white/8 bg-[#0e131b] p-5 transition-all hover:border-white/12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* ── Left ── */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="mb-3 flex flex-wrap items-start gap-3">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                <Users size={16} className="text-accent" />
              </div>
              <div>
                <p className="font-display text-xl leading-none text-silver">
                  {candidate.nick}
                </p>
                <p className="mt-0.5 text-xs text-subtle">
                  {candidate.nome || "—"}
                  {candidate.idade ? `, ${candidate.idade} anos` : ""}
                </p>
              </div>
            </div>
            <StatusBadge status={candidate.status} />
          </div>

          {/* Meta */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-subtle">
            {candidate.cidadeEstado && (
              <span>{candidate.cidadeEstado}</span>
            )}
            {candidate.cidadeEstado && candidate.submittedAt && (
              <span className="text-white/20">·</span>
            )}
            {candidate.submittedAt && <span>{candidate.submittedAt}</span>}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {candidate.funcao && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${funcaoColor}`}
              >
                {labelOf(FUNCOES, candidate.funcao)}
              </span>
            )}
            {candidate.patenteAtual && (
              <span
                className={`inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium ${patenteColor}`}
              >
                {labelOf(PATENTES_LATAM, candidate.patenteAtual)}
              </span>
            )}
            {candidate.idConta && (
              <button
                onClick={copyId}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-subtle transition-colors hover:border-accent/30 hover:text-accent"
              >
                {copied ? (
                  <span className="text-emerald-400">Copiado!</span>
                ) : (
                  <>
                    {candidate.idConta}
                    <Copy size={10} />
                  </>
                )}
              </button>
            )}
            {candidate.horarioDisponivel && (
              <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-subtle">
                {candidate.horarioDisponivel}
              </span>
            )}
          </div>

          {/* Historical Experience */}
          {candidate.experienciaCompetitiva === "sim" &&
            candidate.experienciaDescricao && (
              <div className="mb-3 rounded-lg border border-white/6 bg-[#121821] px-3 py-2.5">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-accent">
                  Histórico Competitivo
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  {candidate.experienciaDescricao}
                </p>
              </div>
            )}

          {/* Staff Note */}
          {editingNote ? (
            <div className="space-y-2">
              <textarea
                ref={noteRef}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:outline-none"
                placeholder="Nota interna do staff..."
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditingNote(false);
                    setNoteText(candidate.staffNote ?? "");
                  }}
                  className="rounded-md border border-white/10 px-3 py-1 text-xs text-subtle hover:text-foreground"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : candidate.staffNote ? (
            <div
              className="cursor-pointer rounded-lg border border-accent/15 bg-accent/5 px-3 py-2.5 transition-all hover:border-accent/25"
              onClick={() => setEditingNote(true)}
            >
              <p className="mb-1 text-[10px] uppercase tracking-widest text-accent">
                Nota Staff
              </p>
              <p className="text-xs text-silver leading-relaxed">
                {candidate.staffNote}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setEditingNote(true)}
              className="text-xs text-subtle underline-offset-2 hover:text-accent hover:underline transition-colors"
            >
              + Nota Staff
            </button>
          )}
        </div>

        {/* ── Right ── */}
        <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col sm:items-stretch">
          {candidate.status === "aprovado" && onPromote && (
            <Button
              className="gap-2 border-accent/40 bg-accent/15 py-2 text-sm text-accent hover:bg-accent/25"
              variant="ghost"
              onClick={() => {
                playClickSound();
                onPromote(candidate);
              }}
            >
              <Trophy size={14} />
              Promover a Membro
            </Button>
          )}
          <Button
            className="gap-2 border-emerald-500/30 bg-emerald-500/10 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20"
            variant="ghost"
            onClick={() => onWaClick(candidate)}
          >
            <MessageCircle size={14} />
            Chamar no Zap
          </Button>
          <Button
            variant="ghost"
            className="gap-2 border border-white/10 py-2 text-sm text-subtle hover:text-foreground"
            onClick={copyFicha}
          >
            <Copy size={14} />
            Copiar Ficha
          </Button>

          {/* Status Actions */}
          <div className="flex items-center justify-between gap-1 rounded-lg border border-white/8 bg-[#121821] px-2 py-1.5">
            <button
              title="Aprovar"
              onClick={() => {
                playApproveSound();
                onStatusChange(candidate.id, "aprovado");
              }}
              className={`rounded-md p-1.5 transition-colors ${
                candidate.status === "aprovado"
                  ? "text-emerald-400"
                  : "text-subtle hover:text-emerald-400"
              }`}
            >
              <CheckCircle2 size={15} />
            </button>
            <button
              title="Em Análise"
              onClick={() => {
                playClickSound();
                onStatusChange(candidate.id, "pendente");
              }}
              className={`rounded-md p-1.5 transition-colors ${
                candidate.status === "pendente"
                  ? "text-amber-400"
                  : "text-subtle hover:text-amber-400"
              }`}
            >
              <Clock size={15} />
            </button>
            <button
              title="Recusar"
              onClick={() => {
                playDenySound();
                onStatusChange(candidate.id, "recusado");
              }}
              className={`rounded-md p-1.5 transition-colors ${
                candidate.status === "recusado"
                  ? "text-red-400"
                  : "text-subtle hover:text-red-400"
              }`}
            >
              <XCircle size={15} />
            </button>
            <span className="h-3 w-px bg-white/10" />
            <button
              title="Excluir Candidatura"
              onClick={() => {
                playClickSound();
                onDelete(candidate);
              }}
              className="rounded-md p-1.5 text-subtle transition-colors hover:text-red-400"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [shaking, setShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cyber grid background
  const gridStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
  };

  function startLockout() {
    setLocked(true);
    setCountdown(LOCKOUT_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setLocked(false);
          setAttempts(0);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;

    if (VALID_KEYS.includes(password.trim())) {
      playSuccessSound();
      try {
        sessionStorage.setItem(AUTH_KEY, "true");
        sessionStorage.setItem(AUTH_EXP_KEY, String(Date.now() + SESSION_TTL));
      } catch {
        /* ignore */
      }
      onLogin();
      toast.success("Acesso autorizado. Bem-vindo ao Painel.");
    } else {
      playDenySound();
      const next = attempts + 1;
      setAttempts(next);
      setPassword("");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      if (next >= MAX_ATTEMPTS) {
        startLockout();
        toast.error("Muitas tentativas. Acesso bloqueado por 60 segundos.");
      } else {
        toast.error(`Senha incorreta. ${MAX_ATTEMPTS - next} tentativa(s) restante(s).`);
      }
    }
  }

  return (
    <div
      className="min-h-screen page-bg flex flex-col"
      style={gridStyle}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/latam-mark.webp" alt={`${GUILD_NAME}${GUILD_MARK}`} className="h-7 w-auto" />
          <span className="font-display text-xl text-silver">
            {GUILD_NAME}{" "}
            <span className="text-accent">{GUILD_MARK}</span>
          </span>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-foreground"
        >
          ← Voltar ao Site
        </Link>
      </header>

      {/* Center */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Logo glow */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(0,180,255,0.35) 0%, transparent 70%)" }}
              />
              <img
                src="/latam-mark.webp"
                alt={`${GUILD_NAME}${GUILD_MARK}`}
                className="relative h-20 w-auto drop-shadow-lg"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs uppercase tracking-widest text-accent">
              Acesso Restrito
            </p>
            <h1 className="font-display text-4xl text-silver leading-none mb-2">
              Painel da Liderança
            </h1>
            <p className="text-sm text-subtle leading-relaxed">
              Acesso exclusivo para líderes e recrutadores da guilda{" "}
              <span className="text-foreground">
                {GUILD_NAME} {GUILD_MARK}
              </span>
              .
            </p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            animate={shaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-4"
          >
            {/* Password field */}
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
                <KeyRound size={15} />
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={locked}
                placeholder="••••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#121821] py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Lockout countdown */}
            {locked && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-center">
                <p className="text-xs text-red-400">
                  Acesso bloqueado. Aguarde{" "}
                  <span className="font-mono font-bold">{countdown}s</span>
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={locked || !password}
            >
              <ShieldCheck size={15} />
              Entrar no Painel
            </Button>
          </motion.form>

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-subtle">
            <Lock size={11} />
            <span>Sistema seguro · Acesso monitorado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("candidaturas");
  const [candidates, setCandidates] = useState<StoredCandidate[]>(loadCandidates);
  const [members, setMembers] = useState<GuildMember[]>(() => loadMembers());
  const [lines, setLines] = useState<GuildLine[]>(() => loadLines());
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [search, setSearch] = useState("");
  const [funcaoFilter, setFuncaoFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "nick">("newest");
  const [muted, setMuted] = useState(isSoundMuted);
  const [waCandidate, setWaCandidate] = useState<StoredCandidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasteMemberModal, setShowPasteMemberModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<StoredCandidate | null>(null);
  const [memberModal, setMemberModal] = useState<{
    isOpen: boolean;
    initialData?: GuildMember | null;
  }>({ isOpen: false });
  const [lineModal, setLineModal] = useState<{
    isOpen: boolean;
    initialData?: GuildLine | null;
  }>({ isOpen: false });

  // Carregar do Supabase e assinar atualizações Realtime se configurado
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    fetchCandidatesSupabase()
      .then((data) => {
        if (isMounted) {
          setCandidates(data);
        }
      })
      .catch((err) => {
        console.warn("[Admin] Falha ao carregar do Supabase:", err);
      });

    const client = getSupabase();
    if (!client) return;

    const channel = client
      .channel("admin-candidatos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidatos" },
        () => {
          fetchCandidatesSupabase().then((data) => {
            if (isMounted) {
              setCandidates(data);
            }
          });
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  // Persist on change (backup local)
  useEffect(() => saveCandidates(candidates), [candidates]);
  useEffect(() => saveMembers(members), [members]);
  useEffect(() => saveLines(lines), [lines]);

  function updateStatus(id: string, status: StoredCandidate["status"]) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    if (isSupabaseConfigured) {
      updateCandidateSupabase(id, { status }).catch((e) =>
        console.error("Erro ao atualizar Supabase:", e),
      );
    }
    if (status === "aprovado") {
      toast.success("Candidato aprovado p/ teste.");
      playApproveSound();
    } else if (status === "recusado") {
      toast.error("Candidato recusado.");
      playDenySound();
    } else {
      toast.info("Status atualizado para Em Análise.");
    }
  }

  function deleteCandidate(id: string) {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured) {
      deleteCandidateSupabase(id).catch((e) =>
        console.error("Erro ao deletar Supabase:", e),
      );
    }
    toast.success("Candidato removido.");
  }

  function updateNote(id: string, note: string) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, staffNote: note } : c)),
    );
    if (isSupabaseConfigured) {
      updateCandidateSupabase(id, { staff_note: note }).catch((e) =>
        console.error("Erro ao salvar nota Supabase:", e),
      );
    }
  }

  function addCandidate(c: StoredCandidate) {
    setCandidates((prev) => [c, ...prev]);
    if (isSupabaseConfigured) {
      insertCandidateSupabase(c).catch((e) =>
        console.error("Erro ao salvar Supabase:", e),
      );
    }
  }

  function approveViaWa(id: string) {
    updateStatus(id, "aprovado");
  }

  function exportCsv() {
    playClickSound();
    const header = "Nick,Nome,Idade,Cidade,WhatsApp,ID,Função,Patente,Horário,Status,Data";
    const rows = candidates.map((c) =>
      [
        c.nick,
        c.nome,
        c.idade,
        c.cidadeEstado,
        c.whatsapp,
        c.idConta,
        labelOf(FUNCOES, c.funcao),
        labelOf(PATENTES_LATAM, c.patenteAtual),
        c.horarioDisponivel,
        c.status ?? "pendente",
        c.submittedAt ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `latam-candidatos-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exportação concluída.");
  }

  // Member Handlers
  function handleAddMember() {
    playClickSound();
    setMemberModal({ isOpen: true, initialData: null });
  }

  function handleEditMember(m: GuildMember) {
    playClickSound();
    setMemberModal({ isOpen: true, initialData: m });
  }

  function handleDeleteMember(id: string) {
    playDenySound();
    setMembers((prev) => prev.filter((m) => m.id !== id));
    // Clear from line slots
    setLines((prev) =>
      prev.map((line) => ({
        ...line,
        slots: line.slots.map((s) =>
          s.jogadorId === id
            ? { ...s, jogadorNick: "", jogadorId: undefined, jogadorIdConta: undefined }
            : s,
        ),
      })),
    );
    toast.success("Membro removido do roster.");
  }

  function handleSaveMember(saved: GuildMember) {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      if (exists) {
        return prev.map((m) => (m.id === saved.id ? saved : m));
      }
      return [saved, ...prev];
    });
    setMemberModal({ isOpen: false });
  }

  function handlePromoteCandidate(c: StoredCandidate) {
    playClickSound();
    setMemberModal({
      isOpen: true,
      initialData: {
        id: `mem-${Date.now()}`,
        nick: c.nick,
        nome: c.nome || "",
        idConta: c.idConta,
        whatsapp: c.whatsapp,
        cargo: "titular",
        funcao: c.funcao || "rush",
        patente: c.patenteAtual || "diamente_mestre",
        status: "ativo",
        entrouEm: "Recém-Aprovado",
        nota: c.staffNote || "Promovido via recrutamento",
      },
    });
  }

  // Line Handlers
  function handleAddLine() {
    playClickSound();
    setLineModal({ isOpen: true, initialData: null });
  }

  function handleEditLine(l: GuildLine) {
    playClickSound();
    setLineModal({ isOpen: true, initialData: l });
  }

  function handleDeleteLine(lineId: string) {
    playDenySound();
    setLines((prev) => prev.filter((l) => l.id !== lineId));
    toast.success("Line excluída com sucesso.");
  }

  function handleSaveLine(saved: GuildLine) {
    setLines((prev) => {
      const exists = prev.some((l) => l.id === saved.id);
      if (exists) {
        return prev.map((l) => (l.id === saved.id ? saved : l));
      }
      return [...prev, saved];
    });
    setLineModal({ isOpen: false });
  }

  function handleAssignSlot(
    lineId: string,
    slotNumber: number,
    playerNick: string,
    idConta?: string,
    memberId?: string,
  ) {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        return {
          ...line,
          slots: line.slots.map((s) => {
            if (s.slotNumber !== slotNumber) return s;
            return {
              ...s,
              jogadorNick: playerNick,
              jogadorIdConta: idConta || s.jogadorIdConta,
              jogadorId: memberId || s.jogadorId,
            };
          }),
        };
      }),
    );
  }

  function handleClearSlot(lineId: string, slotNumber: number) {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        return {
          ...line,
          slots: line.slots.map((s) => {
            if (s.slotNumber !== slotNumber) return s;
            return {
              ...s,
              jogadorNick: "",
              jogadorId: undefined,
              jogadorIdConta: undefined,
            };
          }),
        };
      }),
    );
    toast.info("Vaga desescalada.");
  }

  // Stats
  const total = candidates.length;
  const emAnalise = candidates.filter((c) => c.status === "pendente").length;
  const aprovados = candidates.filter((c) => c.status === "aprovado").length;
  const recusados = candidates.filter((c) => c.status === "recusado").length;
  const vagasLivres = Math.max(0, LINEUP_SLOTS - aprovados);

  // Filter + sort
  const filtered = candidates
    .filter((c) => {
      if (filterStatus !== "todos" && c.status !== filterStatus) return false;
      if (funcaoFilter && c.funcao !== funcaoFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.nick.toLowerCase().includes(q) ||
          c.nome.toLowerCase().includes(q) ||
          c.cidadeEstado.toLowerCase().includes(q) ||
          c.idConta.includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "nick") return a.nick.localeCompare(b.nick);
      if (sortBy === "oldest") return (a.submittedAt ?? "").localeCompare(b.submittedAt ?? "");
      return (b.submittedAt ?? "").localeCompare(a.submittedAt ?? "");
    });

  const tabs: { value: FilterStatus; label: string; count: number }[] = [
    { value: "todos", label: "Todos", count: total },
    { value: "pendente", label: "Pendentes", count: emAnalise },
    { value: "aprovado", label: "Aprovados", count: aprovados },
    { value: "recusado", label: "Recusados", count: recusados },
  ];

  const selectClass =
    "rounded-lg border border-white/10 bg-[#121821] px-3 py-1.5 text-sm text-foreground focus:border-accent/50 focus:outline-none";

  return (
    <div className="min-h-screen page-bg">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07090e]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/latam-mark.webp"
                alt={`${GUILD_NAME}${GUILD_MARK}`}
                className="h-7 w-auto transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl text-silver hidden sm:block">
                {GUILD_NAME} <span className="text-accent">{GUILD_MARK}</span>
              </span>
            </Link>

            {/* Nav Section Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-[#121821] p-1">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveSection("candidaturas");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeSection === "candidaturas"
                    ? "bg-accent/15 text-accent shadow-sm border border-accent/30"
                    : "text-subtle hover:text-foreground"
                }`}
              >
                <FileText size={13} />
                <span className="hidden md:inline">Candidaturas</span>
                <span className="md:hidden">Inscritos</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">
                  {candidates.length}
                </span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveSection("lines");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeSection === "lines"
                    ? "bg-accent/15 text-accent shadow-sm border border-accent/30"
                    : "text-subtle hover:text-foreground"
                }`}
              >
                <Swords size={13} />
                <span>Lines</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">
                  {lines.length}
                </span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveSection("membros");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeSection === "membros"
                    ? "bg-accent/15 text-accent shadow-sm border border-accent/30"
                    : "text-subtle hover:text-foreground"
                }`}
              >
                <Users size={13} />
                <span>Membros</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">
                  {members.length}
                </span>
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sound toggle */}
            <button
              onClick={() => {
                const m = toggleSound();
                setMuted(m);
              }}
              className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
              title={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Contextual Action Buttons */}
            {activeSection === "candidaturas" && (
              <>
                <button
                  onClick={exportCsv}
                  className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
                  title="Exportar CSV"
                >
                  <Download size={16} />
                </button>
                <Button
                  className="gap-1.5 py-2 text-sm bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30"
                  onClick={() => {
                    playClickSound();
                    setShowAddModal(true);
                  }}
                >
                  <ClipboardPaste size={14} />
                  <span className="hidden sm:inline">Colar Ficha</span>
                  <span className="sm:hidden">Colar</span>
                </Button>
              </>
            )}

            {activeSection === "lines" && (
              <Button
                className="gap-1.5 py-2 text-sm bg-accent text-accent-foreground font-semibold hover:bg-accent/90"
                onClick={handleAddLine}
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Nova Line</span>
                <span className="sm:hidden">Line</span>
              </Button>
            )}

            {activeSection === "membros" && (
              <>
                <Button
                  className="gap-1.5 py-2 text-sm bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30"
                  onClick={() => {
                    playClickSound();
                    setShowPasteMemberModal(true);
                  }}
                >
                  <ClipboardPaste size={14} />
                  <span className="hidden sm:inline">Colar Ficha</span>
                  <span className="sm:hidden">Colar</span>
                </Button>
                <Button
                  className="gap-1.5 py-2 text-sm bg-accent text-accent-foreground font-semibold hover:bg-accent/90"
                  onClick={handleAddMember}
                >
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Novo Membro</span>
                  <span className="sm:hidden">Membro</span>
                </Button>
              </>
            )}

            {/* Logout */}
            <button
              onClick={() => {
                playClickSound();
                try {
                  sessionStorage.removeItem(AUTH_KEY);
                } catch {
                  /* ignore */
                }
                onLogout();
                toast.info("Sessão encerrada.");
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* ── Section: Candidaturas ── */}
        {activeSection === "candidaturas" && (
          <>
            {/* Header with Supabase indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent font-semibold">
                  Recrutamento Aberto
                </p>
                <h1 className="font-display text-3xl text-silver">
                  Candidaturas Free Fire
                </h1>
              </div>

              <div>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Supabase Nuvem Ativo
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400"
                    title="Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env"
                  >
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    Modo Local (Sem Nuvem)
                  </span>
                )}
              </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {/* Total */}
              <div className="rounded-xl border border-white/8 bg-[#0e131b] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-subtle">
                    Total Inscritos
                  </p>
                  <Users size={15} className="text-subtle" />
                </div>
                <p className="font-display text-4xl text-foreground">{total}</p>
              </div>

              {/* Em Análise */}
              <div className="rounded-xl border border-amber-500/15 bg-[#0e131b] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-subtle">
                    Em Análise
                  </p>
                  <Clock size={15} className="text-amber-400" />
                </div>
                <p className="font-display text-4xl text-amber-400">{emAnalise}</p>
              </div>

              {/* Aprovados */}
              <div className="rounded-xl border border-emerald-500/15 bg-[#0e131b] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-subtle">
                    Aprovados p/ Teste
                  </p>
                  <Trophy size={15} className="text-emerald-400" />
                </div>
                <p className="font-display text-4xl text-emerald-400">{aprovados}</p>
              </div>

              {/* Vagas */}
              <div className="rounded-xl border border-accent/15 bg-[#0e131b] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-subtle">
                    Vagas da Line-up
                  </p>
                  <Swords size={15} className="text-accent" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-4xl text-accent">{aprovados}</span>
                  <span className="text-sm font-semibold text-subtle">/ {LINEUP_SLOTS}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (aprovados / LINEUP_SLOTS) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-subtle">
                  {vagasLivres} vaga{vagasLivres !== 1 ? "s" : ""} livre{vagasLivres !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* ── Search + Filters ── */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
                />
                <input
                  type="text"
                  placeholder="Buscar por nick, nome ou cidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#121821] py-1.5 pl-8 pr-8 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Status tabs */}
              <div className="flex items-center gap-0.5 rounded-lg border border-white/8 bg-[#121821] p-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      playClickSound();
                      setFilterStatus(tab.value);
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      filterStatus === tab.value
                        ? "bg-accent text-accent-foreground"
                        : "text-subtle hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        filterStatus === tab.value
                          ? "bg-accent-foreground/20 text-accent-foreground"
                          : "bg-white/8 text-subtle"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Function filter */}
              <select
                value={funcaoFilter}
                onChange={(e) => {
                  playClickSound();
                  setFuncaoFilter(e.target.value);
                }}
                className={selectClass}
              >
                <option value="">Todas as funções</option>
                {FUNCOES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => {
                  playClickSound();
                  setSortBy(e.target.value as typeof sortBy);
                }}
                className={selectClass}
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="nick">Nick (A-Z)</option>
              </select>
            </div>

            {/* ── Candidate List ── */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <Users size={32} className="mx-auto mb-4 text-subtle/40" />
                  <p className="text-subtle">Nenhum candidato encontrado.</p>
                </div>
              ) : (
                filtered.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    onStatusChange={updateStatus}
                    onDelete={(cand) => setCandidateToDelete(cand)}
                    onNoteChange={updateNote}
                    onWaClick={(cand) => {
                      playClickSound();
                      setWaCandidate(cand);
                    }}
                    onPromote={handlePromoteCandidate}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* ── Section: Lines ── */}
        {activeSection === "lines" && (
          <LinesView
            lines={lines}
            members={members}
            candidates={candidates}
            onAddLine={handleAddLine}
            onEditLine={handleEditLine}
            onDeleteLine={handleDeleteLine}
            onAssignSlot={handleAssignSlot}
            onClearSlot={handleClearSlot}
          />
        )}

        {/* ── Section: Membros ── */}
        {activeSection === "membros" && (
          <MembrosView
            members={members}
            lines={lines}
            onAddMember={handleAddMember}
            onPasteMember={() => {
              playClickSound();
              setShowPasteMemberModal(true);
            }}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {waCandidate && (
          <WhatsAppModal
            key="wa-modal"
            candidate={waCandidate}
            onClose={() => setWaCandidate(null)}
            onApprove={() => approveViaWa(waCandidate.id)}
          />
        )}
        {showAddModal && (
          <AddPlayerModal
            key="add-modal"
            onClose={() => setShowAddModal(false)}
            onAdd={addCandidate}
          />
        )}
        {showPasteMemberModal && (
          <PasteMemberModal
            key="paste-member-modal"
            lines={lines}
            onClose={() => setShowPasteMemberModal(false)}
            onAdd={handleSaveMember}
          />
        )}
        {candidateToDelete && (
          <ConfirmDeleteModal
            key="confirm-delete-candidate"
            isOpen={Boolean(candidateToDelete)}
            title="Excluir Candidatura"
            itemName={candidateToDelete.nick}
            itemDescription={`A ficha de ${candidateToDelete.nome || candidateToDelete.nick} será apagada permanentemente do sistema.`}
            confirmLabel="Sim, Excluir Ficha"
            onClose={() => setCandidateToDelete(null)}
            onConfirm={() => {
              playDenySound();
              deleteCandidate(candidateToDelete.id);
              setCandidateToDelete(null);
            }}
          />
        )}
        {memberModal.isOpen && (
          <MemberModal
            key="member-modal"
            initialData={memberModal.initialData}
            lines={lines}
            onClose={() => setMemberModal({ isOpen: false })}
            onSave={handleSaveMember}
          />
        )}
        {lineModal.isOpen && (
          <AddLineModal
            key="line-modal"
            initialLine={lineModal.initialData}
            onClose={() => setLineModal({ isOpen: false })}
            onSave={handleSaveLine}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

function AdminPage() {
  const [authed, setAuthed] = useState(() => isSessionValid());

  // Expose displayValue to suppress unused import warning (it's part of required imports)
  void displayValue;
  void maskPhone;
  void maskPlayerId;
  void SIM_NAO;
  void HORAS_DISPONIBILIDADE;

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
