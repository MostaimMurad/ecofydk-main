import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNewsletterSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email, is_active: true },
          { onConflict: 'email' }
        );

      if (error) throw error;
    },
  });
};
