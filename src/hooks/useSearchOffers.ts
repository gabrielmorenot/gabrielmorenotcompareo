import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Offer } from '@/types';

export function useSearchOffers(query: string) {
  return useQuery({
    queryKey: ['search-offers', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*, stores(*)')
        .eq('active', true)
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Offer[];
    },
    enabled: query.length >= 2,
  });
}
