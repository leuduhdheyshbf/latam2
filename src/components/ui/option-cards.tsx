import {
  Award,
  Check,
  Crown,
  Crosshair,
  Flame,
  Gem,
  HeartPulse,
  Layers,
  Shield,
  ShieldCheck,
  Wind,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import { playSelectSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  desc?: string;
  badge?: string;
  tier?: string;
};

type OptionCardsProps = {
  name: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  columns?: "two" | "stack";
};

const ICONS_BY_VALUE: Record<string, ComponentType<{ className?: string }>> = {
  // Funções
  rush: Zap,
  suporte: ShieldCheck,
  fuzileiro: Crosshair,
  granadeiro: Flame,
  full_gas: Wind,
  cura: HeartPulse,
  flexivel: Layers,

  // Patentes
  ouro_platina: Award,
  platina_diamente: Gem,
  diamente_mestre: Flame,
  elite: Crown,
  outra: Shield,
};

export function OptionCards({
  name,
  value,
  options,
  onChange,
  columns = "two",
}: OptionCardsProps) {
  function handleSelect(val: string) {
    playSelectSound();
    onChange(val);
  }

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "grid gap-2.5",
        columns === "stack" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = ICONS_BY_VALUE[option.value];

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(
              "option-card group relative flex items-start gap-3 p-3.5 text-left transition-all duration-150",
              selected && "option-card-selected",
            )}
            onClick={() => handleSelect(option.value)}
          >
            {Icon ? (
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  selected
                    ? "bg-accent/20 text-accent shadow-[0_0_12px_rgba(0,180,255,0.35)]"
                    : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-silver",
                )}
              >
                <Icon className="size-4.5" />
              </span>
            ) : (
              <span className={cn("option-dot mt-1", selected && "option-dot-selected")}>
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("font-medium text-sm leading-tight", selected ? "text-white" : "text-foreground")}>
                  {option.label}
                </span>

                {option.badge ? (
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      selected ? "bg-accent/25 text-accent" : "bg-white/5 text-subtle",
                    )}
                  >
                    {option.badge}
                  </span>
                ) : null}

                {option.tier ? (
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      selected ? "bg-accent/25 text-accent" : "bg-white/5 text-subtle",
                    )}
                  >
                    {option.tier}
                  </span>
                ) : null}
              </div>

              {option.desc ? (
                <p className="mt-1 text-xs leading-normal text-muted-foreground group-hover:text-silver/80">
                  {option.desc}
                </p>
              ) : null}
            </div>

            {Icon ? (
              <span
                className={cn(
                  "option-dot absolute top-3 right-3",
                  selected && "option-dot-selected",
                )}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
