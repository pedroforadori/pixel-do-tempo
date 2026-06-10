"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function NavbarSignOut() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="flex items-center gap-2 text-destructive focus:text-destructive"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </DropdownMenuItem>
  );
}
