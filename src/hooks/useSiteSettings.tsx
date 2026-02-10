import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  button_color: string;
  heading_font: string;
  body_font: string;
  cover_color: string;
  cover_image_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_badge_text: string;
  hero_button_primary_text: string;
  hero_button_primary_link: string;
  hero_button_secondary_text: string;
  hero_button_secondary_link: string;
  header_logo_size: string;
  footer_logo_size: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  logo_url: null,
  favicon_url: null,
  primary_color: '67 100% 50%',
  secondary_color: '220 15% 95%',
  background_color: '60 20% 98%',
  text_color: '220 20% 10%',
  button_color: '67 100% 50%',
  heading_font: 'Plus Jakarta Sans',
  body_font: 'Plus Jakarta Sans',
  cover_color: '67 100% 50%',
  cover_image_url: null,
  hero_title: 'Compare preços e **economize** nas suas compras',
  hero_subtitle: 'Encontre os melhores descontos em TVs, celulares, eletrodomésticos e muito mais. Atualizamos as ofertas todos os dias para você!',
  hero_badge_text: 'As melhores ofertas em um só lugar',
  hero_button_primary_text: 'Ver Ofertas do Dia',
  hero_button_primary_link: '#ofertas',
  hero_button_secondary_text: 'Explorar Categorias',
  hero_button_secondary_link: '#categorias',
  header_logo_size: '100',
  footer_logo_size: '100',
};

const SiteSettingsContext = createContext<{
  settings: SiteSettings;
  isLoading: boolean;
}>({ settings: DEFAULT_SETTINGS, isLoading: true });

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data: rawSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) throw error;
      return data as { key: string; value: string | null }[];
    },
  });

  const settings = useMemo(() => {
    if (!rawSettings) return DEFAULT_SETTINGS;
    const map: Record<string, string | null> = {};
    rawSettings.forEach(r => { map[r.key] = r.value; });
    return {
      logo_url: map.logo_url ?? DEFAULT_SETTINGS.logo_url,
      favicon_url: map.favicon_url ?? DEFAULT_SETTINGS.favicon_url,
      primary_color: map.primary_color ?? DEFAULT_SETTINGS.primary_color,
      secondary_color: map.secondary_color ?? DEFAULT_SETTINGS.secondary_color,
      background_color: map.background_color ?? DEFAULT_SETTINGS.background_color,
      text_color: map.text_color ?? DEFAULT_SETTINGS.text_color,
      button_color: map.button_color ?? DEFAULT_SETTINGS.button_color,
      heading_font: map.heading_font ?? DEFAULT_SETTINGS.heading_font,
      body_font: map.body_font ?? DEFAULT_SETTINGS.body_font,
      cover_color: map.cover_color ?? DEFAULT_SETTINGS.cover_color,
      cover_image_url: map.cover_image_url ?? DEFAULT_SETTINGS.cover_image_url,
      hero_title: map.hero_title ?? DEFAULT_SETTINGS.hero_title,
      hero_subtitle: map.hero_subtitle ?? DEFAULT_SETTINGS.hero_subtitle,
      hero_badge_text: map.hero_badge_text ?? DEFAULT_SETTINGS.hero_badge_text,
      hero_button_primary_text: map.hero_button_primary_text ?? DEFAULT_SETTINGS.hero_button_primary_text,
      hero_button_primary_link: map.hero_button_primary_link ?? DEFAULT_SETTINGS.hero_button_primary_link,
      hero_button_secondary_text: map.hero_button_secondary_text ?? DEFAULT_SETTINGS.hero_button_secondary_text,
      hero_button_secondary_link: map.hero_button_secondary_link ?? DEFAULT_SETTINGS.hero_button_secondary_link,
      header_logo_size: map.header_logo_size ?? DEFAULT_SETTINGS.header_logo_size,
      footer_logo_size: map.footer_logo_size ?? DEFAULT_SETTINGS.footer_logo_size,
    };
  }, [rawSettings]);

  // Apply CSS variables dynamically
  useEffect(() => {
    if (isLoading) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--accent', settings.primary_color);
    root.style.setProperty('--ring', settings.primary_color);
    root.style.setProperty('--neon', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--background', settings.background_color);
    root.style.setProperty('--foreground', settings.text_color);
    root.style.setProperty('--card-foreground', settings.text_color);

    // Fonts via CSS variables for global coverage
    root.style.setProperty('--font-body', `"${settings.body_font}", system-ui, sans-serif`);
    root.style.setProperty('--font-heading', `"${settings.heading_font}", system-ui, sans-serif`);
    document.body.style.fontFamily = `var(--font-body)`;

    // Favicon
    if (settings.favicon_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings, isLoading]);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

// Admin hooks
export function useAllSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data as { id: string; key: string; value: string | null }[];
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string | null }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}
