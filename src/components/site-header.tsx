import { Link } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { GUILD_MARK, GUILD_NAME } from "@/lib/recruitment";
import { isSoundMuted, toggleSound } from "@/lib/sound";

export function SiteHeader() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
  }, []);

  function handleToggleAudio() {
    const next = toggleSound();
    setMuted(next);
  }

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

        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Link
              to="/"
              className="hover:text-silver transition-colors [&.active]:text-accent"
            >
              Início
            </Link>
            <Link
              to="/candidatura"
              className="hover:text-silver transition-colors [&.active]:text-accent"
            >
              Candidatar-se
            </Link>
          </nav>

          {/* Toggle de Som */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={muted ? "Ativar som de efeitos" : "Mutar som de efeitos"}
            title={muted ? "Som desativado (Clique para ativar)" : "Som ativado (Clique para mutar)"}
            className="flex size-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-muted-foreground hover:bg-white/8 hover:text-silver transition-colors"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-accent" />}
          </button>
        </div>
      </div>
    </header>
  );
}
