
ALTER TABLE public.banners ADD COLUMN section text NOT NULL DEFAULT 'blog';

-- Mark existing banners as blog by default
-- Future promo banners will use 'promos'
