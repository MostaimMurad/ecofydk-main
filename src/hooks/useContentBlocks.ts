import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContentBlock {
  id: string;
  section: string;
  block_key: string;
  title_en: string | null;
  title_da: string | null;
  description_en: string | null;
  description_da: string | null;
  value: string | null;
  icon: string | null;
  color: string | null;
  image_url: string | null;
  metadata: Record<string, unknown>;
  sort_order: number;
}

export const useContentBlocks = (section: string) => {
  return useQuery({
    queryKey: ['content-blocks', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('section', section)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as ContentBlock[];
    },
  });
};

// Helper to get a single content block by key
export const useContentBlock = (section: string, blockKey: string) => {
  return useQuery({
    queryKey: ['content-blocks', section, blockKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('section', section)
        .eq('block_key', blockKey)
        .maybeSingle();

      if (error) throw error;
      return data as ContentBlock | null;
    },
  });
};
