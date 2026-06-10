import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { StorageClient } from "@supabase/storage-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado em Server Components — middleware lida com refresh
          }
        },
      },
    }
  );
}

export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// StorageClient com service role explícito nos headers — bypassa RLS de forma garantida
export function createAdminStorageClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1`;
  return new StorageClient(storageUrl, {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  });
}
