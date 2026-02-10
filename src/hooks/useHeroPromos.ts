import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroPromo {
  id: string;
  desktop_image_url: string;
  mobile_image_url: string | null;
  link: string | null;
  banner_size: 'small' | 'medium' | 'large' | 'full';
  display_order: number;
  active: boolean;
  autoplay_interval: number;
  created_at: string;
  updated_at: string;
}

export function useHeroPromos() {
  return useQuery({
    queryKey: ['hero-promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_promos')
        .select('*')
        .eq('active', true)
        .order('display_order');
      if (error) throw error;
      return data as HeroPromo[];
    },
  });
}

export function useAllHeroPromos() {
  return useQuery({
    queryKey: ['all-hero-promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_promos')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as HeroPromo[];
    },
  });
}

export function useCreateHeroPromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promo: Omit<HeroPromo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('hero_promos').insert(promo as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero-promos'] });
      qc.invalidateQueries({ queryKey: ['all-hero-promos'] });
    },
  });
}

export function useUpdateHeroPromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...promo }: Partial<HeroPromo> & { id: string }) => {
      const { data, error } = await supabase.from('hero_promos').update(promo as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero-promos'] });
      qc.invalidateQueries({ queryKey: ['all-hero-promos'] });
    },
  });
}

export function useDeleteHeroPromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_promos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero-promos'] });
      qc.invalidateQueries({ queryKey: ['all-hero-promos'] });
    },
  });
}
