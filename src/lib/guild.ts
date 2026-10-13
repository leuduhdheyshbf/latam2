import { Crown, Shield, Swords, Trophy, Clock, Users } from "lucide-react";

export type GuildCargo =
  | "lider"
  | "vice_lider"
  | "capitao"
  | "titular"
  | "reserva"
  | "membro";

export type GuildMember = {
  id: string;
  nick: string;
  nome: string;
  idConta: string;
  whatsapp: string;
  cargo: GuildCargo;
  funcao: string;
  patente: string;
  lineId?: string;
  status: "ativo" | "inativo";
  entrouEm?: string;
  nota?: string;
};

export type GuildLineSlot = {
  slotNumber: number;
  funcaoLabel: string;
  jogadorNick?: string;
  jogadorId?: string;
  jogadorIdConta?: string;
};

export type GuildLine = {
  id: string;
  nome: string;
  tag: string;
  status: "completa" | "buscando_rush" | "buscando_suporte" | "em_treino";
  horarioTreino: string;
  capitaoNick?: string;
  slots: GuildLineSlot[];
};

export const GUILD_MAX_MEMBERS = 50;
export const STORAGE_MEMBERS_KEY = "latam-admin-members";
export const STORAGE_LINES_KEY = "latam-admin-lines";

export const CARGO_CONFIG: Record<
  GuildCargo,
  { label: string; badgeClass: string; icon: typeof Crown }
> = {
  lider: {
    label: "Líder",
    badgeClass: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    icon: Crown,
  },
  vice_lider: {
    label: "Vice-Líder",
    badgeClass: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
    icon: Shield,
  },
  capitao: {
    label: "Capitão",
    badgeClass: "text-purple-300 border-purple-500/30 bg-purple-500/10",
    icon: Swords,
  },
  titular: {
    label: "Titular",
    badgeClass: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    icon: Trophy,
  },
  reserva: {
    label: "Reserva",
    badgeClass: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    icon: Clock,
  },
  membro: {
    label: "Membro",
    badgeClass: "text-slate-300 border-slate-500/30 bg-slate-500/10",
    icon: Users,
  },
};

export const DEFAULT_MEMBERS: GuildMember[] = [];

export const DEFAULT_LINES: GuildLine[] = [];

export function loadMembers(): GuildMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_MEMBERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuildMember[]) : [];
  } catch {
    return [];
  }
}

export function saveMembers(list: GuildMember[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function loadLines(): GuildLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_LINES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuildLine[]) : [];
  } catch {
    return [];
  }
}

export function saveLines(list: GuildLine[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_LINES_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

// ─── Warnings / Advertências ──────────────────────────────────────────────────

export type WarningGrau = "leve" | "media" | "grave";
export type WarningStatus = "ativa" | "revogada" | "cumprida";

export type GuildWarning = {
  id: string;
  memberId: string;
  memberNick: string;
  memberIdConta?: string;
  motivo: string;
  descricao?: string;
  grau: WarningGrau;
  pontos: number; // 1 (leve), 2 (média), 3 (grave)
  data: string;
  aplicadaPor: string;
  status: WarningStatus;
  dataRevogacao?: string;
  motivoRevogacao?: string;
};

export const MAX_WARNING_POINTS = 3;
export const STORAGE_WARNINGS_KEY = "latam-admin-warnings";

export const WARNING_MOTIVOS_PRESET = [
  "Falta injustificada em Treino Oficial",
  "Atraso recorrente nos horários marcados",
  "Toxicidade ou desrespeito em call/chat",
  "Descumprimento direto de ordem do Capitão",
  "Não atingiu a meta semanal de pontuação/atividade",
  "Ausência prolongada sem aviso prévio à Staff",
  "Uso indevido da Tag/Nome da Guilda em público",
  "Conduta antiesportiva em sala personalizada",
  "Outro motivo personalizado",
] as const;

export const GRAU_CONFIG: Record<
  WarningGrau,
  { label: string; pontos: number; badgeClass: string; borderClass: string; textClass: string }
> = {
  leve: {
    label: "Leve (1 Ponto)",
    pontos: 1,
    badgeClass: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    borderClass: "border-amber-500/30 hover:border-amber-500/50",
    textClass: "text-amber-400",
  },
  media: {
    label: "Média (2 Pontos)",
    pontos: 2,
    badgeClass: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    borderClass: "border-orange-500/40 hover:border-orange-500/60",
    textClass: "text-orange-400",
  },
  grave: {
    label: "Grave (3 Pontos / Kick)",
    pontos: 3,
    badgeClass: "text-red-400 border-red-500/30 bg-red-500/10 shadow-red-500/20 shadow-sm",
    borderClass: "border-red-500/50 hover:border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    textClass: "text-red-400",
  },
};

export function loadWarnings(): GuildWarning[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_WARNINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuildWarning[]) : [];
  } catch {
    return [];
  }
}

export function saveWarnings(list: GuildWarning[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_WARNINGS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

