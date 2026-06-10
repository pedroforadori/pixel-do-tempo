"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CreditGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: "signup_required" | "insufficient_credits";
}

export function CreditGate({ open, onOpenChange, reason }: CreditGateProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Sparkles className="h-7 w-7 text-brand-dark" />
          </div>
          <DialogTitle className="text-center">
            {reason === "signup_required"
              ? "Crie uma conta para continuar"
              : "Créditos insuficientes"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason === "signup_required"
              ? "Você já usou sua restauração gratuita. Crie uma conta para restaurar mais fotos."
              : "Você não tem créditos suficientes. Adquira um pacote para continuar restaurando."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {reason === "signup_required" ? (
            <>
              <Button
                className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white"
                nativeButton={false}
                render={<Link href="/auth/signup" />}
              >
                Criar conta grátis
              </Button>
              <Button
                variant="outline"
                className="w-full"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                Já tenho conta
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white"
                nativeButton={false}
                render={<Link href="/pricing" />}
              >
                Ver pacotes de créditos
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
