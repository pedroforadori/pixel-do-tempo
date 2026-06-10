import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.arrayBuffer();
  const rawBody = Buffer.from(body);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook/stripe] signature verification failed:", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Idempotency: mark event as processed; bail only on unique_violation (23505)
  const { error: insertError } = await supabase
    .from("stripe_events")
    .insert({ id: event.id });

  if (insertError) {
    if (insertError.code === "23505") {
      // Already processed — return 200 so Stripe stops retrying
      return NextResponse.json({ received: true });
    }
    // Any other error (e.g. table not yet migrated): log and continue so credits
    // are still added; idempotency degrades gracefully rather than silently drops credits.
    console.error("[webhook/stripe] stripe_events insert error:", insertError);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const creditsAmount = Number(session.metadata?.credits_amount ?? 0);

    if (!userId || !creditsAmount) {
      console.error("[webhook/stripe] missing metadata:", session.metadata);
      return NextResponse.json({ error: "missing_metadata" }, { status: 422 });
    }

    const { error } = await supabase.rpc("add_credits", {
      p_user_id: userId,
      p_amount: creditsAmount,
    });

    if (error) {
      console.error("[webhook/stripe] add_credits failed:", error);
      return NextResponse.json({ error: "credit_update_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
