"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RestoreResult } from "@/hooks/useUpload";
import { ResultCompare } from "./ResultCompare";

interface ResultsCarouselProps {
  results: RestoreResult[];
  onReset: () => void;
}

export function ResultsCarousel({ results, onReset }: ResultsCarouselProps) {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  function go(index: number) {
    setActive(index);
    setAnimKey((k) => k + 1);
  }

  function prev() {
    go((active - 1 + results.length) % results.length);
  }

  function next() {
    go((active + 1) % results.length);
  }

  const result = results[active];

  return (
    <div className="space-y-4">
      {/* Slide */}
      <div key={animKey} className="animate-in fade-in duration-300">
        <ResultCompare
          originalUrl={result.originalUrl}
          restoredUrl={result.restoredUrl}
          withWatermark={result.withWatermark}
          onReset={onReset}
          index={active}
        />
      </div>

      {/* Dots navigation */}
      {results.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <div className="flex gap-1.5">
            {results.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-4 bg-brand-dark" : "w-1.5 bg-muted-foreground/30"
                )}
                aria-label={`Ver foto ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
