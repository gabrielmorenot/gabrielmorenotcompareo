
-- Create hero_promos table
CREATE TABLE public.hero_promos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link TEXT,
  banner_size TEXT NOT NULL DEFAULT 'medium' CHECK (banner_size IN ('small', 'medium', 'large', 'full')),
  display_order INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  autoplay_interval INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_promos ENABLE ROW LEVEL SECURITY;

-- Public read active
CREATE POLICY "Public can read active hero_promos"
ON public.hero_promos
FOR SELECT
USING (active = true);

-- Admin manage
CREATE POLICY "Admins can manage hero_promos"
ON public.hero_promos
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE TRIGGER update_hero_promos_updated_at
BEFORE UPDATE ON public.hero_promos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
