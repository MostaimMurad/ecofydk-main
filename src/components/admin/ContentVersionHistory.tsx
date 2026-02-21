import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { History, RotateCcw, X, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Json } from '@/integrations/supabase/types';

interface ContentBlockVersion {
    id: string;
    content_block_id: string;
    changed_by: string | null;
    changed_at: string;
    change_type: string;
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
    status: string;
}

interface ContentVersionHistoryProps {
    blockId: string;
    blockKey: string;
    onClose: () => void;
}

const changeTypeColors: Record<string, string> = {
    create: 'bg-green-500/10 text-green-600',
    update: 'bg-blue-500/10 text-blue-600',
    publish: 'bg-emerald-500/10 text-emerald-600',
    unpublish: 'bg-amber-500/10 text-amber-600',
    rollback: 'bg-purple-500/10 text-purple-600',
};

export function ContentVersionHistory({ blockId, blockKey, onClose }: ContentVersionHistoryProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

    const { data: versions, isLoading } = useQuery({
        queryKey: ['content-block-versions', blockId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('content_block_versions')
                .select('*')
                .eq('content_block_id', blockId)
                .order('changed_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            return data as ContentBlockVersion[];
        },
    });

    const rollbackMutation = useMutation({
        mutationFn: async (version: ContentBlockVersion) => {
            const { error } = await supabase.from('content_blocks').update({
                title_en: version.title_en,
                title_da: version.title_da,
                description_en: version.description_en,
                description_da: version.description_da,
                value: version.value,
                icon: version.icon,
                color: version.color,
                image_url: version.image_url,
                metadata: version.metadata as Json,
                sort_order: version.sort_order,
            }).eq('id', blockId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-block-versions', blockId] });
            toast({ title: 'Rolled back successfully' });
        },
        onError: (e) => toast({ title: 'Rollback failed: ' + (e as Error).message, variant: 'destructive' }),
    });

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        const diffDays = Math.floor(diffHr / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l shadow-2xl z-50 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                <div className="flex items-center gap-2.5">
                    <History className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-sm">Version History</h3>
                        <p className="text-xs text-muted-foreground">{blockKey}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Versions List */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">Loading history...</div>
                    ) : !versions?.length ? (
                        <div className="text-center py-8">
                            <History className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">No version history yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">Changes will be tracked automatically.</p>
                        </div>
                    ) : (
                        versions.map((v, i) => (
                            <div key={v.id} className="relative">
                                {/* Timeline line */}
                                {i < versions.length - 1 && (
                                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                                )}

                                <div
                                    className={cn(
                                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                        expandedVersion === v.id ? "bg-muted/50" : "hover:bg-muted/30"
                                    )}
                                    onClick={() => setExpandedVersion(expandedVersion === v.id ? null : v.id)}
                                >
                                    {/* Timeline dot */}
                                    <div className={cn("w-[10px] h-[10px] rounded-full mt-1 shrink-0 ring-2 ring-background",
                                        v.change_type === 'create' ? 'bg-green-500' :
                                            v.change_type === 'publish' ? 'bg-emerald-500' :
                                                v.change_type === 'unpublish' ? 'bg-amber-500' :
                                                    v.change_type === 'rollback' ? 'bg-purple-500' : 'bg-blue-500'
                                    )} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn("text-[10px] capitalize", changeTypeColors[v.change_type])}>
                                                {v.change_type}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {formatTime(v.changed_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {v.title_en || v.value || 'No title'}
                                        </p>

                                        {/* Expanded details */}
                                        <AnimatePresence>
                                            {expandedVersion === v.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-3 space-y-2 overflow-hidden"
                                                >
                                                    {v.title_en && (
                                                        <div>
                                                            <span className="text-[10px] uppercase text-muted-foreground font-medium">Title EN</span>
                                                            <p className="text-xs bg-muted rounded px-2 py-1 mt-0.5">{v.title_en}</p>
                                                        </div>
                                                    )}
                                                    {v.title_da && (
                                                        <div>
                                                            <span className="text-[10px] uppercase text-muted-foreground font-medium">Title DA</span>
                                                            <p className="text-xs bg-muted rounded px-2 py-1 mt-0.5">{v.title_da}</p>
                                                        </div>
                                                    )}
                                                    {v.description_en && (
                                                        <div>
                                                            <span className="text-[10px] uppercase text-muted-foreground font-medium">Description EN</span>
                                                            <p className="text-xs bg-muted rounded px-2 py-1 mt-0.5 line-clamp-3">{v.description_en}</p>
                                                        </div>
                                                    )}
                                                    {v.value && (
                                                        <div>
                                                            <span className="text-[10px] uppercase text-muted-foreground font-medium">Value</span>
                                                            <p className="text-xs bg-muted rounded px-2 py-1 mt-0.5">{v.value}</p>
                                                        </div>
                                                    )}
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="w-full mt-2 gap-1.5 text-xs h-7"
                                                        onClick={(e) => { e.stopPropagation(); rollbackMutation.mutate(v); }}
                                                        disabled={rollbackMutation.isPending}
                                                    >
                                                        <RotateCcw className="h-3 w-3" />
                                                        {rollbackMutation.isPending ? 'Rolling back...' : 'Restore this version'}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </motion.div>
    );
}

export default ContentVersionHistory;
