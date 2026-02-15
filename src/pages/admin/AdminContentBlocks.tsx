import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus, Edit, Trash2, Search, ChevronDown, ChevronRight,
    FileText, GripVertical, Copy, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Map sections to human-readable page names
const SECTION_PAGE_MAP: Record<string, string> = {
    // Why Jute
    whyjute_comparison: 'Why Jute',
    whyjute_lifecycle: 'Why Jute',
    whyjute_stats: 'Why Jute',
    // Certifications
    certifications_list: 'Certifications',
    certifications_supplychain: 'Certifications',
    certifications_regulations: 'Certifications',
    // Impact Dashboard
    impact_stats: 'Impact Dashboard',
    impact_milestones: 'Impact Dashboard',
    // Case Studies
    casestudies_list: 'Case Studies',
    casestudies_industries: 'Case Studies',
    // Pricing Guide
    pricing_tiers: 'Pricing Guide',
    pricing_shipping: 'Pricing Guide',
    pricing_faq: 'Pricing Guide',
    // Careers
    careers_positions: 'Careers',
    careers_perks: 'Careers',
    // Resources Hub
    resources_items: 'Resources Hub',
    // Custom Solutions
    custom_product_types: 'Custom Solutions',
    custom_materials: 'Custom Solutions',
    custom_sizes: 'Custom Solutions',
    custom_branding: 'Custom Solutions',
    custom_process: 'Custom Solutions',
    custom_why: 'Custom Solutions',
    // Homepage
    trusted_partners: 'Homepage',
    // More general sections
    hero: 'Homepage',
    stats: 'Homepage',
    features: 'Homepage',
};

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
}

const emptyBlock: Omit<ContentBlock, 'id'> = {
    section: '',
    block_key: '',
    title_en: '',
    title_da: '',
    description_en: '',
    description_da: '',
    value: '',
    icon: '',
    color: '',
    image_url: '',
    metadata: {},
    sort_order: 0,
};

const AdminContentBlocks = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [filterPage, setFilterPage] = useState<string>('all');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newBlock, setNewBlock] = useState<Omit<ContentBlock, 'id'>>(emptyBlock);
    const [metadataText, setMetadataText] = useState('{}');

    // Fetch all content blocks
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

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('content_blocks').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            toast({ title: 'Content block deleted' });
        },
        onError: () => {
            toast({ title: 'Failed to delete', variant: 'destructive' });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (block: ContentBlock) => {
            const { id, ...rest } = block;
            const { error } = await supabase.from('content_blocks').update({ ...rest, metadata: rest.metadata as Json }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            setEditingBlock(null);
            toast({ title: 'Content block updated' });
        },
        onError: (e) => {
            toast({ title: 'Failed to update: ' + (e as Error).message, variant: 'destructive' });
        },
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (block: Omit<ContentBlock, 'id'>) => {
            const { error } = await supabase.from('content_blocks').insert({ ...block, metadata: block.metadata as Json });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            queryClient.invalidateQueries({ queryKey: ['content-blocks'] });
            setIsCreating(false);
            setNewBlock(emptyBlock);
            toast({ title: 'Content block created' });
        },
        onError: (e) => {
            toast({ title: 'Failed to create: ' + (e as Error).message, variant: 'destructive' });
        },
    });

    // Duplicate mutation
    const duplicateMutation = useMutation({
        mutationFn: async (block: ContentBlock) => {
            const { id, ...rest } = block;
            const { error } = await supabase.from('content_blocks').insert({
                ...rest,
                metadata: rest.metadata as Json,
                block_key: rest.block_key + '_copy',
                sort_order: rest.sort_order + 1,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content-blocks'] });
            toast({ title: 'Content block duplicated' });
        },
        onError: () => {
            toast({ title: 'Failed to duplicate', variant: 'destructive' });
        },
    });

    // Group blocks by section
    const groupedBlocks = useMemo(() => {
        if (!blocks) return {};
        return blocks.reduce((acc, block) => {
            if (!acc[block.section]) acc[block.section] = [];
            acc[block.section].push(block);
            return acc;
        }, {} as Record<string, ContentBlock[]>);
    }, [blocks]);

    // Get unique page names for filter
    const pageNames = useMemo(() => {
        const pages = new Set<string>();
        Object.keys(groupedBlocks).forEach((section) => {
            pages.add(SECTION_PAGE_MAP[section] || 'Other');
        });
        return Array.from(pages).sort();
    }, [groupedBlocks]);

    // Filter sections
    const filteredSections = useMemo(() => {
        let sections = Object.entries(groupedBlocks);

        if (filterPage !== 'all') {
            sections = sections.filter(
                ([section]) => (SECTION_PAGE_MAP[section] || 'Other') === filterPage
            );
        }

        if (search) {
            const q = search.toLowerCase();
            sections = sections
                .map(([section, items]) => [
                    section,
                    items.filter(
                        (b) =>
                            b.block_key.toLowerCase().includes(q) ||
                            b.title_en?.toLowerCase().includes(q) ||
                            b.title_da?.toLowerCase().includes(q) ||
                            b.description_en?.toLowerCase().includes(q) ||
                            b.section.toLowerCase().includes(q)
                    ),
                ] as [string, ContentBlock[]])
                .filter(([, items]) => items.length > 0);
        }

        return sections;
    }, [groupedBlocks, filterPage, search]);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const openEditDialog = (block: ContentBlock) => {
        setEditingBlock({ ...block });
        setMetadataText(JSON.stringify(block.metadata || {}, null, 2));
    };

    const openCreateDialog = (section?: string) => {
        setNewBlock({ ...emptyBlock, section: section || '' });
        setMetadataText('{}');
        setIsCreating(true);
    };

    const handleSaveEdit = () => {
        if (!editingBlock) return;
        try {
            const meta = JSON.parse(metadataText);
            updateMutation.mutate({ ...editingBlock, metadata: meta });
        } catch {
            toast({ title: 'Invalid JSON in metadata', variant: 'destructive' });
        }
    };

    const handleSaveCreate = () => {
        if (!newBlock.section || !newBlock.block_key) {
            toast({ title: 'Section and Block Key are required', variant: 'destructive' });
            return;
        }
        try {
            const meta = JSON.parse(metadataText);
            createMutation.mutate({ ...newBlock, metadata: meta });
        } catch {
            toast({ title: 'Invalid JSON in metadata', variant: 'destructive' });
        }
    };

    const totalBlocks = blocks?.length || 0;
    const totalSections = Object.keys(groupedBlocks).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Manager</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage all dynamic content across {totalSections} sections ({totalBlocks} blocks)
                    </p>
                </div>
                <Button onClick={() => openCreateDialog()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Content Block
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, key, or section..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterPage} onValueChange={setFilterPage}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Pages</SelectItem>
                                {pageNames.map((page) => (
                                    <SelectItem key={page} value={page}>
                                        {page}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sections */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
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
                            const pageName = SECTION_PAGE_MAP[section] || 'Other';

                            return (
                                <motion.div
                                    key={section}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Card>
                                        <CardHeader
                                            className="cursor-pointer hover:bg-muted/50 transition-colors py-3 px-4"
                                            onClick={() => toggleSection(section)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <CardTitle className="text-base font-semibold">
                                                            {section}
                                                        </CardTitle>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {pageName} · {items.length} {items.length === 1 ? 'block' : 'blocks'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="font-mono text-xs">
                                                        {items.length}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openCreateDialog(section);
                                                        }}
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <CardContent className="p-0">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="w-8 px-2"></TableHead>
                                                                    <TableHead className="min-w-[120px]">Key</TableHead>
                                                                    <TableHead>Title (EN)</TableHead>
                                                                    <TableHead>Title (DA)</TableHead>
                                                                    <TableHead className="w-16">Order</TableHead>
                                                                    <TableHead className="w-20">Meta</TableHead>
                                                                    <TableHead className="w-32 text-right">Actions</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {items.map((block) => (
                                                                    <TableRow key={block.id} className="group">
                                                                        <TableCell className="px-2">
                                                                            <GripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                                                                {block.block_key}
                                                                            </code>
                                                                        </TableCell>
                                                                        <TableCell className="max-w-[200px] truncate">
                                                                            {block.title_en || (
                                                                                <span className="text-muted-foreground italic">—</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="max-w-[200px] truncate">
                                                                            {block.title_da || (
                                                                                <span className="text-muted-foreground italic">—</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline" className="font-mono text-xs">
                                                                                {block.sort_order}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {block.metadata &&
                                                                                Object.keys(block.metadata).length > 0 ? (
                                                                                <Badge className="text-[10px]">
                                                                                    {Object.keys(block.metadata).length} fields
                                                                                </Badge>
                                                                            ) : (
                                                                                <span className="text-muted-foreground text-xs">—</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => openEditDialog(block)}
                                                                                    title="Edit"
                                                                                >
                                                                                    <Edit className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => duplicateMutation.mutate(block)}
                                                                                    title="Duplicate"
                                                                                >
                                                                                    <Copy className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <AlertDialog>
                                                                                    <AlertDialogTrigger asChild>
                                                                                        <Button
                                                                                            size="icon"
                                                                                            variant="ghost"
                                                                                            className="h-8 w-8 hover:text-destructive"
                                                                                            title="Delete"
                                                                                        >
                                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                    </AlertDialogTrigger>
                                                                                    <AlertDialogContent>
                                                                                        <AlertDialogHeader>
                                                                                            <AlertDialogTitle>Delete block?</AlertDialogTitle>
                                                                                            <AlertDialogDescription>
                                                                                                This will permanently delete "{block.block_key}" from
                                                                                                "{block.section}". This action cannot be undone.
                                                                                            </AlertDialogDescription>
                                                                                        </AlertDialogHeader>
                                                                                        <AlertDialogFooter>
                                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                            <AlertDialogAction
                                                                                                onClick={() => deleteMutation.mutate(block.id)}
                                                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                            >
                                                                                                Delete
                                                                                            </AlertDialogAction>
                                                                                        </AlertDialogFooter>
                                                                                    </AlertDialogContent>
                                                                                </AlertDialog>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </CardContent>
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

            {/* Edit Dialog */}
            <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Content Block</DialogTitle>
                        <DialogDescription>
                            Section: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{editingBlock?.section}</code>
                        </DialogDescription>
                    </DialogHeader>
                    {editingBlock && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Section</Label>
                                    <Input
                                        value={editingBlock.section}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, section: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Block Key</Label>
                                    <Input
                                        value={editingBlock.block_key}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, block_key: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Title (English)</Label>
                                    <Input
                                        value={editingBlock.title_en || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, title_en: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Title (Danish)</Label>
                                    <Input
                                        value={editingBlock.title_da || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, title_da: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Description (English)</Label>
                                <Textarea
                                    value={editingBlock.description_en || ''}
                                    onChange={(e) =>
                                        setEditingBlock({ ...editingBlock, description_en: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Description (Danish)</Label>
                                <Textarea
                                    value={editingBlock.description_da || ''}
                                    onChange={(e) =>
                                        setEditingBlock({ ...editingBlock, description_da: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Value</Label>
                                    <Input
                                        value={editingBlock.value || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, value: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Icon</Label>
                                    <Input
                                        value={editingBlock.icon || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, icon: e.target.value })
                                        }
                                        placeholder="e.g. ShieldCheck"
                                    />
                                </div>
                                <div>
                                    <Label>Color</Label>
                                    <Input
                                        value={editingBlock.color || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, color: e.target.value })
                                        }
                                        placeholder="e.g. from-green-500 to-emerald-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Image URL</Label>
                                    <Input
                                        value={editingBlock.image_url || ''}
                                        onChange={(e) =>
                                            setEditingBlock({ ...editingBlock, image_url: e.target.value })
                                        }
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <Label>Sort Order</Label>
                                    <Input
                                        type="number"
                                        value={editingBlock.sort_order}
                                        onChange={(e) =>
                                            setEditingBlock({
                                                ...editingBlock,
                                                sort_order: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Metadata (JSON)</Label>
                                <Textarea
                                    value={metadataText}
                                    onChange={(e) => setMetadataText(e.target.value)}
                                    rows={6}
                                    className="font-mono text-xs"
                                    placeholder='{"key": "value"}'
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingBlock(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={(open) => !open && setIsCreating(false)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Content Block</DialogTitle>
                        <DialogDescription>Add a new content block to manage dynamic page content.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>
                                    Section <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    value={newBlock.section}
                                    onChange={(e) => setNewBlock({ ...newBlock, section: e.target.value })}
                                    placeholder="e.g. pricing_tiers"
                                />
                            </div>
                            <div>
                                <Label>
                                    Block Key <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    value={newBlock.block_key}
                                    onChange={(e) => setNewBlock({ ...newBlock, block_key: e.target.value })}
                                    placeholder="e.g. tier_starter"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Title (English)</Label>
                                <Input
                                    value={newBlock.title_en || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, title_en: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Title (Danish)</Label>
                                <Input
                                    value={newBlock.title_da || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, title_da: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Description (English)</Label>
                            <Textarea
                                value={newBlock.description_en || ''}
                                onChange={(e) => setNewBlock({ ...newBlock, description_en: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label>Description (Danish)</Label>
                            <Textarea
                                value={newBlock.description_da || ''}
                                onChange={(e) => setNewBlock({ ...newBlock, description_da: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Value</Label>
                                <Input
                                    value={newBlock.value || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, value: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <Input
                                    value={newBlock.icon || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, icon: e.target.value })}
                                    placeholder="e.g. ShieldCheck"
                                />
                            </div>
                            <div>
                                <Label>Color</Label>
                                <Input
                                    value={newBlock.color || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, color: e.target.value })}
                                    placeholder="e.g. from-green-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Image URL</Label>
                                <Input
                                    value={newBlock.image_url || ''}
                                    onChange={(e) => setNewBlock({ ...newBlock, image_url: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Sort Order</Label>
                                <Input
                                    type="number"
                                    value={newBlock.sort_order}
                                    onChange={(e) =>
                                        setNewBlock({ ...newBlock, sort_order: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Metadata (JSON)</Label>
                            <Textarea
                                value={metadataText}
                                onChange={(e) => setMetadataText(e.target.value)}
                                rows={6}
                                className="font-mono text-xs"
                                placeholder='{"key": "value"}'
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreating(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Block'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminContentBlocks;
