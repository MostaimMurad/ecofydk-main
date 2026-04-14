import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Section visibility is stored in the content_blocks table using a special
 * section called '_section_visibility'. The block_key uses the format
 * "pageId__sectionKey" (double underscore) to ensure uniqueness per page+section.
 *
 * IMPORTANT: is_active is always kept TRUE so that these entries pass the
 * RLS SELECT policy ("is_active = true"). The actual visibility state is
 * stored in metadata.visible (boolean). This avoids all RLS conflicts.
 */

// Build composite key
const makeKey = (pageId: string, sectionKey: string) => `${pageId}__${sectionKey}`;

// Parse composite key
const parseKey = (blockKey: string) => {
  const idx = blockKey.indexOf('__');
  if (idx === -1) return { pageId: 'unknown', sectionKey: blockKey };
  return { pageId: blockKey.slice(0, idx), sectionKey: blockKey.slice(idx + 2) };
};

// ── Read all section visibility entries ──────────────────────────
export const useSectionVisibility = () => {
  return useQuery({
    queryKey: ['section-visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('id, section, block_key, is_active, metadata')
        .eq('section', '_section_visibility')
        .order('block_key', { ascending: true });

      if (error) throw error;

      // Build a lookup map: "pageId:sectionKey" -> visible (boolean)
      const map: Record<string, boolean> = {};
      (data || []).forEach((entry: any) => {
        const { pageId, sectionKey } = parseKey(entry.block_key);
        // Visibility comes from metadata.visible, defaulting to true
        const meta = entry.metadata as Record<string, unknown> | null;
        const visible = meta?.visible !== false; // default true
        map[`${pageId}:${sectionKey}`] = visible;
      });

      return { entries: data, map };
    },
    staleTime: 30_000,
  });
};

// ── Check if a specific section is visible ──────────────────────
export const useIsSectionVisible = (pageId: string, sectionKey: string): boolean => {
  const { data } = useSectionVisibility();
  if (!data) return true;
  return data.map[`${pageId}:${sectionKey}`] !== false;
};

// ── Helper: check multiple sections for a page ──────────────────
export const usePageSectionVisibility = (pageId: string) => {
  const { data, isLoading } = useSectionVisibility();

  const isVisible = (sectionKey: string): boolean => {
    if (!data) return true;
    return data.map[`${pageId}:${sectionKey}`] !== false;
  };

  return { isVisible, isLoading };
};

// ── Toggle section visibility (admin mutation) ──────────────────
export const useToggleSectionVisibility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      pageId,
      sectionKey,
      visible,
    }: {
      pageId: string;
      sectionKey: string;
      visible: boolean;
    }) => {
      const compositeKey = makeKey(pageId, sectionKey);
      const label = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      // Always keep is_active = true to pass RLS SELECT policy.
      // Store actual visibility in metadata.visible.
      const { error } = await supabase
        .from('content_blocks')
        .upsert(
          {
            section: '_section_visibility',
            block_key: compositeKey,
            is_active: true, // Always true for RLS compatibility
            title_en: `${pageId}: ${label}`,
            metadata: { page: pageId, visible } as unknown as Json,
            sort_order: 0,
            status: 'published',
          },
          { onConflict: 'section,block_key' }
        );
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['section-visibility'] });
      toast({
        title: variables.visible ? 'Section shown' : 'Section hidden',
        description: `${variables.sectionKey.replace(/_/g, ' ')} is now ${variables.visible ? 'visible' : 'hidden'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update visibility',
        description: error?.message || 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};
