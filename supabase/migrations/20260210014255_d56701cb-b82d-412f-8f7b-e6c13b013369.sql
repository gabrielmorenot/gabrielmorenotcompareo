
-- Create popup_type enum
CREATE TYPE public.popup_type AS ENUM ('informativo', 'promocao', 'captura_lead');

-- Create popup_display_target enum
CREATE TYPE public.popup_display_target AS ENUM ('home', 'all', 'specific');

-- Create popup_device_target enum  
CREATE TYPE public.popup_device_target AS ENUM ('desktop', 'mobile', 'both');

-- Create popups table
CREATE TABLE public.popups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  popup_type public.popup_type NOT NULL DEFAULT 'informativo',
  display_target public.popup_display_target NOT NULL DEFAULT 'home',
  specific_pages TEXT[], -- array of paths for 'specific' target
  device_target public.popup_device_target NOT NULL DEFAULT 'both',
  delay_seconds INTEGER NOT NULL DEFAULT 0,
  once_per_session BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

-- Admin can manage
CREATE POLICY "Admins can manage popups"
ON public.popups
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read active popups
CREATE POLICY "Public can read active popups"
ON public.popups
FOR SELECT
TO anon, authenticated
USING (active = true);

-- Trigger for updated_at
CREATE TRIGGER update_popups_updated_at
BEFORE UPDATE ON public.popups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
