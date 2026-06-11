"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ReactCompareSliderProps } from "react-compare-slider";
import { ReactCompareSliderImage } from "react-compare-slider";

const ReactCompareSlider = dynamic<ReactCompareSliderProps>(
  () => import("react-compare-slider").then((m) => m.ReactCompareSlider),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Palette } from "lucide-react";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { cn } from "@/lib/utils";

interface ResultCompareProps {
  originalUrl: string;
  restoredUrl: string;
  withWatermark?: boolean;
  onReset?: () => void;
  index?: number;
  isDemo?: boolean;
}

export function ResultCompare({
  originalUrl,
  restoredUrl,
  withWatermark,
  onReset,
  index,
  isDemo,
}: ResultCompareProps) {
  const [keepColor, setKeepColor] = useState(false);

  async function handleDownload() {
    if (keepColor) {
      try {
        const [restoredImg, originalImg] = await Promise.all([
          loadImage(restoredUrl),
          loadImage(originalUrl),
        ]);
        const canvas = document.createElement("canvas");
        canvas.width = restoredImg.naturalWidth;
        canvas.height = restoredImg.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(restoredImg, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "color";
        ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          triggerDownload(url, index);
          URL.revokeObjectURL(url);
        }, "image/jpeg", 0.92);
        return;
      } catch {
        // CORS bloqueou — baixa a restaurada normalmente
      }
    }
    const res = await fetch(restoredUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    triggerDownload(url, index);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="relative w-full" style={{ height: "460px" }}>
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={originalUrl}
                alt="Foto original"
                loading="eager"
                style={{ objectFit: "cover" }}
              />
            }
            itemTwo={
              <div className="relative w-full h-full">
                <ReactCompareSliderImage
                  src={restoredUrl}
                  alt="Foto restaurada"
                  loading="eager"
                  style={{ objectFit: "cover" }}
                />
                {keepColor && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={originalUrl}
                    alt=""
                    aria-hidden
                    crossOrigin="anonymous"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      mixBlendMode: "color",
                      pointerEvents: "none",
                    }}
                  />
                )}
                {withWatermark && <WatermarkOverlay />}
              </div>
            }
          />
        </div>

        {/* Labels */}
        <div className="flex border-t">
          <div className="flex-1 py-2 text-center text-xs text-muted-foreground border-r">
            Antes
          </div>
          <div className="flex-1 py-2 text-center text-xs font-medium text-brand-text">
            Depois ✦
          </div>
        </div>
      </div>

      {!isDemo && (
        <>
          {/* Toggle: manter cor original */}
          <button
            type="button"
            onClick={() => setKeepColor((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors",
              keepColor
                ? "border-brand-dark/40 bg-brand-dark/5 text-brand-dark"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50"
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              <Palette className="h-4 w-4" />
              Manter cor original
            </span>
            {/* pill toggle */}
            <span
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
                keepColor ? "bg-brand-dark" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  keepColor && "translate-x-4"
                )}
              />
            </span>
          </button>

          <div className="flex gap-3">
            {onReset && (
              <Button variant="outline" className="flex-1" onClick={onReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Nova foto
              </Button>
            )}
            {!withWatermark && (
              <Button
                className="flex-1 bg-brand-dark hover:bg-brand-dark/90 text-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            )}
          </div>
        </>
      )}

      {withWatermark && (
        <p className="text-center text-sm text-muted-foreground">
          Crie uma conta para baixar sem marca d&apos;água.
        </p>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function triggerDownload(url: string, index?: number) {
  const a = document.createElement("a");
  a.href = url;
  a.download = index != null ? `foto-restaurada-${index + 1}.jpg` : "foto-restaurada.jpg";
  a.click();
}
