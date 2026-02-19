import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, FolderOpen, Save, X, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

interface CategoryRow {
    id: string;
    name_en: string;
    name_da: string;
    created_at: string;
}

const AdminCategories = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formId, setFormId] = useState('');
    const [formNameEn, setFormNameEn] = useState('');
    const [formNameDa, setFormNameDa] = useState('');
    const [isNew, setIsNew] = useState(false);

    // Fetch categories with product count
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

    // Fetch product counts per category
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

    const openNew = () => {
        setIsNew(true);
        setFormId('');
        setFormNameEn('');
        setFormNameDa('');
        setDialogOpen(true);
    };

    const openEdit = (cat: CategoryRow) => {
        setIsNew(false);
        setEditingCategory(cat);
        setFormId(cat.id);
        setFormNameEn(cat.name_en);
        setFormNameDa(cat.name_da);
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
                    id: slug,
                    name_en: formNameEn.trim(),
                    name_da: formNameDa.trim(),
                });
                if (error) throw error;
            } else {
                // If ID changed, we need to update products too
                if (editingCategory && editingCategory.id !== slug) {
                    // Update products referencing old category
                    const { error: prodError } = await supabase
                        .from('products')
                        .update({ category_id: slug })
                        .eq('category_id', editingCategory.id);
                    if (prodError) throw prodError;

                    // Delete old and insert new
                    const { error: delError } = await supabase
                        .from('product_categories')
                        .delete()
                        .eq('id', editingCategory.id);
                    if (delError) throw delError;

                    const { error: insError } = await supabase.from('product_categories').insert({
                        id: slug,
                        name_en: formNameEn.trim(),
                        name_da: formNameDa.trim(),
                    });
                    if (insError) throw insError;
                } else {
                    const { error } = await supabase
                        .from('product_categories')
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
            if (count > 0) {
                throw new Error(`Cannot delete — ${count} product(s) still use this category`);
            }
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
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-foreground">Product Categories</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage the categories shown in product filters and on the product detail page.
                    </p>
                </div>
                <Button onClick={openNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Categories Table */}
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p>No categories yet. Click "Add Category" to create one.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {/* Header Row */}
                            <div className="grid grid-cols-[1fr_1.5fr_1.5fr_auto_auto] gap-4 px-6 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <span>ID / Slug</span>
                                <span>🇬🇧 English</span>
                                <span>🇩🇰 Dansk</span>
                                <span>Products</span>
                                <span>Actions</span>
                            </div>

                            {/* Data Rows */}
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="grid grid-cols-[1fr_1.5fr_1.5fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors"
                                >
                                    <div>
                                        <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{cat.id}</code>
                                    </div>
                                    <span className="text-sm font-medium">{cat.name_en}</span>
                                    <span className="text-sm">{cat.name_da}</span>
                                    <div className="text-center">
                                        <Badge variant="secondary" className="text-xs">
                                            <Package className="h-3 w-3 mr-1" />
                                            {productCounts[cat.id] || 0}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => openEdit(cat)}
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete "{cat.name_en}"?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {(productCounts[cat.id] || 0) > 0
                                                            ? `This category has ${productCounts[cat.id]} product(s). You must reassign them before deleting.`
                                                            : 'This action cannot be undone.'}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        disabled={(productCounts[cat.id] || 0) > 0}
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isNew ? 'Add New Category' : 'Edit Category'}</DialogTitle>
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
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => saveMutation.mutate()}
                            disabled={saveMutation.isPending}
                            className="gap-2"
                        >
                            {saveMutation.isPending ? 'Saving...' : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isNew ? 'Create' : 'Update'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
