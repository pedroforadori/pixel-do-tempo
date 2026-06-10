import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const serviceSupabase = createServiceClient();

  // Fetch coupon (bypasses RLS)
  const { data: coupon, error: fetchError } = await serviceSupabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .is("used_by", null)
    .single();

  if (fetchError || !coupon) {
    return NextResponse.json({ error: "invalid_or_used_coupon" }, { status: 404 });
  }

  // Optimistic lock: mark coupon as used only if still unused
  const { data: updated, error: updateError } = await serviceSupabase
    .from("coupons")
    .update({ used_by: user.id, used_at: new Date().toISOString(), is_active: false })
    .eq("id", coupon.id)
    .is("used_by", null)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("[/api/redeem] update error:", updateError);
    return NextResponse.json({ error: "redeem_failed" }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "coupon_already_used" }, { status: 409 });
  }

  // Add credits
  const { data: newBalance, error: creditError } = await serviceSupabase.rpc("add_credits", {
    p_user_id: user.id,
    p_amount: coupon.credits_amount,
  });

  if (creditError) {
    console.error("[/api/redeem] add_credits error:", creditError);
    return NextResponse.json({ error: "credit_update_failed" }, { status: 500 });
  }

  return NextResponse.json({
    creditsAdded: coupon.credits_amount,
    newBalance,
  });
}
