import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PACKS = [
  { label: "Starter", credits: 10, price: "R$ 9,90", highlight: false },
  { label: "Popular", credits: 50, price: "R$ 39,90", highlight: true },
  { label: "Pro", credits: 150, price: "R$ 99,90", highlight: false },
];

export function PricingPreview() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Planos simples e transparentes
          </h2>
          <p className="text-muted-foreground mt-2">
            Sem assinatura. Compre créditos e use quando quiser.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {PACKS.map((pack) => (
            <div
              key={pack.label}
              className={`rounded-2xl border p-5 ${
                pack.highlight
                  ? "border-brand-dark ring-1 ring-brand-dark bg-card"
                  : "bg-card"
              }`}
            >
              <p className="text-sm font-medium text-muted-foreground">{pack.label}</p>
              <p className="text-2xl font-bold mt-1">{pack.price}</p>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                {pack.credits} restaurações
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-brand-dark hover:bg-brand-dark/90 text-white"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            Ver todos os pacotes
          </Button>
        </div>
      </div>
    </section>
  );
}
