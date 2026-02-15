import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Languages,
  Filter,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import TranslatableField from '@/components/admin/TranslatableField';

interface TranslationRow {
  id: string;
  key: string;
  value_en: string;
  value_da: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TranslationForm {
  key: string;
  value_en: string;
  value_da: string;
  category: string;
}

const EMPTY_FORM: TranslationForm = {
  key: '',
  value_en: '',
  value_da: '',
  category: 'general',
};

const AdminTranslations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TranslationForm>(EMPTY_FORM);

  // ── Fetch translations ──────────────────────────────────────────────
  const { data: translations, isLoading } = useQuery({
    queryKey: ['admin-translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('category')
        .order('key');

      if (error) throw error;
      return data as TranslationRow[];
    },
  });

  // ── Derived: categories ─────────────────────────────────────────────
  const categories = Array.from(
    new Set(translations?.map((t) => t.category) ?? [])
  ).sort();

  // ── Filtered list ───────────────────────────────────────────────────
  const filtered = translations?.filter((t) => {
    const matchesSearch =
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      t.value_en.toLowerCase().includes(search.toLowerCase()) ||
      t.value_da.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ── Mutations ───────────────────────────────────────────────────────
  const upsertMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | null;
      data: TranslationForm;
    }) => {
      if (id) {
        const { error } = await supabase
          .from('translations')
          .update({
            key: data.key,
            value_en: data.value_en,
            value_da: data.value_da,
            category: data.category,
          })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('translations').insert({
          key: data.key,
          value_en: data.value_en,
          value_da: data.value_da,
          category: data.category,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({ title: editingId ? 'Translation updated' : 'Translation created' });
      closeDialog();
    },
    onError: (err: any) => {
      toast({
        title: 'Error saving translation',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('translations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({ title: 'Translation deleted' });
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('translations')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
  });

  // ── Dialog helpers ──────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (t: TranslationRow) => {
    setEditingId(t.id);
    setForm({
      key: t.key,
      value_en: t.value_en,
      value_da: t.value_da,
      category: t.category,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (!form.key.trim() || !form.value_en.trim() || !form.value_da.trim()) {
      toast({ title: 'All fields are required', variant: 'destructive' });
      return;
    }
    upsertMutation.mutate({ id: editingId, data: form });
  };

  // ── Category badge color helper ─────────────────────────────────────
  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      navigation: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      hero: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      products: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      testimonials: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      newsletter: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      contact: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      story: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      sustainability: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      footer: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
      faq: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colors[cat] ?? 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
            <Languages className="h-8 w-8 text-primary" />
            Translations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all UI translation strings (EN / DA)
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Translation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by key, English or Danish text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filtered && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing {filtered.length} of {translations?.length ?? 0} translations
            </p>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Key</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="min-w-[220px]">English</TableHead>
                    <TableHead className="min-w-[220px]">Danish</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No translations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered?.map((t) => (
                      <TableRow
                        key={t.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openEdit(t)}
                      >
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                            {t.key}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`capitalize text-xs ${categoryColor(t.category)}`}
                          >
                            {t.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm line-clamp-2">{t.value_en}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm line-clamp-2">{t.value_da}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActiveMutation.mutate({
                                id: t.id,
                                isActive: t.is_active,
                              });
                            }}
                          >
                            {t.is_active ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                                <Eye className="mr-1 h-3 w-3" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="mr-1 h-3 w-3" /> Inactive
                              </Badge>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete translation?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Key: <strong>{t.key}</strong> will be permanently
                                    deleted. The UI will fall back to hardcoded text.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(t.id)}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Translation' : 'New Translation'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-key">Key</Label>
                <Input
                  id="t-key"
                  placeholder="e.g. nav.home"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  disabled={!!editingId}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger id="t-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'general',
                      'navigation',
                      'hero',
                      'products',
                      'testimonials',
                      'newsletter',
                      'contact',
                      'story',
                      'sustainability',
                      'footer',
                      'faq',
                      'journal',
                      'auth',
                    ].map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TranslatableField
              label="Translation Value"
              enValue={form.value_en}
              daValue={form.value_da}
              onEnChange={(v) => setForm({ ...form, value_en: v })}
              onDaChange={(v) => setForm({ ...form, value_da: v })}
              multiline
              rows={3}
              enPlaceholder="English translation..."
              daPlaceholder="Danish translation..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={upsertMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTranslations;
