"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Enviando imagem…",
  "Analisando qualidade…",
  "Restaurando detalhes e rostos…",
  "Aprimorando nitidez…",
  "Finalizando…",
];

const STEP_DURATION = 4000; // ms per step

interface ProcessingStateProps {
  current?: number;
  total?: number;
}

function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

export function ProcessingState({ current = 1, total = 1 }: ProcessingStateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const elapsed = useElapsed();

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, []);

  const progressPct = Math.min(
    ((activeStep + 1) / STEPS.length) * 100,
    92
  );

  return (
    <div className="flex flex-col items-center gap-6 py-10 px-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Restaurando sua foto
          {total > 1 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({current} de {total})
            </span>
          )}
        </h3>
        <p className="text-xs text-muted-foreground">
          {elapsed < 5
            ? "Isso pode levar entre 15 e 30 segundos"
            : `${elapsed}s decorridos…`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-dark transition-all duration-[3000ms] ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step list */}
      <ol className="w-full max-w-xs space-y-3">
        {STEPS.map((label, i) => {
          const isDone = i < activeStep;
          const isActive = i === activeStep;
          const isPending = i > activeStep;

          return (
            <li key={i} className="flex items-center gap-3">
              {/* Icon */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300",
                  isDone && "border-emerald-500 bg-emerald-500 text-white",
                  isActive && "border-brand-dark bg-brand-dark/10 text-brand-dark",
                  isPending && "border-muted-foreground/30 bg-transparent text-muted-foreground/40"
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  isDone && "text-muted-foreground line-through decoration-muted-foreground/40",
                  isActive && "font-medium text-foreground",
                  isPending && "text-muted-foreground/50"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
