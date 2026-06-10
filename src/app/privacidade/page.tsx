import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Política de Privacidade — Pixel do Tempo",
  description: "Saiba como o Pixel do Tempo coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground text-sm mb-10">Última atualização: junho de 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Quem somos</h2>
            <p className="text-muted-foreground leading-relaxed">
              O <strong>Pixel do Tempo</strong> é operado por <strong>Foradori Soluções Digitais Ltda</strong>,
              CNPJ 30.791.983/0001-92, com sede no Brasil. Para qualquer questão relacionada a
              privacidade, entre em contato pelo e-mail{" "}
              <a href="mailto:pedroforadori@gmail.com" className="text-brand-dark underline">
                pedroforadori@gmail.com
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Dados que coletamos</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
              <li>
                <strong>Dados de cadastro:</strong> nome e endereço de e-mail ao criar uma conta.
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados diretamente pelo Stripe. Não
                armazenamos números de cartão ou dados bancários.
              </li>
              <li>
                <strong>Imagens enviadas:</strong> as fotos que você envia para restauração.
                São armazenadas temporariamente no Supabase Storage e usadas exclusivamente
                para processar a restauração solicitada.
              </li>
              <li>
                <strong>Dados de uso:</strong> logs de acesso, tipo de navegador e IP para
                segurança e diagnóstico de erros.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Como usamos seus dados</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
              <li>Fornecer o serviço de restauração de fotos solicitado.</li>
              <li>Gerenciar sua conta e histórico de créditos.</li>
              <li>Processar pagamentos e emitir comprovantes.</li>
              <li>Enviar comunicações sobre sua conta (nunca marketing sem consentimento).</li>
              <li>Cumprir obrigações legais e fiscais brasileiras.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. O que NÃO fazemos com suas fotos</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-2">Nosso compromisso com suas imagens:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Não usamos suas fotos para treinar modelos de IA.</li>
                <li>Não compartilhamos suas imagens com terceiros para fins comerciais.</li>
                <li>Não exibimos suas fotos publicamente.</li>
                <li>Não vendemos seus dados a anunciantes.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Compartilhamento de dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Compartilhamos dados apenas com provedores essenciais para o funcionamento do
              serviço: <strong>Supabase</strong> (banco de dados e armazenamento),{" "}
              <strong>Stripe</strong> (pagamentos) e <strong>Replicate</strong> (processamento
              de IA). Todos operando sob contratos de confidencialidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Retenção de dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. As imagens processadas podem
              ser deletadas a qualquer momento a seu pedido. Ao encerrar sua conta, seus dados
              pessoais são excluídos em até 30 dias, salvo obrigações legais de retenção.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Seus direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem
              direito a:
            </p>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1 text-sm">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou incorretos.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação dos dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
              Para exercer seus direitos, entre em contato:{" "}
              <a href="mailto:pedroforadori@gmail.com" className="text-brand-dark underline">
                pedroforadori@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies essenciais para autenticação e funcionamento do serviço. Não
              utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <div className="border-t pt-6 mt-10 text-sm text-muted-foreground">
            <p>
              Foradori Soluções Digitais Ltda · CNPJ 30.791.983/0001-92 ·{" "}
              <Link href="/termos" className="underline hover:text-foreground">
                Termos de Uso
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
