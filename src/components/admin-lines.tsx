import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
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
  onEditLine,
  onDeleteLine,
  onAssignSlot,
  onClearSlot,
}: LinesViewProps) {
  const [selectedSlot, setSelectedSlot] = useState<{
    line: GuildLine;
    slot: GuildLineSlot;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

      {/* ── Lines List ── */}
      <div className="space-y-6">
        {lines.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[#0e131b] py-16 text-center">
            <Swords size={36} className="mx-auto mb-3 text-subtle/40" />
            <p className="text-silver font-semibold mb-1">Nenhuma line cadastrada</p>
            <p className="text-xs text-subtle mb-4">
              Crie a primeira line para escalar os jogadores da LATAM 友.
            </p>
            <Button
              onClick={() => {
                playClickSound();
                onAddLine();
              }}
              className="gap-2 bg-accent text-accent-foreground font-semibold"
            >
              <Plus size={16} />
              Criar Nova Line
            </Button>
          </div>
        ) : (
          lines.map((line) => {
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
                          playDenySound();
                          if (
                            confirm(
                              `Deseja realmente excluir a "${line.nome}"?`
                            )
                          ) {
                            onDeleteLine(line.id);
                          }
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
            <div>
              <label className="block text-xs text-subtle mb-1">
                Nick do Jogador *
              </label>
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                placeholder="Ex: LATAM 友 RECRUTA"
                value={manualNick}
                onChange={(e) => setManualNick(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-subtle mb-1">
                ID Free Fire (Opcional)
              </label>
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
      { slotNumber: 1, funcaoLabel: "Capitão / IGL" },
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
            <p className="text-xs uppercase tracking-widest text-accent">
              Esquadrões
            </p>
            <h3 className="font-display text-2xl text-silver">
              {initialLine ? "Editar Line" : "+ Nova Line Competitiva"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Nome da Line *</label>
              <input
                className={fieldClass}
                placeholder="Ex: Line 4 — Feminina"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Tag Curta *</label>
              <input
                className={fieldClass}
                placeholder="Ex: FEMININA"
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status da Line</label>
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
              <label className={labelClass}>Capitão / IGL (Opcional)</label>
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
            <label className={labelClass}>Horário de Treino / Camps</label>
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
              {initialLine ? "Salvar Alterações" : "Criar Line"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
