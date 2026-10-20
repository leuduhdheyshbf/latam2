import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { GUILD_MARK, GUILD_NAME } from "@/lib/recruitment";

export function SiteHeader() {
  return (
    <header className="site-header backdrop-blur-md bg-background/85">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <img
            src="/latam-mark.webp"
            alt="Brasão LATAM 友"
            width={32}
            height={32}
            className="size-8 transition-transform duration-200 group-hover:scale-105"
            decoding="async"
          />
          <span className="font-display text-xl tracking-[0.14em] text-silver group-hover:text-white transition-colors">
            {GUILD_NAME} <span className="tracking-normal text-accent">{GUILD_MARK}</span>
          </span>
        </Link>

        {/* Links de Acesso */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-neutral-950 transition-all duration-200 shadow-[0_0_14px_rgba(0,180,255,0.25)] active:scale-95 group"
          >
            <ShieldCheck className="size-4 transition-transform group-hover:scale-110" />
            <span>Sou ADM</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
