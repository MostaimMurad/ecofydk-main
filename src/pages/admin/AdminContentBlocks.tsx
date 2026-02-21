import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus, Edit, Trash2, Search, ChevronDown, ChevronRight,
    FileText, Copy, Filter, Home, BookOpen, Leaf, ShieldCheck,
    BarChart3, Briefcase, Users, DollarSign, Wrench, Globe,
    LayoutGrid, Save, X, Eye, ChevronUp, History, Image as ImageIcon
} from 'lucide-react';
import { DraftPublishBadge } from '@/components/admin/DraftPublishBadge';
import { ContentVersionHistory } from '@/components/admin/ContentVersionHistory';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaPicker from '@/components/admin/MediaPicker';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Page definitions with icons and metadata ──────────────────────
interface PageDef {
    id: string;
    label: string;
    icon: any;
    description: string;
    sections: string[];
    color: string;
}

export const PAGES: PageDef[] = [
    {
        id: 'homepage', label: 'Homepage', icon: Home,
        description: 'Hero, impact counters, featured products, partners',
        sections: ['hero', 'hero_stats', 'stats', 'features', 'trusted_partners',
            'sustainability_highlights', 'sustainability_stats', 'newsletter_trust',
            'about', 'about_stats', 'about_features'],
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
        id: 'our-story', label: 'Our Story', icon: BookOpen,
        description: 'Timeline, team members, artisans, values',
        sections: ['story_stats'],
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
        id: 'sustainability', label: 'Sustainability', icon: Leaf,
        description: 'Practices, carbon stats, certifications, SDGs',
        sections: ['sustainability_practices', 'carbon_stats', 'certifications', 'sdg_goals'],
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        id: 'contact', label: 'Contact', icon: Globe,
        description: 'WhatsApp, business hours, offices',
        sections: ['contact'],
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
        id: 'footer', label: 'Footer', icon: LayoutGrid,
        description: 'Certifications, links',
        sections: ['footer_certifications'],
        color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    },
    {
        id: 'why-jute', label: 'Why Jute', icon: ShieldCheck,
        description: 'Comparison, lifecycle, statistics',
        sections: ['whyjute_comparison', 'whyjute_lifecycle', 'whyjute_stats'],
        color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    },
    {
        id: 'certifications-page', label: 'Certifications', icon: ShieldCheck,
        description: 'List, supply chain, regulations',
        sections: ['certifications_list', 'certifications_supplychain', 'certifications_regulations'],
        color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
        id: 'impact', label: 'Impact Dashboard', icon: BarChart3,
        description: 'Stats, milestones',
        sections: ['impact_stats', 'impact_milestones'],
        color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    {
        id: 'case-studies', label: 'Case Studies', icon: Briefcase,
        description: 'Client case studies, industries',
        sections: ['casestudies_list', 'casestudies_industries'],
        color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
    {
        id: 'pricing', label: 'Pricing Guide', icon: DollarSign,
        description: 'Tiers, shipping, FAQ',
        sections: ['pricing_tiers', 'pricing_shipping', 'pricing_faq'],
        color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
    {
        id: 'careers', label: 'Careers', icon: Users,
        description: 'Positions, perks',
        sections: ['careers_positions', 'careers_perks'],
        color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    },
    {
        id: 'resources', label: 'Resources Hub', icon: FileText,
        description: 'Downloadable resources',
        sections: ['resources_items'],
        color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
        id: 'custom', label: 'Custom Solutions', icon: Wrench,
        description: 'Product types, materials, sizes, branding, process',
        sections: ['custom_product_types', 'custom_materials', 'custom_sizes',
            'custom_branding', 'custom_process', 'custom_why'],
        color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
];

// ── Content Block Type ────────────────────────────────────────────
interface ContentBlock {
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
    status: string;
    published_at: string | null;
}

const emptyBlock: Omit<ContentBlock, 'id'> = {
    section: '', block_key: '', title_en: '', title_da: '',
    description_en: '', description_da: '', value: '', icon: '',
    color: '', image_url: '', metadata: {}, sort_order: 0,
    status: 'published', published_at: null,
};

// ── Helper: get page for a section ────────────────────────────────
function getPageForSection(section: string): PageDef | undefined {
    return PAGES.find(p => p.sections.includes(section));
}

// ── Inline Block Editor ───────────────────────────────────────────
function InlineBlockEditor({
    block, onSave, onCancel, isSaving
}: {
    block: ContentBlock;
    onSave: (b: ContentBlock) => void;
    onCancel: () => void;
    isSaving: boolean;
}) {
    const [edited, setEdited] = useState({ ...block });
    const [metaText, setMetaText] = useState(JSON.stringify(block.metadata || {}, null, 2));
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<'en' | 'da' | 'image_url'>('en');

    const handleSave = () => {
        try {
            const meta = JSON.parse(metaText);
            onSave({ ...edited, metadata: meta });
        } catch {
            // invalid JSON — ignore metadata changes
            onSave(edited);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-muted/30 px-6 py-5"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground">Title (English)</Label>
                        <Input value={edited.title_en || ''} onChange={e => setEdited({ ...edited, title_en: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground">Description (English)</Label>
                        <div className="mt-1">
                            <RichTextEditor
                                value={edited.description_en || ''}
                                onChange={(html) => setEdited({ ...edited, description_en: html })}
                                placeholder="Write English description..."
                                minHeight="120px"
                                onImageRequest={() => { setMediaPickerTarget('en'); setMediaPickerOpen(true); }}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground">Title (Danish)</Label>
                        <Input value={edited.title_da || ''} onChange={e => setEdited({ ...edited, title_da: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground">Description (Danish)</Label>
                        <div className="mt-1">
                            <RichTextEditor
                                value={edited.description_da || ''}
                                onChange={(html) => setEdited({ ...edited, description_da: html })}
                                placeholder="Skriv dansk beskrivelse..."
                                minHeight="120px"
                                onImageRequest={() => { setMediaPickerTarget('da'); setMediaPickerOpen(true); }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <Label className="text-xs font-medium text-muted-foreground">Value</Label>
                    <Input value={edited.value || ''} onChange={e => setEdited({ ...edited, value: e.target.value })} className="mt-1" />
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground">Icon</Label>
                    <Input value={edited.icon || ''} onChange={e => setEdited({ ...edited, icon: e.target.value })} className="mt-1" placeholder="e.g. ShieldCheck" />
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground">Color</Label>
                    <Input value={edited.color || ''} onChange={e => setEdited({ ...edited, color: e.target.value })} className="mt-1" placeholder="e.g. from-green-500 to-emerald-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <Label className="text-xs font-medium text-muted-foreground">Image</Label>
                    <div className="mt-1 flex gap-2">
                        <Input value={edited.image_url || ''} onChange={e => setEdited({ ...edited, image_url: e.target.value })} placeholder="https://... or browse media" className="flex-1" />
                        <Button type="button" variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => { setMediaPickerTarget('image_url'); setMediaPickerOpen(true); }}>
                            <ImageIcon className="h-4 w-4" /> Browse
                        </Button>
                    </div>
                    {edited.image_url && (
                        <div className="mt-2 relative group w-20 h-20 rounded-lg overflow-hidden border bg-muted">
                            <img src={edited.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                            <button type="button" className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" onClick={() => setEdited({ ...edited, image_url: '' })}>
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground">Sort Order</Label>
                    <Input type="number" value={edited.sort_order} onChange={e => setEdited({ ...edited, sort_order: parseInt(e.target.value) || 0 })} className="mt-1" />
                </div>
            </div>

            <div className="mt-4">
                <Label className="text-xs font-medium text-muted-foreground">Metadata (JSON)</Label>
                <Textarea value={metaText} onChange={e => setMetaText(e.target.value)} rows={4} className="mt-1 font-mono text-xs" />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
                    <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* MediaPicker for inserting images into description fields */}
            <MediaPicker
                open={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={(url) => {
                    if (mediaPickerTarget === 'image_url') {
                        setEdited({ ...edited, image_url: url });
                    } else if (mediaPickerTarget === 'en') {
                        setEdited({ ...edited, description_en: (edited.description_en || '') + `<img src="${url}" />` });
                    } else {
                        setEdited({ ...edited, description_da: (edited.description_da || '') + `<img src="${url}" />` });
                    }
                    setMediaPickerOpen(false);
                }}
            />
        </motion.div>
    );
}

// ── Main Component ────────────────────────────────────────────────
const AdminContentBlocks = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const activePage = searchParams.get('page') || 'all';
    const [search, setSearch] = useState('');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newBlock, setNewBlock] = useState<Omit<ContentBlock, 'id'>>(emptyBlock);
    const [metadataText, setMetadataText] = useState('{}');
    const [historyBlockId, setHistoryBlockId] = useState<string | null>(null);
    const [historyBlockKey, setHistoryBlockKey] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

    // ── Fetch all content blocks ──────────────────────────────────
    const { data: blocks, isLoading } = useQuery({
        queryKey: ['admin-content-blocks'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('content_blocks')
                .select('*')
                .order('section', { ascending: true })
                .order('sort_order', { ascending: true });
            if (error) throw error;
            return data as ContentBlock[];
        },
    });

    // ── Mutations ─────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('content_blocks').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            toast({ title: 'Content block deleted' });
        },
        onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
    });

    const updateMutation = useMutation({
        mutationFn: async (block: ContentBlock) => {
            const { id, ...rest } = block;
            const { error } = await supabase.from('content_blocks')
                .update({ ...rest, metadata: rest.metadata as Json }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            setEditingBlockId(null);
            toast({ title: 'Content block updated' });
        },
        onError: (e) => toast({ title: 'Failed: ' + (e as Error).message, variant: 'destructive' }),
    });

    const createMutation = useMutation({
        mutationFn: async (block: Omit<ContentBlock, 'id'>) => {
            const { error } = await supabase.from('content_blocks')
                .insert({ ...block, metadata: block.metadata as Json });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            setIsCreating(false);
            setNewBlock(emptyBlock);
            toast({ title: 'Content block created' });
        },
        onError: (e) => toast({ title: 'Failed: ' + (e as Error).message, variant: 'destructive' }),
    });

    const duplicateMutation = useMutation({
        mutationFn: async (block: ContentBlock) => {
            const { id, ...rest } = block;
            const { error } = await supabase.from('content_blocks').insert({
                ...rest, metadata: rest.metadata as Json,
                block_key: rest.block_key + '_copy', sort_order: rest.sort_order + 1,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            toast({ title: 'Content block duplicated' });
        },
        onError: () => toast({ title: 'Failed to duplicate', variant: 'destructive' }),
    });

    // ── Computed data ─────────────────────────────────────────────
    const groupedBlocks = useMemo(() => {
        if (!blocks) return {};
        return blocks.reduce((acc, block) => {
            if (!acc[block.section]) acc[block.section] = [];
            acc[block.section].push(block);
            return acc;
        }, {} as Record<string, ContentBlock[]>);
    }, [blocks]);

    // Count blocks per page
    const pageBlockCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        PAGES.forEach(page => {
            counts[page.id] = page.sections.reduce((sum, s) => sum + (groupedBlocks[s]?.length || 0), 0);
        });
        // Count "other" blocks not in any page
        const allMappedSections = PAGES.flatMap(p => p.sections);
        counts['other'] = Object.keys(groupedBlocks)
            .filter(s => !allMappedSections.includes(s))
            .reduce((sum, s) => sum + (groupedBlocks[s]?.length || 0), 0);
        return counts;
    }, [groupedBlocks]);

    // Filter sections by active page and search
    const filteredSections = useMemo(() => {
        let sections = Object.entries(groupedBlocks);
        if (activePage !== 'all') {
            const page = PAGES.find(p => p.id === activePage);
            if (page) {
                sections = sections.filter(([s]) => page.sections.includes(s));
            } else if (activePage === 'other') {
                const allMapped = PAGES.flatMap(p => p.sections);
                sections = sections.filter(([s]) => !allMapped.includes(s));
            }
        }
        if (search) {
            const q = search.toLowerCase();
            sections = sections
                .map(([section, items]) => [section, items.filter(b =>
                    b.block_key.toLowerCase().includes(q) ||
                    b.title_en?.toLowerCase().includes(q) ||
                    b.title_da?.toLowerCase().includes(q) ||
                    b.description_en?.toLowerCase().includes(q) ||
                    b.section.toLowerCase().includes(q)
                )] as [string, ContentBlock[]])
                .filter(([, items]) => items.length > 0);
        }
        return sections;
    }, [groupedBlocks, activePage, search]);

    const toggleSection = (s: string) =>
        setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));

    const openCreateDialog = (section?: string) => {
        setNewBlock({ ...emptyBlock, section: section || '' });
        setMetadataText('{}');
        setIsCreating(true);
    };

    const handleSaveCreate = () => {
        if (!newBlock.section || !newBlock.block_key) {
            toast({ title: 'Section and Block Key are required', variant: 'destructive' });
            return;
        }
        try {
            const meta = JSON.parse(metadataText);
            createMutation.mutate({ ...newBlock, metadata: meta });
        } catch { toast({ title: 'Invalid JSON', variant: 'destructive' }); }
    };

    const totalBlocks = blocks?.length || 0;
    const totalSections = Object.keys(groupedBlocks).length;

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Manager</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {totalSections} sections · {totalBlocks} content blocks
                    </p>
                </div>
                <Button onClick={() => openCreateDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Content Block
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by title, key, or section..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="space-y-6">
                {/* ── Main Content Area ────────────────────────────── */}
                <div className="min-w-0">
                    {/* Page header */}
                    {activePage !== 'all' && activePage !== 'other' && (
                        <Card className="mb-4">
                            <CardContent className="p-4 flex items-center gap-4">
                                {(() => {
                                    const page = PAGES.find(p => p.id === activePage);
                                    if (!page) return null;
                                    const Icon = page.icon;
                                    return (
                                        <>
                                            <div className={cn("p-3 rounded-xl", page.color)}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold">{page.label}</h2>
                                                <p className="text-sm text-muted-foreground">{page.description}</p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    )}

                    {/* Loading */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                        </div>
                    ) : filteredSections.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-lg">No content blocks found</h3>
                                <p className="text-muted-foreground mt-1">
                                    {search ? 'Try a different search query' : 'Create your first content block'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {filteredSections.map(([section, items]) => {
                                    const isExpanded = expandedSections[section];
                                    const page = getPageForSection(section);

                                    return (
                                        <motion.div key={section}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Card className="overflow-hidden">
                                                {/* Section Header */}
                                                <div
                                                    className="flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors px-4 py-3"
                                                    onClick={() => toggleSection(section)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("p-1.5 rounded-md", page?.color || 'bg-muted')}>
                                                            {isExpanded
                                                                ? <ChevronDown className="h-3.5 w-3.5" />
                                                                : <ChevronRight className="h-3.5 w-3.5" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-semibold">{section}</h3>
                                                            <p className="text-xs text-muted-foreground">
                                                                {items.length} {items.length === 1 ? 'block' : 'blocks'}
                                                                {page && ` · ${page.label}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="font-mono text-xs">{items.length}</Badge>
                                                        <Button size="sm" variant="outline" className="h-7 text-xs"
                                                            onClick={e => { e.stopPropagation(); openCreateDialog(section); }}>
                                                            <Plus className="h-3 w-3 mr-1" /> Add
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expanded Block List */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="border-t divide-y">
                                                                {items.map(block => (
                                                                    <div key={block.id}>
                                                                        {/* Block Row */}
                                                                        <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors group">
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2">
                                                                                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono shrink-0">
                                                                                        {block.block_key}
                                                                                    </code>
                                                                                    {block.icon && (
                                                                                        <Badge variant="outline" className="text-[10px]">{block.icon}</Badge>
                                                                                    )}
                                                                                    <DraftPublishBadge id={block.id} status={block.status || 'published'} table="content_blocks" />
                                                                                </div>
                                                                                <div className="flex gap-4 mt-1">
                                                                                    <p className="text-sm truncate flex-1">
                                                                                        {block.title_en || <span className="text-muted-foreground italic">No title</span>}
                                                                                    </p>
                                                                                    {block.value && (
                                                                                        <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                                                                                            {block.value}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Button size="icon" variant="ghost" className="h-8 w-8"
                                                                                    onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                                                                                    title="Edit">
                                                                                    {editingBlockId === block.id
                                                                                        ? <ChevronUp className="h-3.5 w-3.5" />
                                                                                        : <Edit className="h-3.5 w-3.5" />}
                                                                                </Button>
                                                                                <Button size="icon" variant="ghost" className="h-8 w-8"
                                                                                    onClick={(e) => { e.stopPropagation(); setHistoryBlockId(block.id); setHistoryBlockKey(block.block_key); }}
                                                                                    title="Version History">
                                                                                    <History className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <Button size="icon" variant="ghost" className="h-8 w-8"
                                                                                    onClick={() => duplicateMutation.mutate(block)} title="Duplicate">
                                                                                    <Copy className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <AlertDialog>
                                                                                    <AlertDialogTrigger asChild>
                                                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" title="Delete">
                                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                    </AlertDialogTrigger>
                                                                                    <AlertDialogContent>
                                                                                        <AlertDialogHeader>
                                                                                            <AlertDialogTitle>Delete block?</AlertDialogTitle>
                                                                                            <AlertDialogDescription>
                                                                                                Permanently delete "{block.block_key}" from "{block.section}".
                                                                                            </AlertDialogDescription>
                                                                                        </AlertDialogHeader>
                                                                                        <AlertDialogFooter>
                                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                            <AlertDialogAction
                                                                                                onClick={() => deleteMutation.mutate(block.id)}
                                                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                            >Delete</AlertDialogAction>
                                                                                        </AlertDialogFooter>
                                                                                    </AlertDialogContent>
                                                                                </AlertDialog>
                                                                            </div>
                                                                        </div>

                                                                        {/* Inline Editor */}
                                                                        <AnimatePresence>
                                                                            {editingBlockId === block.id && (
                                                                                <InlineBlockEditor
                                                                                    block={block}
                                                                                    onSave={b => updateMutation.mutate(b)}
                                                                                    onCancel={() => setEditingBlockId(null)}
                                                                                    isSaving={updateMutation.isPending}
                                                                                />
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Create Dialog ─────────────────────────────────────── */}
            <Dialog open={isCreating} onOpenChange={open => !open && setIsCreating(false)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Content Block</DialogTitle>
                        <DialogDescription>Add a new content block to manage dynamic page content.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Section <span className="text-destructive">*</span></Label>
                                <Input value={newBlock.section} onChange={e => setNewBlock({ ...newBlock, section: e.target.value })} placeholder="e.g. pricing_tiers" />
                            </div>
                            <div>
                                <Label>Block Key <span className="text-destructive">*</span></Label>
                                <Input value={newBlock.block_key} onChange={e => setNewBlock({ ...newBlock, block_key: e.target.value })} placeholder="e.g. tier_starter" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Title (English)</Label>
                                <Input value={newBlock.title_en || ''} onChange={e => setNewBlock({ ...newBlock, title_en: e.target.value })} />
                            </div>
                            <div>
                                <Label>Title (Danish)</Label>
                                <Input value={newBlock.title_da || ''} onChange={e => setNewBlock({ ...newBlock, title_da: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>Description (English)</Label>
                            <Textarea value={newBlock.description_en || ''} onChange={e => setNewBlock({ ...newBlock, description_en: e.target.value })} rows={3} />
                        </div>
                        <div>
                            <Label>Description (Danish)</Label>
                            <Textarea value={newBlock.description_da || ''} onChange={e => setNewBlock({ ...newBlock, description_da: e.target.value })} rows={3} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Value</Label>
                                <Input value={newBlock.value || ''} onChange={e => setNewBlock({ ...newBlock, value: e.target.value })} />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <Input value={newBlock.icon || ''} onChange={e => setNewBlock({ ...newBlock, icon: e.target.value })} placeholder="e.g. ShieldCheck" />
                            </div>
                            <div>
                                <Label>Color</Label>
                                <Input value={newBlock.color || ''} onChange={e => setNewBlock({ ...newBlock, color: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Image URL</Label>
                                <Input value={newBlock.image_url || ''} onChange={e => setNewBlock({ ...newBlock, image_url: e.target.value })} />
                            </div>
                            <div>
                                <Label>Sort Order</Label>
                                <Input type="number" value={newBlock.sort_order} onChange={e => setNewBlock({ ...newBlock, sort_order: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div>
                            <Label>Metadata (JSON)</Label>
                            <Textarea value={metadataText} onChange={e => setMetadataText(e.target.value)} rows={4} className="font-mono text-xs" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button onClick={handleSaveCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Block'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Version History Slide-over ────────────────────────── */}
            <AnimatePresence>
                {historyBlockId && (
                    <ContentVersionHistory
                        blockId={historyBlockId}
                        blockKey={historyBlockKey}
                        onClose={() => setHistoryBlockId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContentBlocks;
