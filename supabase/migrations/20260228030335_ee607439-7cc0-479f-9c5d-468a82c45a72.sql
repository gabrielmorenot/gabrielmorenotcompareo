
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS cashback_percent numeric DEFAULT 0;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS cta_text text DEFAULT 'Resgatar cashback';
