import { AlertCircle, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { REQUIREMENTS } from "@/lib/recruitment";

export function Requirements() {
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto mt-20 max-w-3xl px-5" aria-labelledby="requisitos-title">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent" />
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Requisitos</p>
      </div>
      <h2 id="requisitos-title" className="font-display mt-2 text-4xl tracking-wide text-silver">
        Antes de se candidatar
      </h2>
      <motion.ul
        className="section-card mt-6 flex flex-col gap-3.5 border border-white/6 bg-card/85 p-6"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        {REQUIREMENTS.map((item) => (
          <li key={item} className="flex items-start gap-3.5 text-sm leading-normal text-foreground/90">
            <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent shadow-[0_0_8px_rgba(0,180,255,0.2)]">
              <Check className="size-3.5" strokeWidth={2.75} />
            </span>
            <span className="flex-1 font-medium">{item}</span>
          </li>
        ))}

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-subtle">
          <AlertCircle className="size-4 shrink-0 text-amber-400/80" />
          <span>Contas fakes ou dados inconsistentes são descartados automaticamente na triagem.</span>
        </div>
      </motion.ul>
    </section>
  );
}
