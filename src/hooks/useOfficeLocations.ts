import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OfficeLocation {
  id: string;
  name_en: string;
  name_da: string;
  type: string;
  address: string;
  city: string;
  country: string;
  flag: string | null;
  lat: number | null;
  lng: number | null;
  sort_order: number;
}

export const useOfficeLocations = () => {
  return useQuery({
    queryKey: ['office-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_locations')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as OfficeLocation[];
    },
  });
};
