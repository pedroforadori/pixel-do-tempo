import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";

interface CreditBalanceProps {
  balance: number;
}

export function CreditBalance({ balance }: CreditBalanceProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Créditos disponíveis
        </CardTitle>
        <Sparkles className="h-4 w-4 text-brand-dark" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold">{balance}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {balance === 1 ? "restauração disponível" : "restaurações disponíveis"}
            </p>
          </div>
          <Button
            size="sm"
            className="bg-brand-dark hover:bg-brand-dark/90 text-white"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            <Plus className="h-4 w-4 mr-1" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
