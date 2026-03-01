import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeaderBanner {
  id: string;
  image_url: string;
  mobile_image_url: string | null;
  link: string | null;
  display_order: number;
  active: boolean;
  autoplay_interval: number;
  created_at: string;
  updated_at: string;
}

export function useHeaderBanners() {
  return useQuery({
    queryKey: ['header-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_banners')
        .select('*')
        .eq('active', true)
        .order('display_order');
      if (error) throw error;
      return data as HeaderBanner[];
    },
  });
}

export function useAllHeaderBanners() {
  return useQuery({
    queryKey: ['all-header-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_banners')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as HeaderBanner[];
    },
  });
}

export function useCreateHeaderBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (banner: Omit<HeaderBanner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('header_banners').insert(banner as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['header-banners'] });
      qc.invalidateQueries({ queryKey: ['all-header-banners'] });
    },
  });
}

export function useUpdateHeaderBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...banner }: Partial<HeaderBanner> & { id: string }) => {
      const { data, error } = await supabase.from('header_banners').update(banner as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['header-banners'] });
      qc.invalidateQueries({ queryKey: ['all-header-banners'] });
    },
  });
}

export function useDeleteHeaderBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('header_banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['header-banners'] });
      qc.invalidateQueries({ queryKey: ['all-header-banners'] });
    },
  });
}
