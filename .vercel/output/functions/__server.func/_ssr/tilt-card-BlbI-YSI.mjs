import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Volume2, r as VolumeX } from "../_libs/lucide-react.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { i as useMotionValue, n as useSpring, r as useTransform } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tilt-card-BlbI-YSI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/**
* Efeitos sonoros táticos sintetizados via Web Audio API (Zero assets externos).
*/
var audioCtx = null;
var isMuted = false;
if (typeof window !== "undefined") try {
	isMuted = localStorage.getItem("latam-sfx-muted") === "true";
} catch {
	isMuted = false;
}
function getAudioContext() {
	if (typeof window === "undefined") return null;
	if (!audioCtx) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (AudioContextClass) audioCtx = new AudioContextClass();
	}
	if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
	return audioCtx;
}
function isSoundMuted() {
	return isMuted;
}
function toggleSound() {
	isMuted = !isMuted;
	if (typeof window !== "undefined") try {
		localStorage.setItem("latam-sfx-muted", String(isMuted));
	} catch {}
	if (!isMuted) playSelectSound();
	return isMuted;
}
function playSelectSound() {
	if (isMuted) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(580, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + .06);
		gain.gain.setValueAtTime(.04, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .06);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .06);
	} catch {}
}
function playStepSound() {
	if (isMuted) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(420, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + .12);
		gain.gain.setValueAtTime(.06, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .12);
	} catch {}
}
function playSuccessSound() {
	if (isMuted) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const now = ctx.currentTime;
		[
			523.25,
			659.25,
			783.99,
			1046.5
		].forEach((freq, idx) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + idx * .08);
			gain.gain.setValueAtTime(.05, now + idx * .08);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .08 + .18);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + idx * .08);
			osc.stop(now + idx * .08 + .2);
		});
	} catch {}
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
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw new Error("Tempo esgotado. Confira a conexão e tente de novo.");
		throw new Error("Erro ao enviar. Tente novamente em instantes.");
	} finally {
		window.clearTimeout(timer);
	}
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "px-5 pb-16 pt-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rule-brand mx-auto mb-6 max-w-xs" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-2xl tracking-[0.16em] text-silver",
				children: [
					GUILD_NAME,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-normal text-accent",
						children: "友"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: GUILD_TAGLINE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-subtle",
				children: [GUILD_NAME, " · Recrutamento Free Fire"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs tracking-[0.12em] text-muted-foreground",
				children: "by Souza"
			})
		]
	});
}
function SiteHeader() {
	const [muted, setMuted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMuted(isSoundMuted());
	}, []);
	function handleToggleAudio() {
		const next = toggleSound();
		setMuted(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "site-header backdrop-blur-md bg-background/85",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-5xl items-center justify-between px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 no-underline group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/latam-mark.webp",
					alt: "Brasão LATAM 友",
					width: 32,
					height: 32,
					className: "size-8 transition-transform duration-200 group-hover:scale-105",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-xl tracking-[0.14em] text-silver group-hover:text-white transition-colors",
					children: [
						GUILD_NAME,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tracking-normal text-accent",
							children: "友"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-silver transition-colors [&.active]:text-accent",
						children: "Início"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/candidatura",
						className: "hover:text-silver transition-colors [&.active]:text-accent",
						children: "Candidatar-se"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleToggleAudio,
					"aria-label": muted ? "Ativar som de efeitos" : "Mutar som de efeitos",
					title: muted ? "Som desativado (Clique para ativar)" : "Som ativado (Clique para mutar)",
					className: "flex size-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-muted-foreground hover:bg-white/8 hover:text-silver transition-colors",
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-accent" })
				})]
			})]
		})
	});
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
//#endregion
export { playSuccessSound as C, submitRecruitment as E, playStepSound as S, saveDraft as T, defaultValues as _, GUILD_TAGLINE as a, loadDraft as b, PILLARS as c, SIM_NAO as d, SiteFooter as f, cn as g, clearDraft as h, GUILD_NAME as i, PROCESS as l, TiltCard as m, FORM_STEPS as n, HORAS_DISPONIBILIDADE as o, SiteHeader as p, FUNCOES as r, PATENTES_LATAM as s, FIELD_LABELS as t, REQUIREMENTS as u, displayValue as v, recruitmentSchema as w, playSelectSound as x, formatApplicationMessage as y };
