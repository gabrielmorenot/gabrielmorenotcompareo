import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductType {
  id: string;
  name: string;
  emoji: string;
  image_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useProductTypes() {
  return useQuery({
    queryKey: ['product-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('active', true)
        .order('display_order');
      if (error) throw error;
      return data as ProductType[];
    },
  });
}

export function useAllProductTypes() {
  return useQuery({
    queryKey: ['all-product-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as ProductType[];
    },
  });
}

export function useCreateProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pt: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('product_types').insert(pt).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
      qc.invalidateQueries({ queryKey: ['all-product-types'] });
    },
  });
}

export function useUpdateProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...pt }: Partial<ProductType> & { id: string }) => {
      const { data, error } = await supabase.from('product_types').update(pt).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
      qc.invalidateQueries({ queryKey: ['all-product-types'] });
    },
  });
}

export function useDeleteProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_types').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
      qc.invalidateQueries({ queryKey: ['all-product-types'] });
    },
  });
}
