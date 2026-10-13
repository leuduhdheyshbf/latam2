import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, Loader2, Send, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/field";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptionCards } from "@/components/ui/option-cards";
import { Textarea } from "@/components/ui/textarea";
import { maskPhone, maskPlayerId } from "@/lib/masks";
import {
  defaultValues,
  FORM_STEPS,
  FUNCOES,
  HORAS_DISPONIBILIDADE,
  PATENTES_LATAM,
  SIM_NAO,
  loadDraft,
  recruitmentSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  saveDraft,
  type RecruitmentInput,
  type RecruitmentValues,
} from "@/lib/recruitment";
import { playStepSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

type RecruitmentFormProps = {
  onSubmitted: (values: RecruitmentValues) => Promise<void> | void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function RecruitmentForm({ onSubmitted }: RecruitmentFormProps) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado isolado e explícito de erros por etapa.
  // Garante 100% que nenhuma etapa receba erros prematuros antes de o usuário clicar em Continuar/Enviar.
  const [errors, setErrors] = useState<Partial<Record<keyof RecruitmentInput, string>>>({});

  const {
    register,
    control,
    setValue,
    watch,
    reset,
  } = useForm<RecruitmentInput>({
    defaultValues,
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const values = watch();

  useEffect(() => {
    reset(loadDraft());
    setHydrated(true);
  }, [reset]);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(values);
  }, [hydrated, values]);

  // Sempre que a etapa mudar, zera qualquer erro anterior para garantir tela totalmente limpa
  useEffect(() => {
    setErrors({});
  }, [step]);

  function clearFieldError(field: keyof RecruitmentInput) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function onInvalid() {
    requestAnimationFrame(() => {
      const first = document.querySelector("[data-error='true']");
      first?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
  }

  function goNext() {
    const currentValues = watch();

    if (step === 0) {
      const result = step1Schema.safeParse(currentValues);
      if (!result.success) {
        const newErrs: Partial<Record<keyof RecruitmentInput, string>> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof RecruitmentInput;
          if (field && !newErrs[field]) {
            newErrs[field] = issue.message;
          }
        }
        setErrors(newErrs);
        onInvalid();
        return;
      }
    } else if (step === 1) {
      const result = step2Schema.safeParse(currentValues);
      if (!result.success) {
        const newErrs: Partial<Record<keyof RecruitmentInput, string>> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof RecruitmentInput;
          if (field && !newErrs[field]) {
            newErrs[field] = issue.message;
          }
        }
        setErrors(newErrs);
        onInvalid();
        return;
      }
    }

    setErrors({});
    playStepSound();
    setStep((current) => Math.min(current + 1, FORM_STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    playStepSound();
    setStep((current) => Math.max(current - 1, 0));
  }

  function jumpToStep(index: number) {
    if (index < step) {
      setErrors({});
      playStepSound();
      setStep(index);
    }
  }

  async function handleFinalSubmit(event?: React.SyntheticEvent) {
    if (event) event.preventDefault();

    const currentValues = watch();

    // 1. Valida estritamente os campos do Passo 3 (Disponibilidade)
    const step3Result = step3Schema.safeParse(currentValues);
    if (!step3Result.success) {
      const newErrs: Partial<Record<keyof RecruitmentInput, string>> = {};
      for (const issue of step3Result.error.issues) {
        const field = issue.path[0] as keyof RecruitmentInput;
        if (field && !newErrs[field]) {
          newErrs[field] = issue.message;
        }
      }
      setErrors(newErrs);
      onInvalid();
      return;
    }

    // 2. Valida o formulário completo
    const fullResult = recruitmentSchema.safeParse(currentValues);
    if (!fullResult.success) {
      for (const issue of fullResult.error.issues) {
        const field = issue.path[0] as keyof RecruitmentInput;
        const stepIdx = FORM_STEPS.findIndex((s) =>
          (s.fields as readonly string[]).includes(field),
        );
        if (stepIdx !== -1) {
          setStep(stepIdx);
          setErrors({ [field]: issue.message });
          break;
        }
      }
      onInvalid();
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmitted(fullResult.data);
    } finally {
      setIsSubmitting(false);
    }
  }

  const progress = (step + 1) / FORM_STEPS.length;
  const current = FORM_STEPS[step];
  const isValidId = values.idConta && values.idConta.length >= 8 && values.idConta.length <= 12;

  return (
    <form
      id="formulario"
      className="mx-auto flex w-full max-w-xl flex-col gap-5 px-5 pb-20 pt-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step < FORM_STEPS.length - 1) {
          goNext();
        } else {
          void handleFinalSubmit(e);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
          e.preventDefault();
          if (step < FORM_STEPS.length - 1) {
            goNext();
          } else {
            void handleFinalSubmit(e);
          }
        }
      }}
      noValidate
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-accent animate-pulse" />
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            Recrutamento Oficial
          </p>
        </div>
        <h1 className="font-display mt-2 text-4xl tracking-wide text-silver">{current.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{current.copy}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-medium tracking-wide text-subtle uppercase">
          <span>
            Passo {String(step + 1).padStart(2, "0")} de {String(FORM_STEPS.length).padStart(2, "0")}
          </span>
          <span className="text-silver font-semibold">{current.title}</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="flex gap-2">
          {FORM_STEPS.map((item, index) => {
            const isDone = index < step;
            const isCurrent = index === step;
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  disabled={index > step}
                  onClick={() => jumpToStep(index)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 w-full rounded-md py-2 text-center text-[11px] font-semibold tracking-wide uppercase transition-all duration-150",
                    isCurrent
                      ? "bg-accent/15 text-accent shadow-[0_0_12px_rgba(0,180,255,0.2)]"
                      : isDone
                        ? "bg-white/5 text-silver hover:bg-white/10"
                        : "text-subtle",
                  )}
                >
                  {isDone ? <Check className="size-3 text-accent" strokeWidth={3} /> : null}
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={reduce ? false : { opacity: 0, x: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, x: -12, filter: "blur(4px)" }}
          transition={{ duration: reduce ? 0 : 0.28, ease }}
        >
          {step === 0 ? (
            <SectionCard id="dados" eyebrow="01" title="Informações do jogador" icon={Users}>
              <Field number={1} label="Nome" htmlFor="nome" error={errors.nome}>
                <Input
                  id="nome"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  {...register("nome", {
                    onChange: () => clearFieldError("nome"),
                  })}
                />
              </Field>
              <Field number={2} label="Idade" htmlFor="idade" error={errors.idade}>
                <Input
                  id="idade"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="Sua idade (ex: 18)"
                  {...register("idade", {
                    onChange: (event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
                      setValue("idade", digits, { shouldValidate: false });
                      clearFieldError("idade");
                    },
                  })}
                />
              </Field>
              <Field number={3} label="Nickname no Free Fire" htmlFor="nick" error={errors.nick}>
                <Input
                  id="nick"
                  placeholder="Seu nick exato no jogo"
                  {...register("nick", {
                    onChange: () => clearFieldError("nick"),
                  })}
                />
              </Field>
              <Field
                number={4}
                label="ID da conta"
                htmlFor="idConta"
                error={errors.idConta}
              >
                <div className="relative">
                  <Input
                    id="idConta"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="ID numérico da sua conta FF"
                    {...register("idConta", {
                      onChange: (event) => {
                        const digits = maskPlayerId(event.target.value);
                        setValue("idConta", digits, { shouldValidate: false });
                        clearFieldError("idConta");
                      },
                    })}
                  />
                  {isValidId ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full pointer-events-none">
                      <CheckCircle2 className="size-3" />
                      ID Válido
                    </span>
                  ) : null}
                </div>
              </Field>
              <Field
                number={5}
                label="Cidade / Estado"
                htmlFor="cidadeEstado"
                error={errors.cidadeEstado}
              >
                <Input
                  id="cidadeEstado"
                  placeholder="Ex: São Paulo - SP"
                  {...register("cidadeEstado", {
                    onChange: () => clearFieldError("cidadeEstado"),
                  })}
                />
              </Field>
              <Field number={6} label="WhatsApp (com DDD)" htmlFor="whatsapp" error={errors.whatsapp}>
                <Input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ex: (11) 99999-9999"
                  {...register("whatsapp", {
                    onChange: (event) => {
                      const masked = maskPhone(event.target.value);
                      setValue("whatsapp", masked, { shouldValidate: false });
                      clearFieldError("whatsapp");
                    },
                  })}
                />
              </Field>
            </SectionCard>
          ) : null}

          {step === 1 ? (
            <SectionCard id="perfil" eyebrow="02" title="Perfil no jogo" icon={Trophy}>
              <Field
                number={7}
                label="Qual sua principal função?"
                htmlFor="funcao"
                error={errors.funcao}
              >
                <Controller
                  name="funcao"
                  control={control}
                  render={({ field }) => (
                    <OptionCards
                      name={field.name}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        clearFieldError("funcao");
                      }}
                      options={FUNCOES}
                    />
                  )}
                />
              </Field>
              <Field
                number={8}
                label="Qual sua patente atual?"
                htmlFor="patenteAtual"
                error={errors.patenteAtual}
              >
                <Controller
                  name="patenteAtual"
                  control={control}
                  render={({ field }) => (
                    <OptionCards
                      name={field.name}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        clearFieldError("patenteAtual");
                      }}
                      options={PATENTES_LATAM}
                    />
                  )}
                />
              </Field>
              <Field
                number={9}
                label="Já teve experiência em competitivo, guildas ou campeonatos?"
                error={errors.experienciaCompetitiva}
              >
                <Controller
                  name="experienciaCompetitiva"
                  control={control}
                  render={({ field }) => (
                    <OptionCards
                      name={field.name}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        clearFieldError("experienciaCompetitiva");
                      }}
                      options={SIM_NAO}
                      columns="stack"
                    />
                  )}
                />
              </Field>

              <AnimatePresence>
                {values.experienciaCompetitiva === "sim" ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <Field
                      number={10}
                      label="Conte brevemente sua experiência competitiva"
                      htmlFor="experienciaDescricao"
                      error={errors.experienciaDescricao}
                    >
                      <Textarea
                        id="experienciaDescricao"
                        rows={3}
                        maxLength={800}
                        placeholder="Campeonatos disputados, guildas anteriores, line-ups, funções..."
                        {...register("experienciaDescricao", {
                          onChange: () => clearFieldError("experienciaDescricao"),
                        })}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-[11px] text-subtle">
                          {(values.experienciaDescricao || "").length}/800 caracteres
                        </span>
                      </div>
                    </Field>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </SectionCard>
          ) : null}

          {step === 2 ? (
            <SectionCard id="disponibilidade" eyebrow="03" title="Disponibilidade" icon={Clock}>
              <Field
                number={11}
                label="Quanto tempo você costuma ficar disponível para jogar por dia?"
                error={errors.tempoDisponivel}
              >
                <Controller
                  name="tempoDisponivel"
                  control={control}
                  render={({ field }) => (
                    <OptionCards
                      name={field.name}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        clearFieldError("tempoDisponivel");
                      }}
                      options={HORAS_DISPONIBILIDADE}
                      columns="stack"
                    />
                  )}
                />
              </Field>
              <Field
                number={12}
                label="Qual seu horário normalmente disponível para jogar?"
                htmlFor="horarioDisponivel"
                error={errors.horarioDisponivel}
              >
                <Input
                  id="horarioDisponivel"
                  placeholder="Ex: 19h às 23h (Treinos e Ranqueadas)"
                  {...register("horarioDisponivel", {
                    onChange: () => clearFieldError("horarioDisponivel"),
                  })}
                />
              </Field>
            </SectionCard>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="submit-panel">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={goBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>
          ) : null}

          {step < FORM_STEPS.length - 1 ? (
            <Button
              key="btn-continuar-passo"
              type="button"
              size="lg"
              className="w-full flex-1"
              onClick={goNext}
            >
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              key="btn-enviar-candidatura"
              type="button"
              size="lg"
              className="w-full flex-1"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {isSubmitting ? "Enviando para a liderança..." : "Enviar candidatura"}
            </Button>
          )}
        </div>
        {step === FORM_STEPS.length - 1 ? (
          <p className="mt-3 text-center text-xs leading-normal text-muted-foreground">
            Ao enviar, seus dados serão encaminhados para a liderança da LATAM 友.
          </p>
        ) : null}
      </div>
    </form>
  );
}
