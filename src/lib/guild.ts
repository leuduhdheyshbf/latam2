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

export const DEFAULT_MEMBERS: GuildMember[] = [
  {
    id: "mem-1",
    nick: "LATAM 友 SOUZA",
    nome: "Lucas Souza",
    idConta: "189420392",
    whatsapp: "(11) 98844-2211",
    cargo: "lider",
    funcao: "rush",
    patente: "elite",
    lineId: "line-1",
    status: "ativo",
    entrouEm: "Fundador",
  },
  {
    id: "mem-2",
    nick: "LATAM 友 GHOST",
    nome: "Gabriel Ferreira",
    idConta: "273819402",
    whatsapp: "(21) 97722-3344",
    cargo: "vice_lider",
    funcao: "fuzileiro",
    patente: "elite",
    lineId: "line-1",
    status: "ativo",
    entrouEm: "02/2026",
  },
  {
    id: "mem-3",
    nick: "LATAM 友 XITADOR",
    nome: "Pedro Santos",
    idConta: "392019482",
    whatsapp: "(31) 99123-4567",
    cargo: "capitao",
    funcao: "rush",
    patente: "diamente_mestre",
    lineId: "line-1",
    status: "ativo",
    entrouEm: "03/2026",
  },
  {
    id: "mem-4",
    nick: "LATAM 友 SNIPER",
    nome: "Matheus Silva",
    idConta: "482019481",
    whatsapp: "(41) 98765-4321",
    cargo: "titular",
    funcao: "suporte",
    patente: "diamente_mestre",
    lineId: "line-1",
    status: "ativo",
    entrouEm: "03/2026",
  },
  {
    id: "mem-5",
    nick: "LATAM 友 DARK",
    nome: "Rafael Dark",
    idConta: "582019489",
    whatsapp: "(51) 99911-2233",
    cargo: "titular",
    funcao: "granadeiro",
    patente: "diamente_mestre",
    lineId: "line-2",
    status: "ativo",
    entrouEm: "03/2026",
  },
  {
    id: "mem-6",
    nick: "LATAM 友 BIEL",
    nome: "Gabriel Biel",
    idConta: "682019412",
    whatsapp: "(61) 99888-7766",
    cargo: "titular",
    funcao: "suporte",
    patente: "elite",
    lineId: "line-2",
    status: "ativo",
    entrouEm: "04/2026",
  },
];

export const DEFAULT_LINES: GuildLine[] = [
  {
    id: "line-1",
    nome: "Line 1 — Elite Principal",
    tag: "PRINCIPAL",
    status: "completa",
    horarioTreino: "19h30 às 23h00 (Camps Diários)",
    capitaoNick: "LATAM 友 GHOST",
    slots: [
      { slotNumber: 1, funcaoLabel: "Capitão / IGL", jogadorNick: "LATAM 友 GHOST", jogadorId: "mem-2", jogadorIdConta: "273819402" },
      { slotNumber: 2, funcaoLabel: "1º Rush", jogadorNick: "LATAM 友 SOUZA", jogadorId: "mem-1", jogadorIdConta: "189420392" },
      { slotNumber: 3, funcaoLabel: "2º Rush", jogadorNick: "LATAM 友 XITADOR", jogadorId: "mem-3", jogadorIdConta: "392019482" },
      { slotNumber: 4, funcaoLabel: "Suporte Fixo", jogadorNick: "LATAM 友 SNIPER", jogadorId: "mem-4", jogadorIdConta: "482019481" },
      { slotNumber: 5, funcaoLabel: "Reserva Tático", jogadorNick: "" },
    ],
  },
  {
    id: "line-2",
    nome: "Line 2 — Base Competitiva",
    tag: "BASE",
    status: "buscando_rush",
    horarioTreino: "20h00 às 22h30",
    capitaoNick: "LATAM 友 DARK",
    slots: [
      { slotNumber: 1, funcaoLabel: "Capitão", jogadorNick: "LATAM 友 DARK", jogadorId: "mem-5", jogadorIdConta: "582019489" },
      { slotNumber: 2, funcaoLabel: "Suporte", jogadorNick: "LATAM 友 BIEL", jogadorId: "mem-6", jogadorIdConta: "682019412" },
      { slotNumber: 3, funcaoLabel: "1º Rush", jogadorNick: "" },
      { slotNumber: 4, funcaoLabel: "Granadeiro", jogadorNick: "" },
      { slotNumber: 5, funcaoLabel: "Reserva", jogadorNick: "" },
    ],
  },
  {
    id: "line-3",
    nome: "Line 3 — Academy / Recrutas",
    tag: "ACADEMY",
    status: "em_treino",
    horarioTreino: "18h00 às 20h30",
    slots: [
      { slotNumber: 1, funcaoLabel: "Capitão", jogadorNick: "" },
      { slotNumber: 2, funcaoLabel: "Rush", jogadorNick: "" },
      { slotNumber: 3, funcaoLabel: "Rush", jogadorNick: "" },
      { slotNumber: 4, funcaoLabel: "Suporte", jogadorNick: "" },
      { slotNumber: 5, funcaoLabel: "Reserva", jogadorNick: "" },
    ],
  },
];

export function loadMembers(): GuildMember[] {
  if (typeof window === "undefined") return DEFAULT_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_MEMBERS_KEY);
    if (!raw) return DEFAULT_MEMBERS;
    const parsed = JSON.parse(raw) as GuildMember[];
    return parsed.length ? parsed : DEFAULT_MEMBERS;
  } catch {
    return DEFAULT_MEMBERS;
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
  if (typeof window === "undefined") return DEFAULT_LINES;
  try {
    const raw = localStorage.getItem(STORAGE_LINES_KEY);
    if (!raw) return DEFAULT_LINES;
    const parsed = JSON.parse(raw) as GuildLine[];
    return parsed.length ? parsed : DEFAULT_LINES;
  } catch {
    return DEFAULT_LINES;
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
