import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  MessageCircle,
  Search,
  ShieldCheck,
  Swords,
  Trash2,
  Trophy,
  UserPlus,
  Users,
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

export const Route = createFileRoute("/admin")({ component: AdminPage });

// ─── Types ───────────────────────────────────────────────────────────────────

type StoredCandidate = RecruitmentValues & {
  id: string;
  submittedAt?: string;
  status?: "pendente" | "aprovado" | "recusado";
  staffNote?: string;
};

type FilterStatus = "todos" | "pendente" | "aprovado" | "recusado";

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

const DEMO: StoredCandidate[] = [
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
    experienciaDescricao:
      "Joguei camps diários pela guilda Black Dragons, foco em invasão rápida e 2v1.",
    tempoDisponivel: "4+h",
    horarioDisponivel: "19h às 00h",
    submittedAt: "Hoje, 19:42",
    status: "aprovado",
    staffNote: "Aprovado para Line 1.",
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
    experienciaDescricao:
      "Granadeiro com boa leitura de mapa e controle de gel. Participei da Copa FF amadora.",
    tempoDisponivel: "2-4h",
    horarioDisponivel: "20h às 23h30",
    submittedAt: "Hoje, 18:15",
    status: "pendente",
    staffNote: "",
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
    if (!raw) return DEMO;
    const parsed = JSON.parse(raw) as StoredCandidate[];
    return parsed.length ? parsed : DEMO;
  } catch {
    return DEMO;
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

function AddPlayerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (c: StoredCandidate) => void;
}) {
  const [form, setForm] = useState({
    nick: "",
    idConta: "",
    nome: "",
    whatsapp: "",
    funcao: "",
    patenteAtual: "",
    horarioDisponivel: "",
    staffNote: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nick.trim() || !form.idConta.trim() || !form.whatsapp.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const candidate: StoredCandidate = {
      id: `cand-${Date.now()}`,
      nick: form.nick.trim(),
      idConta: form.idConta.trim(),
      nome: form.nome.trim(),
      whatsapp: form.whatsapp.trim(),
      funcao: form.funcao,
      patenteAtual: form.patenteAtual,
      idade: "",
      cidadeEstado: "",
      experienciaCompetitiva: "nao",
      experienciaDescricao: "",
      tempoDisponivel: "",
      horarioDisponivel: form.horarioDisponivel.trim(),
      submittedAt: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pendente",
      staffNote: form.staffNote.trim(),
    };
    playApproveSound();
    onAdd(candidate);
    toast.success(`${candidate.nick} adicionado à lista.`);
    onClose();
  }

  const fieldClass =
    "w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none";
  const labelClass = "block text-xs text-subtle mb-1";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
              Candidatos
            </p>
            <h3 className="font-display text-2xl text-silver">+ Novo Jogador</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Nick <span className="text-red-400">*</span>
              </label>
              <input
                className={fieldClass}
                placeholder="NICK_FF"
                value={form.nick}
                onChange={(e) => setForm((f) => ({ ...f, nick: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>
                ID da Conta <span className="text-red-400">*</span>
              </label>
              <input
                className={fieldClass}
                placeholder="123456789"
                value={form.idConta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idConta: maskPlayerId(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                className={fieldClass}
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>
                WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                className={fieldClass}
                placeholder="(11) 9xxxx-xxxx"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, whatsapp: maskPhone(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Função</label>
              <select
                className={fieldClass}
                value={form.funcao}
                onChange={(e) => setForm((f) => ({ ...f, funcao: e.target.value }))}
              >
                <option value="">Selecionar...</option>
                {FUNCOES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Patente</label>
              <select
                className={fieldClass}
                value={form.patenteAtual}
                onChange={(e) =>
                  setForm((f) => ({ ...f, patenteAtual: e.target.value }))
                }
              >
                <option value="">Selecionar...</option>
                {PATENTES_LATAM.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Horário Disponível</label>
            <input
              className={fieldClass}
              placeholder="Ex: 19h às 23h"
              value={form.horarioDisponivel}
              onChange={(e) =>
                setForm((f) => ({ ...f, horarioDisponivel: e.target.value }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Nota Staff</label>
            <textarea
              className={`${fieldClass} resize-none`}
              rows={2}
              placeholder="Observações internas..."
              value={form.staffNote}
              onChange={(e) =>
                setForm((f) => ({ ...f, staffNote: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-white/10"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <UserPlus size={15} />
              Adicionar
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
}: {
  candidate: StoredCandidate;
  onStatusChange: (id: string, status: StoredCandidate["status"]) => void;
  onDelete: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
  onWaClick: (c: StoredCandidate) => void;
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
              title="Excluir"
              onClick={() => {
                playDenySound();
                onDelete(candidate.id);
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
  const [candidates, setCandidates] = useState<StoredCandidate[]>(loadCandidates);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [search, setSearch] = useState("");
  const [funcaoFilter, setFuncaoFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "nick">("newest");
  const [muted, setMuted] = useState(isSoundMuted);
  const [waCandidate, setWaCandidate] = useState<StoredCandidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Carregar do Supabase e assinar atualizações Realtime se configurado
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    fetchCandidatesSupabase()
      .then((data) => {
        if (isMounted && data.length > 0) {
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
              playApproveSound();
              toast.info("Nova inscrição recebida no banco!");
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
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <img src="/latam-mark.webp" alt={`${GUILD_NAME}${GUILD_MARK}`} className="h-7 w-auto" />
            <span className="font-display text-xl text-silver hidden sm:block">
              {GUILD_NAME} <span className="text-accent">{GUILD_MARK}</span>
            </span>
          </div>

          <div className="flex-1 flex items-center gap-2.5">
            <h2 className="font-display text-lg text-silver leading-none">
              Candidaturas
            </h2>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Supabase Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400" title="Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Modo Local (Sem Nuvem)
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
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

            {/* Export */}
            <button
              onClick={exportCsv}
              className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
              title="Exportar CSV"
            >
              <Download size={16} />
            </button>

            {/* Add player */}
            <Button
              className="gap-1.5 py-2 text-sm"
              onClick={() => {
                playClickSound();
                setShowAddModal(true);
              }}
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">+ Novo Jogador</span>
              <span className="sm:hidden">+</span>
            </Button>

            {/* Logout */}
            <button
              onClick={() => {
                playClickSound();
                try { sessionStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
                onLogout();
                toast.info("Sessão encerrada.");
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
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
                onDelete={deleteCandidate}
                onNoteChange={updateNote}
                onWaClick={(cand) => {
                  playClickSound();
                  setWaCandidate(cand);
                }}
              />
            ))
          )}
        </div>
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
