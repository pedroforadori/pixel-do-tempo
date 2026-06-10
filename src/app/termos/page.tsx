import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Termos de Uso — Pixel do Tempo",
  description: "Leia os termos de uso do Pixel do Tempo antes de utilizar o serviço.",
};

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Termos de Uso</h1>
          <p className="text-muted-foreground text-sm mb-10">Última atualização: junho de 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Sobre o serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              O <strong>Pixel do Tempo</strong> é um serviço de restauração de fotografias antigas
              por inteligência artificial, operado por <strong>Foradori Soluções Digitais Ltda</strong>,
              CNPJ 30.791.983/0001-92. Ao utilizar o serviço, você concorda integralmente com estes
              Termos de Uso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Elegibilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O serviço é destinado a maiores de 18 anos ou menores devidamente assistidos por
              responsáveis legais. Ao criar uma conta, você declara ter capacidade legal para
              celebrar contratos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Créditos e pagamentos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os créditos são adquiridos em pacotes via Stripe e não expiram. Cada crédito
              corresponde a uma restauração. Créditos consumidos em restaurações bem-sucedidas
              não são reembolsáveis. Em caso de falha técnica no processamento, o crédito é
              devolvido automaticamente à sua conta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Conteúdo enviado</h2>
            <p className="text-muted-foreground leading-relaxed">
              Você é o único responsável pelas imagens que envia. É proibido enviar imagens que
              violem direitos de terceiros, contenham conteúdo ilegal, nudez não consensual ou
              material ofensivo. Reservamo-nos o direito de suspender contas que infrinjam esta
              regra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Uso das imagens</h2>
            <p className="text-muted-foreground leading-relaxed">
              As imagens enviadas são processadas exclusivamente pela IA para gerar a restauração
              solicitada. <strong>Não utilizamos suas fotos para treinamento de modelos, publicidade
              ou qualquer outra finalidade além da restauração contratada.</strong> As imagens são
              armazenadas temporariamente e podem ser deletadas a qualquer momento mediante
              solicitação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Limitação de responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Pixel do Tempo é fornecido &quot;como está&quot;. Não garantimos resultados
              específicos de restauração, pois a qualidade depende da foto original. Não nos
              responsabilizamos por danos indiretos decorrentes do uso do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Alterações nos termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar estes Termos a qualquer momento. Alterações relevantes serão
              comunicadas por e-mail. O uso continuado após a notificação implica aceitação dos
              novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dúvidas ou solicitações:{" "}
              <a href="mailto:pedroforadori@gmail.com" className="text-brand-dark underline">
                pedroforadori@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t pt-6 mt-10 text-sm text-muted-foreground">
            <p>
              Foradori Soluções Digitais Ltda · CNPJ 30.791.983/0001-92 ·{" "}
              <Link href="/privacidade" className="underline hover:text-foreground">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
