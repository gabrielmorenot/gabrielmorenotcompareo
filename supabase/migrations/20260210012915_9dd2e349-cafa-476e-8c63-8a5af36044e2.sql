
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_title', 'Compare preços e **economize** nas suas compras'),
  ('hero_subtitle', 'Encontre os melhores descontos em TVs, celulares, eletrodomésticos e muito mais. Atualizamos as ofertas todos os dias para você!'),
  ('hero_badge_text', 'As melhores ofertas em um só lugar'),
  ('hero_button_primary_text', 'Ver Ofertas do Dia'),
  ('hero_button_primary_link', '#ofertas'),
  ('hero_button_secondary_text', 'Explorar Categorias'),
  ('hero_button_secondary_link', '#categorias')
ON CONFLICT (key) DO NOTHING;
