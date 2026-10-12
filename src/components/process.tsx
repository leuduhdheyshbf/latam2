import { FileEdit, MessageSquare, UserCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { PROCESS } from "@/lib/recruitment";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "01": FileEdit,
  "02": UserCheck,
  "03": MessageSquare,
};

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="processo" className="mx-auto mt-20 max-w-3xl scroll-mt-20 px-5" aria-labelledby="processo-title">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent" />
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Processo</p>
      </div>
      <h2 id="processo-title" className="font-display mt-2 text-4xl tracking-wide text-silver">
        Três passos até o time
      </h2>
      <motion.ol
        className="mt-6 grid gap-3 sm:grid-cols-3 relative"
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
              className="process-card group relative p-4 border border-white/6 hover:border-accent/40 bg-card/80 hover:bg-card-2 transition-all duration-200"
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl tracking-wide text-accent">{item.step}</span>
                <span className="flex size-8 items-center justify-center rounded-md bg-white/4 text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                  <Icon className="size-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-normal text-muted-foreground group-hover:text-silver/90">
                {item.body}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
