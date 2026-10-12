import { Shield, Target, TrendingUp, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { TiltCard } from "@/components/ui/tilt-card";
import { PILLARS } from "@/lib/recruitment";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Disciplina: Target,
  Equipe: Users,
  Evolução: TrendingUp,
  Respeito: Shield,
};

export function Pillars() {
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto mt-24 max-w-3xl px-5" aria-labelledby="pilares-title">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,180,255,0.8)]" />
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">A guilda</p>
      </div>
      <h2 id="pilares-title" className="font-display mt-2 text-4xl tracking-wide text-silver sm:text-5xl">
        O que a LATAM cobra
      </h2>
      <motion.div
        className="mt-8 grid gap-4 sm:grid-cols-2"
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {PILLARS.map((pillar) => {
          const Icon = ICONS[pillar.title] || Shield;
          return (
            <motion.div
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
              }}
            >
              <TiltCard
                maxTilt={10}
                glareOpacity={0.15}
                className="pillar-card group relative overflow-hidden p-5 border border-white/8 hover:border-accent/50 bg-gradient-to-br from-[#121824] via-[#0d121b] to-[#080c12] transition-all duration-200 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-all duration-200 shadow-[0_0_14px_rgba(0,180,255,0.2)]">
                    <Icon className="size-5.5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-silver group-hover:text-white transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm leading-normal text-muted-foreground group-hover:text-silver/90">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
