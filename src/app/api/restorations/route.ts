import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminStorageClient } from "@/lib/supabase/server";
import type { Restoration } from "@/types/database";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") ?? 9) || 9, 50);

  let query = supabase
    .from("restorations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt("created_at", cursor);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: "db_error" }, { status: 500 });

  const items = (data as Restoration[]) ?? [];

  const paths = new Set<string>();
  items.forEach((r) => {
    if (r.original_url) paths.add(r.original_url);
    if (r.restored_url) paths.add(r.restored_url);
  });

  const adminStorage = createAdminStorageClient();
  const signedUrls: Record<string, string> = {};
  await Promise.all(
    Array.from(paths).map(async (path) => {
      const { data: urlData } = await adminStorage
        .from("restorations")
        .createSignedUrl(path, 3600);
      if (urlData?.signedUrl) signedUrls[path] = urlData.signedUrl;
    })
  );

  return NextResponse.json({ items, signedUrls, hasMore: items.length === limit });
}
