import { Check, Copy, MessageCircle, RotateCcw, Share2, Sparkles, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  displayValue,
  FIELD_LABELS,
  formatApplicationMessage,
  GUILD_MARK,
  GUILD_NAME,
  type RecruitmentValues,
} from "@/lib/recruitment";
import { TiltCard } from "@/components/ui/tilt-card";
import { playSuccessSound } from "@/lib/sound";

const SUMMARY_KEYS: (keyof RecruitmentValues)[] = [
  "nome",
  "idade",
  "cidadeEstado",
  "nick",
  "idConta",
  "whatsapp",
  "funcao",
  "patenteAtual",
  "experienciaCompetitiva",
  "experienciaDescricao",
  "tempoDisponivel",
  "horarioDisponivel",
];

type SuccessViewProps = {
  values: RecruitmentValues;
  onReset: () => void;
};

export function SuccessView({ values, onReset }: SuccessViewProps) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const message = formatApplicationMessage(values);

  useEffect(() => {
    playSuccessSound();
  }, []);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Ficha da candidatura copiada!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Selecione e copie o texto abaixo.");
    }
  }

  // Se houver número da liderança nas variáveis de ambiente, direciona para lá, senão abre o seletor do WhatsApp
  const leadershipPhone = import.meta.env.VITE_LEADERSHIP_WHATSAPP || "";
  const whatsappUrl = leadershipPhone
    ? `https://api.whatsapp.com/send?phone=${leadershipPhone.replace(/\D/g, "")}&text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  // Protocolo determinístico baseado no ID do jogador (evita erro de hidratação SSR)
  const protocolId = values.idConta
    ? `LATAM-${values.idConta.slice(-6).padStart(6, "0")}`
    : "LATAM-RECRUTA";

  return (
    <section id="formulario" className="mx-auto w-full max-w-xl px-5 pb-20 pt-8">
      {/* Topo com Sucesso */}
      <motion.div
        className="section-card text-center relative overflow-hidden"
        initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 size-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="success-mark mx-auto shadow-[0_0_24px_rgba(0,180,255,0.35)]">
          <Check className="size-7" strokeWidth={2.5} />
        </div>

        <h2 className="font-display mt-4 text-4xl tracking-wide text-silver">
          Candidatura Registrada!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-normal text-muted-foreground">
          Sua ficha foi salva e enviada. A liderança da <strong className="text-silver">{GUILD_NAME} {GUILD_MARK}</strong> irá avaliar suas informações e chamar no WhatsApp.
        </p>

        {/* Botões de Ação Imediata */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-medium min-h-11 rounded-lg px-5 text-sm bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-150 active:scale-95"
          >
            <MessageCircle className="size-4.5" />
            Enviar Ficha no WhatsApp
          </a>

          <Button
            variant="secondary"
            size="default"
            className="min-h-11 text-sm"
            onClick={copyMessage}
          >
            {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
            {copied ? "Copiado!" : "Copiar Ficha"}
          </Button>
        </div>
      </motion.div>

      {/* Cartão Tático 3D do Jogador (VIP Holographic Player Badge) */}
      <TiltCard
        maxTilt={14}
        glareOpacity={0.3}
        className="mt-6 rounded-2xl p-[1.5px] holographic-foil shadow-[0_20px_45px_rgba(0,0,0,0.65)] cursor-grab active:cursor-grabbing select-none"
      >
        <div className="rounded-[15px] bg-gradient-to-b from-[#131c2a] via-[#0c121b] to-[#070a0f] p-5 relative overflow-hidden backdrop-blur-md">
          {/* Marca d'água sutil do brasão no fundo */}
          <img
            src="/latam-mark.webp"
            alt=""
            className="absolute -right-6 -bottom-6 size-36 opacity-10 pointer-events-none select-none"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between pb-3.5 border-b border-white/8 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-[0.14em] text-silver">
                {GUILD_NAME} <span className="text-accent">{GUILD_MARK}</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 shadow-[0_0_8px_rgba(0,180,255,0.2)]">
                Protocolo #{protocolId}
              </span>
            </div>

            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Em Análise
            </span>
          </div>

          {/* Nick e Nome */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 relative z-10">
            <div>
              <p className="text-[11px] uppercase font-semibold tracking-wider text-accent">Jogador Selecionado</p>
              <h3 className="font-display text-4xl tracking-wide text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {values.nick}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {values.nome} • {values.cidadeEstado}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[11px] uppercase font-semibold tracking-wider text-subtle">ID Free Fire</p>
              <p className="font-mono text-lg font-bold text-accent tracking-wider drop-shadow-[0_0_10px_rgba(0,180,255,0.4)]">
                {values.idConta}
              </p>
            </div>
          </div>

          {/* Grid de Atributos Táticos 3D */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/8 relative z-10">
            <div className="rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-[10px] uppercase font-semibold text-subtle tracking-wide">Função</p>
              <p className="font-display text-lg text-silver tracking-wide mt-0.5">
                {displayValue("funcao", values)}
              </p>
            </div>

            <div className="rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-[10px] uppercase font-semibold text-subtle tracking-wide">Patente</p>
              <p className="font-display text-lg text-silver tracking-wide mt-0.5">
                {displayValue("patenteAtual", values)}
              </p>
            </div>

            <div className="rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-[10px] uppercase font-semibold text-subtle tracking-wide">Tempo Diário</p>
              <p className="font-display text-lg text-silver tracking-wide mt-0.5">
                {displayValue("tempoDisponivel", values)}
              </p>
            </div>

            <div className="rounded-lg bg-black/35 p-2.5 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-[10px] uppercase font-semibold text-subtle tracking-wide">Competitivo</p>
              <p className="font-display text-lg text-silver tracking-wide mt-0.5">
                {displayValue("experienciaCompetitiva", values)}
              </p>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Detalhamento Completo */}
      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wider text-subtle uppercase px-1 mb-2">
          Resumo Completo dos Dados
        </p>
        <dl className="summary-list">
          {SUMMARY_KEYS.filter((key) => key !== "experienciaDescricao" || values.experienciaDescricao).map(
            (key) => (
              <div key={key} className="summary-row">
                <dt>{FIELD_LABELS[key]}</dt>
                <dd>{displayValue(key, values)}</dd>
              </div>
            ),
          )}
        </dl>
      </div>

      {/* Botão de Enviar Outra */}
      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-white">
          <RotateCcw className="size-4" />
          Preencher outro formulário
        </Button>
      </div>
    </section>
  );
}
