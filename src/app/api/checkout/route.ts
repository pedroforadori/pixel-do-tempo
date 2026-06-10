import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, CREDIT_PACKS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { priceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const pack = CREDIT_PACKS.find((p) => p.priceId && p.priceId === body.priceId);
  if (!pack) {
    return NextResponse.json({ error: "invalid_price" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: pack.priceId, quantity: 1 }],
    metadata: {
      user_id: user.id,
      credits_amount: String(pack.credits),
    },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    customer_email: user.email,
  });

  if (!session.url) {
    return NextResponse.json({ error: "checkout_url_unavailable" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
