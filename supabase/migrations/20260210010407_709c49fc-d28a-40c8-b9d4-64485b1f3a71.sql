
-- Site settings table for visual customization
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('logo_url', null),
  ('favicon_url', null),
  ('primary_color', '67 100% 50%'),
  ('secondary_color', '220 15% 95%'),
  ('background_color', '60 20% 98%'),
  ('text_color', '220 20% 10%'),
  ('button_color', '67 100% 50%'),
  ('heading_font', 'Plus Jakarta Sans'),
  ('body_font', 'Plus Jakarta Sans');

-- Dynamic categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '📦',
  image_url text,
  display_order integer DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, display_order) VALUES
  ('Eletrônicos', 'eletronicos', '📺', 1),
  ('Celulares e Telefonia', 'celulares', '📱', 2),
  ('Informática', 'informatica', '💻', 3),
  ('Eletrodomésticos', 'eletrodomesticos', '🧊', 4),
  ('Eletroportáteis', 'eletroportateis', '🔌', 5),
  ('Casa e Cozinha', 'casa-cozinha', '🏠', 6),
  ('Beleza e Cuidado Pessoal', 'beleza', '💄', 7),
  ('Esporte e Lazer', 'esporte-lazer', '⚽', 8),
  ('Pet Shop', 'pet-shop', '🐾', 9),
  ('Automotivo', 'automotivo', '🚗', 10),
  ('Games', 'games', '🎮', 11);

-- Menu items table
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  is_external boolean NOT NULL DEFAULT false,
  display_order integer DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active menu items" ON public.menu_items FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage menu items" ON public.menu_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default menu items
INSERT INTO public.menu_items (label, url, display_order) VALUES
  ('Ofertas do Dia', '#ofertas', 1),
  ('Categorias', '#categorias', 2),
  ('Lojas Parceiras', '#lojas', 3);

-- Add mobile_image_url to banners
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS mobile_image_url text;

-- Add category_id to offers (keeping old category column for now)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id);
