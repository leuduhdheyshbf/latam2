import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { R as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as useMotionValue, n as useSpring, r as useTransform } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recruitment-DF6yoLIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function TiltCard({ children, className, maxTilt = 12, glareOpacity = .2, ...props }) {
	const cardRef = (0, import_react.useRef)(null);
	const x = useMotionValue(.5);
	const y = useMotionValue(.5);
	const springConfig = {
		damping: 25,
		stiffness: 220
	};
	const smoothX = useSpring(x, springConfig);
	const smoothY = useSpring(y, springConfig);
	const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
	const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
	const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
	const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);
	function handleMouseMove(e) {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const clientX = (e.clientX - rect.left) / rect.width;
		const clientY = (e.clientY - rect.top) / rect.height;
		x.set(Math.min(Math.max(clientX, 0), 1));
		y.set(Math.min(Math.max(clientY, 0), 1));
	}
	function handleMouseLeave() {
		x.set(.5);
		y.set(.5);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		ref: cardRef,
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		style: {
			transformStyle: "preserve-3d",
			rotateX,
			rotateY
		},
		className: cn("relative transform-gpu transition-shadow duration-300", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300 opacity-0 group-hover:opacity-100",
			style: {
				background: `radial-gradient(circle 280px at 50% 50%, rgba(255,255,255,${glareOpacity}), transparent 80%)`,
				left: useTransform(glareX, (val) => `calc(${val} - 140px)`),
				top: useTransform(glareY, (val) => `calc(${val} - 140px)`),
				width: "280px",
				height: "280px"
			}
		}), children]
	});
}
var GUILD_NAME = "LATAM";
var GUILD_TAGLINE = "Foco total na partida sem ter medo de perder";
var PILLARS = [
	{
		title: "Disciplina",
		body: "Foco total na partida sem ter medo de perder."
	},
	{
		title: "Equipe",
		body: "Jogamos juntos, vencemos juntos."
	},
	{
		title: "Evolução",
		body: "Melhoramos a cada rodada."
	},
	{
		title: "Respeito",
		body: "Tratamento justo e direto com todos."
	}
];
var PROCESS = [
	{
		step: "01",
		title: "Preencha o formulário",
		body: "Dados reais, nick, ID da conta e disponibilidade. Leva menos de dois minutos."
	},
	{
		step: "02",
		title: "Análise da liderança",
		body: "Avaliamos patente, função e se o perfil encaixa no jeito da LATAM 友."
	},
	{
		step: "03",
		title: "Chamada no WhatsApp",
		body: "Se for aprovado, a liderança entra em contato e te coloca no time."
	}
];
var REQUIREMENTS = [
	"Idade entre 12 e 80 anos",
	"ID da conta Free Fire válido",
	"Informações verdadeiras — a gente confere",
	"Disponibilidade mínima para jogar com a equipe",
	"Sem toxicidade. Respeito é regra, não pedido"
];
var FUNCOES = [
	{
		value: "rush",
		label: "Rush",
		desc: "Linha de frente e invasão agressiva",
		badge: "Ataque"
	},
	{
		value: "suporte",
		label: "Suporte",
		desc: "Cobertura, visão e resgate de equipe",
		badge: "Tático"
	},
	{
		value: "fuzileiro",
		label: "Fuzileiro",
		desc: "Precisão e dano contínuo à distância",
		badge: "Dano"
	},
	{
		value: "granadeiro",
		label: "Granadeiro",
		desc: "Explosivos táticos, gel e quebra de formação",
		badge: "Explosivo"
	},
	{
		value: "full_gas",
		label: "Full Gás",
		desc: "Sobrevivência, rotação e pontuação estratégica",
		badge: "Gás"
	},
	{
		value: "cura",
		label: "Cura",
		desc: "Sustentação médica e suporte de recursos",
		badge: "Suporte"
	},
	{
		value: "flexivel",
		label: "Flexível",
		desc: "Adaptação rápida a qualquer papel da call",
		badge: "Coringa"
	}
];
var PATENTES_LATAM = [
	{
		value: "ouro_platina",
		label: "Ouro–Platina",
		desc: "Evoluindo nas ranqueadas",
		tier: "Ouro/Platina"
	},
	{
		value: "platina_diamente",
		label: "Platina–Diamante",
		desc: "Domínio de rotação e trocação",
		tier: "Diamante"
	},
	{
		value: "diamente_mestre",
		label: "Diamante–Mestre de Honra",
		desc: "Patente alta com leitura de jogo",
		tier: "Mestre"
	},
	{
		value: "elite",
		label: "Elite+",
		desc: "Topo do ranking competitivo",
		tier: "Elite"
	},
	{
		value: "outra",
		label: "Outra",
		desc: "Iniciando a jornada ou retorno ao jogo",
		tier: "Casual"
	}
];
var SIM_NAO = [{
	value: "sim",
	label: "Sim",
	desc: "Já disputei treinos, guildas ou campeonatos"
}, {
	value: "nao",
	label: "Não",
	desc: "Buscando minha primeira guilda competitiva"
}];
var HORAS_DISPONIBILIDADE = [
	{
		value: "1-2h",
		label: "1–2 horas",
		desc: "Tempo focado para partidas diárias"
	},
	{
		value: "2-4h",
		label: "2–4 horas",
		desc: "Ideal para treinos e line-ups"
	},
	{
		value: "4+h",
		label: "4+ horas",
		desc: "Disponibilidade intensa e dedicação máxima"
	}
];
var FORM_STEPS = [
	{
		id: "jogador",
		title: "Jogador",
		heading: "Quem é você",
		copy: "Dados da conta e da pessoa por trás do nick.",
		fields: [
			"nome",
			"idade",
			"nick",
			"idConta",
			"cidadeEstado",
			"whatsapp"
		]
	},
	{
		id: "perfil",
		title: "Perfil",
		heading: "Como você joga",
		copy: "Função, patente e se já rodou competitivo.",
		fields: [
			"funcao",
			"patenteAtual",
			"experienciaCompetitiva"
		]
	},
	{
		id: "agenda",
		title: "Agenda",
		heading: "Quando você joga",
		copy: "A liderança usa isso para montar treinos.",
		fields: ["tempoDisponivel", "horarioDisponivel"]
	}
];
var required = (message) => string().trim().min(1, message);
var oneOf = (options, message) => required(message).refine((value) => options.some((option) => option.value === value), message);
function isValidSchedule(value) {
	const text = value.trim().toLowerCase();
	if (!/^[\d\s:hàáâãéêíóôõúüç-]+$/i.test(text)) return false;
	const matches = [...text.matchAll(/(?:^|\D)(\d{1,2})(?::([0-5]\d))?\s*h?/g)];
	if (!matches.length) return false;
	return matches.every((match) => Number(match[1]) >= 0 && Number(match[1]) <= 23);
}
var recruitmentSchema = object({
	nome: required("Informe seu nome").min(2, "Informe seu nome completo").regex(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u, "O nome deve conter apenas letras e espaços"),
	idade: required("Informe sua idade").regex(/^\d{1,3}$/, "Informe uma idade válida").refine((value) => {
		const age = Number(value);
		return age >= 12 && age <= 80;
	}, "A idade deve ser entre 12 e 80 anos"),
	nick: required("Informe seu nickname no jogo").min(2, "Informe seu nickname").max(30, "Nickname muito longo"),
	idConta: required("Informe o ID da sua conta").regex(/^\d{6,15}$/, "O ID da conta deve ter de 6 a 15 dígitos"),
	cidadeEstado: required("Informe sua cidade/estado").min(3, "Informe cidade e estado").max(80, "Cidade/Estado muito longo"),
	whatsapp: required("Informe seu WhatsApp").regex(/^[+\d\s().-]+$/, "Informe apenas um número de WhatsApp válido").refine((value) => {
		const digits = value.replace(/\D/g, "");
		return digits.length >= 10 && digits.length <= 13;
	}, "Informe um WhatsApp válido"),
	funcao: oneOf(FUNCOES, "Selecione uma função válida"),
	patenteAtual: oneOf(PATENTES_LATAM, "Selecione uma patente válida"),
	experienciaCompetitiva: oneOf(SIM_NAO, "Selecione uma opção válida"),
	experienciaDescricao: string().trim().max(800, "Descrição muito longa").optional(),
	tempoDisponivel: oneOf(HORAS_DISPONIBILIDADE, "Selecione uma disponibilidade válida"),
	horarioDisponivel: required("Informe seu horário disponível para jogar").max(80, "Horário muito longo").refine(isValidSchedule, "Informe horários válidos, por exemplo: 19h às 23h")
});
var defaultValues = {
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
	horarioDisponivel: ""
};
var DRAFT_KEY = "latam-recruitment-draft";
function loadDraft() {
	if (typeof window === "undefined") return defaultValues;
	try {
		const raw = sessionStorage.getItem(DRAFT_KEY);
		if (!raw) return defaultValues;
		const parsed = JSON.parse(raw);
		return {
			...defaultValues,
			...parsed
		};
	} catch {
		return defaultValues;
	}
}
function saveDraft(values) {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
	} catch {}
}
function clearDraft() {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.removeItem(DRAFT_KEY);
	} catch {}
}
function labelOf(options, value) {
	return options.find((option) => option.value === value)?.label ?? value;
}
function formatApplicationMessage(values) {
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
		`Horário: ${values.horarioDisponivel}`
	].filter(Boolean).join("\n");
}
var FIELD_LABELS = {
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
	horarioDisponivel: "Horário disponível"
};
function displayValue(key, values) {
	switch (key) {
		case "funcao": return labelOf(FUNCOES, values.funcao);
		case "patenteAtual": return labelOf(PATENTES_LATAM, values.patenteAtual);
		case "experienciaCompetitiva": return labelOf(SIM_NAO, values.experienciaCompetitiva);
		case "tempoDisponivel": return labelOf(HORAS_DISPONIBILIDADE, values.tempoDisponivel);
		default: return values[key] ?? "";
	}
}
var RECRUITMENT_API_URL = "https://latam-api.nyxaria.workers.dev";
async function submitRecruitment(values) {
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
		website: ""
	};
	const controller = new AbortController();
	const timer = window.setTimeout(() => controller.abort(), 2e4);
	try {
		const response = await fetch(RECRUITMENT_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: controller.signal
		});
		const result = await response.json().catch(() => null);
		if (!response.ok || !result?.success) throw new Error(result?.error || "O servidor recusou os dados. Confira o formulário.");
		if (typeof window !== "undefined") try {
			const existing = JSON.parse(localStorage.getItem("latam-admin-candidates") || "[]");
			const newRecord = {
				...payload,
				id: `cand-${Date.now()}`,
				submittedAt: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit"
				}),
				status: "pendente"
			};
			localStorage.setItem("latam-admin-candidates", JSON.stringify([newRecord, ...existing]));
		} catch {}
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw new Error("Tempo esgotado. Confira a conexão e tente de novo.");
		throw new Error("Erro ao enviar. Tente novamente em instantes.");
	} finally {
		window.clearTimeout(timer);
	}
}
//#endregion
export { formatApplicationMessage as _, GUILD_TAGLINE as a, saveDraft as b, PILLARS as c, SIM_NAO as d, TiltCard as f, displayValue as g, defaultValues as h, GUILD_NAME as i, PROCESS as l, cn as m, FORM_STEPS as n, HORAS_DISPONIBILIDADE as o, clearDraft as p, FUNCOES as r, PATENTES_LATAM as s, FIELD_LABELS as t, REQUIREMENTS as u, loadDraft as v, submitRecruitment as x, recruitmentSchema as y };
