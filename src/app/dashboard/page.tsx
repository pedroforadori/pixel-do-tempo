export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CreditBalance } from "@/components/dashboard/CreditBalance";
import { RestorationHistory } from "@/components/dashboard/RestorationHistory";
import { createClient, createServiceClient, createAdminStorageClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { Credits, Restoration } from "@/types/database";

export const metadata = {
  title: "Painel | Pixel do Tempo",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard");

  const serviceSupabase = createServiceClient();

  const [{ data: creditsData }, { data: restorations }] = await Promise.all([
    supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single(),
    serviceSupabase
      .from("restorations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(9),
  ]);

  const balance = (creditsData as Pick<Credits, "balance"> | null)?.balance ?? 0;
  const items = (restorations as Restoration[] | null) ?? [];

  // Generate signed URLs for all images (1-hour TTL)
  const paths = new Set<string>();
  items.forEach((r) => {
    if (r.original_url) paths.add(r.original_url);
    if (r.restored_url) paths.add(r.restored_url);
  });

  const adminStorage = createAdminStorageClient();
  const signedUrls: Record<string, string> = {};
  await Promise.all(
    Array.from(paths).map(async (path) => {
      const { data } = await adminStorage
        .from("restorations")
        .createSignedUrl(path, 3600);
      if (data?.signedUrl) signedUrls[path] = data.signedUrl;
    })
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu painel</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
          </div>
          <Button
            className="bg-brand-dark hover:bg-brand-dark/90 text-white"
            nativeButton={false}
            render={<Link href="/restore" />}
          >
            <Upload className="h-4 w-4 mr-2" />
            Nova restauração
          </Button>
        </div>

        <div className="max-w-xs mb-8">
          <CreditBalance balance={balance} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Histórico de restaurações</h2>
          <RestorationHistory
            restorations={items}
            signedUrls={signedUrls}
            initialHasMore={items.length === 9}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
