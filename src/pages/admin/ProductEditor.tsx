import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import TranslatableField from '@/components/admin/TranslatableField';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  slug: z.string().min(2, 'Enter slug').regex(/^[a-z0-9-]+$/, 'Use only lowercase letters, numbers and hyphens'),
  category_id: z.string().min(1, 'Select a category'),
  name_en: z.string().min(2, 'Enter English name'),
  name_da: z.string().min(2, 'Enter Danish name'),
  description_en: z.string().min(10, 'Enter English description'),
  description_da: z.string().min(10, 'Enter Danish description'),
  spec_size: z.string().optional(),
  spec_weight: z.string().optional(),
  spec_material: z.string().optional(),
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().default(0),
});

type ProductForm = z.infer<typeof productSchema>;

const categories = [
  { id: 'bags', label: 'Bags' },
  { id: 'sacks', label: 'Sacks' },
  { id: 'decor', label: 'Home Décor' },
  { id: 'rope', label: 'Rope & Twine' },
];

const ProductEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [useCasesEn, setUseCasesEn] = useState<string[]>([]);
  const [useCasesDa, setUseCasesDa] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      slug: '',
      category_id: '',
      name_en: '',
      name_da: '',
      description_en: '',
      description_da: '',
      spec_size: '',
      spec_weight: '',
      spec_material: '',
      featured: false,
      is_active: true,
      sort_order: 0,
    },
  });

  // Fetch existing product if editing
  const { isLoading: fetchLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Populate form
      form.reset({
        slug: data.slug,
        category_id: data.category_id,
        name_en: data.name_en,
        name_da: data.name_da,
        description_en: data.description_en,
        description_da: data.description_da,
        spec_size: data.spec_size || '',
        spec_weight: data.spec_weight || '',
        spec_material: data.spec_material || '',
        featured: data.featured ?? false,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
      });
      setImageUrl(data.image_url);
      setGallery(Array.isArray(data.gallery) ? (data.gallery as string[]) : []);
      setUseCasesEn(Array.isArray(data.use_cases_en) ? (data.use_cases_en as string[]) : []);
      setUseCasesDa(Array.isArray(data.use_cases_da) ? (data.use_cases_da as string[]) : []);

      return data;
    },
    enabled: !!isEditing,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      if (!imageUrl) throw new Error('Please upload main image');

      const productData = {
        slug: data.slug,
        category_id: data.category_id,
        name_en: data.name_en,
        name_da: data.name_da,
        description_en: data.description_en,
        description_da: data.description_da,
        spec_size: data.spec_size || null,
        spec_weight: data.spec_weight || null,
        spec_material: data.spec_material || null,
        featured: data.featured,
        is_active: data.is_active,
        sort_order: data.sort_order,
        image_url: imageUrl,
        gallery: gallery as unknown as null,
        use_cases_en: useCasesEn as unknown as null,
        use_cases_da: useCasesDa as unknown as null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: isEditing ? 'Product updated' : 'Product created' });
      navigate('/admin/products');
    },
    onError: (error: Error) => {
      toast({ title: error.message || 'Failed to save', variant: 'destructive' });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast({ title: 'Image uploaded' });
    } catch (error) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newUrls = await Promise.all(
        Array.from(files).map((file) => uploadImage(file))
      );
      setGallery([...gallery, ...newUrls]);
      toast({ title: 'Gallery updated' });
    } catch (error) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeFromGallery = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h1>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input {...form.register('slug')} placeholder="product-slug" />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={form.watch('category_id')}
                      onValueChange={(value) => form.setValue('category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TranslatableField
                  label="Product Name"
                  enValue={form.watch('name_en')}
                  daValue={form.watch('name_da')}
                  onEnChange={(v) => form.setValue('name_en', v)}
                  onDaChange={(v) => form.setValue('name_da', v)}
                  enPlaceholder="Product Name"
                  daPlaceholder="Produktnavn"
                />

                <TranslatableField
                  label="Description"
                  enValue={form.watch('description_en')}
                  daValue={form.watch('description_da')}
                  onEnChange={(v) => form.setValue('description_en', v)}
                  onDaChange={(v) => form.setValue('description_da', v)}
                  multiline
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input {...form.register('spec_size')} placeholder="40 x 35 x 12 cm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input {...form.register('spec_weight')} placeholder="250g" />
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Input {...form.register('spec_material')} placeholder="100% Natural Jute" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TranslatableField
                  label="Use Cases (comma-separated)"
                  enValue={useCasesEn.join(', ')}
                  daValue={useCasesDa.join(', ')}
                  onEnChange={(v) => setUseCasesEn(v.split(',').map(s => s.trim()).filter(Boolean))}
                  onDaChange={(v) => setUseCasesDa(v.split(',').map(s => s.trim()).filter(Boolean))}
                  enPlaceholder="Grocery shopping, Beach trips, Daily commute"
                  daPlaceholder="Dagligvareindkøb, Strandture, Daglig pendling"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={form.watch('is_active')}
                    onCheckedChange={(checked) => form.setValue('is_active', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch
                    checked={form.watch('featured')}
                    onCheckedChange={(checked) => form.setValue('featured', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    {...form.register('sort_order', { valueAsNumber: true })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Main Image */}
            <Card>
              <CardHeader>
                <CardTitle>Main Image</CardTitle>
              </CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="relative">
                    <img src={imageUrl} alt="Product" className="w-full aspect-square object-cover rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setImageUrl('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload image</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {gallery.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeFromGallery(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Add more images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </CardContent>
            </Card>

            {/* SEO Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-4 w-4 text-blue-500">🔍</span>
                  SEO Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 bg-white dark:bg-gray-950 p-3 space-y-1">
                  <p className="text-[13px] text-blue-700 dark:text-blue-400 font-medium line-clamp-1 hover:underline cursor-default">
                    {form.watch('name_en') || 'Product Name'} — Ecofy
                  </p>
                  <p className="text-[11px] text-green-700 dark:text-green-500">
                    ecofy.dk/products/{form.watch('slug') || 'product-slug'}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {form.watch('description_en')?.slice(0, 160) || 'Product description will appear here as it would look in Google search results...'}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {(form.watch('description_en') || '').length}/160 characters
                </p>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-4 w-4">📊</span>
                  Content Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Name (EN)', val: form.watch('name_en') },
                    { label: 'Name (DA)', val: form.watch('name_da') },
                    { label: 'Desc (EN)', val: form.watch('description_en') },
                    { label: 'Desc (DA)', val: form.watch('description_da') },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono ${(val || '').trim() ? 'text-foreground' : 'text-red-400'}`}>
                          {(val || '').trim().split(/\s+/).filter(Boolean).length}w
                        </span>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="font-mono text-muted-foreground">
                          {(val || '').length}c
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Images</span>
                    <span className="font-mono text-foreground">
                      {(imageUrl ? 1 : 0) + gallery.length} uploaded
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Use Cases</span>
                    <span className="font-mono text-foreground">
                      {useCasesEn.length} EN / {useCasesDa.length} DA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Translation Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-4 w-4">🌐</span>
                  Translation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const fields = [
                    { en: form.watch('name_en'), da: form.watch('name_da'), label: 'Name' },
                    { en: form.watch('description_en'), da: form.watch('description_da'), label: 'Description' },
                    { en: useCasesEn.join(','), da: useCasesDa.join(','), label: 'Use Cases' },
                  ];
                  const total = fields.length * 2;
                  const filled = fields.reduce((acc, f) => acc + (f.en?.trim() ? 1 : 0) + (f.da?.trim() ? 1 : 0), 0);
                  const pct = Math.round((filled / total) * 100);
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Overall</span>
                        <span className={`font-bold ${pct === 100 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {fields.map(f => (
                        <div key={f.label} className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{f.label}</span>
                          <div className="flex gap-1.5">
                            <span className={f.en?.trim() ? 'text-green-600' : 'text-red-400'}>
                              🇬🇧 {f.en?.trim() ? '✓' : '✗'}
                            </span>
                            <span className={f.da?.trim() ? 'text-green-600' : 'text-red-400'}>
                              🇩🇰 {f.da?.trim() ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-4 w-4">💡</span>
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[11px] text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Keep descriptions under 160 chars for optimal SEO</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Use the 🤖 Auto Translate button to quickly fill Danish fields</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Upload multiple gallery images for better product showcase</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Mark as Featured to show on homepage hero section</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
