import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, D as Clock, E as Copy, N as ArrowRight, O as CircleCheck, P as ArrowLeft, S as Flame, T as Crosshair, _ as MessageCircle, a as Users, b as HeartPulse, f as Shield, h as RotateCcw, j as Award, m as Send, n as Wind, p as ShieldCheck, s as Trophy, t as Zap, v as LoaderCircle, w as Crown, x as Gem, y as Layers } from "../_libs/lucide-react.mjs";
import { o as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as playSuccessSound, E as submitRecruitment, S as playStepSound, T as saveDraft, _ as defaultValues, b as loadDraft, d as SIM_NAO, f as SiteFooter, g as cn, h as clearDraft, i as GUILD_NAME, m as TiltCard, n as FORM_STEPS, o as HORAS_DISPONIBILIDADE, p as SiteHeader, r as FUNCOES, s as PATENTES_LATAM, t as FIELD_LABELS, v as displayValue, w as recruitmentSchema, x as playSelectSound, y as formatApplicationMessage } from "./tilt-card-BlbI-YSI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidatura-BUTyytjU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("flex items-baseline gap-3 text-sm font-medium text-foreground", className),
		...props
	});
}
function Field({ number, label, htmlFor, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-2", error && "field-has-error"),
		"data-error": error ? "true" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg leading-none tracking-wide text-accent",
					children: String(number).padStart(2, "0")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				role: "alert",
				children: error
			}) : null
		]
	});
}
function SectionCard({ id, eyebrow, title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "section-card scroll-mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "section-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-5",
					strokeWidth: 1.75
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-accent uppercase",
				children: eyebrow
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-1 text-3xl tracking-wide text-silver text-balance",
				children: title
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-5",
			children
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,box-shadow,color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-foreground shadow-accent hover:bg-accent-hover",
			secondary: "bg-card text-foreground shadow-border hover:shadow-border-hover",
			ghost: "bg-transparent text-muted-foreground hover:text-foreground"
		},
		size: {
			default: "min-h-11 rounded-md px-5 text-sm",
			lg: "min-h-12 rounded-lg px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		suppressHydrationWarning: true,
		className: cn("field-control", className),
		...props
	});
}
var ICONS_BY_VALUE = {
	rush: Zap,
	suporte: ShieldCheck,
	fuzileiro: Crosshair,
	granadeiro: Flame,
	full_gas: Wind,
	cura: HeartPulse,
	flexivel: Layers,
	ouro_platina: Award,
	platina_diamente: Gem,
	diamente_mestre: Flame,
	elite: Crown,
	outra: Shield
};
function getBadgeStyle(badge, tier, selected) {
	if (tier === "Mestre") return "bg-gradient-to-r from-red-600/25 to-amber-600/25 text-amber-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)]";
	if (tier === "Elite") return "bg-gradient-to-r from-purple-600/25 to-pink-600/25 text-pink-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]";
	if (tier === "Diamante") return "bg-gradient-to-r from-cyan-600/25 to-blue-600/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]";
	if (tier === "Ouro/Platina") return "bg-gradient-to-r from-yellow-600/25 to-amber-600/25 text-yellow-300 border border-yellow-500/40";
	if (badge === "Ataque") return "bg-red-500/15 text-red-400 border border-red-500/30";
	if (badge === "Tático") return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
	if (badge === "Dano") return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
	if (badge === "Explosivo") return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
	if (badge === "Gás") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
	if (badge === "Coringa") return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
	return selected ? "bg-accent/20 text-accent border border-accent/30" : "bg-white/5 text-subtle border border-white/5";
}
function OptionCards({ name, value, options, onChange, columns = "two" }) {
	function handleSelect(val) {
		playSelectSound();
		onChange(val);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "radiogroup",
		"aria-label": name,
		className: cn("grid gap-2.5 [perspective:1000px]", columns === "stack" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"),
		children: options.map((option) => {
			const selected = value === option.value;
			const Icon = ICONS_BY_VALUE[option.value];
			const tagText = option.badge || option.tier;
			const badgeClasses = getBadgeStyle(option.badge, option.tier, selected);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": selected,
				className: cn("option-card group relative flex items-start gap-3 p-3.5 text-left transition-all duration-200 rounded-xl", selected ? "option-card-selected shadow-[0_10px_24px_-4px_rgba(0,180,255,0.35)]" : "hover:-translate-y-0.5"),
				onClick: () => handleSelect(option.value),
				children: [
					Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex size-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200", selected ? "bg-accent/25 text-accent shadow-[0_0_16px_rgba(0,180,255,0.4)] scale-105" : "bg-white/4 text-muted-foreground group-hover:bg-white/8 group-hover:text-silver"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("option-dot mt-1", selected && "option-dot-selected"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-2.5",
							strokeWidth: 3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 pr-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-medium text-sm leading-tight", selected ? "text-white font-semibold" : "text-foreground"),
								children: option.label
							}), tagText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors", badgeClasses),
								children: tagText
							}) : null]
						}), option.desc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-normal text-muted-foreground group-hover:text-silver/90",
							children: option.desc
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("option-dot absolute top-3.5 right-3.5 transition-all duration-200", selected ? "option-dot-selected scale-110" : "opacity-40 group-hover:opacity-75"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-2.5",
							strokeWidth: 3
						})
					})
				]
			}, option.value);
		})
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		suppressHydrationWarning: true,
		className: cn("field-control field-textarea", className),
		...props
	});
}
/**
* Utilitários de máscara e formatação para o formulário da LATAM 友
*/
function maskPhone(value) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	if (!digits) return "";
	if (digits.length <= 2) return `(${digits}`;
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
function maskPlayerId(value) {
	return value.replace(/\D/g, "").slice(0, 12);
}
var ease = [
	.22,
	1,
	.36,
	1
];
function RecruitmentForm({ onSubmitted }) {
	const reduce = useReducedMotion();
	const [step, setStep] = (0, import_react.useState)(0);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const { register, control, handleSubmit, setValue, trigger, watch, reset, formState: { errors, isSubmitting } } = useForm({
		resolver: u(recruitmentSchema),
		defaultValues,
		mode: "onSubmit",
		shouldUnregister: false
	});
	const values = watch();
	(0, import_react.useEffect)(() => {
		reset(loadDraft());
		setHydrated(true);
	}, [reset]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		saveDraft(values);
	}, [hydrated, values]);
	function onInvalid() {
		requestAnimationFrame(() => {
			document.querySelector("[data-error='true']")?.scrollIntoView({
				behavior: reduce ? "auto" : "smooth",
				block: "center"
			});
		});
	}
	async function goNext() {
		const fields = [...FORM_STEPS[step].fields];
		if (!await trigger(fields)) {
			onInvalid();
			return;
		}
		playStepSound();
		setStep((current) => Math.min(current + 1, FORM_STEPS.length - 1));
	}
	function goBack() {
		playStepSound();
		setStep((current) => Math.max(current - 1, 0));
	}
	const progress = (step + 1) / FORM_STEPS.length;
	const current = FORM_STEPS[step];
	const isValidId = values.idConta && values.idConta.length >= 8 && values.idConta.length <= 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		id: "formulario",
		className: "mx-auto flex w-full max-w-xl flex-col gap-5 px-5 pb-20 pt-8",
		onSubmit: (event) => {
			if (step < FORM_STEPS.length - 1) {
				event.preventDefault();
				goNext();
				return;
			}
			handleSubmit(onSubmitted, onInvalid)(event);
		},
		noValidate: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex size-2 rounded-full bg-accent animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-[0.18em] text-accent uppercase",
						children: "Recrutamento Oficial"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-4xl tracking-wide text-silver",
					children: current.heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: current.copy
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-medium tracking-wide text-subtle uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Passo ",
							String(step + 1).padStart(2, "0"),
							" de ",
							String(FORM_STEPS.length).padStart(2, "0")
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-silver font-semibold",
							children: current.title
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "progress-track",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "progress-fill",
							style: { transform: `scaleX(${progress})` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex gap-2",
						children: FORM_STEPS.map((item, index) => {
							const isDone = index < step;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: index > step,
									onClick: () => {
										if (index < step) {
											playStepSound();
											setStep(index);
										}
									},
									className: cn("flex items-center justify-center gap-1.5 w-full rounded-md py-2 text-center text-[11px] font-semibold tracking-wide uppercase transition-all duration-150", index === step ? "bg-accent/15 text-accent shadow-[0_0_12px_rgba(0,180,255,0.2)]" : isDone ? "bg-white/5 text-silver hover:bg-white/10" : "text-subtle"),
									children: [isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-3 text-accent",
										strokeWidth: 3
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
								})
							}, item.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				initial: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: reduce ? false : {
						opacity: 0,
						x: 16,
						filter: "blur(4px)"
					},
					animate: {
						opacity: 1,
						x: 0,
						filter: "blur(0px)"
					},
					exit: reduce ? void 0 : {
						opacity: 0,
						x: -12,
						filter: "blur(4px)"
					},
					transition: {
						duration: reduce ? 0 : .28,
						ease
					},
					children: [
						step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							id: "dados",
							eyebrow: "01",
							title: "Informações do jogador",
							icon: Users,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 1,
									label: "Nome",
									htmlFor: "nome",
									error: errors.nome?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "nome",
										autoComplete: "name",
										placeholder: "Seu nome completo",
										...register("nome")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 2,
									label: "Idade",
									htmlFor: "idade",
									error: errors.idade?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "idade",
										inputMode: "numeric",
										maxLength: 3,
										placeholder: "Sua idade (ex: 18)",
										...register("idade", { onChange: (event) => {
											const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
											setValue("idade", digits, { shouldValidate: false });
										} })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 3,
									label: "Nickname no Free Fire",
									htmlFor: "nick",
									error: errors.nick?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "nick",
										placeholder: "Seu nick exato no jogo",
										...register("nick")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 4,
									label: "ID da conta",
									htmlFor: "idConta",
									error: errors.idConta?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "idConta",
											inputMode: "numeric",
											maxLength: 12,
											placeholder: "ID numérico da sua conta FF",
											...register("idConta", { onChange: (event) => {
												const digits = maskPlayerId(event.target.value);
												setValue("idConta", digits, { shouldValidate: false });
											} })
										}), isValidId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full pointer-events-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "ID Válido"]
										}) : null]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 5,
									label: "Cidade / Estado",
									htmlFor: "cidadeEstado",
									error: errors.cidadeEstado?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "cidadeEstado",
										placeholder: "Ex: São Paulo - SP",
										...register("cidadeEstado")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 6,
									label: "WhatsApp (com DDD)",
									htmlFor: "whatsapp",
									error: errors.whatsapp?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "whatsapp",
										type: "tel",
										inputMode: "tel",
										autoComplete: "tel",
										placeholder: "Ex: (11) 99999-9999",
										...register("whatsapp", { onChange: (event) => {
											const masked = maskPhone(event.target.value);
											setValue("whatsapp", masked, { shouldValidate: false });
										} })
									})
								})
							]
						}) : null,
						step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							id: "perfil",
							eyebrow: "02",
							title: "Perfil no jogo",
							icon: Trophy,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 7,
									label: "Qual sua principal função?",
									htmlFor: "funcao",
									error: errors.funcao?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
										name: "funcao",
										control,
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCards, {
											name: field.name,
											value: field.value,
											onChange: field.onChange,
											options: FUNCOES
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 8,
									label: "Qual sua patente atual?",
									htmlFor: "patenteAtual",
									error: errors.patenteAtual?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
										name: "patenteAtual",
										control,
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCards, {
											name: field.name,
											value: field.value,
											onChange: field.onChange,
											options: PATENTES_LATAM
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									number: 9,
									label: "Já teve experiência em competitivo, guildas ou campeonatos?",
									error: errors.experienciaCompetitiva?.message,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
										name: "experienciaCompetitiva",
										control,
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCards, {
											name: field.name,
											value: field.value,
											onChange: field.onChange,
											options: SIM_NAO,
											columns: "stack"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: values.experienciaCompetitiva === "sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: {
										opacity: 0,
										height: 0
									},
									animate: {
										opacity: 1,
										height: "auto"
									},
									exit: {
										opacity: 0,
										height: 0
									},
									transition: { duration: .25 },
									className: "overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
										number: 10,
										label: "Conte brevemente sua experiência competitiva",
										htmlFor: "experienciaDescricao",
										error: errors.experienciaDescricao?.message,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "experienciaDescricao",
											rows: 3,
											maxLength: 800,
											placeholder: "Campeonatos disputados, guildas anteriores, line-ups, funções...",
											...register("experienciaDescricao")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-subtle",
												children: [(values.experienciaDescricao || "").length, "/800 caracteres"]
											})
										})]
									})
								}) : null })
							]
						}) : null,
						step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							id: "disponibilidade",
							eyebrow: "03",
							title: "Disponibilidade",
							icon: Clock,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								number: 11,
								label: "Quanto tempo você costuma ficar disponível para jogar por dia?",
								error: errors.tempoDisponivel?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
									name: "tempoDisponivel",
									control,
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionCards, {
										name: field.name,
										value: field.value,
										onChange: field.onChange,
										options: HORAS_DISPONIBILIDADE,
										columns: "stack"
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								number: 12,
								label: "Qual seu horário normalmente disponível para jogar?",
								htmlFor: "horarioDisponivel",
								error: errors.horarioDisponivel?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "horarioDisponivel",
									placeholder: "Ex: 19h às 23h (Treinos e Ranqueadas)",
									...register("horarioDisponivel")
								})
							})]
						}) : null
					]
				}, current.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "submit-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5 sm:flex-row",
					children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						size: "lg",
						className: "w-full sm:w-auto",
						onClick: goBack,
						disabled: isSubmitting,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Voltar"]
					}) : null, step < FORM_STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "lg",
						className: "w-full flex-1",
						onClick: goNext,
						children: ["Continuar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						className: "w-full flex-1",
						disabled: isSubmitting,
						children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), isSubmitting ? "Enviando para a liderança..." : "Enviar candidatura"]
					})]
				}), step === FORM_STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-xs leading-normal text-muted-foreground",
					children: "Ao enviar, seus dados serão encaminhados para a liderança da LATAM 友."
				}) : null]
			})
		]
	});
}
var SUMMARY_KEYS = [
	"nome",
	"idade",
	"cidadeEstado",
	"nick",
	"idConta",
	"whatsapp",
	"funcao",
	"patenteAtual",
	"experienciaCompetitiva",
	"experienciaDescricao",
	"tempoDisponivel",
	"horarioDisponivel"
];
function SuccessView({ values, onReset }) {
	const reduce = useReducedMotion();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const message = formatApplicationMessage(values);
	(0, import_react.useEffect)(() => {
		playSuccessSound();
	}, []);
	async function copyMessage() {
		try {
			await navigator.clipboard.writeText(message);
			setCopied(true);
			toast.success("Ficha da candidatura copiada!");
			setTimeout(() => setCopied(false), 2500);
		} catch {
			toast.error("Não foi possível copiar automaticamente. Selecione e copie o texto abaixo.");
		}
	}
	const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
	const protocolId = values.idConta ? `LATAM-${values.idConta.slice(-4)}${Math.floor(100 + Math.random() * 900)}` : `LATAM-${Date.now().toString().slice(-6)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "formulario",
		className: "mx-auto w-full max-w-xl px-5 pb-20 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "section-card text-center relative overflow-hidden",
				initial: reduce ? false : {
					opacity: 0,
					y: 14,
					filter: "blur(4px)"
				},
				animate: {
					opacity: 1,
					y: 0,
					filter: "blur(0px)"
				},
				transition: { duration: .4 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-16 left-1/2 -translate-x-1/2 size-40 bg-accent/20 rounded-full blur-3xl pointer-events-none",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "success-mark mx-auto shadow-[0_0_24px_rgba(0,180,255,0.35)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-7",
							strokeWidth: 2.5
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-4 text-4xl tracking-wide text-silver",
						children: "Candidatura Registrada!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-2 max-w-md text-sm leading-normal text-muted-foreground",
						children: [
							"Sua ficha foi salva e enviada. A liderança da ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-silver",
								children: [
									GUILD_NAME,
									" ",
									"友"
								]
							}),
							" irá avaliar suas informações e chamar no WhatsApp."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col sm:flex-row gap-2.5 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: whatsappUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 font-medium min-h-11 rounded-lg px-5 text-sm bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-150 active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4.5" }), "Enviar Ficha no WhatsApp"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "default",
							className: "min-h-11 text-sm",
							onClick: copyMessage,
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copiado!" : "Copiar Ficha"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiltCard, {
				maxTilt: 14,
				glareOpacity: .3,
				className: "mt-6 rounded-2xl p-[1.5px] holographic-foil shadow-[0_20px_45px_rgba(0,0,0,0.65)] cursor-grab active:cursor-grabbing select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[15px] bg-gradient-to-b from-[#131c2a] via-[#0c121b] to-[#070a0f] p-5 relative overflow-hidden backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/latam-mark.webp",
							alt: "",
							className: "absolute -right-6 -bottom-6 size-36 opacity-10 pointer-events-none select-none",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3.5 border-b border-white/8 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-xl tracking-[0.14em] text-silver",
									children: [
										GUILD_NAME,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-accent",
											children: "友"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 shadow-[0_0_8px_rgba(0,180,255,0.2)]",
									children: ["Protocolo #", protocolId]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Em Análise"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase font-semibold tracking-wider text-accent",
									children: "Jogador Selecionado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-4xl tracking-wide text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]",
									children: values.nick
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-0.5 font-medium",
									children: [
										values.nome,
										" • ",
										values.cidadeEstado
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase font-semibold tracking-wider text-subtle",
									children: "ID Free Fire"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-lg font-bold text-accent tracking-wider drop-shadow-[0_0_10px_rgba(0,180,255,0.4)]",
									children: values.idConta
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/8 relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase font-semibold text-subtle tracking-wide",
										children: "Função"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-silver tracking-wide mt-0.5",
										children: displayValue("funcao", values)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase font-semibold text-subtle tracking-wide",
										children: "Patente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-silver tracking-wide mt-0.5",
										children: displayValue("patenteAtual", values)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase font-semibold text-subtle tracking-wide",
										children: "Tempo Diário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-silver tracking-wide mt-0.5",
										children: displayValue("tempoDisponivel", values)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase font-semibold text-subtle tracking-wide",
										children: "Competitivo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-silver tracking-wide mt-0.5",
										children: displayValue("experienciaCompetitiva", values)
									})]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-wider text-subtle uppercase px-1 mb-2",
					children: "Resumo Completo dos Dados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "summary-list",
					children: SUMMARY_KEYS.filter((key) => key !== "experienciaDescricao" || values.experienciaDescricao).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "summary-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: FIELD_LABELS[key] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: displayValue(key, values) })]
					}, key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: onReset,
					className: "text-muted-foreground hover:text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Preencher outro formulário"]
				})
			})
		]
	});
}
function Candidatura() {
	const [submitted, setSubmitted] = (0, import_react.useState)(null);
	const [submitError, setSubmitError] = (0, import_react.useState)(null);
	async function handleSubmit(values) {
		setSubmitError(null);
		try {
			await submitRecruitment(values);
			clearDraft();
			setSubmitted(values);
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Erro ao enviar formulário. Tente novamente.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-bg min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessView, {
				values: submitted,
				onReset: () => setSubmitted(null)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .4 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentForm, { onSubmitted: handleSubmit })
			}),
			submitError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "fixed top-16 left-1/2 z-50 max-w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-destructive px-4 py-2 text-center text-sm text-background shadow-lg",
				children: submitError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Candidatura as component };
