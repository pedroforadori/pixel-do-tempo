import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    });
  }
  return stripeInstance;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const CREDIT_PACKS = [
  {
    credits: 5,
    priceId: requireEnv("STRIPE_PRICE_5_CREDITS"),
    label: "Mini",
    price: "R$ 5,90",
    pricePerCredit: "R$ 1,18",
    description: "Para testar com calma",
    highlight: false,
  },
  {
    credits: 10,
    priceId: requireEnv("STRIPE_PRICE_10_CREDITS"),
    label: "Starter",
    price: "R$ 9,90",
    pricePerCredit: "R$ 0,99",
    description: "Ideal para experimentar",
    highlight: false,
  },
  {
    credits: 50,
    priceId: requireEnv("STRIPE_PRICE_50_CREDITS"),
    label: "Popular",
    price: "R$ 39,90",
    pricePerCredit: "R$ 0,80",
    description: "Melhor custo-benefício",
    highlight: true,
  },
  {
    credits: 150,
    priceId: requireEnv("STRIPE_PRICE_150_CREDITS"),
    label: "Pro",
    price: "R$ 99,90",
    pricePerCredit: "R$ 0,67",
    description: "Para uso intenso",
    highlight: false,
  },
] as const;

export type CreditPack = (typeof CREDIT_PACKS)[number];
