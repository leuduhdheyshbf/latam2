import { z } from "zod";
import { insertCandidateSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const GUILD_NAME = "LATAM";
export const GUILD_MARK = "友";
export const GUILD_TAGLINE = "Foco total na partida sem ter medo de perder";

export const PILLARS = [
  { title: "Disciplina", body: "Foco total na partida sem ter medo de perder." },
  { title: "Equipe", body: "Jogamos juntos, vencemos juntos." },
  { title: "Evolução", body: "Melhoramos a cada rodada." },
  { title: "Respeito", body: "Tratamento justo e direto com todos." },
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Preencha o formulário",
    body: "Dados reais, nick, ID da conta e disponibilidade. Leva menos de dois minutos.",
  },
  {
    step: "02",
    title: "Análise da liderança",
    body: "Avaliamos patente, função e se o perfil encaixa no jeito da LATAM 友.",
  },
  {
    step: "03",
    title: "Chamada no WhatsApp",
    body: "Se for aprovado, a liderança entra em contato e te coloca no time.",
  },
] as const;

export const REQUIREMENTS = [
  "Idade entre 12 e 80 anos",
  "ID da conta Free Fire válido",
  "Informações verdadeiras — a gente confere",
  "Disponibilidade mínima para jogar com a equipe",
  "Sem toxicidade. Respeito é regra, não pedido",
] as const;

export const FUNCOES = [
  { value: "rush", label: "Rush", desc: "Linha de frente e invasão agressiva", badge: "Ataque" },
  { value: "suporte", label: "Suporte", desc: "Cobertura, visão e resgate de equipe", badge: "Tático" },
  { value: "fuzileiro", label: "Fuzileiro", desc: "Precisão e dano contínuo à distância", badge: "Dano" },
  { value: "granadeiro", label: "Granadeiro", desc: "Explosivos táticos, gel e quebra de formação", badge: "Explosivo" },
  { value: "full_gas", label: "Full Gás", desc: "Sobrevivência, rotação e pontuação estratégica", badge: "Gás" },
  { value: "cura", label: "Cura", desc: "Sustentação médica e suporte de recursos", badge: "Suporte" },
  { value: "flexivel", label: "Flexível", desc: "Adaptação rápida a qualquer papel da call", badge: "Coringa" },
] as const;

export const PATENTES_LATAM = [
  { value: "ouro_platina", label: "Ouro–Platina", desc: "Evoluindo nas ranqueadas", tier: "Ouro/Platina" },
  { value: "platina_diamente", label: "Platina–Diamante", desc: "Domínio de rotação e trocação", tier: "Diamante" },
  { value: "diamente_mestre", label: "Diamante–Mestre de Honra", desc: "Patente alta com leitura de jogo", tier: "Mestre" },
  { value: "elite", label: "Elite+", desc: "Topo do ranking competitivo", tier: "Elite" },
  { value: "outra", label: "Outra", desc: "Iniciando a jornada ou retorno ao jogo", tier: "Casual" },
] as const;

export const SIM_NAO = [
  { value: "sim", label: "Sim", desc: "Já disputei treinos, guildas ou campeonatos" },
  { value: "nao", label: "Não", desc: "Buscando minha primeira guilda competitiva" },
] as const;

export const HORAS_DISPONIBILIDADE = [
  { value: "1-2h", label: "1–2 horas", desc: "Tempo focado para partidas diárias" },
  { value: "2-4h", label: "2–4 horas", desc: "Ideal para treinos e line-ups" },
  { value: "4+h", label: "4+ horas", desc: "Disponibilidade intensa e dedicação máxima" },
] as const;

export const FORM_STEPS = [
  {
    id: "jogador",
    title: "Jogador",
    heading: "Quem é você",
    copy: "Dados da conta e da pessoa por trás do nick.",
    fields: ["nome", "idade", "nick", "idConta", "cidadeEstado", "whatsapp"] as const,
  },
  {
    id: "perfil",
    title: "Perfil",
    heading: "Como você joga",
    copy: "Função, patente e se já rodou competitivo.",
    fields: ["funcao", "patenteAtual", "experienciaCompetitiva"] as const,
  },
  {
    id: "agenda",
    title: "Agenda",
    heading: "Quando você joga",
    copy: "A liderança usa isso para montar treinos.",
    fields: ["tempoDisponivel", "horarioDisponivel"] as const,
  },
] as const;

const required = (message: string) => z.string().trim().min(1, message);

const oneOf = (options: readonly { value: string }[], message: string) =>
  required(message).refine((value) => options.some((option) => option.value === value), message);

function isValidSchedule(value: string): boolean {
  const text = value.trim();
  if (text.length < 2 || text.length > 80) return false;
  return /[a-zA-Z0-9À-ÿ]/.test(text);
}

export const step1Schema = z.object({
  nome: required("Informe seu nome")
    .min(2, "Informe seu nome completo")
    .regex(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u, "O nome deve conter apenas letras e espaços"),
  idade: required("Informe sua idade")
    .regex(/^\d{1,3}$/, "Informe uma idade válida")
    .refine((value) => {
      const age = Number(value);
      return age >= 12 && age <= 80;
    }, "A idade deve ser entre 12 e 80 anos"),
  nick: required("Informe seu nickname no jogo")
    .min(2, "Informe seu nickname")
    .max(30, "Nickname muito longo"),
  idConta: required("Informe o ID da sua conta").regex(
    /^\d{6,15}$/,
    "O ID da conta deve ter de 6 a 15 dígitos",
  ),
  cidadeEstado: required("Informe sua cidade/estado").min(3, "Informe cidade e estado").max(80, "Cidade/Estado muito longo"),
  whatsapp: required("Informe seu WhatsApp")
    .regex(/^[+\d\s().-]+$/, "Informe apenas um número de WhatsApp válido")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }, "Informe um WhatsApp válido"),
});

export const step2Schema = z.object({
  funcao: oneOf(FUNCOES, "Selecione uma função válida"),
  patenteAtual: oneOf(PATENTES_LATAM, "Selecione uma patente válida"),
  experienciaCompetitiva: oneOf(SIM_NAO, "Selecione uma opção válida"),
  experienciaDescricao: z.string().trim().max(800, "Descrição muito longa").optional(),
});

export const step3Schema = z.object({
  tempoDisponivel: oneOf(HORAS_DISPONIBILIDADE, "Selecione uma disponibilidade válida"),
  horarioDisponivel: required("Informe seu horário disponível para jogar")
    .max(80, "Horário muito longo")
    .refine(isValidSchedule, "Informe horários válidos, por exemplo: 19h às 23h"),
});

export const recruitmentSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema] as const;

export type RecruitmentInput = z.input<typeof recruitmentSchema>;
export type RecruitmentValues = z.output<typeof recruitmentSchema>;

export const defaultValues: RecruitmentInput = {
  nome: "",
  idade: "",
  nick: "",
  idConta: "",
  cidadeEstado: "",
  whatsapp: "",
  funcao: "",
  patenteAtual: "",
  experienciaCompetitiva: "",
  experienciaDescricao: "",
  tempoDisponivel: "",
  horarioDisponivel: "",
};

export const DRAFT_KEY = "latam-recruitment-draft";

export function loadDraft(): RecruitmentInput {
  if (typeof window === "undefined") return defaultValues;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return defaultValues;
    const parsed = JSON.parse(raw) as Partial<RecruitmentInput>;
    return { ...defaultValues, ...parsed };
  } catch {
    return defaultValues;
  }
}

export function saveDraft(values: RecruitmentInput) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  } catch {
    /* quota / private mode */
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function labelOf(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function formatApplicationMessage(values: RecruitmentValues): string {
  return [
    `*${GUILD_NAME} — Candidatura*`,
    "",
    "*Dados do jogador*",
    `Nome: ${values.nome}`,
    `Idade: ${values.idade}`,
    `Cidade/Estado: ${values.cidadeEstado}`,
    `Nickname: ${values.nick}`,
    `ID da conta: ${values.idConta}`,
    `WhatsApp: ${values.whatsapp}`,
    "",
    "*Perfil no jogo*",
    `Função: ${labelOf(FUNCOES, values.funcao)}`,
    `Patente atual: ${labelOf(PATENTES_LATAM, values.patenteAtual)}`,
    `Experiência competitiva: ${labelOf(SIM_NAO, values.experienciaCompetitiva)}`,
    values.experienciaDescricao ? `Descrição: ${values.experienciaDescricao}` : "",
    "",
    "*Disponibilidade*",
    `Tempo por dia: ${labelOf(HORAS_DISPONIBILIDADE, values.tempoDisponivel)}`,
    `Horário: ${values.horarioDisponivel}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const FIELD_LABELS: Record<keyof RecruitmentValues, string> = {
  nome: "Nome",
  idade: "Idade",
  nick: "Nickname do jogo",
  idConta: "ID da conta",
  cidadeEstado: "Cidade/Estado",
  whatsapp: "WhatsApp",
  funcao: "Principal função",
  patenteAtual: "Patente atual",
  experienciaCompetitiva: "Experiência em competitivo",
  experienciaDescricao: "Descrição da experiência",
  tempoDisponivel: "Tempo disponível por dia",
  horarioDisponivel: "Horário disponível",
};

export function displayValue(key: keyof RecruitmentValues, values: RecruitmentValues): string {
  switch (key) {
    case "funcao":
      return labelOf(FUNCOES, values.funcao);
    case "patenteAtual":
      return labelOf(PATENTES_LATAM, values.patenteAtual);
    case "experienciaCompetitiva":
      return labelOf(SIM_NAO, values.experienciaCompetitiva);
    case "tempoDisponivel":
      return labelOf(HORAS_DISPONIBILIDADE, values.tempoDisponivel);
    default:
      return values[key] ?? "";
  }
}

const RECRUITMENT_API_URL = import.meta.env.VITE_RECRUITMENT_API_URL;

export async function submitRecruitment(values: RecruitmentValues): Promise<void> {
  const payload = {
    nome: values.nome,
    idade: values.idade,
    nick: values.nick,
    idConta: values.idConta,
    cidadeEstado: values.cidadeEstado,
    whatsapp: values.whatsapp,
    funcao: values.funcao,
    patenteAtual: values.patenteAtual,
    experienciaCompetitiva: values.experienciaCompetitiva,
    experienciaDescricao: values.experienciaDescricao ?? "",
    tempoDisponivel: values.tempoDisponivel,
    horarioDisponivel: values.horarioDisponivel,
    website: "",
  };

  // 1. Se o Supabase estiver configurado, envia diretamente para o banco
  if (isSupabaseConfigured) {
    try {
      await insertCandidateSupabase(values);
    } catch (err) {
      console.error("[Recruitment] Falha ao enviar para Supabase:", err);
      throw new Error(err instanceof Error ? err.message : "Erro ao salvar no banco Supabase.");
    }
  } else if (RECRUITMENT_API_URL) {
    // 2. Se houver uma API webhook alternativa configurada
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(RECRUITMENT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "O servidor recusou os dados. Confira o formulário.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Tempo esgotado. Confira a conexão e tente de novo.");
      }
      throw new Error("Erro ao enviar. Tente novamente em instantes.");
    } finally {
      window.clearTimeout(timer);
    }
  }

  // 3. Salva cópia local para visualização instantânea no Painel do Administrador (Sou ADM)
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("latam-admin-candidates") || "[]");
      const newRecord = {
        ...payload,
        id: `cand-${Date.now()}`,
        submittedAt: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "pendente",
      };
      localStorage.setItem("latam-admin-candidates", JSON.stringify([newRecord, ...existing]));
    } catch {
      /* ignore */
    }
  }
}

