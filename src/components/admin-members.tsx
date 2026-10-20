import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Check,
  ClipboardPaste,
  Copy,
  Crown,
  ExternalLink,
  Link2,
  MessageCircle,
  Pencil,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { maskPhone, maskPlayerId } from "@/lib/masks";
import { FUNCOES, PATENTES_LATAM, GUILD_NAME, GUILD_MARK } from "@/lib/recruitment";
import { playApproveSound, playClickSound, playDenySound } from "@/lib/sound";
import {
  CARGO_CONFIG,
  GUILD_MAX_MEMBERS,
  MAX_WARNING_POINTS,
  type GuildCargo,
  type GuildLine,
  type GuildMember,
  type GuildWarning,
} from "@/lib/guild";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";

type MembroFilter = "todos" | "lideranca" | "capitao" | "titular" | "reserva";

interface MembrosViewProps {
  members: GuildMember[];
  lines: GuildLine[];
  warnings?: GuildWarning[];
  onAddMember: () => void;
  onPasteMember?: () => void;
  onEditMember: (member: GuildMember) => void;
  onDeleteMember: (id: string) => void;
  onWarnMember?: (member: GuildMember) => void;
}

export function MembrosView({
  members,
  lines,
  warnings = [],
  onAddMember,
  onPasteMember,
  onEditMember,
  onDeleteMember,
  onWarnMember,
}: MembrosViewProps) {


  const [search, setSearch] = useState("");
  const [cargoFilter, setCargoFilter] = useState<MembroFilter>("todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<GuildMember | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const total = members.length;
  const titulares = members.filter(
    (m) => m.cargo === "titular" || m.cargo === "capitao"
  ).length;
  const lideranca = members.filter(
    (m) => m.cargo === "lider" || m.cargo === "vice_lider"
  ).length;

  const filtered = members
    .filter((m) => {
      if (cargoFilter === "lideranca") {
        if (m.cargo !== "lider" && m.cargo !== "vice_lider") return false;
      } else if (cargoFilter === "capitao") {
        if (m.cargo !== "capitao") return false;
      } else if (cargoFilter === "titular") {
        if (m.cargo !== "titular") return false;
      } else if (cargoFilter === "reserva") {
        if (m.cargo !== "reserva") return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.nick.toLowerCase().includes(q) ||
          m.nome.toLowerCase().includes(q) ||
          (m.idade && m.idade.includes(q)) ||
          m.idConta.includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Líderes primeiro
      const order: Record<GuildCargo, number> = {
        lider: 0,
        vice_lider: 1,
        capitao: 2,
        titular: 3,
        reserva: 4,
        membro: 5,
      };
      return order[a.cargo] - order[b.cargo];
    });

  function copyId(id: string) {
    void navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info("ID copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function copyMemberFicha(m: GuildMember) {
    playClickSound();
    const text = [
      `*Nick:* ${m.nick}`,
      `*Nome:* ${m.nome}`,
      `idade: ${m.idade || "—"}`,
      `*ID da Conta:* ${m.idConta}`,
      `*WhatsApp:* ${m.whatsapp}`,
      `*Função:* ${FUNCOES.find((f) => f.value === m.funcao)?.label || m.funcao}`,
      `*Patente:* ${PATENTES_LATAM.find((p) => p.value === m.patente)?.label || m.patente}`,
    ]
      .filter(Boolean)
      .join("\n");

    void navigator.clipboard.writeText(text);
    toast.success(`Ficha de ${m.nick} copiada!`);
  }

  return (
    <div className="space-y-6">
      {/* ── KPIs do Roster ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Membros */}
        <div className="rounded-xl border border-white/8 bg-[#0e131b] p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Membros na Guilda
            </p>
            <Users size={16} className="text-accent" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display text-4xl text-silver">{total}</span>
            <span className="text-sm font-semibold text-subtle">
              / {GUILD_MAX_MEMBERS} vagas
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (total / GUILD_MAX_MEMBERS) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Titulares em Lines */}
        <div className="rounded-xl border border-emerald-500/15 bg-[#0e131b] p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Titulares de Line
            </p>
            <Trophy size={16} className="text-emerald-400" />
          </div>
          <p className="font-display text-4xl text-emerald-400">{titulares}</p>
          <p className="text-xs text-subtle mt-1">Escalados em Lines Oficiais</p>
        </div>

        {/* Liderança & Staff */}
        <div className="rounded-xl border border-amber-500/15 bg-[#0e131b] p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Liderança & Staff
            </p>
            <Crown size={16} className="text-amber-400" />
          </div>
          <p className="font-display text-4xl text-amber-400">{lideranca}</p>
          <p className="text-xs text-subtle mt-1">Líderes e Vice-Líderes</p>
        </div>
      </div>

      {/* ── Barra de Busca e Filtros ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-[#121821] py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none"
            placeholder="Buscar por Nick, nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 bg-[#121821] p-1 rounded-xl border border-white/10">
            {(
              [
                { value: "todos", label: "Todos" },
                { value: "lideranca", label: "Liderança" },
                { value: "capitao", label: "Capitães" },
                { value: "titular", label: "Titulares" },
                { value: "reserva", label: "Reservas" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  playClickSound();
                  setCargoFilter(tab.value);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  cargoFilter === tab.value
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "text-subtle hover:text-silver"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowLinkModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-[#121821] hover:bg-cyan-500/15 px-3.5 py-2 text-xs font-semibold text-cyan-400 transition-all shadow-sm hover:border-cyan-400 cursor-pointer"
          >
            <Link2 size={14} />
            <span className="hidden sm:inline">Gerar Link pra Membro</span>
            <span className="sm:hidden">Gerar Link</span>
          </button>

          {onPasteMember && (
            <button
              onClick={() => {
                playClickSound();
                onPasteMember();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-[#121821] hover:bg-accent/15 px-3.5 py-2 text-xs font-semibold text-accent transition-all shadow-sm hover:border-accent/50 cursor-pointer"
            >
              <ClipboardPaste size={14} />
              <span className="hidden sm:inline">Colar Ficha</span>
              <span className="sm:hidden">Colar</span>
            </button>
          )}

          <Button
            onClick={() => {
              playClickSound();
              onAddMember();
            }}
            className="gap-1.5 py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-accent-foreground rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,180,255,0.25)]"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Novo Membro</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* ── Grid de Membros ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-xl border border-white/5 bg-[#0e131b]">
          <Users size={32} className="mx-auto mb-3 text-subtle/40" />
          <p className="text-subtle mb-4">Nenhum membro encontrado com esse filtro.</p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                playClickSound();
                setShowLinkModal(true);
              }}
              className="gap-1.5 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs"
            >
              <Link2 size={14} />
              Gerar Link pra Membro
            </Button>

            {onPasteMember && (
              <Button
                variant="ghost"
                onClick={() => {
                  playClickSound();
                  onPasteMember();
                }}
                className="gap-1.5 border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 text-xs"
              >
                <ClipboardPaste size={14} />
                Colar Ficha de Membro
              </Button>
            )}
            <Button
              onClick={() => {
                playClickSound();
                onAddMember();
              }}
              className="gap-1.5 text-xs bg-accent text-accent-foreground font-semibold"
            >
              <UserPlus size={14} />
              Novo Membro Manual
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => {
            const cargo = CARGO_CONFIG[m.cargo] || CARGO_CONFIG.membro;
            const CargoIcon = cargo.icon;
            const associatedLine = lines.find((l) => l.id === m.lineId);
            const activeWarns = warnings.filter(
              (w) => w.status === "ativa" && w.memberNick === m.nick
            );
            const warnCount = activeWarns.length;

            return (
              <div
                key={m.id}
                className="rounded-xl border border-white/8 bg-[#0e131b] p-4 transition-all hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(0,180,255,0.06)] flex flex-col justify-between gap-3"
              >
                <div>
                  {/* Topo: Avatar + Cargo */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-10 rounded-xl bg-[#121821] border border-white/10 flex items-center justify-center font-display text-xl text-accent">
                        {m.nick.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-display text-xl leading-none text-silver truncate max-w-[170px]">
                          {m.nick}
                        </h4>
                        <p className="text-xs text-subtle mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{m.nome}</span>
                          {m.idade ? (
                            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 rounded">
                              {m.idade} anos
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${cargo.badgeClass}`}
                    >
                      <CargoIcon size={11} />
                      {cargo.label}
                    </span>
                  </div>

                  {/* Chips: ID + Função + Line + Advertências */}
                  <div className="flex flex-wrap gap-1.5 text-xs mb-3">
                    <button
                      onClick={() => copyId(m.idConta)}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#121821] px-2 py-0.5 font-mono text-[11px] text-accent transition-colors hover:border-accent/40 cursor-pointer"
                      title="Copiar ID Free Fire"
                    >
                      {copiedId === m.idConta ? (
                        <span className="text-emerald-400">Copiado!</span>
                      ) : (
                        <>
                          {m.idConta}
                          <Copy size={10} className="text-subtle" />
                        </>
                      )}
                    </button>

                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-silver capitalize">
                      {m.funcao}
                    </span>

                    {associatedLine ? (
                      <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] text-accent font-medium">
                        {associatedLine.tag}
                      </span>
                    ) : (
                      <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] text-subtle">
                        Sem Line
                      </span>
                    )}

                    {warnCount > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                          warnCount >= MAX_WARNING_POINTS
                            ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                            : warnCount === 2
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        }`}
                        title={`${warnCount} advertência(s) ativa(s)`}
                      >
                        <AlertTriangle size={10} />
                        {warnCount}/{MAX_WARNING_POINTS} Adv
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="flex items-center justify-between border-t border-white/6 pt-2.5">
                  {m.whatsapp ? (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${m.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      <MessageCircle size={13} />
                      WhatsApp
                    </a>
                  ) : (
                    <span className="text-xs text-subtle">Sem WhatsApp</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyMemberFicha(m)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#121821] px-2.5 py-1 text-xs text-silver hover:border-accent/40 hover:text-accent transition-colors cursor-pointer"
                      title="Copiar ficha do membro"
                    >
                      <Copy size={12} />
                      <span className="hidden sm:inline">Copiar</span>
                    </button>
                    {onWarnMember && (
                      <button
                        onClick={() => {
                          playClickSound();
                          onWarnMember(m);
                        }}
                        className="rounded-lg p-1.5 text-subtle hover:bg-amber-500/10 hover:text-amber-400 transition-colors cursor-pointer"
                        title="Aplicar advertência"
                      >
                        <AlertTriangle size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        playClickSound();
                        onEditMember(m);
                      }}
                      className="rounded-lg p-1.5 text-subtle hover:bg-white/5 hover:text-silver transition-colors cursor-pointer"
                      title="Editar membro"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        setMemberToDelete(m);
                      }}
                      className="rounded-lg p-1.5 text-subtle hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remover da guilda"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modais de Membros */}
      <AnimatePresence>
        {memberToDelete && (
          <ConfirmDeleteModal
            isOpen={Boolean(memberToDelete)}
            title="Remover Membro"
            itemName={memberToDelete.nick}
            itemDescription={`O jogador ${memberToDelete.nome || memberToDelete.nick} será removido do roster da guilda e de qualquer line.`}
            confirmLabel="Sim, Remover Membro"
            onClose={() => setMemberToDelete(null)}
            onConfirm={() => {
              playDenySound();
              onDeleteMember(memberToDelete.id);
              setMemberToDelete(null);
            }}
          />
        )}

        {showLinkModal && (
          <LinkMemberModal
            onClose={() => setShowLinkModal(false)}
            lines={lines}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Modal Adicionar/Editar Membro ──────────────────────────────────────────

interface MemberModalProps {
  onClose: () => void;
  onSave: (member: GuildMember) => void;
  initialData?: Partial<GuildMember> | null;
  lines: GuildLine[];
}

export function MemberModal({
  onClose,
  onSave,
  initialData,
  lines,
}: MemberModalProps) {
  const [form, setForm] = useState({
    nick: initialData?.nick || "",
    nome: initialData?.nome || "",
    idade: initialData?.idade || "",
    idConta: initialData?.idConta || "",
    whatsapp: initialData?.whatsapp || "",
    cargo: (initialData?.cargo as GuildCargo) || "titular",
    funcao: initialData?.funcao || "rush",
    patente: initialData?.patente || "diamente_mestre",
    lineId: initialData?.lineId || "",
    nota: initialData?.nota || "",
  });

  async function handlePasteIntoForm() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      const parsed = parseMemberFicha(text);
      setForm((prev) => ({
        ...prev,
        nick: parsed.nick || prev.nick,
        nome: parsed.nome || prev.nome,
        idade: parsed.idade || prev.idade,
        idConta: parsed.idConta || prev.idConta,
        whatsapp: parsed.whatsapp || prev.whatsapp,
        cargo: parsed.cargo || prev.cargo,
        funcao: parsed.funcao || prev.funcao,
        patente: parsed.patente || prev.patente,
      }));
      playApproveSound();
      toast.success("Dados colados e preenchidos automaticamente!");
    } catch {
      toast.error("Permissão de área de transferência necessária.");
    }
  }

  async function pasteSpecificField(
    field: keyof typeof form,
    transform?: (val: string) => string,
  ) {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      const val = transform ? transform(text.trim()) : text.trim();
      setForm((prev) => ({ ...prev, [field]: val }));
      playApproveSound();
      toast.success("Texto colado!");
    } catch {
      toast.error("Permissão de área de transferência necessária.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nick.trim() || !form.idConta.trim()) {
      toast.error("Nick e ID Free Fire são obrigatórios.");
      return;
    }

    const member: GuildMember = {
      id: initialData?.id || `mem-${Date.now()}`,
      nick: form.nick.trim(),
      nome: form.nome.trim() || form.nick.trim(),
      idade: form.idade.trim() || undefined,
      idConta: form.idConta.trim(),
      whatsapp: form.whatsapp.trim(),
      cargo: form.cargo,
      funcao: form.funcao,
      patente: form.patente,
      lineId: form.lineId,
      status: "ativo",
      entrouEm:
        initialData?.entrouEm ||
        new Date().toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
        }),
      nota: form.nota.trim(),
    };

    playApproveSound();
    onSave(member);
    toast.success(
      initialData?.id
        ? "Membro atualizado com sucesso!"
        : `${member.nick} oficializado na guilda LATAM 友!`
    );
    onClose();
  }

  const fieldClass =
    "w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none";
  const labelClass = "text-xs text-subtle";

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
              Roster Oficial
            </p>
            <h3 className="font-display text-2xl text-silver">
              {initialData?.id ? "Editar Membro" : "+ Oficializar Membro"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-subtle hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Banner de colar ficha completa */}
          <div className="flex items-center justify-between rounded-xl border border-accent/25 bg-accent/5 p-2.5">
            <div className="flex items-center gap-2">
              <ClipboardPaste size={15} className="text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-silver">Colar Ficha do WhatsApp / Discord</p>
                <p className="text-[10px] text-subtle">Preenche todos os campos em 1 clique</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Nick no Jogo *</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("nick")}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="LATAM 友 NICK"
                value={form.nick}
                onChange={(e) => setForm((f) => ({ ...f, nick: e.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>ID Free Fire *</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("idConta", maskPlayerId)}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="123456789"
                value={form.idConta}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    idConta: maskPlayerId(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-5">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Nome Real</label>
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
                placeholder="Nome do jogador"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              />
            </div>
            <div className="col-span-4 sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Idade</label>
                <button
                  type="button"
                  onClick={() =>
                    pasteSpecificField("idade", (v) => v.replace(/\D/g, "").slice(0, 2))
                  }
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
              <input
                className={fieldClass}
                placeholder="Ex: 19"
                maxLength={2}
                value={form.idade}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    idade: e.target.value.replace(/\D/g, "").slice(0, 2),
                  }))
                }
              />
            </div>
            <div className="col-span-8 sm:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>WhatsApp</label>
                <button
                  type="button"
                  onClick={() => pasteSpecificField("whatsapp", maskPhone)}
                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <ClipboardPaste size={10} />
                  Colar
                </button>
              </div>
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
              <label className={labelClass}>Cargo na Guilda</label>
              <select
                className={fieldClass}
                value={form.cargo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cargo: e.target.value as GuildCargo }))
                }
              >
                <option value="lider">👑 Líder</option>
                <option value="vice_lider">🛡️ Vice-Líder</option>
                <option value="capitao">⚔️ Capitão</option>
                <option value="titular">🏆 Titular de Line</option>
                <option value="reserva">⏱️ Reserva</option>
                <option value="membro">👤 Membro</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Função</label>
              <select
                className={fieldClass}
                value={form.funcao}
                onChange={(e) => setForm((f) => ({ ...f, funcao: e.target.value }))}
              >
                {FUNCOES.map((fn) => (
                  <option key={fn.value} value={fn.value}>
                    {fn.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Line Associada</label>
              <select
                className={fieldClass}
                value={form.lineId}
                onChange={(e) => setForm((f) => ({ ...f, lineId: e.target.value }))}
              >
                <option value="">Sem Line (Livre)</option>
                {lines.map((ln) => (
                  <option key={ln.id} value={ln.id}>
                    {ln.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Patente</label>
              <select
                className={fieldClass}
                value={form.patente}
                onChange={(e) => setForm((f) => ({ ...f, patente: e.target.value }))}
              >
                {PATENTES_LATAM.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-white/10"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <UserCheck size={15} />
              Salvar Membro
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Parser da Ficha do Membro ───────────────────────────────────────────────

export function parseMemberFicha(raw: string) {
  const clean = raw.replace(/[*_#~]/g, "");
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  let nick = "";
  let idConta = "";
  let nome = "";
  let idade = "";
  let whatsapp = "";
  let cargo: GuildCargo = "titular";
  let funcao = "rush";
  let patente = "diamente_mestre";
  let nota = "";

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("nick:") || lower.startsWith("nickname:")) {
      nick = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (lower.startsWith("nome:")) {
      nome = line.split(/:(.+)/)[1]?.trim() || "";
    } else if (
      lower.startsWith("idade:") ||
      lower.startsWith("idade") ||
      lower.startsWith("anos:") ||
      lower.startsWith("age:")
    ) {
      const match =
        line.split(/[:\-\s]+(.+)/)[1]?.replace(/\D/g, "").slice(0, 2) ||
        line.replace(/\D/g, "").slice(0, 2);
      if (match) idade = match;
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
      lower.startsWith("id free fire:") ||
      lower.startsWith("uid:")
    ) {
      idConta = line.split(/:(.+)/)[1]?.replace(/\D/g, "") || "";
    } else if (lower.startsWith("cargo:")) {
      const cVal = lower.split(/:(.+)/)[1]?.trim() || "";
      if (cVal.includes("lider") && !cVal.includes("vice")) cargo = "lider";
      else if (cVal.includes("vice")) cargo = "vice_lider";
      else if (cVal.includes("capitao") || cVal.includes("capitão")) cargo = "capitao";
      else if (cVal.includes("reserva")) cargo = "reserva";
      else if (cVal.includes("membro")) cargo = "membro";
      else cargo = "titular";
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
      if (pVal.includes("elite")) patente = "elite";
      else if (pVal.includes("mestre") || pVal.includes("diamante")) patente = "diamente_mestre";
      else if (pVal.includes("platina")) patente = "platina_diamente";
      else if (pVal.includes("ouro")) patente = "ouro_platina";
    }
  }

  // Fallbacks regex
  if (!idConta) {
    const idMatch = clean.match(/\b(\d{7,12})\b/);
    if (idMatch) idConta = idMatch[1];
  }
  if (!idade) {
    const ageMatch =
      clean.match(/(?:idade|anos|age)[:\s\-]+(\d{1,2})/i) ||
      clean.match(/\b(\d{1,2})\s*(?:anos|yo|yr)\b/i);
    if (ageMatch) idade = ageMatch[1];
  }
  if (!whatsapp) {
    const zapMatch = clean.match(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/);
    if (zapMatch) whatsapp = zapMatch[0];
  }
  if (!nick) {
    const firstNonHeader = lines.find(
      (l) => !l.toLowerCase().includes("latam") && !l.toLowerCase().includes("candidatura") && !l.toLowerCase().includes("membro")
    );
    if (firstNonHeader) {
      nick = firstNonHeader.slice(0, 24);
    }
  }

  return {
    nick: nick || "LATAM 友 RECRUTA",
    idConta: idConta || "",
    nome: nome || nick || "",
    idade: idade || "",
    whatsapp: whatsapp || "",
    cargo,
    funcao,
    patente,
    nota,
  };
}

// ─── Modal Colar Ficha de Membro ─────────────────────────────────────────────

export interface PasteMemberModalProps {
  onClose: () => void;
  onAdd: (member: GuildMember) => void;
  lines: GuildLine[];
}

export function PasteMemberModal({
  onClose,
  onAdd,
  lines,
}: PasteMemberModalProps) {
  const [pastedText, setPastedText] = useState("");
  const [selectedCargo, setSelectedCargo] = useState<GuildCargo>("titular");
  const [selectedLineId, setSelectedLineId] = useState("");

  const parsed = pastedText.trim() ? parseMemberFicha(pastedText) : null;

  async function handlePasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("Área de transferência vazia.");
        return;
      }
      setPastedText(text);
      const p = parseMemberFicha(text);
      if (p.cargo) setSelectedCargo(p.cargo);
      playClickSound();
      toast.success("Ficha colada com sucesso!");
    } catch {
      toast.error("Permissão de área de transferência negada.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parsed) {
      toast.error("Cole os dados do membro primeiro.");
      return;
    }
    if (!parsed.nick || !parsed.idConta) {
      toast.error("Nick e ID Free Fire são obrigatórios.");
      return;
    }

    const member: GuildMember = {
      id: `mem-${Date.now()}`,
      nick: parsed.nick,
      nome: parsed.nome || parsed.nick,
      idade: parsed.idade || undefined,
      idConta: parsed.idConta,
      whatsapp: parsed.whatsapp,
      cargo: selectedCargo,
      funcao: parsed.funcao,
      patente: parsed.patente,
      lineId: selectedLineId || undefined,
      status: "ativo",
      entrouEm: new Date().toLocaleDateString("pt-BR", {
        month: "2-digit",
        year: "numeric",
      }),
      nota: "Cadastrado via Colar Ficha",
    };

    playApproveSound();
    onAdd(member);
    toast.success(`${member.nick} oficializado na guilda LATAM 友!`);
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
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">
              Roster Oficial
            </p>
            <h3 className="font-display text-2xl text-silver flex items-center gap-2">
              📋 Colar Ficha de Membro
            </h3>
            <p className="text-xs text-subtle mt-1">
              Cole o texto enviado pelo jogador (WhatsApp, Discord ou Instagram). O sistema extrai Nick, ID, WhatsApp, Função e Patente na hora!
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
              className="w-full rounded-xl border border-white/10 bg-[#121821] p-3 text-xs font-mono text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none resize-none"
              rows={7}
              placeholder={`Cole aqui o texto ou ficha inteira do membro...\n\nExemplo:\nNick: LATAM 友 GHOST\nNome: Gabriel Ferreira\nWhatsApp: (21) 97722-3344\nID da conta: 273819402\nFunção: Suporte\nPatente: Elite`}
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
                <span className="text-[11px] text-emerald-400">✓ Pronto para oficializar</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Nick</span>
                  <span className="font-semibold text-silver truncate block">{parsed.nick}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">ID Free Fire</span>
                  <span className="font-mono text-accent truncate block">{parsed.idConta || "—"}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Idade</span>
                  <span className="text-cyan-300 font-semibold truncate block">{parsed.idade ? `${parsed.idade} anos` : "—"}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">WhatsApp</span>
                  <span className="text-silver truncate block">{parsed.whatsapp || "—"}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Função</span>
                  <span className="text-silver capitalize truncate block">{parsed.funcao}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                  <span className="text-subtle block text-[10px] uppercase">Patente</span>
                  <span className="text-silver capitalize truncate block">{parsed.patente}</span>
                </div>
                <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5 col-span-2 sm:col-span-3">
                  <span className="text-subtle block text-[10px] uppercase">Nome</span>
                  <span className="text-silver truncate block">{parsed.nome || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Opções de Cargo e Line */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs text-subtle mb-1">Cargo no Roster</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-xs text-foreground focus:border-accent/50 focus:outline-none"
                value={selectedCargo}
                onChange={(e) => setSelectedCargo(e.target.value as GuildCargo)}
              >
                <option value="titular">Titular</option>
                <option value="capitao">Capitão</option>
                <option value="vice_lider">Vice-Líder</option>
                <option value="lider">Líder</option>
                <option value="reserva">Reserva</option>
                <option value="membro">Membro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-subtle mb-1">Vincular a Line (Opcional)</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-[#121821] px-3 py-2 text-xs text-foreground focus:border-accent/50 focus:outline-none"
                value={selectedLineId}
                onChange={(e) => setSelectedLineId(e.target.value)}
              >
                <option value="">Sem Line (Livre)</option>
                {lines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nome} ({l.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-white/6">
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
              disabled={!parsed}
              className="bg-accent text-accent-foreground font-semibold"
            >
              Oficializar Membro
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal de Criação / Compartilhamento de Link de Membro ───────────────────

export function LinkMemberModal({
  onClose,
  lines,
}: {
  onClose: () => void;
  lines: GuildLine[];
}) {
  const [selectedCargo, setSelectedCargo] = useState<GuildCargo>("membro");
  const [selectedLineId, setSelectedLineId] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://latam2.nyxaria.workers.dev";
  const baseUrl = `${origin}/cadastro-membro`;

  const params = new URLSearchParams();
  if (selectedCargo && selectedCargo !== "membro") {
    params.set("cargo", selectedCargo);
  }
  if (selectedLineId) {
    params.set("line", selectedLineId);
  }
  const queryString = params.toString();
  const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const selectedLine = lines.find((l) => l.id === selectedLineId);

  const inviteMessage = [
    `🏆 *${GUILD_NAME}${GUILD_MARK} — Formulário de Membro Oficial*`,
    "",
    "Olá guerreiro! Registre sua ficha oficial para entrar no Roster:",
    selectedLine ? `⚔️ Line: *${selectedLine.nome} (${selectedLine.tag})*` : "",
    "",
    `🔗 ${fullUrl}`,
    "",
    "Campos da ficha:",
    "*Nick:*",
    "*Nome:*",
    "idade",
    "*ID da Conta:*",
    "*WhatsApp:*",
    "*Função:*",
    "*Patente:*",
    "",
    "_Foco total na partida sem ter medo de perder!_",
  ]
    .filter(Boolean)
    .join("\n");

  function handleCopyLink() {
    playClickSound();
    void navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    toast.success("Link de cadastro copiado!");
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleCopyInvite() {
    playApproveSound();
    void navigator.clipboard.writeText(inviteMessage);
    setCopiedMsg(true);
    toast.success("Convite formatado para WhatsApp copiado!");
    setTimeout(() => setCopiedMsg(false), 2000);
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
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e131b] p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Link2 size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                Roster Oficial
              </p>
              <h3 className="font-display text-2xl text-silver">
                Gerar Link pra Membro
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-subtle mb-4 leading-relaxed">
          Os membros que acessarem este link preenchem a própria ficha e entram automaticamente na <strong>Tabela de Membros</strong> da guilda (no Supabase e no painel).
        </p>

        {/* Customização opcional de Cargo e Line */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-black/30 border border-white/6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-subtle mb-1">
              Cargo Atribuído
            </label>
            <select
              className="w-full rounded-lg border border-white/10 bg-[#121821] px-2.5 py-1.5 text-xs text-foreground focus:border-cyan-400 focus:outline-none"
              value={selectedCargo}
              onChange={(e) => setSelectedCargo(e.target.value as GuildCargo)}
            >
              <option value="membro">Membro (Padrão)</option>
              <option value="titular">Titular</option>
              <option value="reserva">Reserva</option>
              <option value="capitao">Capitão</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-subtle mb-1">
              Line-up (Opcional)
            </label>
            <select
              className="w-full rounded-lg border border-white/10 bg-[#121821] px-2.5 py-1.5 text-xs text-foreground focus:border-cyan-400 focus:outline-none"
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
            >
              <option value="">Nenhuma / Livre</option>
              {lines.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nome} ({l.tag})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo com a URL */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-wider text-subtle mb-1">
            URL Pública Gerada
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="flex-1 rounded-xl border border-white/10 bg-[#121821] px-3.5 py-2 font-mono text-xs text-cyan-300 focus:outline-none select-all"
            />
            <Button
              onClick={handleCopyLink}
              className="gap-1.5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-xl cursor-pointer shadow-[0_0_12px_rgba(0,180,255,0.25)]"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? "Copiado!" : "Copiar"}</span>
            </Button>
          </div>
        </div>

        {/* Card do WhatsApp */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MessageCircle size={14} />
              Convite Formatado para WhatsApp
            </span>
            <button
              onClick={handleCopyInvite}
              className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 cursor-pointer underline underline-offset-2 flex items-center gap-1"
            >
              {copiedMsg ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedMsg ? "Copiado!" : "Copiar Mensagem"}</span>
            </button>
          </div>
          <pre className="text-[11px] text-subtle whitespace-pre-wrap font-sans bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
            {inviteMessage}
          </pre>
        </div>

        {/* Rodapé / Ações */}
        <div className="flex items-center justify-between pt-2 border-t border-white/6">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-cyan-400 transition-colors"
          >
            <ExternalLink size={13} />
            <span>Abrir página em nova aba</span>
          </a>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="border border-white/10 text-subtle text-xs"
          >
            Fechar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
