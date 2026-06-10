export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { Camera } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-brand" />
          <span className="text-white font-semibold text-lg">Pixel do Tempo</span>
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
