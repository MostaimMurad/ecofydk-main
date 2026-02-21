import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type HeroVariant = 'video' | 'gradient' | 'image' | 'pattern';

export interface SiteSettings {
  id: string;
  hero_variant: HeroVariant;
  site_title_en: string;
  site_title_da: string;
  site_tagline_en: string;
  site_tagline_da: string;
  logo_url: string | null;
  footer_text_en: string;
  footer_text_da: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  cvr_number: string;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  map_embed_url: string;
  map_latitude: string;
  map_longitude: string;
  updated_at: string;
  updated_by: string | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (error) throw error;

      // Return default if no settings exist
      if (!data) {
        return {
          id: 'global',
          hero_variant: 'video' as HeroVariant,
          site_title_en: 'Ecofy',
          site_title_da: 'Ecofy',
          site_tagline_en: 'Sustainable Jute Products from Bangladesh',
          site_tagline_da: 'Bæredygtige juteprodukter fra Bangladesh',
          logo_url: null,
          footer_text_en: 'Crafting sustainable stories since 2019',
          footer_text_da: 'Skaber bæredygtige historier siden 2019',
          contact_email: 'hello@ecofy.dk',
          contact_phone: '+45 12 34 56 78',
          contact_address: 'Copenhagen, Denmark',
          cvr_number: '',
          social_facebook: null,
          social_instagram: null,
          social_linkedin: null,
          social_twitter: null,
          map_embed_url: '',
          map_latitude: '',
          map_longitude: '',
          updated_at: new Date().toISOString(),
          updated_by: null,
        };
      }

      return data as SiteSettings;
    },
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<SiteSettings, 'id' | 'updated_at' | 'updated_by'>>) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          ...updates,
          updated_at: new Date().toISOString(),
          updated_by: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'Settings Updated',
        description: 'Site settings have been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to update settings:', error);
    },
  });
};
