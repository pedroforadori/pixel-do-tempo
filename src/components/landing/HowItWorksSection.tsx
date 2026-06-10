import { Upload, Cpu, Download, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "1. Envie a foto",
    description:
      "Faça upload de qualquer foto antiga — JPG, PNG ou WebP até 10MB.",
  },
  {
    icon: Cpu,
    title: "2. IA processa",
    description:
      "Nossa IA analisa e restaura cada detalhe: nitidez, cores e rostos.",
  },
  {
    icon: Download,
    title: "3. Baixe o resultado",
    description:
      "Receba a foto restaurada em alta resolução, pronta para imprimir.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Como funciona
          </h2>
          <p className="text-muted-foreground mt-2">
            Três passos simples para restaurar suas memórias
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark/10">
                <step.icon className="h-7 w-7 text-brand-dark" />
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-xl border bg-muted/50 px-5 py-4 max-w-2xl mx-auto">
          <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Suas fotos ficam seguras.</span>{" "}
            A IA processa sua imagem apenas para gerar a restauração — nunca usamos suas fotos para
            treinar modelos ou qualquer outra finalidade. Veja nossa{" "}
            <a href="/privacidade" className="underline text-foreground hover:text-brand-dark transition-colors">
              Política de Privacidade
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
