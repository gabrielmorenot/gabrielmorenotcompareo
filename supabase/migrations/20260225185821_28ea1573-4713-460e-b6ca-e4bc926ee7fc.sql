
-- Restructure hero_promos: each row = one slide image in a specific slot
-- Slots: 'desktop_left' (small, vertical dots), 'desktop_right' (large, horizontal dots), 'mobile'
ALTER TABLE public.hero_promos ADD COLUMN slot text NOT NULL DEFAULT 'desktop_right';
ALTER TABLE public.hero_promos RENAME COLUMN desktop_image_url TO image_url;
ALTER TABLE public.hero_promos DROP COLUMN IF EXISTS mobile_image_url;
ALTER TABLE public.hero_promos DROP COLUMN IF EXISTS banner_size;
ALTER TABLE public.hero_promos DROP COLUMN IF EXISTS show_on_mobile;
