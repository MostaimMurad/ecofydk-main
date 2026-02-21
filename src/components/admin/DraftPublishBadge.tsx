import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, FileEdit, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DraftPublishBadgeProps {
    id: string;
    status: string;
    table: 'content_blocks' | 'translations';
    size?: 'sm' | 'md';
    showActions?: boolean;
}

export function DraftPublishBadge({ id, status, table, size = 'sm', showActions = true }: DraftPublishBadgeProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const toggleMutation = useMutation({
        mutationFn: async () => {
            const newStatus = status === 'published' ? 'draft' : 'published';
            const updates: Record<string, unknown> = { status: newStatus };
            if (newStatus === 'published') updates.published_at = new Date().toISOString();
            const { error } = await supabase.from(table).update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            const key = table === 'content_blocks' ? 'admin-content-blocks' : 'admin-translations';
            queryClient.invalidateQueries({ queryKey: [key] });
            if (table === 'content_blocks') queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            toast({ title: status === 'published' ? 'Moved to draft' : 'Published!' });
        },
        onError: (e) => toast({ title: 'Failed: ' + (e as Error).message, variant: 'destructive' }),
    });

    const isPublished = status === 'published';
    const badgeSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

    return (
        <div className="flex items-center gap-1.5">
            <Badge
                variant="outline"
                className={cn(
                    badgeSize, 'gap-1 font-medium',
                    isPublished
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800'
                )}
            >
                {isPublished ? <Globe className="h-2.5 w-2.5" /> : <FileEdit className="h-2.5 w-2.5" />}
                {isPublished ? 'Published' : 'Draft'}
            </Badge>
            {showActions && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => { e.stopPropagation(); toggleMutation.mutate(); }}
                    disabled={toggleMutation.isPending}
                    title={isPublished ? 'Move to draft' : 'Publish'}
                >
                    {isPublished
                        ? <ArrowDownCircle className="h-3.5 w-3.5 text-amber-500" />
                        : <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500" />}
                </Button>
            )}
        </div>
    );
}

export default DraftPublishBadge;
