import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from './useBlogPosts';

export const useRelatedPosts = (currentPostId: string, category: string | null) => {
  return useQuery({
    queryKey: ['related_posts', currentPostId, category],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // If we have less than 3 posts in the same category, fetch more from other categories
      if (data && data.length < 3 && category) {
        const remainingCount = 3 - data.length;
        const existingIds = data.map(p => p.id);
        existingIds.push(currentPostId);
        
        const { data: morePosts, error: moreError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('published_at', { ascending: false })
          .limit(remainingCount);
        
        if (!moreError && morePosts) {
          return [...data, ...morePosts] as BlogPost[];
        }
      }
      
      return data as BlogPost[];
    },
    enabled: !!currentPostId,
  });
};
