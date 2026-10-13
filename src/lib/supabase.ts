import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RecruitmentValues } from "@/lib/recruitment";

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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!);
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
