"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Tag } from "lucide-react";

export function RedeemCoupon() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "invalid_or_used_coupon") {
          toast.error("Cupom inválido ou já utilizado.");
        } else if (data.error === "coupon_already_used") {
          toast.error("Esse cupom já foi resgatado.");
        } else if (data.error === "unauthorized") {
          toast.error("Faça login para resgatar cupons.");
        } else {
          toast.error("Erro ao resgatar cupom.");
        }
        return;
      }

      toast.success(`${data.creditsAdded} créditos adicionados com sucesso!`);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-brand-dark" />
        <h3 className="font-semibold">Tem um cupom?</h3>
      </div>
      <form onSubmit={handleRedeem} className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="coupon" className="sr-only">Código do cupom</Label>
          <Input
            id="coupon"
            placeholder="Ex: LAUNCH10"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-mono uppercase tracking-wider"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Resgatar"
          )}
        </Button>
      </form>
    </div>
  );
}
