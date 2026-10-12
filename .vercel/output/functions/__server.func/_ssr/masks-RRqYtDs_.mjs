import { R as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { m as cn } from "./recruitment-DF6yoLIM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/masks-RRqYtDs_.js
var import_jsx_runtime = require_jsx_runtime();
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
function formatWhatsAppUrl(phone, text) {
	const digits = phone.replace(/\D/g, "");
	return `https://api.whatsapp.com/send?phone=${digits.length <= 11 ? `55${digits}` : digits}&text=${encodeURIComponent(text)}`;
}
//#endregion
export { maskPlayerId as a, maskPhone as i, Input as n, formatWhatsAppUrl as r, Button as t };
