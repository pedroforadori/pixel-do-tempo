-- ═══════════════════════════════════════════════════════════════════════════
-- Pixel do Tempo — Supabase Schema
-- Execute este arquivo completo no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────────────────────
-- TABLES
-- ───────────────────────────────────────────────────────────────────────────

-- profiles: espelho de auth.users, criado automaticamente por trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- credits: saldo atômico, uma linha por usuário
CREATE TABLE IF NOT EXISTS public.credits (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance    INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- restorations: histórico de jobs de restauração
CREATE TABLE IF NOT EXISTS public.restorations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  restored_url TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_msg    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- stripe_events: idempotência de webhooks — impede crédito duplicado em retentativas
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id           TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- coupons: códigos promocionais de uso único
CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           TEXT NOT NULL UNIQUE,
  credits_amount INTEGER NOT NULL CHECK (credits_amount > 0),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  used_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  used_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ───────────────────────────────────────────────────────────────────────────
-- TRIGGER: auto-criar profile + credits ao cadastrar usuário
-- ───────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ───────────────────────────────────────────────────────────────────────────
-- FUNCTION: consume_credits — atômico, levanta exceção se insuficiente
-- ───────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.consume_credits(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT balance
    INTO v_balance
    FROM public.credits
   WHERE user_id = p_user_id
   FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'credits_row_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'insufficient_credits' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.credits
     SET balance    = balance - p_amount,
         updated_at = NOW()
   WHERE user_id = p_user_id;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────────
-- FUNCTION: add_credits — upsert seguro, usado por webhook e redeem
-- ───────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  INSERT INTO public.credits (user_id, balance)
       VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance    = public.credits.balance + p_amount,
    updated_at = NOW()
  RETURNING balance INTO v_new_balance;

  RETURN v_new_balance;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons      ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- credits
CREATE POLICY "credits_select_own"
  ON public.credits FOR SELECT
  USING (auth.uid() = user_id);

-- restorations
CREATE POLICY "restorations_select_own"
  ON public.restorations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "restorations_insert_own"
  ON public.restorations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- coupons: leitura pública de cupons ativos e não usados (para validar no client)
CREATE POLICY "coupons_select_active"
  ON public.coupons FOR SELECT
  USING (is_active = TRUE AND used_by IS NULL);

-- ───────────────────────────────────────────────────────────────────────────
-- STORAGE: bucket "restorations"
-- Criar via dashboard: Storage → New bucket → "restorations" (private)
-- Depois executar as políticas abaixo:
-- ───────────────────────────────────────────────────────────────────────────

-- Permite upload para pasta do próprio usuário: {user_id}/arquivo
CREATE POLICY "storage_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restorations'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Permite leitura dos próprios arquivos
CREATE POLICY "storage_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'restorations'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Permite deleção dos próprios arquivos
CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restorations'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );
