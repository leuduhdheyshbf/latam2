import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertOctagon,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Swords,
  Trash2,
  Undo2,
  Users,
  UserX,
  X,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type GuildWarning,
  type GuildMember,
  type WarningGrau,
  GRAU_CONFIG,
  MAX_WARNING_POINTS,
  WARNING_MOTIVOS_PRESET,
} from "@/lib/guild";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { playApproveSound, playClickSound, playDenySound } from "@/lib/sound";

export function formatWhatsAppWarning(
  w: GuildWarning,
  activeCount: number = 1
): string {
  const grauEmoji = w.grau === "grave" ? "🛑" : w.grau === "media" ? "🟠" : "🟡";
  const grauNome = w.grau === "grave" ? "GRAVE" : w.grau === "media" ? "MÉDIA" : "LEVE";
  const alertFooter =
    activeCount >= 3
      ? "🚨 *STATUS CRÍTICO:* O jogador atingiu o limite de advertências ativas (3/3) e está sujeito a desligamento imediato."
      : activeCount === 2
      ? "⚠️ *ALERTA VERMELHO:* Jogador com 2/3 advertências ativas. A próxima acarretará na expulsão da guilda."
      : "ℹ️ *AVISO:* O acúmulo de 3 advertências ativas acarreta na expulsão automática da guilda.";

  return [
    `⚠️ *LATAM ESPORTS • COMUNICADO DISCIPLINAR* ⚠️`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Jogador:* ${w.memberNick}${w.memberIdConta ? ` (ID: ${w.memberIdConta})` : ""}`,
    `${grauEmoji} *Gravidade:* ${grauNome} (${w.pontos} ${w.pontos > 1 ? "pontos" : "ponto"})`,
    `📊 *Acúmulo Ativo:* ${activeCount}/${MAX_WARNING_POINTS} advertências`,
    `📌 *Infração:* ${w.motivo}`,
    w.descricao ? `📝 *Detalhes:* ${w.descricao}` : "",
    `📅 *Data de Aplicação:* ${w.data}`,
    `🛡️ *Aplicado por:* ${w.aplicadaPor || "Staff LATAM"}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    alertFooter,
  ]
    .filter(Boolean)
    .join("\n");
}

export const MOTIVO_INFO_MAP: Record<
  string,
  { label: string; desc: string; icon: typeof Swords }
> = {
  "Falta injustificada em Treino Oficial": {
    label: "Falta em Treino",
    desc: "Não compareceu ao treino oficial",
    icon: Swords,
  },
  "Atraso recorrente nos horários marcados": {
    label: "Atraso Recorrente",
    desc: "Atrasos frequentes nos horários",
    icon: Clock,
  },
  "Toxicidade ou desrespeito em call/chat": {
    label: "Toxicidade em Call/Chat",
    desc: "Falta de respeito ou ofensas",
    icon: MessageCircle,
  },
  "Descumprimento direto de ordem do Capitão": {
    label: "Ordem do Capitão",
    desc: "Desobediência a calls e táticas",
    icon: ShieldAlert,
  },
  "Não atingiu a meta semanal de pontuação/atividade": {
    label: "Meta Semanal",
    desc: "Atividade abaixo do mínimo exigido",
    icon: AlertOctagon,
  },
  "Ausência prolongada sem aviso prévio à Staff": {
    label: "Ausência sem Aviso",
    desc: "Inatividade sem justificativa",
    icon: UserX,
  },
  "Uso indevido da Tag/Nome da Guilda em público": {
    label: "Uso Indevido da Tag",
    desc: "Manchou a imagem da guilda",
    icon: Shield,
  },
  "Conduta antiesportiva em sala personalizada": {
    label: "Conduta Antiesportiva",
    desc: "Atitude antijogo em salas",
    icon: AlertTriangle,
  },
  "Outro motivo personalizado": {
    label: "Outro Motivo",
    desc: "Digitar motivo personalizado",
    icon: Plus,
  },
};

type WarningFilter = "todas" | "ativas" | "criticas" | "revogadas";

interface AdvertenciasViewProps {
  warnings: GuildWarning[];
  members: GuildMember[];
  onAddWarning: () => void;
  onRevokeWarning: (warning: GuildWarning) => void;
  onDeleteWarning: (id: string) => void;
}

export function AdvertenciasView({
  warnings,
  members,
  onAddWarning,
  onRevokeWarning,
  onDeleteWarning,
}: AdvertenciasViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<WarningFilter>("todas");
  const [warningToDelete, setWarningToDelete] = useState<GuildWarning | null>(null);

  // Calcula advertências ativas por membro
  const activeCountByMember = warnings
    .filter((w) => w.status === "ativa")
    .reduce<Record<string, number>>((acc, curr) => {
      acc[curr.memberNick] = (acc[curr.memberNick] || 0) + 1;
      return acc;
    }, {});

  const ativas = warnings.filter((w) => w.status === "ativa");
  const criticos = Object.entries(activeCountByMember).filter(([_, count]) => count >= 2);
  const estourados = Object.entries(activeCountByMember).filter(([_, count]) => count >= MAX_WARNING_POINTS);
  const revogadas = warnings.filter((w) => w.status === "revogada");

  const filtered = warnings
    .filter((w) => {
      if (filter === "ativas" && w.status !== "ativa") return false;
      if (filter === "revogadas" && w.status !== "revogada") return false;
      if (filter === "criticas") {
        if (w.status !== "ativa") return false;
        const count = activeCountByMember[w.memberNick] || 0;
        if (count < 2 && w.grau !== "grave") return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          w.memberNick.toLowerCase().includes(q) ||
          (w.memberIdConta && w.memberIdConta.includes(q)) ||
          w.motivo.toLowerCase().includes(q) ||
          (w.descricao && w.descricao.toLowerCase().includes(q)) ||
          w.aplicadaPor.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Ativas primeiro, depois por data decrescente
      if (a.status === "ativa" && b.status !== "ativa") return -1;
      if (a.status !== "ativa" && b.status === "ativa") return 1;
      return b.id.localeCompare(a.id);
    });

  async function handleCopyWhatsApp(w: GuildWarning) {
    playClickSound();
    const count = activeCountByMember[w.memberNick] || 1;
    const text = formatWhatsAppWarning(w, count);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Comunicado para ${w.memberNick} copiado!`, {
        description: "Pronto para colar no WhatsApp ou Discord.",
      });
    } catch {
      toast.error("Falha ao copiar comunicado para a área de transferência.");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header & Counters ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Ativas */}
        <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 backdrop-blur-sm sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-subtle font-medium">
              Ativas
            </span>
            <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
              <AlertTriangle size={13} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-silver">
            {ativas.length}
          </p>
          <span className="text-[11px] text-subtle">Advertências em vigor</span>
        </div>

        {/* Membros em Risco (2/3) */}
        <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 backdrop-blur-sm sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-subtle font-medium">
              Em Risco (2/3)
            </span>
            <span className="flex size-6 items-center justify-center rounded-md bg-orange-500/10 text-orange-400">
              <ShieldAlert size={13} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-orange-400">
            {criticos.length}
          </p>
          <span className="text-[11px] text-subtle">A 1 falta do desligamento</span>
        </div>

        {/* Limite Excedido (>= 3/3) */}
        <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 backdrop-blur-sm sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-subtle font-medium">
              Kick Sugerido (3/3)
            </span>
            <span className="flex size-6 items-center justify-center rounded-md bg-red-500/10 text-red-400 animate-pulse">
              <UserX size={13} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-red-400">
            {estourados.length}
          </p>
          <span className="text-[11px] text-subtle">Limite de infrações estourado</span>
        </div>

        {/* Revogadas */}
        <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 backdrop-blur-sm sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-subtle font-medium">
              Revogadas
            </span>
            <span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={13} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
            {revogadas.length}
          </p>
          <span className="text-[11px] text-subtle">Advertências perdoadas</span>
        </div>
      </div>

      {/* ── Toolbar: Busca, Filtros e Botão Adicionar ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0e131b]/90 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <Input
              type="text"
              placeholder="Buscar por Nick, ID, motivo ou aplicador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-black/40 border-white/10 text-sm focus:border-accent text-silver"
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

          {/* Filtros */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: "todas", label: "Todas" },
                { id: "ativas", label: "Ativas" },
                { id: "criticas", label: "Críticas / Risco" },
                { id: "revogadas", label: "Revogadas" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  playClickSound();
                  setFilter(f.id);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-accent/20 text-accent border border-accent/40 shadow-sm"
                    : "text-subtle hover:text-foreground hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Nova Advertência */}
        <Button
          onClick={() => {
            playClickSound();
            onAddWarning();
          }}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 shadow-lg shadow-red-950/30 font-semibold gap-1.5 shrink-0"
        >
          <Plus size={15} />
          <span>Nova Advertência</span>
        </Button>
      </div>

      {/* ── Lista de Advertências ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-subtle mb-3">
            <ShieldCheck size={28} className="text-emerald-400/80" />
          </div>
          <h3 className="font-display text-lg text-silver">
            Nenhuma advertência encontrada
          </h3>
          <p className="text-xs text-subtle max-w-sm mt-1">
            {search
              ? "Nenhum registro corresponde aos termos da pesquisa."
              : "A guilda está com a conduta limpa! Use o botão acima para registrar infrações quando necessário."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((w) => {
            const memberTotalActive = activeCountByMember[w.memberNick] || 0;
            const isExceeded = memberTotalActive >= MAX_WARNING_POINTS;
            const isCritical = memberTotalActive === 2;
            const cfg = GRAU_CONFIG[w.grau] || GRAU_CONFIG.leve;

            return (
              <motion.div
                key={w.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#0e131b]/95 p-5 shadow-xl transition-all duration-200 ${
                  w.status === "revogada"
                    ? "border-white/5 opacity-70 hover:opacity-100"
                    : isExceeded
                    ? "border-red-500/60 shadow-red-950/40 shadow-lg"
                    : isCritical
                    ? "border-orange-500/50 shadow-orange-950/30"
                    : cfg.borderClass
                }`}
              >
                {/* Banner de status crítico para o membro */}
                {w.status === "ativa" && isExceeded && (
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-300">
                    <span className="flex items-center gap-1.5">
                      <AlertOctagon size={14} className="animate-pulse" />
                      LIMITE MÁXIMO ATINGIDO (3/3)
                    </span>
                    <span className="uppercase text-[10px] tracking-wider text-red-400">
                      Kick Recomendado
                    </span>
                  </div>
                )}

                {/* Top: Header do Card */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-white tracking-wide">
                          {w.memberNick}
                        </span>
                        {w.memberIdConta && (
                          <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-subtle border border-white/5">
                            ID: {w.memberIdConta}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-subtle mt-0.5">
                        {w.data} • Por: <strong className="text-zinc-300">{w.aplicadaPor}</strong>
                      </span>
                    </div>

                    {/* Grau Badge */}
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                          w.status === "revogada"
                            ? "border-zinc-700 bg-zinc-800 text-zinc-400"
                            : cfg.badgeClass
                        }`}
                      >
                        {w.status === "revogada" ? "Revogada" : cfg.label}
                      </span>
                      {w.status === "ativa" && (
                        <span className="text-[10px] text-subtle">
                          Acúmulo: <strong className={isExceeded ? "text-red-400" : isCritical ? "text-orange-400" : "text-amber-400"}>{memberTotalActive}/3</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Motivo & Descrição */}
                  <div className="mt-3.5 rounded-xl border border-white/5 bg-black/35 p-3.5">
                    <p className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                      {w.motivo}
                    </p>
                    {w.descricao && (
                      <p className="mt-1.5 text-xs text-subtle leading-relaxed whitespace-pre-wrap">
                        {w.descricao}
                      </p>
                    )}
                  </div>

                  {/* Se revogada, mostra info da revogação */}
                  {w.status === "revogada" && (
                    <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[11px] text-emerald-300">
                      <div className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={12} />
                        Revogada {w.dataRevogacao ? `em ${w.dataRevogacao}` : ""}
                      </div>
                      {w.motivoRevogacao && (
                        <p className="mt-0.5 text-emerald-400/80">
                          Motivo: {w.motivoRevogacao}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Barra de progresso de gravidade */}
                {w.status === "ativa" && (
                  <div className="mt-4 mb-3">
                    <div className="flex justify-between text-[10px] text-subtle mb-1">
                      <span>Nível de Tolerância</span>
                      <span className={isExceeded ? "text-red-400 font-bold" : "text-subtle"}>
                        {memberTotalActive} de {MAX_WARNING_POINTS} faltas
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/5">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isExceeded
                            ? "bg-red-500"
                            : isCritical
                            ? "bg-orange-500"
                            : "bg-amber-400"
                        }`}
                        style={{
                          width: `${Math.min((memberTotalActive / MAX_WARNING_POINTS) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                  {/* WhatsApp Copy */}
                  <button
                    onClick={() => handleCopyWhatsApp(w)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors"
                  >
                    <MessageCircle size={13} />
                    <span>Copiar p/ WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Revogar */}
                    {w.status === "ativa" && (
                      <button
                        onClick={() => {
                          playClickSound();
                          onRevokeWarning(w);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-subtle hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Perdoar / Revogar Advertência"
                      >
                        <Undo2 size={13} />
                        <span className="hidden sm:inline">Revogar</span>
                      </button>
                    )}


                    {/* Excluir Registro */}
                    <button
                      onClick={() => {
                        playClickSound();
                        setWarningToDelete(w);
                      }}
                      className="flex size-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Excluir Registro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Modal de Exclusão Gamer ── */}
      {warningToDelete && (
        <ConfirmDeleteModal
          isOpen={Boolean(warningToDelete)}
          title="Excluir Advertência"
          itemName={`${warningToDelete.memberNick} — ${warningToDelete.motivo}`}
          itemDescription="Esse registro disciplinar será removido permanentemente do histórico da guilda."
          confirmLabel="Sim, Excluir Registro"
          onClose={() => setWarningToDelete(null)}
          onConfirm={() => {
            playDenySound();
            onDeleteWarning(warningToDelete.id);
            setWarningToDelete(null);
            toast.success("Registro de advertência removido com sucesso.");
          }}
        />
      )}
    </div>
  );
}

// ─── Modal Adicionar Advertência ──────────────────────────────────────────────

interface AddWarningModalProps {
  members: GuildMember[];
  initialMemberNick?: string;
  onClose: () => void;
  onSave: (warning: GuildWarning) => void;
}

export function AddWarningModal({
  members,
  initialMemberNick,
  onClose,
  onSave,
}: AddWarningModalProps) {
  const [selectedNick, setSelectedNick] = useState(initialMemberNick || (members[0]?.nick ?? ""));
  const [openMemberDropdown, setOpenMemberDropdown] = useState(false);
  const [customNick, setCustomNick] = useState("");
  const [isManualNick, setIsManualNick] = useState(members.length === 0);
  const [idConta, setIdConta] = useState(
    members.find((m) => m.nick === initialMemberNick)?.idConta ?? (members[0]?.idConta ?? "")
  );
  const [grau, setGrau] = useState<WarningGrau>("leve");
  const [motivoPreset, setMotivoPreset] = useState<string>(WARNING_MOTIVOS_PRESET[0]);
  const [motivoCustom, setMotivoCustom] = useState("");
  const [descricao, setDescricao] = useState("");
  const [aplicadaPor, setAplicadaPor] = useState("Liderança LATAM");

  const selectedMember = members.find((m) => m.nick === selectedNick);

  function handleMemberSelect(nick: string) {
    setSelectedNick(nick);
    const m = members.find((x) => x.nick === nick);
    if (m) {
      setIdConta(m.idConta);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalNick = isManualNick ? customNick.trim() : selectedNick;

    if (!finalNick) {
      toast.error("Informe o Nick do jogador.");
      return;
    }

    const finalMotivo =
      motivoPreset === "Outro motivo personalizado"
        ? motivoCustom.trim()
        : motivoPreset;

    if (!finalMotivo) {
      toast.error("Informe o motivo da advertência.");
      return;
    }

    const pontos = GRAU_CONFIG[grau].pontos;

    const newWarning: GuildWarning = {
      id: `adv-${Date.now()}`,
      memberId: members.find((m) => m.nick === finalNick)?.id ?? `ext-${Date.now()}`,
      memberNick: finalNick,
      memberIdConta: idConta.trim() || undefined,
      motivo: finalMotivo,
      descricao: descricao.trim() || undefined,
      grau,
      pontos,
      data: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      aplicadaPor: aplicadaPor.trim() || "Staff LATAM",
      status: "ativa",
    };

    playApproveSound();
    onSave(newWarning);
    toast.success(`Advertência aplicada a ${finalNick}!`, {
      description: `Grau: ${GRAU_CONFIG[grau].label}`,
    });
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-red-500/30 bg-[#0e131b] p-6 shadow-2xl shadow-red-950/40"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <div className="flex items-start justify-between border-b border-white/5 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5">
              <ShieldAlert size={14} />
              Setor Disciplinar
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              Aplicar Advertência
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-subtle hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Seleção do Jogador */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Jogador Advertido *
              </label>
              {members.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualNick(!isManualNick)}
                  className="text-[11px] text-accent hover:underline cursor-pointer"
                >
                  {isManualNick ? "Selecionar da Guilda" : "Digitar Manualmente"}
                </button>
              )}
            </div>

            {!isManualNick && members.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMemberDropdown(!openMemberDropdown)}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#121821] px-3.5 py-2.5 text-sm text-silver hover:border-white/20 hover:text-white transition-all cursor-pointer focus:border-red-500/60 focus:outline-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Users size={15} className="text-red-400 shrink-0" />
                    <span className="font-medium truncate">
                      {selectedMember
                        ? `${selectedMember.nick} ${selectedMember.nome ? `(${selectedMember.nome})` : ""} — ${selectedMember.cargo}`
                        : "Selecione um jogador..."}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-subtle transition-transform duration-200 shrink-0 ml-2 ${
                      openMemberDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMemberDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenMemberDropdown(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-[#121821] shadow-2xl z-30 p-1 divide-y divide-white/5">
                      {members.map((m) => {
                        const isSelected = m.nick === selectedNick;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              handleMemberSelect(m.nick);
                              setOpenMemberDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-red-500/20 text-white font-semibold"
                                : "text-zinc-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="truncate">
                              <span className="font-semibold">{m.nick}</span>
                              {m.nome && (
                                <span className="text-subtle ml-1">
                                  ({m.nome})
                                </span>
                              )}
                              <span className="text-[11px] text-zinc-400 ml-2">
                                [{m.cargo}]
                              </span>
                            </div>
                            {isSelected && (
                              <Check size={14} className="text-red-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Input
                placeholder="Ex: LATAM・CORINGA"
                value={customNick}
                onChange={(e) => setCustomNick(e.target.value)}
                className="bg-[#121821] border-white/10 text-silver focus:border-red-500/60 rounded-xl"
                required
              />
            )}
          </div>

          {/* ID da Conta */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              ID da Conta (Opcional)
            </label>
            <Input
              placeholder="Ex: 123456789"
              value={idConta}
              onChange={(e) => setIdConta(e.target.value)}
              className="bg-[#121821] border-white/10 text-silver focus:border-red-500/60 font-mono rounded-xl"
            />
          </div>

          {/* Grau da Advertência */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Grau da Advertência *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "leve", label: "Leve", pontos: "1 pt", desc: "Aviso formal" },
                  { id: "media", label: "Média", pontos: "2 pts", desc: "Risco alto" },
                  { id: "grave", label: "Grave", pontos: "3 pts", desc: "Kick imediato" },
                ] as const
              ).map((g) => {
                const active = grau === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setGrau(g.id);
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all text-center cursor-pointer ${
                      active
                        ? g.id === "grave"
                          ? "border-red-500 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/50"
                          : g.id === "media"
                          ? "border-orange-500 bg-orange-500/20 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/50"
                          : "border-amber-500 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50"
                        : "border-white/10 bg-[#121821] text-zinc-400 hover:border-white/20 hover:bg-[#161f2c] hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold">{g.label}</span>
                    <span className="text-[10px] font-mono mt-0.5 opacity-80">{g.pontos}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motivo da Infração */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Motivo da Infração *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WARNING_MOTIVOS_PRESET.map((m) => {
                const isSelected = motivoPreset === m;
                const info = MOTIVO_INFO_MAP[m] ?? {
                  label: m,
                  desc: "",
                  icon: ShieldAlert,
                };
                const IconComponent = info.icon;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setMotivoPreset(m);
                    }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-red-500/70 bg-red-500/15 text-white ring-1 ring-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "border-white/10 bg-[#121821] text-zinc-300 hover:border-white/20 hover:bg-[#161f2c] hover:text-white"
                    }`}
                  >
                    <div
                      className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? "bg-red-500/30 text-red-300"
                          : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      <IconComponent size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold leading-tight truncate">
                          {info.label}
                        </span>
                        {isSelected && (
                          <Check size={12} className="text-red-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 leading-tight">
                        {info.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {motivoPreset === "Outro motivo personalizado" && (
              <Input
                placeholder="Descreva o motivo de forma resumida..."
                value={motivoCustom}
                onChange={(e) => setMotivoCustom(e.target.value)}
                className="bg-[#121821] border-white/10 text-silver focus:border-red-500/60 rounded-xl mt-2.5"
                required
              />
            )}
          </div>

          {/* Descrição / Detalhes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Observações / Detalhes do Ocorrido
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Faltou no treino das 21h sem avisar os companheiros de line..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121821] p-3 text-xs text-silver placeholder:text-subtle/50 focus:border-red-500/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Aplicado Por */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Aplicado Por (Assinatura Staff)
            </label>
            <Input
              placeholder="Ex: Capitão Line 1 ou Liderança LATAM"
              value={aplicadaPor}
              onChange={(e) => setAplicadaPor(e.target.value)}
              className="bg-[#121821] border-white/10 text-silver focus:border-red-500/60 rounded-xl"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2.5 border-t border-white/5 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-[#121821] text-subtle hover:text-white hover:bg-white/5 cursor-pointer px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold shadow-lg shadow-red-950/40 cursor-pointer px-5"
            >
              Confirmar e Aplicar
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal Revogar Advertência ────────────────────────────────────────────────

interface RevokeWarningModalProps {
  warning: GuildWarning;
  onClose: () => void;
  onConfirm: (justificativa: string) => void;
}

export function RevokeWarningModal({
  warning,
  onClose,
  onConfirm,
}: RevokeWarningModalProps) {
  const [justificativa, setJustificativa] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(justificativa.trim() || "Perdoado pela liderança após conversa e alinhamento.");
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#0e131b] p-6 shadow-2xl shadow-emerald-950/30"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Revogação Disciplinar
            </span>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              Perdoar Advertência
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-subtle hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <p className="text-xs text-subtle">
            Você está revogando a advertência de{" "}
            <strong className="text-white">{warning.memberNick}</strong> (
            {warning.motivo}). Os pontos desta falta serão desconsiderados.
          </p>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Justificativa da Revogação
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Justificou motivo de força maior com atestado / cumpriu a meta compensatória..."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121821] p-3 text-xs text-silver placeholder:text-subtle/50 focus:border-emerald-500/60 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-[#121821] text-subtle hover:text-white hover:bg-white/5 cursor-pointer px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 cursor-pointer px-5"
            >
              Confirmar Revogação
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
