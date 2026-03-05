
CREATE TABLE public.cashback_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subtitle text NOT NULL DEFAULT 'Clique no seu preferido',
  title text NOT NULL DEFAULT 'Muitas lojas e produtos para ganhar muito cashback.',
  cta_text text NOT NULL DEFAULT 'Compre agora e receba até 12% de cashback',
  cta_link text,
  badge_text text DEFAULT 'Até 24x',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.cashback_section (subtitle, title, cta_text, badge_text) 
VALUES ('Clique no seu preferido', 'Muitas lojas e produtos para ganhar muito cashback.', 'Compre agora e receba até 12% de cashback', 'Até 24x');

-- Enable RLS
ALTER TABLE public.cashback_section ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read cashback_section" ON public.cashback_section FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins can manage cashback_section" ON public.cashback_section FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
