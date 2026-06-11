import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted/50 to-background py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Badge
          variant="secondary"
          className="mb-5 gap-1.5 border border-blue-100 bg-blue-50 text-blue-800"
        >
          <Sparkles className="h-3 w-3" />
          Powered by GFPGAN v1.4
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          Dê nova vida às suas
          <br />
          <span className="text-brand-dark">fotos antigas</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Nossa IA restaura detalhes, corrige desbotamento e aumenta a nitidez
          de fotos danificadas em segundos. Simples como tirar uma foto.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            className="bg-brand-dark hover:bg-brand-dark/90 text-white px-8"
            render={<Link href="#restaurar" />}
          >
            Restaurar foto agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="#precos" />}
          >
            Ver preços
          </Button>
        </div>
      </div>
    </section>
  );
}
