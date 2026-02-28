
-- Create product_types table
CREATE TABLE public.product_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📦',
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public can read active product_types"
ON public.product_types FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage product_types"
ON public.product_types FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_product_types_updated_at
BEFORE UPDATE ON public.product_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.product_types (name, emoji, display_order) VALUES
('iPhone', '📱', 1),
('PlayStation', '🎮', 2),
('Airfryer', '🍟', 3),
('Smart TV', '📺', 4),
('Galaxy', '✨', 5),
('iPad', '📋', 6),
('Echo Dot', '🔊', 7),
('Kindle', '📖', 8),
('Apple Watch', '⌚', 9),
('AirPods', '🎧', 10),
('Xbox', '🕹️', 11),
('Nintendo Switch', '🎲', 12),
('Robô Aspirador', '🤖', 13),
('Cafeteira', '☕', 14),
('Soundbar', '🔈', 15),
('Câmera', '📷', 16),
('Drone', '🚁', 17),
('Monitor', '🖥️', 18);
