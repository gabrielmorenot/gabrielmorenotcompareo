import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Popup } from '@/types';

export function usePopups() {
  return useQuery({
    queryKey: ['popups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('active', true)
        .order('display_order');
      if (error) throw error;
      return data as Popup[];
    },
  });
}

export function useAllPopups() {
  return useQuery({
    queryKey: ['all-popups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as Popup[];
    },
  });
}

export function useCreatePopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (popup: Omit<Popup, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('popups').insert(popup as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['popups'] });
      qc.invalidateQueries({ queryKey: ['all-popups'] });
    },
  });
}

export function useUpdatePopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...popup }: Partial<Popup> & { id: string }) => {
      const { data, error } = await supabase.from('popups').update(popup as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['popups'] });
      qc.invalidateQueries({ queryKey: ['all-popups'] });
    },
  });
}

export function useDeletePopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('popups').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['popups'] });
      qc.invalidateQueries({ queryKey: ['all-popups'] });
    },
  });
}
