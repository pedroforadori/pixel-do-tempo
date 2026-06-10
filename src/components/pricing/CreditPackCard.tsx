"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreditPack } from "@/lib/stripe";

interface CreditPackCardProps {
  pack: CreditPack;
  isAuthenticated: boolean;
}

export function CreditPackCard({ pack, isAuthenticated }: CreditPackCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (!isAuthenticated) {
      router.push("/auth/login?redirectTo=/pricing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: pack.priceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md",
        pack.highlight
          ? "border-brand-dark shadow-md ring-1 ring-brand-dark"
          : "border-border"
      )}
    >
      {pack.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-brand-dark text-white text-xs px-3 py-0.5">
            Mais popular
          </Badge>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-muted-foreground">{pack.label}</p>
        <p className="text-3xl font-bold mt-1">{pack.price}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{pack.pricePerCredit} por restauração</p>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        <li className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
          <span><strong>{pack.credits}</strong> restaurações</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
          IA GFPGAN v1.4
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
          Download em alta resolução
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
          Sem assinatura mensal
        </li>
      </ul>

      <Button
        className={cn(
          "w-full",
          pack.highlight
            ? "bg-brand-dark hover:bg-brand-dark/90 text-white"
            : ""
        )}
        variant={pack.highlight ? "default" : "outline"}
        onClick={handleBuy}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Comprar {pack.credits} créditos
      </Button>
    </div>
  );
}
