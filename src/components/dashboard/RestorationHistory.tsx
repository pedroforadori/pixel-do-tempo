"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, Loader2, Upload } from "lucide-react";
import type { Restoration } from "@/types/database";

interface RestorationHistoryProps {
  restorations: Restoration[];
  signedUrls: Record<string, string>;
  initialHasMore: boolean;
}

const statusLabel: Record<Restoration["status"], string> = {
  pending: "Aguardando",
  processing: "Processando",
  completed: "Concluída",
  failed: "Falhou",
};

const statusVariant: Record<
  Restoration["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  processing: "secondary",
  completed: "default",
  failed: "destructive",
};

export function RestorationHistory({
  restorations,
  signedUrls: initialSignedUrls,
  initialHasMore,
}: RestorationHistoryProps) {
  const [items, setItems] = useState<Restoration[]>(restorations);
  const [signedUrls, setSignedUrls] = useState(initialSignedUrls);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  async function downloadRestored(id: string, url: string) {
    setDownloadingIds((prev) => new Set(prev).add(id));
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "foto-restaurada.jpg";
    a.click();
    URL.revokeObjectURL(href);
    setDownloadingIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  }

  async function loadMore() {
    setLoading(true);
    const cursor = items[items.length - 1].created_at;
    const res = await fetch(`/api/restorations?cursor=${encodeURIComponent(cursor)}&limit=9`);
    if (res.ok) {
      const { items: newItems, signedUrls: newUrls, hasMore: more } = await res.json();
      setItems((prev) => [...prev, ...newItems]);
      setSignedUrls((prev) => ({ ...prev, ...newUrls }));
      setHasMore(more);
    }
    setLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4 border rounded-xl">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
          <ImageIcon className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <p className="font-medium">Nenhuma restauração ainda</p>
          <p className="text-sm text-muted-foreground mt-1">
            Envie sua primeira foto para começar
          </p>
        </div>
        <Button
          className="bg-brand-dark hover:bg-brand-dark/90 text-white"
          nativeButton={false}
          render={<Link href="/restore" />}
        >
          <Upload className="h-4 w-4 mr-2" />
          Restaurar foto
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => {
          const restoredUrl = r.restored_url ? signedUrls[r.restored_url] : null;
          const originalUrl = signedUrls[r.original_url];

          return (
            <div
              key={r.id}
              className="rounded-xl border overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="grid grid-cols-2 h-32 bg-slate-100">
                {originalUrl ? (
                  <div className="relative border-r">
                    <Image
                      src={originalUrl}
                      alt="Original"
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">
                      Antes
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-r">
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  </div>
                )}
                {restoredUrl ? (
                  <div className="relative">
                    <Image
                      src={restoredUrl}
                      alt="Restaurada"
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-brand-dark/80 text-white px-1 rounded">
                      Depois
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <time className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </time>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[r.status]} className="text-xs">
                    {statusLabel[r.status]}
                  </Badge>
                  {r.status === "completed" && restoredUrl && (
                    <button
                      onClick={() => downloadRestored(r.id, restoredUrl)}
                      disabled={downloadingIds.has(r.id)}
                      title="Baixar foto restaurada"
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {downloadingIds.has(r.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Carregando…
              </>
            ) : (
              "Carregar mais"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
