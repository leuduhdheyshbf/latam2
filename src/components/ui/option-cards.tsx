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

function getBadgeStyle(badge?: string, tier?: string, selected?: boolean): string {
  if (tier === "Mestre") {
    return "bg-gradient-to-r from-red-600/25 to-amber-600/25 text-amber-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)]";
  }
  if (tier === "Elite") {
    return "bg-gradient-to-r from-purple-600/25 to-pink-600/25 text-pink-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]";
  }
  if (tier === "Diamante") {
    return "bg-gradient-to-r from-cyan-600/25 to-blue-600/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]";
  }
  if (tier === "Ouro/Platina") {
    return "bg-gradient-to-r from-yellow-600/25 to-amber-600/25 text-yellow-300 border border-yellow-500/40";
  }

  if (badge === "Ataque") return "bg-red-500/15 text-red-400 border border-red-500/30";
  if (badge === "Tático") return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  if (badge === "Dano") return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  if (badge === "Explosivo") return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
  if (badge === "Gás") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  if (badge === "Coringa") return "bg-purple-500/15 text-purple-400 border border-purple-500/30";

  return selected
    ? "bg-accent/20 text-accent border border-accent/30"
    : "bg-white/5 text-subtle border border-white/5";
}

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
        "grid gap-2.5 [perspective:1000px]",
        columns === "stack" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = ICONS_BY_VALUE[option.value];
        const tagText = option.badge || option.tier;
        const badgeClasses = getBadgeStyle(option.badge, option.tier, selected);

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(
              "option-card group relative flex items-start gap-3 p-3.5 text-left transition-all duration-200 rounded-xl",
              selected
                ? "option-card-selected shadow-[0_10px_24px_-4px_rgba(0,180,255,0.35)]"
                : "hover:-translate-y-0.5",
            )}
            onClick={() => handleSelect(option.value)}
          >
            {Icon ? (
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                  selected
                    ? "bg-accent/25 text-accent shadow-[0_0_16px_rgba(0,180,255,0.4)] scale-105"
                    : "bg-white/4 text-muted-foreground group-hover:bg-white/8 group-hover:text-silver",
                )}
              >
                <Icon className="size-5" />
              </span>
            ) : (
              <span className={cn("option-dot mt-1", selected && "option-dot-selected")}>
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            )}

            <div className="flex-1 min-w-0 pr-5">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("font-medium text-sm leading-tight", selected ? "text-white font-semibold" : "text-foreground")}>
                  {option.label}
                </span>

                {tagText ? (
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors",
                      badgeClasses,
                    )}
                  >
                    {tagText}
                  </span>
                ) : null}
              </div>

              {option.desc ? (
                <p className="mt-1 text-xs leading-normal text-muted-foreground group-hover:text-silver/90">
                  {option.desc}
                </p>
              ) : null}
            </div>

            {/* Checkmark no canto superior direito */}
            <span
              className={cn(
                "option-dot absolute top-3.5 right-3.5 transition-all duration-200",
                selected ? "option-dot-selected scale-110" : "opacity-40 group-hover:opacity-75",
              )}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
