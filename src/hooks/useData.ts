import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Offer, Store, Banner, Category } from '@/types';

// Single Offer
export function useOffer(id: string) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*, stores(*)')
        .eq('id', id)
        .eq('active', true)
        .maybeSingle();
      if (error) throw error;
      return data as Offer | null;
    },
    enabled: !!id,
  });
}

// Related Offers (same category, excluding current)
export function useRelatedOffers(category?: Category, excludeId?: string) {
  return useQuery({
    queryKey: ['related-offers', category, excludeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*, stores(*)')
        .eq('active', true)
        .eq('category', category!)
        .neq('id', excludeId!)
        .limit(4)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Offer[];
    },
    enabled: !!category && !!excludeId,
  });
}

// Offers - supports filtering by category enum or category_id uuid
export function useOffers(categoryFilter?: string | null) {
  return useQuery({
    queryKey: ['offers', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('offers')
        .select('*, stores(*)')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (categoryFilter) {
        // Check if it's a UUID (category_id) or enum value
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryFilter);
        if (isUuid) {
          query = query.eq('category_id', categoryFilter);
        } else {
          query = query.eq('category', categoryFilter as Category);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Offer[];
    },
  });
}

export function useAllOffers() {
  return useQuery({
    queryKey: ['all-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*, stores(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Offer[];
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (offer: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'stores'>) => {
      const { data, error } = await supabase.from('offers').insert(offer).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-offers'] });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...offer }: Partial<Offer> & { id: string }) => {
      const { stores, ...offerData } = offer as any;
      const { data, error } = await supabase.from('offers').update(offerData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-offers'] });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-offers'] });
    },
  });
}

// Stores
export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stores').select('*').eq('active', true).order('display_order', { ascending: true }).order('name');
      if (error) throw error;
      return data as Store[];
    },
  });
}

export function useAllStores() {
  return useQuery({
    queryKey: ['all-stores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stores').select('*').order('name');
      if (error) throw error;
      return data as Store[];
    },
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (store: Omit<Store, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('stores').insert(store).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['all-stores'] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...store }: Partial<Store> & { id: string }) => {
      const { data, error } = await supabase.from('stores').update(store).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['all-stores'] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['all-stores'] });
    },
  });
}

// Banners - Blog section
export function useBanners() {
  return useQuery({
    queryKey: ['banners', 'blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .eq('section', 'blog')
        .order('display_order');
      if (error) throw error;
      return data as Banner[];
    },
  });
}

export function useAllBanners() {
  return useQuery({
    queryKey: ['all-banners', 'blog'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').eq('section', 'blog').order('display_order');
      if (error) throw error;
      return data as Banner[];
    },
  });
}

// Banners - Promos section
export function usePromoBanners() {
  return useQuery({
    queryKey: ['banners', 'promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .eq('section', 'promos')
        .order('display_order');
      if (error) throw error;
      return data as Banner[];
    },
  });
}

export function useAllPromoBanners() {
  return useQuery({
    queryKey: ['all-banners', 'promos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').eq('section', 'promos').order('display_order');
      if (error) throw error;
      return data as Banner[];
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('banners').insert(banner).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...banner }: Partial<Banner> & { id: string }) => {
      const { data, error } = await supabase.from('banners').update(banner).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
    },
  });
}
