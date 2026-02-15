import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import TranslatableField from '@/components/admin/TranslatableField';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const blogSchema = z.object({
  slug: z.string().min(2, 'Enter slug').regex(/^[a-z0-9-]+$/, 'Use only lowercase letters, numbers and hyphens'),
  title_en: z.string().min(5, 'Enter English title'),
  title_da: z.string().min(5, 'Enter Danish title'),
  excerpt_en: z.string().optional(),
  excerpt_da: z.string().optional(),
  content_en: z.string().min(50, 'Enter English content'),
  content_da: z.string().min(50, 'Enter Danish content'),
  category: z.string().optional(),
  is_published: z.boolean().default(false),
});

type BlogForm = z.infer<typeof blogSchema>;

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverImage, setCoverImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      slug: '',
      title_en: '',
      title_da: '',
      excerpt_en: '',
      excerpt_da: '',
      content_en: '',
      content_da: '',
      category: '',
      is_published: false,
    },
  });

  // Fetch existing post if editing
  const { isLoading: fetchLoading } = useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      form.reset({
        slug: data.slug,
        title_en: data.title_en,
        title_da: data.title_da,
        excerpt_en: data.excerpt_en || '',
        excerpt_da: data.excerpt_da || '',
        content_en: data.content_en,
        content_da: data.content_da,
        category: data.category || '',
        is_published: data.is_published ?? false,
      });
      setCoverImage(data.cover_image || '');

      return data;
    },
    enabled: !!isEditing,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      const postData = {
        slug: data.slug,
        title_en: data.title_en,
        title_da: data.title_da,
        excerpt_en: data.excerpt_en || null,
        excerpt_da: data.excerpt_da || null,
        content_en: data.content_en,
        content_da: data.content_da,
        category: data.category || null,
        cover_image: coverImage || null,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
        author_id: user?.id || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: isEditing ? 'Post updated' : 'Post created' });
      navigate('/admin/blog');
    },
    onError: (error: Error) => {
      toast({ title: error.message || 'Failed to save', variant: 'destructive' });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
      toast({ title: 'Image uploaded' });
    } catch (error) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Post' : 'New Post'}
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
                    <Input {...form.register('slug')} placeholder="post-slug" />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input {...form.register('category')} placeholder="sustainability, news" />
                  </div>
                </div>

                <TranslatableField
                  label="Title"
                  enValue={form.watch('title_en')}
                  daValue={form.watch('title_da')}
                  onEnChange={(v) => form.setValue('title_en', v)}
                  onDaChange={(v) => form.setValue('title_da', v)}
                  enPlaceholder="Post Title"
                  daPlaceholder="Indlægstitel"
                />

                <TranslatableField
                  label="Excerpt"
                  enValue={form.watch('excerpt_en') || ''}
                  daValue={form.watch('excerpt_da') || ''}
                  onEnChange={(v) => form.setValue('excerpt_en', v)}
                  onDaChange={(v) => form.setValue('excerpt_da', v)}
                  multiline
                  rows={2}
                />
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TranslatableField
                  label="Content"
                  enValue={form.watch('content_en')}
                  daValue={form.watch('content_da')}
                  onEnChange={(v) => form.setValue('content_en', v)}
                  onDaChange={(v) => form.setValue('content_da', v)}
                  multiline
                  rows={10}
                  enPlaceholder="Write your content here..."
                  daPlaceholder="Skriv dit indhold her..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Publish</Label>
                  <Switch
                    checked={form.watch('is_published')}
                    onCheckedChange={(checked) => form.setValue('is_published', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                {coverImage ? (
                  <div className="relative">
                    <img src={coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setCoverImage('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload cover image</p>
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
                    {form.watch('title_en') || 'Blog Post Title'} — Ecofy Journal
                  </p>
                  <p className="text-[11px] text-green-700 dark:text-green-500">
                    ecofy.dk/journal/{form.watch('slug') || 'post-slug'}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {form.watch('excerpt_en')?.slice(0, 160) || form.watch('content_en')?.slice(0, 160) || 'Post excerpt will appear here as it would look in Google search results...'}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Excerpt: {(form.watch('excerpt_en') || '').length}/160 characters
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
                    { label: 'Title (EN)', val: form.watch('title_en') },
                    { label: 'Title (DA)', val: form.watch('title_da') },
                    { label: 'Content (EN)', val: form.watch('content_en') },
                    { label: 'Content (DA)', val: form.watch('content_da') },
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
                    <span className="text-muted-foreground">Reading Time (EN)</span>
                    <span className="font-mono text-foreground">
                      ~{Math.max(1, Math.ceil((form.watch('content_en') || '').trim().split(/\s+/).filter(Boolean).length / 200))} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cover Image</span>
                    <span className={`font-mono ${coverImage ? 'text-green-600' : 'text-red-400'}`}>
                      {coverImage ? '✓ Uploaded' : '✗ Missing'}
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
                    { en: form.watch('title_en'), da: form.watch('title_da'), label: 'Title' },
                    { en: form.watch('excerpt_en'), da: form.watch('excerpt_da'), label: 'Excerpt' },
                    { en: form.watch('content_en'), da: form.watch('content_da'), label: 'Content' },
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

            {/* Writing Tips */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-4 w-4">💡</span>
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[11px] text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Write a compelling excerpt (under 160 chars) for SEO</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Use the 🤖 Auto Translate button to fill Danish fields</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Add a cover image — posts with images get 94% more views</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Aim for 500+ words for better search ranking</span>
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
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
