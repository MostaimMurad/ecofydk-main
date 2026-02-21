import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderOpen, Save, Package, Search, Hash, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';

interface CategoryRow {
    id: string;
    name_en: string;
    name_da: string;
    created_at: string;
}

// ── Color palette for category cards (cycles) ──────────────────────
const CATEGORY_COLORS = [
    { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: 'text-blue-500' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', icon: 'text-emerald-500' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', icon: 'text-amber-500' },
    { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', icon: 'text-purple-500' },
    { bg: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-200 dark:border-pink-800', badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300', icon: 'text-pink-500' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-200 dark:border-cyan-800', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300', icon: 'text-cyan-500' },
];

const AdminCategories = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formId, setFormId] = useState('');
    const [formNameEn, setFormNameEn] = useState('');
    const [formNameDa, setFormNameDa] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // ── Data fetching ────────────────────────────────────────
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('id');
            if (error) throw error;
            return data as CategoryRow[];
        },
    });

    const { data: productCounts = {} } = useQuery({
        queryKey: ['admin-category-counts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('category_id');
            if (error) throw error;
            const counts: Record<string, number> = {};
            (data || []).forEach((p) => {
                counts[p.category_id] = (counts[p.category_id] || 0) + 1;
            });
            return counts;
        },
    });

    const filteredCategories = categories.filter(cat =>
        !searchQuery || cat.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.name_da.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalProducts = Object.values(productCounts).reduce((a, b) => a + b, 0);

    // ── Actions ──────────────────────────────────────────────
    const openNew = () => {
        setIsNew(true); setFormId(''); setFormNameEn(''); setFormNameDa('');
        setDialogOpen(true);
    };

    const openEdit = (cat: CategoryRow) => {
        setIsNew(false); setEditingCategory(cat);
        setFormId(cat.id); setFormNameEn(cat.name_en); setFormNameDa(cat.name_da);
        setDialogOpen(true);
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!formId.trim() || !formNameEn.trim() || !formNameDa.trim()) {
                throw new Error('All fields are required');
            }
            const slug = formId.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

            if (isNew) {
                const { error } = await supabase.from('product_categories').insert({
                    id: slug, name_en: formNameEn.trim(), name_da: formNameDa.trim(),
                });
                if (error) throw error;
            } else {
                if (editingCategory && editingCategory.id !== slug) {
                    const { error: prodError } = await supabase.from('products')
                        .update({ category_id: slug }).eq('category_id', editingCategory.id);
                    if (prodError) throw prodError;
                    const { error: delError } = await supabase.from('product_categories')
                        .delete().eq('id', editingCategory.id);
                    if (delError) throw delError;
                    const { error: insError } = await supabase.from('product_categories').insert({
                        id: slug, name_en: formNameEn.trim(), name_da: formNameDa.trim(),
                    });
                    if (insError) throw insError;
                } else {
                    const { error } = await supabase.from('product_categories')
                        .update({ name_en: formNameEn.trim(), name_da: formNameDa.trim() })
                        .eq('id', editingCategory!.id);
                    if (error) throw error;
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            queryClient.invalidateQueries({ queryKey: ['admin-category-counts'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: `✅ Category ${isNew ? 'created' : 'updated'}!` });
            setDialogOpen(false);
        },
        onError: (err: Error) => {
            toast({ title: err.message || 'Save failed', variant: 'destructive' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const count = productCounts[id] || 0;
            if (count > 0) throw new Error(`Cannot delete — ${count} product(s) still use this category`);
            const { error } = await supabase.from('product_categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: '✅ Category deleted' });
        },
        onError: (err: Error) => {
            toast({ title: err.message, variant: 'destructive' });
        },
    });

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">Product Categories</h1>
                    <p className="text-muted-foreground mt-1">
                        Organize products into browsable groups for your storefront.
                    </p>
                </div>
                <Button onClick={openNew} size="lg" className="gap-2 shadow-md">
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            {/* ── Summary Bar ─────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <FolderOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{categories.length}</p>
                            <p className="text-xs text-muted-foreground font-medium">Categories</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalProducts}</p>
                            <p className="text-xs text-muted-foreground font-medium">Total Products</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900">
                            <Hash className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">Avg per Category</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Search ──────────────────────────────────────── */}
            {categories.length > 3 && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="pl-9"
                    />
                </div>
            )}

            {/* ── Category Cards ──────────────────────────────── */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-5">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredCategories.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-12 flex flex-col items-center text-center">
                        <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                            <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                            {searchQuery ? 'No categories found' : 'No categories yet'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {searchQuery
                                ? `No results for "${searchQuery}". Try a different search.`
                                : 'Create your first category to start organizing products.'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={openNew} className="gap-2">
                                <Plus className="h-4 w-4" /> Create First Category
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat, i) => {
                            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                            const count = productCounts[cat.id] || 0;

                            return (
                                <motion.div
                                    key={cat.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className={`group overflow-hidden border ${color.border} hover:shadow-lg transition-all duration-300`}>
                                        <CardContent className="p-0">
                                            <div className="flex items-stretch">
                                                {/* Color accent */}
                                                <div className={`w-1.5 ${color.bg}`} style={{ background: `var(--${color.icon.replace('text-', '')})` }} />

                                                <div className="flex-1 p-5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        {/* Category info */}
                                                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                                            <div className={`p-2.5 rounded-xl ${color.bg} shrink-0`}>
                                                                <FolderOpen className={`h-5 w-5 ${color.icon}`} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-semibold text-base truncate">{cat.name_en}</h3>
                                                                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 shrink-0">
                                                                        {cat.id}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground truncate">
                                                                    🇩🇰 {cat.name_da}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2.5">
                                                                    <Badge className={`text-xs font-medium ${color.badge} border-0`}>
                                                                        <Package className="h-3 w-3 mr-1" />
                                                                        {count} {count === 1 ? 'product' : 'products'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <Button
                                                                variant="ghost" size="icon"
                                                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => openEdit(cat)}
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete "{cat.name_en}"?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {count > 0
                                                                                ? `This category has ${count} product(s). You must reassign them before deleting.`
                                                                                : 'This action cannot be undone. The category will be permanently removed.'}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            disabled={count > 0}
                                                                            onClick={() => deleteMutation.mutate(cat.id)}
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── Add/Edit Dialog ──────────────────────────────── */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-primary" />
                            {isNew ? 'Add New Category' : 'Edit Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {isNew ? 'Create a new product category with English and Danish names.' : 'Update the category details below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Category ID / Slug</Label>
                            <Input
                                value={formId}
                                onChange={(e) => setFormId(e.target.value)}
                                placeholder="e.g. bags, sacks, decor"
                                disabled={!isNew}
                                className="font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Used in URLs and database. Lowercase only, no spaces.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">🇬🇧 English Name</Label>
                                <Input
                                    value={formNameEn}
                                    onChange={(e) => setFormNameEn(e.target.value)}
                                    placeholder="e.g. Bags"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">🇩🇰 Danish Name</Label>
                                <Input
                                    value={formNameDa}
                                    onChange={(e) => setFormNameDa(e.target.value)}
                                    placeholder="f.eks. Tasker"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
                            {saveMutation.isPending ? 'Saving...' : (
                                <><Save className="h-4 w-4" /> {isNew ? 'Create' : 'Update'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
