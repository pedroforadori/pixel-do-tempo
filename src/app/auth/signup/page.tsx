export const dynamic = "force-dynamic";

import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Camera } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-brand" />
          <span className="text-white font-semibold text-lg">Pixel do Tempo</span>
        </Link>
        <div className="space-y-4">
          <p className="text-slate-300 text-xl font-medium">
            Dê nova vida às suas memórias
          </p>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              1 restauração grátis para começar
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              IA de última geração (GFPGAN v1.4)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              Resultado em menos de 30 segundos
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <SignUpForm />
      </div>
    </div>
  );
}
