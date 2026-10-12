import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, C as FilePen, F as ArrowDown, M as ArrowUp, N as ArrowRight, a as Users, d as Swords, f as Shield, g as MessageSquare, k as CircleAlert, l as TrendingUp, o as UserCheck, p as ShieldCheck, t as Zap, u as Target } from "../_libs/lucide-react.mjs";
import { a as GUILD_TAGLINE, c as PILLARS, f as SiteFooter, i as GUILD_NAME, l as PROCESS, p as SiteHeader, u as REQUIREMENTS } from "./site-header-DTr75rTI.mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DFiZkz-T.js
var import_jsx_runtime = require_jsx_runtime();
var ease = [
	.22,
	1,
	.36,
	1
];
function Hero() {
	const reduce = useReducedMotion();
	const hidden = reduce ? {
		opacity: 1,
		y: 0,
		filter: "blur(0px)"
	} : {
		opacity: 0,
		y: 16,
		filter: "blur(4px)"
	};
	const visible = {
		opacity: 1,
		y: 0,
		filter: "blur(0px)"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative flex flex-col items-center px-5 pb-6 pt-10 text-center sm:pt-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hero-glow",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "relative",
				initial: reduce ? false : {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: {
					duration: .7,
					ease
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/latam-logo.webp",
					alt: `Brasão da guilda ${GUILD_NAME} 友`,
					className: "hero-logo relative drop-shadow-[0_12px_24px_rgba(0,180,255,0.2)]",
					width: 636,
					height: 640,
					fetchPriority: "high",
					decoding: "async"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
				className: "live-badge mt-6 cursor-default",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .45,
					delay: .12,
					ease
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }), "Recrutamento Oficial Aberto"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
				className: "font-display mt-5 max-w-2xl text-5xl leading-[0.92] tracking-wide text-silver sm:text-7xl",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .5,
					delay: .2,
					ease
				},
				children: [
					GUILD_NAME,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-accent",
						children: "友"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
				className: "font-display mt-3 text-2xl tracking-wide text-foreground/90 sm:text-3xl",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .5,
					delay: .28,
					ease
				},
				children: "Formulário de Recrutamento"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
				className: "mt-4 max-w-md text-base leading-normal text-muted-foreground",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .5,
					delay: .36,
					ease
				},
				children: [GUILD_TAGLINE, ". Preencha com informações verdadeiras — nossa liderança analisa cada perfil com critério e chama no WhatsApp."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .5,
					delay: .44,
					ease
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/candidatura",
					className: "cta-jump w-full sm:w-auto shadow-[0_0_24px_rgba(0,180,255,0.35)]",
					children: ["Candidatar-se Agora", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4",
						strokeWidth: 2.25
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#processo",
					className: "cta-ghost w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" }), "Como funciona"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground",
				initial: hidden,
				animate: visible,
				transition: {
					duration: .5,
					delay: .52,
					ease
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-3.5 text-accent" }), "Treinos & Ranqueadas"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-accent" }), "Linhas Competitivas"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5 text-accent" }), "Triagem Rápida"]
					})
				]
			})
		]
	});
}
var ICONS$1 = {
	Disciplina: Target,
	Equipe: Users,
	Evolução: TrendingUp,
	Respeito: Shield
};
function Pillars() {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto mt-20 max-w-3xl px-5",
		"aria-labelledby": "pilares-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-[0.18em] text-accent uppercase",
					children: "A guilda"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "pilares-title",
				className: "font-display mt-2 text-4xl tracking-wide text-silver",
				children: "O que a LATAM cobra"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				initial: reduce ? false : "hidden",
				whileInView: "visible",
				viewport: {
					once: true,
					amount: .3
				},
				variants: {
					hidden: {},
					visible: { transition: { staggerChildren: .08 } }
				},
				children: PILLARS.map((pillar) => {
					const Icon = ICONS$1[pillar.title] || Shield;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.article, {
						className: "pillar-card group relative overflow-hidden p-4 border border-white/6 hover:border-accent/40 bg-card/80 hover:bg-card-2 transition-all duration-200",
						variants: {
							hidden: {
								opacity: 0,
								y: 12,
								filter: "blur(4px)"
							},
							visible: {
								opacity: 1,
								y: 0,
								filter: "blur(0px)",
								transition: { duration: .4 }
							}
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors duration-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl tracking-wide text-silver group-hover:text-white transition-colors",
								children: pillar.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-normal text-muted-foreground group-hover:text-silver/90",
								children: pillar.body
							})] })]
						})
					}, pillar.title);
				})
			})
		]
	});
}
var ICONS = {
	"01": FilePen,
	"02": UserCheck,
	"03": MessageSquare
};
function Process() {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "processo",
		className: "mx-auto mt-20 max-w-3xl scroll-mt-20 px-5",
		"aria-labelledby": "processo-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-[0.18em] text-accent uppercase",
					children: "Processo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "processo-title",
				className: "font-display mt-2 text-4xl tracking-wide text-silver",
				children: "Três passos até o time"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ol, {
				className: "mt-6 grid gap-3 sm:grid-cols-3 relative",
				initial: reduce ? false : "hidden",
				whileInView: "visible",
				viewport: {
					once: true,
					amount: .25
				},
				variants: {
					hidden: {},
					visible: { transition: { staggerChildren: .1 } }
				},
				children: PROCESS.map((item) => {
					const Icon = ICONS[item.step] || FilePen;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
						className: "process-card group relative p-4 border border-white/6 hover:border-accent/40 bg-card/80 hover:bg-card-2 transition-all duration-200",
						variants: {
							hidden: {
								opacity: 0,
								y: 12,
								filter: "blur(4px)"
							},
							visible: {
								opacity: 1,
								y: 0,
								filter: "blur(0px)",
								transition: { duration: .4 }
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl tracking-wide text-accent",
									children: item.step
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-8 items-center justify-center rounded-md bg-white/4 text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-sm font-semibold text-foreground group-hover:text-white transition-colors",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-normal text-muted-foreground group-hover:text-silver/90",
								children: item.body
							})
						]
					}, item.step);
				})
			})
		]
	});
}
function Requirements() {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto mt-20 max-w-3xl px-5",
		"aria-labelledby": "requisitos-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-[0.18em] text-accent uppercase",
					children: "Requisitos"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "requisitos-title",
				className: "font-display mt-2 text-4xl tracking-wide text-silver",
				children: "Antes de se candidatar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.ul, {
				className: "section-card mt-6 flex flex-col gap-3.5 border border-white/6 bg-card/85 p-6",
				initial: reduce ? false : {
					opacity: 0,
					y: 12
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .3
				},
				transition: { duration: .4 },
				children: [REQUIREMENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3.5 text-sm leading-normal text-foreground/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent shadow-[0_0_8px_rgba(0,180,255,0.2)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-3.5",
							strokeWidth: 2.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 font-medium",
						children: item
					})]
				}, item)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 text-amber-400/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contas fakes ou dados inconsistentes são descartados automaticamente na triagem." })]
				})]
			})
		]
	});
}
function Home() {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pillars, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Requirements, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
				className: "mx-auto mt-16 flex max-w-3xl flex-col items-center px-5 pb-8 pt-4 text-center",
				initial: reduce ? false : {
					opacity: 0,
					y: 16
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .4
				},
				transition: { duration: .45 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#",
					className: "cta-ghost mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" }), "Voltar para o topo"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Home as component };
