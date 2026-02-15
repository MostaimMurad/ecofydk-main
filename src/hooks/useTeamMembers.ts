import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role_en: string;
  role_da: string;
  bio_en: string | null;
  bio_da: string | null;
  image_url: string | null;
  years_experience: number;
  sort_order: number;
}

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
  });
};
