"use client";

import { useState } from "react";
import Image from "next/image";
import { useUpload } from "@/hooks/useUpload";
import { UploadZone } from "@/components/restore/UploadZone";
import { ProcessingState } from "@/components/restore/ProcessingState";
import { ResultsCarousel } from "@/components/restore/ResultsCarousel";
import { ResultCompare } from "@/components/restore/ResultCompare";
import { CreditGate } from "@/components/restore/CreditGate";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMOS = [
  { originalUrl: "/demo/original.webp",   restoredUrl: "/demo/restaurada.webp" },
  { originalUrl: "/demo/original_1.webp", restoredUrl: "/demo/restaurada_1.webp" },
  { originalUrl: "/demo/original_2.webp", restoredUrl: "/demo/restaurada_2.webp" },
];

function DemoCarousel() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  function go(i: number) {
    setActive(i);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="space-y-3">
      <div key={animKey} className="animate-in fade-in duration-300">
        <ResultCompare
          originalUrl={DEMOS[active].originalUrl}
          restoredUrl={DEMOS[active].restoredUrl}
          isDemo
        />
      </div>
      {/* Thumbnails */}
      <div className="flex justify-center gap-2">
        {DEMOS.map((demo, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={cn(
              "relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all",
              i === active
                ? "border-brand-dark shadow-md scale-105"
                : "border-transparent opacity-50 hover:opacity-80"
            )}
            aria-label={`Exemplo ${i + 1}`}
          >
            <Image src={demo.originalUrl} alt="" fill sizes="56px" unoptimized className="object-cover" />
          </button>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => go((active - 1 + DEMOS.length) % DEMOS.length)}
          className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
          aria-label="Exemplo anterior"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <div className="flex">
          {DEMOS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="flex h-6 w-6 items-center justify-center"
              aria-label={`Exemplo ${i + 1}`}
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-4 bg-brand-dark" : "w-1.5 bg-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => go((active + 1) % DEMOS.length)}
          className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
          aria-label="Próximo exemplo"
        >
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export function RestoreClient() {
  const { state, upload, reset, closeGate, setError } = useUpload();

  return (
    <>
      {state.status === "idle" && (
        <>
          <DemoCarousel />
          <div className="mt-6">
            <UploadZone onFiles={upload} onReject={setError} />
          </div>
        </>
      )}

      {state.status === "processing" && (
        <ProcessingState current={state.current} total={state.total} />
      )}

      {state.status === "done" && (
        <ResultsCarousel results={state.results} onReset={reset} />
      )}

      {state.status === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm font-medium text-destructive">
            {state.message}
          </p>
          <Button variant="outline" onClick={reset} size="sm">
            Tentar novamente
          </Button>
        </div>
      )}

      {state.status === "gate" && (
        <CreditGate
          open
          onOpenChange={(open) => { if (!open) closeGate(); }}
          reason={state.reason}
        />
      )}
    </>
  );
}
