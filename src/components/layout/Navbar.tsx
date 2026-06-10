import Link from "next/link";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavbarSignOut } from "./NavbarSignOut";
import { ThemeToggle } from "./ThemeToggle";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let balance: number | null = null;
  if (user) {
    const { data } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();
    balance = (data as { balance: number } | null)?.balance ?? 0;
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/#inicio" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt="" className="h-9 w-auto dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="" className="h-9 w-auto hidden dark:block" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-foreground">Pixel do Tempo</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">Revivendo momentos com IA</span>
          </div>
        </Link>

        {/* Nav links — âncoras */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#restaurar" className="hover:text-foreground transition-colors">
            Restaurar
          </Link>
          <Link href="/#precos" className="hover:text-foreground transition-colors">
            Preços
          </Link>
          <Link href="/#como-funciona" className="hover:text-foreground transition-colors">
            Como funciona
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {balance !== null && (
                <Link
                  href="/#precos"
                  className="hidden sm:flex items-center gap-1 text-xs rounded-full border border-border bg-secondary px-2.5 py-0.5 font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-brand-dark" />
                  {balance} crédito{balance !== 1 ? "s" : ""}
                  <span className="ml-1 text-brand-dark">+</span>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs bg-slate-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link href="/dashboard" />}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Painel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href="/#precos" />}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Comprar créditos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <NavbarSignOut />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                nativeButton={false}
                className="bg-brand-dark hover:bg-brand-dark/90 text-white"
                render={<Link href="/auth/signup" />}
              >
                Começar grátis
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
