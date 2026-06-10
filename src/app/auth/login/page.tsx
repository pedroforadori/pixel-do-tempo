export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="" className="h-9 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold text-sm">Pixel do Tempo</span>
            <span className="text-slate-400 text-[10px]">Revivendo momentos com IA</span>
          </div>
        </Link>
        <div>
          <blockquote className="text-slate-300 text-lg leading-relaxed">
            &ldquo;Restaurei fotos da minha avó que achávamos perdidas para sempre.
            O resultado foi inacreditável.&rdquo;
          </blockquote>
          <p className="mt-4 text-slate-500 text-sm">— Maria S., usuária desde 2025</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
