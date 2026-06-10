import { createClient } from "@/lib/supabase/server";

export async function getBalance(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .single();
  return data?.balance ?? 0;
}
