
CREATE TABLE public.header_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  autoplay_interval INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.header_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active header_banners" ON public.header_banners FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage header_banners" ON public.header_banners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
