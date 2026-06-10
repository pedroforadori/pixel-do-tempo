const TESTIMONIALS = [
  {
    quote:
      "Restaurei fotos da minha avó que achávamos perdidas para sempre. O resultado foi inacreditável.",
    name: "Maria S.",
    role: "Professora",
  },
  {
    quote:
      "Em 20 segundos transformou uma foto desbotada dos anos 70 em algo nítido e cheio de vida.",
    name: "Carlos M.",
    role: "Fotógrafo",
  },
  {
    quote:
      "Simples demais. Subi a foto, aguardei um minuto e a minha família ficou emocionada com o resultado.",
    name: "Ana P.",
    role: "Arquiteta",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            O que dizem nossos usuários
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border bg-muted/50 p-6 space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
