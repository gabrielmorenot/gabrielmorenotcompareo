import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CashbackSectionData {
  id: string;
  subtitle: string;
  title: string;
  cta_text: string;
  cta_link: string | null;
  badge_text: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCashbackSection() {
  return useQuery({
    queryKey: ['cashback-section'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cashback_section')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CashbackSectionData | null;
    },
  });
}

export function useUpdateCashbackSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CashbackSectionData> & { id: string }) => {
      const { data, error } = await supabase
        .from('cashback_section')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashback-section'] });
    },
  });
}
