
-- Add cover settings
INSERT INTO public.site_settings (key, value) VALUES
  ('cover_color', '67 100% 50%'),
  ('cover_image_url', null)
ON CONFLICT DO NOTHING;
