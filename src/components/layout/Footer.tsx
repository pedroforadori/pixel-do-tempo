import Image from "next/image";
import Link from "next/link";
import { Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Topo: marca + navegação + contato */}
        <div className="grid gap-8 sm:grid-cols-3 mb-8">

          {/* Marca */}
          <div className="flex flex-col gap-3">
            <Link href="/#inicio" className="inline-flex items-center gap-2.5">
              <Image src="/logo-light.png" alt="" width={240} height={417} unoptimized className="h-8 w-auto dark:hidden" />
              <Image src="/logo-dark.png" alt="" width={122} height={205} unoptimized className="h-8 w-auto hidden dark:block" />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-foreground">Pixel do Tempo</span>
                <span className="text-[10px] text-muted-foreground">Revivendo momentos com IA</span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Restauração de fotografias antigas com inteligência artificial. Devolvemos
              vida às suas memórias.
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium text-foreground mb-1">Serviço</p>
            <Link href="/#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Como funciona
            </Link>
            <Link href="/#restaurar" className="text-muted-foreground hover:text-foreground transition-colors">
              Restaurar foto
            </Link>
            <Link href="/#precos" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
          </div>

          {/* Contato e redes */}
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium text-foreground mb-1">Contato</p>
            <a
              href="mailto:pedroforadori@gmail.com"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              pedroforadori@gmail.com
            </a>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground cursor-not-allowed text-xs">
              <Globe className="h-3.5 w-3.5" />
              Instagram (em breve)
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground cursor-not-allowed text-xs">
              <Globe className="h-3.5 w-3.5" />
              Facebook (em breve)
            </span>
          </div>
        </div>

        {/* Aviso de privacidade de IA */}
        <div className="rounded-xl border bg-muted/50 px-4 py-3 text-xs text-muted-foreground mb-8">
          <span className="font-medium text-foreground">Transparência:</span>{" "}
          Suas fotos são processadas pela IA exclusivamente para gerar a restauração solicitada.
          Não utilizamos suas imagens para treinar modelos, publicidade ou qualquer outra finalidade.
        </div>

        {/* Rodapé inferior */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center">
            <span>Foradori Soluções Digitais Ltda</span>
            <span className="hidden sm:inline">·</span>
            <span>CNPJ 30.791.983/0001-92</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <span>© {new Date().getFullYear()} Pixel do Tempo</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
