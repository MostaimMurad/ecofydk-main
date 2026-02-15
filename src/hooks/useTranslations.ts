import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TranslationRow {
  key: string;
  value_en: string;
  value_da: string;
}

/**
 * Fetches all active translations from Supabase and returns them
 * as a Record<string, { en: string; da: string }> for fast key lookup.
 */
export const useTranslations = () => {
  return useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('key, value_en, value_da')
        .eq('is_active', true);

      if (error) throw error;

      const map: Record<string, { en: string; da: string }> = {};
      (data as TranslationRow[]).forEach((row) => {
        map[row.key] = { en: row.value_en, da: row.value_da };
      });
      return map;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes — translations rarely change
    gcTime: 30 * 60 * 1000,
  });
};
