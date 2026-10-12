import { FileEdit, MessageSquare, UserCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { TiltCard } from "@/components/ui/tilt-card";
import { PROCESS } from "@/lib/recruitment";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "01": FileEdit,
  "02": UserCheck,
  "03": MessageSquare,
};

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="processo" className="mx-auto mt-24 max-w-3xl scroll-mt-20 px-5" aria-labelledby="processo-title">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,180,255,0.8)]" />
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Processo</p>
      </div>
      <h2 id="processo-title" className="font-display mt-2 text-4xl tracking-wide text-silver sm:text-5xl">
        Três passos até o time
      </h2>
      <motion.ol
        className="mt-8 grid gap-4 sm:grid-cols-3 relative"
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {PROCESS.map((item) => {
          const Icon = ICONS[item.step] || FileEdit;
          return (
            <motion.li
              key={item.step}
              variants={{
                hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
              }}
            >
              <TiltCard
                maxTilt={12}
                glareOpacity={0.18}
                className="process-card group relative p-5 border border-white/8 hover:border-accent/50 bg-gradient-to-b from-[#121824] via-[#0d121b] to-[#080c12] transition-all duration-200 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl tracking-wide text-accent drop-shadow-[0_0_12px_rgba(0,180,255,0.4)]">
                    {item.step}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/4 text-muted-foreground group-hover:text-neutral-950 group-hover:bg-accent transition-all duration-200">
                    <Icon className="size-4.5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-normal text-muted-foreground group-hover:text-silver/90">
                  {item.body}
                </p>
              </TiltCard>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
