"use client";

import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SIZE = 10 * 1024;        // 10 KB
const MAX_SIZE = 30 * 1024 * 1024; // 30 MB

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  onReject?: (message: string) => void;
  disabled?: boolean;
}

export function UploadZone({ onFiles, onReject, disabled }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles]
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      if (!onReject || rejections.length === 0) return;
      const { errors } = rejections[0];
      const code = errors[0]?.code;
      if (code === "file-too-large") {
        onReject("Arquivo muito grande. O tamanho máximo permitido é 30 MB.");
      } else if (code === "file-too-small") {
        onReject("Arquivo muito pequeno. O tamanho mínimo permitido é 10 KB.");
      } else if (code === "file-invalid-type") {
        onReject("Formato inválido. Use JPG, PNG ou WebP.");
      } else if (code === "too-many-files") {
        onReject("Muitos arquivos. Envie no máximo 10 fotos por vez.");
      } else {
        onReject("Arquivo rejeitado. Verifique o formato e o tamanho.");
      }
    },
    [onReject]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    maxFiles: 10,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer select-none",
        isDragActive
          ? "border-brand-dark bg-brand-dark/10"
          : "border-border hover:border-brand-dark hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
          isDragActive ? "bg-brand-dark/20" : "bg-muted"
        )}
      >
        {isDragActive ? (
          <ImagePlus className="h-7 w-7 text-brand-dark" />
        ) : (
          <Upload className="h-7 w-7 text-muted-foreground" />
        )}
      </div>

      <div>
        <p className="font-medium text-foreground">
          {isDragActive ? "Solte as fotos aqui" : "Arraste fotos aqui"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          ou <span className="text-brand-dark font-medium">clique para selecionar</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          JPG, PNG ou WebP · até 10 fotos · de 10 KB a 30 MB cada
        </p>
      </div>
    </div>
  );
}
