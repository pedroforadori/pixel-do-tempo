export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { RestoreClient } from "@/app/restore/RestoreClient";
import { CreditPackCard } from "@/components/pricing/CreditPackCard";
import { RedeemCoupon } from "@/components/pricing/RedeemCoupon";
import { CREDIT_PACKS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section id="inicio">
          <HeroSection />
        </section>

        {/* ── COMO FUNCIONA ─────────────────────────────────── */}
        <section id="como-funciona">
          <HowItWorksSection />
        </section>

        {/* ── RESTAURAR ─────────────────────────────────────── */}
        <section id="restaurar" className="py-16 sm:py-20 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Restaurar foto
              </h2>
              <p className="text-muted-foreground mt-2">
                Envie uma foto antiga e nossa IA restaura os detalhes em segundos.
              </p>
            </div>
            <RestoreClient />
          </div>
        </section>

        {/* ── DEPOIMENTOS ───────────────────────────────────── */}
        <section id="depoimentos">
          <TestimonialsSection />
        </section>

        {/* ── PREÇOS ────────────────────────────────────────── */}
        <section id="precos" className="py-16 sm:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 text-brand-text mb-3">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Sem assinatura</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Pacotes de créditos
              </h2>
              <p className="text-muted-foreground mt-2">
                Compre créditos e use quando quiser. 1 crédito = 1 restauração.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {CREDIT_PACKS.map((pack) => (
                <CreditPackCard
                  key={pack.credits}
                  pack={pack}
                  isAuthenticated={!!user}
                />
              ))}
            </div>

            {user && (
              <div className="max-w-sm mx-auto mt-6">
                <RedeemCoupon />
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-8">
              Pagamento seguro via Stripe · Créditos não expiram
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
