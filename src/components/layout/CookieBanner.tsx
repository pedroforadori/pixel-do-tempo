"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "pdt_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="h-5 w-5 text-brand-dark shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-muted-foreground flex-1">
          Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para
          melhorar sua experiência. Ao continuar navegando, você concorda com nossa{" "}
          <Link href="/privacidade" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
