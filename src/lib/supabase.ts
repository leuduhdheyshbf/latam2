import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RecruitmentValues } from "@/lib/recruitment";
import type { GuildMember, GuildLine, GuildCargo, GuildLineSlot, GuildWarning, WarningGrau, WarningStatus } from "@/lib/guild";


export interface DbCandidate {
  id: string;
  created_at?: string;
  nome: string;
  idade: string;
  nick: string;
  id_conta: string;
  cidade_estado: string;
  whatsapp: string;
  funcao: string;
  patente_atual: string;
  experiencia_competitiva: string;
  experiencia_descricao: string;
  tempo_disponivel: string;
  horario_disponivel: string;
  status: "pendente" | "aprovado" | "recusado";
  staff_note: string;
}

export type CandidateRecord = RecruitmentValues & {
  id: string;
  submittedAt?: string;
  status?: "pendente" | "aprovado" | "recusado";
  staffNote?: string;
};

const DEFAULT_SUPABASE_URL = "https://djjzihkwtkiehlugxoae.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_65rDvc1MGSpLgoXyytF9xw_uFh-WvTt";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey.length > 20
);

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
}

export function dbToCandidate(db: DbCandidate): CandidateRecord {
  return {
    id: db.id,
    nome: db.nome,
    idade: db.idade,
    nick: db.nick,
    idConta: db.id_conta,
    cidadeEstado: db.cidade_estado,
    whatsapp: db.whatsapp,
    funcao: db.funcao,
    patenteAtual: db.patente_atual,
    experienciaCompetitiva: db.experiencia_competitiva,
    experienciaDescricao: db.experiencia_descricao || "",
    tempoDisponivel: db.tempo_disponivel,
    horarioDisponivel: db.horario_disponivel,
    status: db.status,
    staffNote: db.staff_note || "",
    submittedAt: db.created_at
      ? new Date(db.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Recente",
  };
}

/**
 * Salva uma nova candidatura no Supabase
 */
export async function insertCandidateSupabase(values: RecruitmentValues): Promise<CandidateRecord | null> {
  const client = getSupabase();
  if (!client) return null;

  const row = {
    nome: values.nome,
    idade: values.idade,
    nick: values.nick,
    id_conta: values.idConta,
    cidade_estado: values.cidadeEstado,
    whatsapp: values.whatsapp,
    funcao: values.funcao,
    patente_atual: values.patenteAtual,
    experiencia_competitiva: values.experienciaCompetitiva,
    experiencia_descricao: values.experienciaDescricao || "",
    tempo_disponivel: values.tempoDisponivel,
    horario_disponivel: values.horarioDisponivel,
    status: "pendente",
    staff_note: "",
  };

  const { data, error } = await client
    .from("candidatos")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("[Supabase] Erro ao inserir candidato:", error);
    throw new Error(`Erro no Supabase: ${error.message}`);
  }

  return dbToCandidate(data as DbCandidate);
}

/**
 * Busca todas as candidaturas do Supabase
 */
export async function fetchCandidatesSupabase(): Promise<CandidateRecord[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("candidatos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Supabase] Erro ao buscar candidatos:", error);
    throw error;
  }

  return ((data || []) as DbCandidate[]).map(dbToCandidate);
}

/**
 * Atualiza status ou observação de um candidato
 */
export async function updateCandidateSupabase(
  id: string,
  updates: Partial<Pick<DbCandidate, "status" | "staff_note">>
): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client
    .from("candidatos")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("[Supabase] Erro ao atualizar candidato:", error);
    throw error;
  }
}

/**
 * Deleta um candidato
 */
export async function deleteCandidateSupabase(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client
    .from("candidatos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Supabase] Erro ao deletar candidato:", error);
    throw error;
  }
}

// ─── Membros ───────────────────────────────────────────────────────────────────

export interface DbMember {
  id: string;
  nick: string;
  nome: string;
  id_conta: string;
  whatsapp: string;
  cargo: string;
  funcao: string;
  patente: string;
  line_id: string | null;
  status: "ativo" | "inativo";
  entrou_em: string | null;
  nota: string | null;
  created_at?: string;
}

export function dbToMember(db: DbMember): GuildMember {
  return {
    id: db.id,
    nick: db.nick,
    nome: db.nome || "",
    idConta: db.id_conta,
    whatsapp: db.whatsapp || "",
    cargo: (db.cargo || "titular") as GuildCargo,
    funcao: db.funcao || "rush",
    patente: db.patente || "diamente_mestre",
    lineId: db.line_id || undefined,
    status: db.status || "ativo",
    entrouEm: db.entrou_em || undefined,
    nota: db.nota || undefined,
  };
}

export function memberToDb(m: GuildMember): DbMember {
  return {
    id: m.id,
    nick: m.nick,
    nome: m.nome,
    id_conta: m.idConta,
    whatsapp: m.whatsapp,
    cargo: m.cargo,
    funcao: m.funcao,
    patente: m.patente,
    line_id: m.lineId || null,
    status: m.status,
    entrou_em: m.entrouEm || null,
    nota: m.nota || null,
  };
}

export async function fetchMembersSupabase(): Promise<GuildMember[] | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("membros")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data || []) as DbMember[]).map(dbToMember);
}

export async function upsertMemberSupabase(m: GuildMember): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const row = memberToDb(m);
  const { error } = await client.from("membros").upsert(row);
  if (error) throw error;
}

export async function deleteMemberSupabase(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.from("membros").delete().eq("id", id);
  if (error) throw error;
}

// ─── Lines ─────────────────────────────────────────────────────────────────────

export interface DbLine {
  id: string;
  nome: string;
  tag: string;
  status: "completa" | "buscando_rush" | "buscando_suporte" | "em_treino";
  horario_treino: string;
  capitao_nick: string | null;
  slots: GuildLineSlot[];
  created_at?: string;
}

export function dbToLine(db: DbLine): GuildLine {
  return {
    id: db.id,
    nome: db.nome,
    tag: db.tag,
    status: db.status,
    horarioTreino: db.horario_treino,
    capitaoNick: db.capitao_nick || undefined,
    slots: Array.isArray(db.slots) ? db.slots : [],
  };
}

export function lineToDb(l: GuildLine): DbLine {
  return {
    id: l.id,
    nome: l.nome,
    tag: l.tag,
    status: l.status,
    horario_treino: l.horarioTreino,
    capitao_nick: l.capitaoNick || null,
    slots: l.slots,
  };
}

export async function fetchLinesSupabase(): Promise<GuildLine[] | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("lines")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data || []) as DbLine[]).map(dbToLine);
}

export async function upsertLineSupabase(l: GuildLine): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const row = lineToDb(l);
  const { error } = await client.from("lines").upsert(row);
  if (error) throw error;
}

export async function deleteLineSupabase(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.from("lines").delete().eq("id", id);
  if (error) throw error;
}

// ─── Warnings / Advertências ──────────────────────────────────────────────────

export interface DbWarning {
  id: string;
  member_id: string;
  member_nick: string;
  member_id_conta: string | null;
  motivo: string;
  descricao: string | null;
  grau: WarningGrau;
  pontos: number;
  data: string;
  aplicada_por: string;
  status: WarningStatus;
  data_revogacao: string | null;
  motivo_revogacao: string | null;
  created_at?: string;
}

export function dbToWarning(db: DbWarning): GuildWarning {
  return {
    id: db.id,
    memberId: db.member_id,
    memberNick: db.member_nick,
    memberIdConta: db.member_id_conta || undefined,
    motivo: db.motivo,
    descricao: db.descricao || undefined,
    grau: db.grau,
    pontos: db.pontos,
    data: db.data,
    aplicadaPor: db.aplicada_por,
    status: db.status,
    dataRevogacao: db.data_revogacao || undefined,
    motivoRevogacao: db.motivo_revogacao || undefined,
  };
}

export function warningToDb(w: GuildWarning): DbWarning {
  return {
    id: w.id,
    member_id: w.memberId,
    member_nick: w.memberNick,
    member_id_conta: w.memberIdConta || null,
    motivo: w.motivo,
    descricao: w.descricao || null,
    grau: w.grau,
    pontos: w.pontos,
    data: w.data,
    aplicada_por: w.aplicadaPor,
    status: w.status,
    data_revogacao: w.dataRevogacao || null,
    motivo_revogacao: w.motivoRevogacao || null,
  };
}

export async function fetchWarningsSupabase(): Promise<GuildWarning[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("advertencias")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Tabela advertencias não encontrada ou inacessível no Supabase:", error.message);
      return null;
    }
    return ((data || []) as DbWarning[]).map(dbToWarning);
  } catch (err) {
    console.warn("Falha ao buscar advertencias do Supabase:", err);
    return null;
  }
}

export async function upsertWarningSupabase(w: GuildWarning): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    const row = warningToDb(w);
    const { error } = await client.from("advertencias").upsert(row);
    if (error) {
      console.warn("Supabase upsertWarning falhou:", error.message);
    }
  } catch (err) {
    console.warn("Erro ao salvar advertência no Supabase:", err);
  }
}

export async function deleteWarningSupabase(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    const { error } = await client.from("advertencias").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteWarning falhou:", error.message);
    }
  } catch (err) {
    console.warn("Erro ao deletar advertência no Supabase:", err);
  }
}

