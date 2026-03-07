import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Offer, Store } from '@/types';

export function useStore(id: string) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Store | null;
    },
    enabled: !!id,
  });
}

export function useStoreOffers(storeId: string, categoryFilter?: string | null) {
  return useQuery({
    queryKey: ['store-offers', storeId, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('offers')
        .select('*, stores(*)')
        .eq('active', true)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (categoryFilter) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryFilter);
        if (isUuid) {
          query = query.eq('category_id', categoryFilter);
        } else {
          query = query.eq('category', categoryFilter);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Offer[];
    },
    enabled: !!storeId,
  });
}
