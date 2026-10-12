import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ShieldCheck, Swords, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TiltCard } from "@/components/ui/tilt-card";
import { GUILD_MARK, GUILD_NAME, GUILD_TAGLINE } from "@/lib/recruitment";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(4px)" };
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <header className="relative flex flex-col items-center px-5 pb-10 pt-10 text-center sm:pt-14 overflow-hidden">
      {/* 3D Perspective Cyber Floor */}
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-[140%] max-w-5xl h-64 opacity-35 [perspective:600px] overflow-hidden -z-10"
        aria-hidden="true"
      >
        <div
          className="w-full h-full [transform:rotateX(70deg)] origin-bottom"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 180, 255, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 180, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 65% 55% at 50% 100%, black 25%, transparent 80%)",
          }}
        />
      </div>

      <div className="hero-glow" aria-hidden="true" />

      {/* Brasão Oficial da Guilda com Tilt 3D Interativo */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10"
      >
        <TiltCard maxTilt={18} glareOpacity={0.3} className="cursor-grab active:cursor-grabbing group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/25 blur-3xl rounded-full scale-90 pointer-events-none" />
            <img
              src="/latam-logo.webp"
              alt={`Brasão da guilda ${GUILD_NAME} ${GUILD_MARK}`}
              className="hero-logo relative drop-shadow-[0_20px_45px_rgba(0,180,255,0.35)] transition-transform duration-300 group-hover:scale-105"
              width={636}
              height={640}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </TiltCard>
      </motion.div>

      <motion.p
        className="live-badge mt-6 cursor-default border border-accent/30 shadow-[0_0_16px_rgba(0,180,255,0.25)]"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.45, delay: 0.12, ease }}
      >
        <span className="live-dot" />
        Recrutamento Oficial Aberto
      </motion.p>

      <motion.h1
        className="font-display mt-5 max-w-2xl text-6xl leading-[0.92] tracking-wide text-silver sm:text-8xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        {GUILD_NAME} <span className="text-accent drop-shadow-[0_0_20px_rgba(0,180,255,0.6)]">{GUILD_MARK}</span>
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

      {/* Botões de Ação 3D */}
      <motion.div
        className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center z-10"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.44, ease }}
      >
        <Link to="/candidatura" className="cta-jump w-full sm:w-auto">
          Candidatar-se Agora
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>
        <a href="#processo" className="cta-ghost w-full sm:w-auto">
          <ArrowDown className="size-4" />
          Como funciona
        </a>
      </motion.div>

      {/* Chips Rápidos de Destaque 3D */}
      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground z-10"
        initial={hidden}
        animate={visible}
        transition={{ duration: 0.5, delay: 0.52, ease }}
      >
        <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-accent/40 transition-colors">
          <Swords className="size-3.5 text-accent" />
          Treinos & Ranqueadas
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-accent/40 transition-colors">
          <ShieldCheck className="size-3.5 text-accent" />
          Linhas Competitivas
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-accent/40 transition-colors">
          <Zap className="size-3.5 text-accent" />
          Triagem Rápida
        </span>
      </motion.div>
    </header>
  );
}
