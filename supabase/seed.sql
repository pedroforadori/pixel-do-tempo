-- ═══════════════════════════════════════════════════════════════════════════
-- Pixel do Tempo — Seed Data (desenvolvimento)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.coupons (code, credits_amount, is_active)
VALUES
  ('LAUNCH10',   10,  TRUE),
  ('BETA50',     50,  TRUE),
  ('FOUNDER150', 150, TRUE),
  ('PROMO20',    20,  TRUE)
ON CONFLICT (code) DO NOTHING;
