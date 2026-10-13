import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ClipboardPaste,
  Clock,
  Copy,
  Crown,
  Flame,
  Pencil,
  Plus,
  Search,
  Shield,
  Swords,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { maskPlayerId } from "@/lib/masks";
import { playApproveSound, playClickSound, playDenySound } from "@/lib/sound";
import {
  CARGO_CONFIG,
  type GuildLine,
  type GuildLineSlot,
  type GuildMember,
} from "@/lib/guild";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";

export type LineCandidate = {
  id: string;
  nick: string;
  nome?: string;
  idConta: string;
  whatsapp?: string;
  funcao?: string;
  patenteAtual?: string;
  status?: string;
};

const LINE_STATUS_CONFIG: Record<
  GuildLine["status"],
  { label: string; badgeClass: string }
> = {
  completa: {
    label: "Completa",
    badgeClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  buscando_rush: {
    label: "Buscando Rush",
    badgeClass: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
  buscando_suporte: {
    label: "Buscando Suporte",
    badgeClass: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  em_treino: {
    label: "Em Treinamento",
    badgeClass: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
};

interface LinesViewProps {
  lines: GuildLine[];
  members: GuildMember[];
  candidates: LineCandidate[];
  onAddLine: () => void;
  onPasteLine?: () => void;
  onEditLine: (line: GuildLine) => void;
  onDeleteLine: (lineId: string) => void;
  onAssignSlot: (
    lineId: string,
    slotNumber: number,
    playerNick: string,
    idConta?: string,
    memberId?: string
  ) => void;
  onClearSlot: (lineId: string, slotNumber: number) => void;
}

export function LinesView({
  lines,
  members,
  candidates,
  onAddLine,
  onPasteLine,
  onEditLine,
  onDeleteLine,
  onAssignSlot,
  onClearSlot,
}: LinesViewProps) {
  const [selectedSlot, setSelectedSlot] = useState<{
    line: GuildLine;
    slot: GuildLineSlot;
  } | null>(null);
  const [lineToDelete, setLineToDelete] = useState<GuildLine | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // KPIs
  const totalLines = lines.length;
  let totalSlots = 0;
  let filledSlots = 0;

  for (const line of lines) {
    totalSlots += line.slots.length;
    for (const slot of line.slots) {
      if (slot.jogadorNick && slot.jogadorNick.trim()) {
        filledSlots++;
      }
    }
  }

  const linesWithVacancies = lines.filter((l) =>
    l.slots.some((s) => !s.jogadorNick || !s.jogadorNick.trim())
  ).length;

  const filteredLines = lines.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.nome.toLowerCase().includes(q) ||
      l.tag.toLowerCase().includes(q) ||
      (l.capitaoNick && l.capitaoNick.toLowerCase().includes(q)) ||
      l.slots.some((s) => s.jogadorNick && s.jogadorNick.toLowerCase().includes(q))
    );
  });

  function copyId(id: string) {
    void navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info("ID copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Total Lines */}
        <div className="rounded-xl border border-white/8 bg-[#0e131b] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Lines Ativas
            </p>
            <Swords size={15} className="text-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl text-foreground">{totalLines}</p>
            <span className="text-xs text-subtle">esquadrões</span>
          </div>
        </div>

        {/* Vagas Ocupadas */}
        <div className="rounded-xl border border-emerald-500/15 bg-[#0e131b] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Escalação Geral
            </p>
            <Trophy size={15} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl text-emerald-400">
              {filledSlots}
            </p>
            <span className="text-xs text-subtle">/ {totalSlots} vagas</span>
          </div>
        </div>

        {/* Vagas em Aberto */}
        <div className="rounded-xl border border-amber-500/15 bg-[#0e131b] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Lines C/ Vagas
            </p>
            <Clock size={15} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl text-amber-400">
              {linesWithVacancies}
            </p>
            <span className="text-xs text-subtle">precisam de jogador</span>
          </div>
        </div>

        {/* Guild Capacity */}
        <div className="rounded-xl border border-accent/15 bg-[#0e131b] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Membros Totais
            </p>
            <Users size={15} className="text-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl text-accent">{members.length}</p>
            <span className="text-xs text-subtle">no roster</span>
          </div>
        </div>
      </div>

      {/* ── Barra de Busca e Ações (tipo Membros) ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-[#121821] py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
            placeholder="Buscar por nome da line, tag ou jogador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onPasteLine && (
            <button
              onClick={() => {
                playClickSound();
                onPasteLine();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-[#121821] hover:bg-accent/15 px-3.5 py-2 text-xs font-semibold text-accent transition-all shadow-sm hover:border-accent/50 cursor-pointer"
            >
              <ClipboardPaste size={14} />
              <span className="hidden sm:inline">Colar Ficha</span>
              <span className="sm:hidden">Colar</span>
            </button>
          )}
          <button
            onClick={() => {
              playClickSound();
              onAddLine();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground px-3.5 py-2 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(0,180,255,0.25)] cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nova Line</span>
            <span className="sm:hidden">Line</span>
          </button>
        </div>
      </div>

      {/* ── Lines List ── */}
      <div className="space-y-6">
        {filteredLines.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[#0e131b] py-16 text-center">
            <Swords size={36} className="mx-auto mb-3 text-subtle/40" />
            <p className="text-silver font-semibold mb-1">
              {search ? "Nenhuma line encontrada para essa busca" : "Nenhuma line cadastrada"}
            </p>
            <p className="text-xs text-subtle mb-4">
              {search ? "Tente buscar por outro termo ou limpe a busca." : "Crie ou cole a primeira line para escalar os jogadores da LATAM 友."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {onPasteLine && (
                <button
                  onClick={() => {
                    playClickSound();
                    onPasteLine();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-[#121821] hover:bg-accent/15 px-3.5 py-2 text-xs font-semibold text-accent transition-all cursor-pointer"
                >
                  <ClipboardPaste size={14} />
                  Colar Ficha de Line
                </button>
              )}
              <button
                onClick={() => {
                  playClickSound();
                  onAddLine();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,180,255,0.25)]"
              >
                <Plus size={14} />
                Nova Line Manual
              </button>
            </div>
          </div>
        ) : (
          filteredLines.map((line) => {

            const statusCfg =
              LINE_STATUS_CONFIG[line.status] ?? LINE_STATUS_CONFIG.completa;
            const filledCount = line.slots.filter(
              (s) => s.jogadorNick && s.jogadorNick.trim()
            ).length;

            return (
              <div
                key={line.id}
                className="overflow-hidden rounded-2xl border border-white/8 bg-[#0e131b] shadow-xl"
              >
                {/* Line Header */}
                <div className="border-b border-white/6 bg-[#121821] px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-bold tracking-widest text-accent uppercase">
                        {line.tag}
                      </span>
                      <h3 className="font-display text-2xl text-silver">
                        {line.nome}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusCfg.badgeClass}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-subtle hidden sm:inline mr-2">
                        {filledCount} / {line.slots.length} escalados
                      </span>
                      <button
                        onClick={() => {
                          playClickSound();
                          onEditLine(line);
                        }}
                        className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
                        title="Editar Informações da Line"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          setLineToDelete(line);
                        }}
                        className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-red-400"
                        title="Excluir Line"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Subline info */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-subtle">
                    {line.horarioTreino && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-accent" />
                        {line.horarioTreino}
                      </span>
                    )}
                    {line.capitaoNick && (
                      <span className="inline-flex items-center gap-1.5">
                        <Crown size={13} className="text-amber-400" />
                        Capitão:{" "}
                        <span className="text-silver font-medium">
                          {line.capitaoNick}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Slots Grid (5 columns on desktop) */}
                <div className="p-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {line.slots.map((slot) => {
                      const isFilled = Boolean(
                        slot.jogadorNick && slot.jogadorNick.trim()
                      );

                      // Get icon based on slot number/label
                      const getSlotIcon = () => {
                        const lbl = slot.funcaoLabel.toLowerCase();
                        if (lbl.includes("capit") || slot.slotNumber === 1)
                          return <Crown size={14} className="text-amber-400" />;
                        if (lbl.includes("rush") && slot.slotNumber === 2)
                          return <Flame size={14} className="text-rose-400" />;
                        if (lbl.includes("rush"))
                          return <Zap size={14} className="text-yellow-400" />;
                        if (lbl.includes("suporte"))
                          return <Shield size={14} className="text-cyan-400" />;
                        return <Clock size={14} className="text-blue-400" />;
                      };

                      if (isFilled) {
                        return (
                          <div
                            key={slot.slotNumber}
                            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#121821] p-3.5 transition-all hover:border-accent/40 hover:bg-[#151d28]"
                          >
                            <div>
                              {/* Slot Role Tag */}
                              <div className="mb-2 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                                  {getSlotIcon()}
                                  {slot.funcaoLabel}
                                </span>
                                <span className="font-mono text-[10px] text-subtle">
                                  #{slot.slotNumber}
                                </span>
                              </div>

                              {/* Player Nick */}
                              <p className="font-display text-lg text-foreground tracking-wide truncate">
                                {slot.jogadorNick}
                              </p>

                              {/* Free Fire ID */}
                              {slot.jogadorIdConta && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <button
                                    onClick={() => copyId(slot.jogadorIdConta!)}
                                    className="group/id inline-flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-subtle transition-colors hover:text-accent"
                                    title="Copiar ID Free Fire"
                                  >
                                    <Copy
                                      size={10}
                                      className="transition-transform group-hover/id:scale-110"
                                    />
                                    <span>{slot.jogadorIdConta}</span>
                                    {copiedId === slot.jogadorIdConta && (
                                      <Check
                                        size={10}
                                        className="text-emerald-400"
                                      />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Slot Actions */}
                            <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
                              <button
                                onClick={() => {
                                  playClickSound();
                                  setSelectedSlot({ line, slot });
                                }}
                                className="text-[11px] text-accent transition-colors hover:underline"
                              >
                                Trocar
                              </button>
                              <button
                                onClick={() => {
                                  playDenySound();
                                  onClearSlot(line.id, slot.slotNumber);
                                }}
                                className="text-[11px] text-subtle transition-colors hover:text-red-400"
                              >
                                Desescalar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Empty Slot
                      return (
                        <div
                          key={slot.slotNumber}
                          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/12 bg-white/[0.02] p-4 text-center transition-all hover:border-accent/40 hover:bg-accent/[0.02]"
                        >
                          <div className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-subtle font-medium">
                            {getSlotIcon()}
                            {slot.funcaoLabel}
                          </div>
                          <p className="text-[10px] text-subtle/60 mb-3">
                            Vaga #{slot.slotNumber} Aberta
                          </p>

                          <button
                            onClick={() => {
                              playClickSound();
                              setSelectedSlot({ line, slot });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:bg-accent/20 cursor-pointer"
                          >
                            <UserPlus size={13} />
                            Escalar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Assign Slot Modal ── */}
      <AnimatePresence>
        {selectedSlot && (
          <AssignSlotModal
            key="assign-modal"
            line={selectedSlot.line}
            slot={selectedSlot.slot}
            members={members}
            candidates={candidates}
            onClose={() => setSelectedSlot(null)}
            onAssign={(nick, idConta, memberId) => {
              onAssignSlot(
                selectedSlot.line.id,
                selectedSlot.slot.slotNumber,
                nick,
                idConta,
                memberId
              );
              setSelectedSlot(null);
            }}
          />
        )}
        {lineToDelete && (
          <ConfirmDeleteModal
            key="confirm-delete-line"
            isOpen={Boolean(lineToDelete)}
            title="Excluir Line"
            itemName={lineToDelete.nome}
            itemDescription="A line e todas as escalações associadas serão removidas do sistema."
            confirmLabel="Sim, Excluir Line"
            onClose={() => setLineToDelete(null)}
            onConfirm={() => {
              playDenySound();
              onDeleteLine(lineToDelete.id);
              setLineToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Modal: Escalar Jogador ──────────────────────────────────────────────────

interface AssignSlotModalProps {
  line: GuildLine;
  slot: GuildLineSlot;
  members: GuildMember[];
  candidates: LineCandidate[];
  onClose: () => void;
  onAssign: (nick: string, idConta?: string, memberId?: string) => void;
}

export function AssignSlotModal({
  line,
  slot,
  members,
  candidates,
  onClose,
  onAssign,
}: AssignSlotModalProps) {
  const [tab, setTab] = useState<"membros" | "candidatos" | "manual">("membros");
  const [search, setSearch] = useState("");
  const [manualNick, setManualNick] = useState("");
  const [manualId, setManualId] = useState("");

  // Filter approved candidates
  const approvedCandidates = candidates.filter(
    (c) => c.status === "aprovado" || !c.status
  );

  const filteredMembers = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.nick.toLowerCase().includes(q) ||
      m.nome.toLowerCase().includes(q) ||
      m.idConta.includes(q)
    );
  });

  const filteredCandidates = approvedCandidates.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.nick.toLowerCase().includes(q) ||
      (c.nome && c.nome.toLowerCase().includes(q)) ||
      c.idConta.includes(q)
    );
  });

  function handleSelectMember(m: GuildMember) {
    playApproveSound();
    toast.success(`${m.nick} escalado para ${slot.funcaoLabel}!`);
    onAssign(m.nick, m.idConta, m.id);
  }

  function handleSelectCandidate(c: LineCandidate) {
    playApproveSound();
    toast.success(`${c.nick} escalado para ${slot.funcaoLabel}!`);
    onAssign(c.nick, c.idConta, c.id);
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualNick.trim()) {
      toast.error("Informe o nick do jogador.");
      return;
    }
    playApproveSound();
    toast.success(`${manualNick.trim()} escalado para ${slot.funcaoLabel}!`);
    onAssign(manualNick.trim(), manualId.trim() || undefined);
  }

  async function handlePasteIntoSlot() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      const clean = text.replace(/[*_#~]/g, "");
      const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
      let nick = "";
      let idConta = "";
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.startsWith("nick:") || lower.startsWith("nickname:")) {
          nick = line.split(/:(.+)/)[1]?.trim() || "";
        } else if (
          lower.startsWith("id:") ||
          lower.startsWith("id da conta:") ||
          lower.startsWith("id free fire:")
        ) {
          idConta = line.split(/:(.+)/)[1]?.replace(/\D/g, "") || "";
        }
      }
      if (!idConta) {
        const idMatch = clean.match(/\b(\d{7,12})\b/);
        if (idMatch) idConta = idMatch[1];
      }
      if (!nick) {
        nick = lines[0]?.slice(0, 24) || clean.trim().slice(0, 24);
      }
      if (nick) setManualNick(nick);
      if (idConta) setManualId(idConta);
      playApproveSound();
      toast.success("Dados colados no slot!");
    } catch {
      toast.error("Permissão de área de transferência necessária.");
    }
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
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              Escalação Tática
            </p>
            <h3 className="font-display text-2xl text-silver">
              Escalar para {slot.funcaoLabel}
            </h3>
            <p className="text-xs text-subtle mt-0.5">
              Line: <span className="text-silver">{line.nome}</span> · Vaga #{slot.slotNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="mb-4 flex rounded-xl border border-white/8 bg-[#121821] p-1">
          <button
            onClick={() => setTab("membros")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === "membros"
                ? "bg-accent/15 text-accent shadow-sm"
                : "text-subtle hover:text-foreground"
            }`}
          >
            👥 Membros ({members.length})
          </button>
          <button
            onClick={() => setTab("candidatos")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === "candidatos"
                ? "bg-accent/15 text-accent shadow-sm"
                : "text-subtle hover:text-foreground"
            }`}
          >
            🏆 Candidatos ({approvedCandidates.length})
          </button>
          <button
            onClick={() => setTab("manual")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === "manual"
                ? "bg-accent/15 text-accent shadow-sm"
                : "text-subtle hover:text-foreground"
            }`}
          >
            ✏️ Manual
          </button>
        </div>

        {/* Tab 1: Guild Members */}
        {tab === "membros" && (
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121821] py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                placeholder="Buscar membro por nick, nome ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredMembers.length === 0 ? (
                <p className="py-6 text-center text-xs text-subtle">
                  Nenhum membro encontrado.
                </p>
              ) : (
                filteredMembers.map((m) => {
                  const cargoCfg = CARGO_CONFIG[m.cargo];
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMember(m)}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/6 bg-[#121821] p-3 text-left transition-all hover:border-accent/30 hover:bg-accent/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-display text-accent">
                          {m.nick[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-silver group-hover:text-accent">
                            {m.nick}
                          </p>
                          <p className="font-mono text-[10px] text-subtle">
                            ID: {m.idConta} · {m.nome}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${cargoCfg.badgeClass}`}
                      >
                        {cargoCfg.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Approved Candidates */}
        {tab === "candidatos" && (
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121821] py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                placeholder="Buscar candidato aprovado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredCandidates.length === 0 ? (
                <p className="py-6 text-center text-xs text-subtle">
                  Nenhum candidato aprovado encontrado.
                </p>
              ) : (
                filteredCandidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCandidate(c)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/6 bg-[#121821] p-3 text-left transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 font-display text-emerald-400">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-silver group-hover:text-emerald-400">
                          {c.nick}
                        </p>
                        <p className="font-mono text-[10px] text-subtle">
                          ID: {c.idConta} · {c.funcao || "Recruta"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Aprovado
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Manual Input */}
        {tab === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-accent/25 bg-accent/5 p-2.5">
              <div className="flex items-center gap-2">
                <ClipboardPaste size={15} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-silver">Colar Ficha do Jogador</p>
                  <p className="text-[10px] text-subtle">Extrai Nick e ID da área de transferência</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePasteIntoSlot}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/25 transition-colors cursor-pointer"
              >
                <ClipboardPaste size={12} />
                Colar
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-subtle">Nick do Jogador *</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text && text.trim()) {
                        setManualNick(text.trim().slice(0, 24));
                        toast.success("Nick colado!");
                      }
                    } catch {}
                  }}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                placeholder="Ex: LATAM 友 RECRUTA"
                value={manualNick}
                onChange={(e) => setManualNick(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-subtle">ID Free Fire (Opcional)</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      const digits = text.replace(/\D/g, "");
                      if (digits) {
                        setManualId(digits);
                        toast.success("ID colado!");
                      }
                    } catch {}
                  }}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                placeholder="Ex: 123456789"
                value={manualId}
                onChange={(e) => setManualId(maskPlayerId(e.target.value))}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="border border-white/10 text-subtle"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground font-semibold"
              >
                Confirmar Escalação
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Parser de Ficha de Line ─────────────────────────────────────────────────

export function parseLineFicha(raw: string) {
  const clean = raw.replace(/[*_#~]/g, "");
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  let nome = "";
  let tag = "";
  let status: GuildLine["status"] = "buscando_rush";
  let horarioTreino = "19h30 às 22h00";
  let capitaoNick = "";
  const slots: GuildLineSlot[] = [
    { slotNumber: 1, funcaoLabel: "Capitão / IGL" },
    { slotNumber: 2, funcaoLabel: "1º Rush" },
    { slotNumber: 3, funcaoLabel: "2º Rush" },
    { slotNumber: 4, funcaoLabel: "Suporte" },
    { slotNumber: 5, funcaoLabel: "Reserva" },
  ];

  let currentSlot = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      lower.startsWith("line:") ||
      lower.startsWith("nome:") ||
      lower.startsWith("esquadrão:") ||
      lower.startsWith("esquadrao:")
    ) {
      nome = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (lower.startsWith("tag:")) {
      tag = line.split(/:(.+)/)[1]?.trim().toUpperCase() || "";
    } else if (
      lower.startsWith("horário:") ||
      lower.startsWith("horario:") ||
      lower.startsWith("treino:")
    ) {
      horarioTreino = line.split(/:(.+)/)[1]?.trim() || horarioTreino;
    } else if (
      lower.startsWith("capitão:") ||
      lower.startsWith("capitao:") ||
      lower.startsWith("igl:")
    ) {
      capitaoNick = line.split(/:(.+)/)[1]?.trim() || "";
      if (slots[0]) {
        slots[0].jogadorNick = capitaoNick;
      }
    } else if (lower.startsWith("status:")) {
      const sVal = lower.split(/:(.+)/)[1]?.trim() || "";
      if (sVal.includes("completa")) status = "completa";
      else if (sVal.includes("rush")) status = "buscando_rush";
      else if (sVal.includes("suporte")) status = "buscando_suporte";
      else if (sVal.includes("treino")) status = "em_treino";
    } else {
      // Reconhece linhas numeradas tipo "1 - Nick (ID: 12345)" ou "2. Nick"
      const slotMatch = line.match(/^(\d|vaga\s*\d|slot\s*\d|[1-5])[º°\.\-\:\)]\s*(.+)/i);
      if (slotMatch && currentSlot < slots.length) {
        const playerInfo = slotMatch[2].trim();
        const idMatch = playerInfo.match(/\b(?:id:?\s*)?(\d{7,12})\b/i);
        const nickClean = playerInfo
          .replace(/\(?id:?\s*\d+\)?/i, "")
          .replace(/[\(\)\[\]\-]/g, "")
          .trim();
        if (nickClean) {
          slots[currentSlot].jogadorNick = nickClean;
          if (idMatch) slots[currentSlot].jogadorIdConta = idMatch[1];
          if (currentSlot === 0 && !capitaoNick) capitaoNick = nickClean;
          currentSlot++;
        }
      }
    }
  }

  if (!nome) {
    const firstNonHeader = lines.find(
      (l) => !l.toLowerCase().includes("latam") && !l.includes(":")
    );
    nome = firstNonHeader ? firstNonHeader.slice(0, 24) : "Line Nova";
  }
  if (!tag) {
    tag = nome.replace(/line\s*/i, "").trim().slice(0, 6).toUpperCase() || "LATAM";
  }

  return { nome, tag, status, horarioTreino, capitaoNick, slots };
}

// ─── Modal: Criar / Editar Line ──────────────────────────────────────────────

interface AddLineModalProps {
  initialLine?: GuildLine | null;
  onClose: () => void;
  onSave: (line: GuildLine) => void;
}

export function AddLineModal({
  initialLine,
  onClose,
  onSave,
}: AddLineModalProps) {
  const [form, setForm] = useState<Omit<GuildLine, "id" | "slots">>({
    nome: initialLine?.nome ?? "",
    tag: initialLine?.tag ?? "",
    status: initialLine?.status ?? "buscando_rush",
    horarioTreino: initialLine?.horarioTreino ?? "19h30 às 22h00",
    capitaoNick: initialLine?.capitaoNick ?? "",
  });

  async function handlePasteIntoForm() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      const p = parseLineFicha(text);
      setForm((prev) => ({
        ...prev,
        nome: p.nome || prev.nome,
        tag: p.tag || prev.tag,
        status: p.status || prev.status,
        horarioTreino: p.horarioTreino || prev.horarioTreino,
        capitaoNick: p.capitaoNick || prev.capitaoNick,
      }));
      playApproveSound();
      toast.success("Dados da line colados e preenchidos!");
    } catch {
      toast.error("Permissão de área de transferência necessária.");
    }
  }

  async function pasteSpecificField(field: keyof typeof form) {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      setForm((prev) => ({ ...prev, [field]: text.trim() }));
      playApproveSound();
      toast.success("Texto colado!");
    } catch {
      toast.error("Permissão de área de transferência necessária.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("Informe o nome da line.");
      return;
    }
    if (!form.tag.trim()) {
      toast.error("Informe a tag da line.");
      return;
    }

    const defaultSlots: GuildLineSlot[] = [
      { slotNumber: 1, funcaoLabel: "Capitão / IGL", jogadorNick: form.capitaoNick || undefined },
      { slotNumber: 2, funcaoLabel: "1º Rush" },
      { slotNumber: 3, funcaoLabel: "2º Rush" },
      { slotNumber: 4, funcaoLabel: "Suporte" },
      { slotNumber: 5, funcaoLabel: "Reserva" },
    ];

    const finalLine: GuildLine = {
      id: initialLine?.id ?? `line-${Date.now()}`,
      nome: form.nome.trim(),
      tag: form.tag.trim().toUpperCase(),
      status: form.status,
      horarioTreino: form.horarioTreino.trim(),
      capitaoNick: form.capitaoNick?.trim() || undefined,
      slots: initialLine?.slots ?? defaultSlots,
    };

    playApproveSound();
    onSave(finalLine);
    toast.success(
      initialLine ? "Line atualizada!" : `Line ${finalLine.nome} criada com sucesso!`
    );
    onClose();
  }

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-[#121821] px-3 py-2.5 text-sm text-silver placeholder:text-subtle focus:border-accent/50 focus:outline-none transition-colors hover:border-white/20";
  const labelClass = "text-xs text-subtle font-medium";

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
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">
              Esquadrões
            </p>
            <h3 className="font-display text-2xl text-silver">
              {initialLine ? "Editar Line" : "+ Nova Line Competitiva"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Banner de colar ficha da line (idêntico ao de membros) */}
          <div className="flex items-center justify-between rounded-xl border border-accent/25 bg-accent/5 p-2.5">
            <div className="flex items-center gap-2">
              <ClipboardPaste size={15} className="text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-silver">Colar Ficha da Line do WhatsApp / Discord</p>
                <p className="text-[10px] text-subtle">Preenche os dados da line em 1 clique</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePasteIntoForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/25 transition-colors cursor-pointer"
            >
              <ClipboardPaste size={12} />
              Colar Tudo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Nome da Line *</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("nome")}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="Ex: Line 4 — Feminina"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                autoFocus
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Tag Curta *</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("tag")}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="Ex: FEM"
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${labelClass} block mb-1`}>Status da Line</label>
              <select
                className={fieldClass}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as GuildLine["status"],
                  }))
                }
              >
                <option value="completa">Completa</option>
                <option value="buscando_rush">Buscando Rush</option>
                <option value="buscando_suporte">Buscando Suporte</option>
                <option value="em_treino">Em Treinamento</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Capitão / IGL</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("capitaoNick")}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="LATAM 友 NICK"
                value={form.capitaoNick}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capitaoNick: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Horário de Treino / Camps</label>
              <button
                type="button"
                onClick={() => pasteSpecificField("horarioTreino")}
                className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <ClipboardPaste size={10} />
                Colar
              </button>
            </div>
            <input
              className={fieldClass}
              placeholder="Ex: 19h30 às 23h00 (Camps Diários)"
              value={form.horarioTreino}
              onChange={(e) =>
                setForm((f) => ({ ...f, horarioTreino: e.target.value }))
              }
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-subtle hover:text-silver px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 text-xs font-semibold shadow-[0_0_15px_rgba(0,180,255,0.25)] transition-all cursor-pointer"
            >
              {initialLine ? "Salvar Alterações" : "Criar Line"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal: Colar Ficha de Line Completa ───────────────────────────────────────

interface PasteLineModalProps {
  onClose: () => void;
  onAdd: (line: GuildLine) => void;
}

export function PasteLineModal({ onClose, onAdd }: PasteLineModalProps) {
  const [pastedText, setPastedText] = useState("");
  const parsed = pastedText.trim() ? parseLineFicha(pastedText) : null;

  async function handlePasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      setPastedText(text);
      playClickSound();
      toast.success("Ficha da line colada com sucesso!");
    } catch {
      toast.error("Permissão de área de transferência negada.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parsed) {
      toast.error("Cole os dados da line primeiro.");
      return;
    }
    if (!parsed.nome || !parsed.tag) {
      toast.error("Nome e Tag da Line são obrigatórios.");
      return;
    }

    const newLine: GuildLine = {
      id: `line-${Date.now()}`,
      nome: parsed.nome,
      tag: parsed.tag.toUpperCase(),
      status: parsed.status,
      horarioTreino: parsed.horarioTreino,
      capitaoNick: parsed.capitaoNick || undefined,
      slots: parsed.slots,
    };

    playApproveSound();
    onAdd(newLine);
    toast.success(`Line ${newLine.nome} criada com sucesso!`);
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
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">
              Esquadrões
            </p>
            <h3 className="font-display text-2xl text-silver flex items-center gap-2">
              <ClipboardPaste size={20} className="text-accent" />
              Colar Line do WhatsApp / Discord
            </h3>
            <p className="text-xs text-subtle mt-1">
              Cole o texto da line com escalação. O sistema reconhece nome, tag, horário, capitão e jogadores!
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-[#121821] hover:bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent transition-all cursor-pointer"
            >
              <ClipboardPaste size={14} />
              Colar da Área de Transferência
            </button>
          </div>

          <div className="relative">
            <textarea
              className="w-full rounded-xl border border-white/10 bg-[#121821] p-3 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none resize-none font-mono text-xs"
              rows={7}
              placeholder={`Cole aqui a escalação da line...\n\nExemplo:\nLine 1 — LATAM Elite\nTAG: LTM\nHorário: 20h às 22h30\nCapitão: LATAM・CORINGA\n1 - LATAM・CORINGA (ID: 18274619)\n2 - LATAM・SHADOW\n3 - LATAM・VAPOR\n4 - LATAM・SNIPER`}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              autoFocus
            />
          </div>

          {parsed && (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-accent">
                <span>Pré-visualização Reconhecida</span>
                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold">
                  {parsed.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-subtle text-[11px]">Nome: </span>
                  <span className="font-semibold text-silver">{parsed.nome}</span>
                </div>
                <div>
                  <span className="text-subtle text-[11px]">Horário: </span>
                  <span className="font-semibold text-silver">{parsed.horarioTreino}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-subtle text-[11px]">Capitão: </span>
                  <span className="font-semibold text-silver">{parsed.capitaoNick || "Não informado"}</span>
                </div>
              </div>

              {parsed.slots.some((s) => s.jogadorNick) && (
                <div className="mt-2 border-t border-accent/15 pt-2">
                  <p className="text-[11px] font-semibold text-accent mb-1">Jogadores Reconhecidos:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsed.slots
                      .filter((s) => s.jogadorNick)
                      .map((s) => (
                        <span
                          key={s.slotNumber}
                          className="rounded-md border border-white/10 bg-[#121821] px-2 py-0.5 text-[11px] text-silver"
                        >
                          #{s.slotNumber} {s.jogadorNick}
                          {s.jogadorIdConta ? ` (${s.jogadorIdConta})` : ""}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-subtle hover:text-silver py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground py-2 text-xs font-semibold shadow-[0_0_15px_rgba(0,180,255,0.25)] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Swords size={14} />
              Criar Line
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

