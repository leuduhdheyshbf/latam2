import { Shield, Target, TrendingUp, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
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
    <section className="mx-auto mt-20 max-w-3xl px-5" aria-labelledby="pilares-title">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent" />
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">A guilda</p>
      </div>
      <h2 id="pilares-title" className="font-display mt-2 text-4xl tracking-wide text-silver">
        O que a LATAM cobra
      </h2>
      <motion.div
        className="mt-6 grid gap-3 sm:grid-cols-2"
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
            <motion.article
              key={pillar.title}
              className="pillar-card group relative overflow-hidden p-4 border border-white/6 hover:border-accent/40 bg-card/80 hover:bg-card-2 transition-all duration-200"
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors duration-200">
                  <Icon className="size-5" />
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
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
