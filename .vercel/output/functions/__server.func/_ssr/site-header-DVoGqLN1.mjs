import { R as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as GUILD_TAGLINE, i as GUILD_NAME } from "./recruitment-DF6yoLIM.mjs";
import { f as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-DVoGqLN1.js
var import_jsx_runtime = require_jsx_runtime();
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-neutral-950 transition-all duration-200 shadow-[0_0_14px_rgba(0,180,255,0.25)] active:scale-95 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 transition-transform group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sou ADM" })]
				})
			})]
		})
	});
}
//#endregion
export { SiteHeader as n, SiteFooter as t };
