import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles, Swords, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GUILD_MARK, GUILD_NAME, GUILD_TAGLINE } from "@/lib/recruitment";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(4px)" };
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <header className="relative flex flex-col items-center px-5 pb-6 pt-10 text-center sm:pt-14">
      <div className="hero-glow" aria-hidden="true" />

      {/* Brasão Oficial da Guilda */}
      <motion.div
        className="relative"
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75 pointer-events-none" />
        <img
          src="/latam-logo.webp"
          alt={`Brasão da guilda ${GUILD_NAME} ${GUILD_MARK}`}
          className="hero-logo relative drop-shadow-[0_12px_24px_rgba(0,180,255,0.2)]"
          width={636}
          height={640}
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>

      <motion.p
        className="live-badge mt-6 cursor-default"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.45, delay: 0.12, ease }}
      >
        <span className="live-dot" />
        Recrutamento Oficial Aberto
      </motion.p>

      <motion.h1
        className="font-display mt-5 max-w-2xl text-5xl leading-[0.92] tracking-wide text-silver sm:text-7xl"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        {GUILD_NAME} <span className="text-accent">{GUILD_MARK}</span>
      </motion.h1>

      <motion.p
        className="font-display mt-3 text-2xl tracking-wide text-foreground/90 sm:text-3xl"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.28, ease }}
      >
        Formulário de Recrutamento
      </motion.p>

      <motion.p
        className="mt-4 max-w-md text-base leading-normal text-muted-foreground"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.36, ease }}
      >
        {GUILD_TAGLINE}. Preencha com informações verdadeiras — nossa liderança analisa cada perfil com critério e chama no WhatsApp.
      </motion.p>

      {/* Botões de Ação */}
      <motion.div
        className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.44, ease }}
      >
        <Link to="/candidatura" className="cta-jump w-full sm:w-auto shadow-[0_0_24px_rgba(0,180,255,0.35)]">
          Candidatar-se Agora
          <ArrowRight className="size-4" strokeWidth={2.25} />
        </Link>
        <a href="#processo" className="cta-ghost w-full sm:w-auto">
          <ArrowDown className="size-4" />
          Como funciona
        </a>
      </motion.div>

      {/* Chips Rápidos de Destaque */}
      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.52, ease }}
      >
        <span className="flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1">
          <Swords className="size-3.5 text-accent" />
          Treinos & Ranqueadas
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1">
          <ShieldCheck className="size-3.5 text-accent" />
          Linhas Competitivas
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/6 bg-white/2 px-3 py-1">
          <Zap className="size-3.5 text-accent" />
          Triagem Rápida
        </span>
      </motion.div>
    </header>
  );
}
