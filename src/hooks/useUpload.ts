"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface RestoreResult {
  originalUrl: string;
  restoredUrl: string;
  withWatermark: boolean;
}

type UploadState =
  | { status: "idle" }
  | { status: "processing"; current: number; total: number }
  | { status: "done"; results: RestoreResult[] }
  | { status: "error"; message: string }
  | { status: "gate"; reason: "signup_required" | "insufficient_credits" };

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const router = useRouter();

  async function upload(files: File[]) {
    const results: RestoreResult[] = [];

    for (let i = 0; i < files.length; i++) {
      setState({ status: "processing", current: i + 1, total: files.length });

      const form = new FormData();
      form.append("file", files[i]);

      try {
        const res = await fetch("/api/restore", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) {
          if (data.error === "signup_required") {
            setState({ status: "gate", reason: "signup_required" });
            return;
          }
          if (data.error === "insufficient_credits") {
            setState({ status: "gate", reason: "insufficient_credits" });
            return;
          }
          if (data.error === "file_too_large") {
            setState({ status: "error", message: "Arquivo muito grande. O tamanho máximo permitido é 30 MB." });
            return;
          }
          if (data.error === "storage_limit") {
            setState({ status: "error", message: "Erro ao salvar a imagem restaurada. Tente com uma foto menor." });
            return;
          }
          if (data.error === "invalid_format") {
            setState({ status: "error", message: "Formato inválido. Use JPG, PNG ou WebP." });
            return;
          }
          throw new Error(data.detail ?? data.error ?? "Erro desconhecido");
        }

        results.push({
          originalUrl: data.originalUrl,
          restoredUrl: data.restoredUrl,
          withWatermark: false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro inesperado";
        setState({ status: "error", message });
        return;
      }
    }

    setState({ status: "done", results });
    router.refresh();
  }

  function reset() {
    setState({ status: "idle" });
  }

  function closeGate() {
    setState({ status: "idle" });
  }

  function setError(message: string) {
    setState({ status: "error", message });
  }

  return { state, upload, reset, closeGate, setError };
}
