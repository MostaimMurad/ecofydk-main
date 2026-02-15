import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TimelineEvent {
  id: string;
  year: string;
  title_en: string;
  title_da: string;
  description_en: string | null;
  description_da: string | null;
  color: string | null;
  sort_order: number;
}

export const useTimelineEvents = () => {
  return useQuery({
    queryKey: ['timeline-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as TimelineEvent[];
    },
  });
};
