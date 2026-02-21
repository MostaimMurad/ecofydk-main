import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft, Upload, X, Loader2, Save, Eye, EyeOff,
  FileText, Hash, Globe, BarChart3, CheckCircle2, AlertCircle,
  Image as ImageIcon, Sparkles, ChevronRight, Clock,
} from 'lucide-react';
import TranslatableField from '@/components/admin/TranslatableField';
import MediaPicker from '@/components/admin/MediaPicker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ── Schema ───────────────────────────────────────────────────────────
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

// ── Stat Pill ────────────────────────────────────────────────────────
function StatPill({ label, value, status }: { label: string; value: string; status: 'ok' | 'warn' | 'error' }) {
  const colors = {
    ok: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    warn: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    error: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  };
  return (
    <div className="flex items-center justify-between text-xs py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-mono px-2 py-0.5 rounded-md text-[11px] font-medium', colors[status])}>{value}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      slug: '', title_en: '', title_da: '',
      excerpt_en: '', excerpt_da: '',
      content_en: '', content_da: '',
      category: '', is_published: false,
    },
  });

  const { isLoading: fetchLoading } = useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from('blog_posts').select('*').eq('id', id).single();
      if (error) throw error;
      form.reset({
        slug: data.slug, title_en: data.title_en, title_da: data.title_da,
        excerpt_en: data.excerpt_en || '', excerpt_da: data.excerpt_da || '',
        content_en: data.content_en, content_da: data.content_da,
        category: data.category || '', is_published: data.is_published ?? false,
      });
      setCoverImage(data.cover_image || '');
      return data;
    },
    enabled: !!isEditing,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      const postData = {
        slug: data.slug, title_en: data.title_en, title_da: data.title_da,
        excerpt_en: data.excerpt_en || null, excerpt_da: data.excerpt_da || null,
        content_en: data.content_en, content_da: data.content_da,
        category: data.category || null, cover_image: coverImage || null,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
        author_id: user?.id || null,
      };
      if (isEditing) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: isEditing ? '✅ Post updated' : '✅ Post created' });
      navigate('/admin/blog');
    },
    onError: (error: Error) => {
      toast({ title: error.message || 'Failed to save', variant: 'destructive' });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file);
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
      toast({ title: '✅ Image uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // ── Computed stats ──────────────────────────────────────────
  const contentStats = useMemo(() => {
    const enWords = (form.watch('content_en') || '').trim().split(/\s+/).filter(Boolean).length;
    const daWords = (form.watch('content_da') || '').trim().split(/\s+/).filter(Boolean).length;
    const excerptLen = (form.watch('excerpt_en') || '').length;
    const readingTime = Math.max(1, Math.ceil(enWords / 200));

    const fields = [
      { en: form.watch('title_en'), da: form.watch('title_da') },
      { en: form.watch('excerpt_en'), da: form.watch('excerpt_da') },
      { en: form.watch('content_en'), da: form.watch('content_da') },
    ];
    const total = fields.length * 2;
    const filled = fields.reduce((a, f) => a + (f.en?.trim() ? 1 : 0) + (f.da?.trim() ? 1 : 0), 0);
    const translationPct = Math.round((filled / total) * 100);

    return { enWords, daWords, excerptLen, readingTime, translationPct };
  }, [form.watch('title_en'), form.watch('title_da'), form.watch('excerpt_en'), form.watch('excerpt_da'), form.watch('content_en'), form.watch('content_da')]);

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPublished = form.watch('is_published');
  const errorCount = Object.keys(form.formState.errors).length;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb + Header ─────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{isEditing ? 'Edit Post' : 'New Post'}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/blog')} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEditing ? 'Update your blog post content and settings' : 'Create a new blog article in English and Danish'}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'text-xs px-3 py-1',
            isPublished
              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
          )}
        >
          {isPublished ? <Eye className="h-3 w-3 mr-1.5" /> : <EyeOff className="h-3 w-3 mr-1.5" />}
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      </div>

      {/* ── Form ────────────────────────────────────────────── */}
      <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* ═══ LEFT: Main Content ═══════════════════════════ */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input {...form.register('slug')} placeholder="my-blog-post" className="pl-8 font-mono text-sm" />
                    </div>
                    {form.formState.errors.slug && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {form.formState.errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
                    <Input {...form.register('category')} placeholder="sustainability, news" className="text-sm" />
                  </div>
                </div>

                <Separator />

                <TranslatableField
                  label="Title"
                  enValue={form.watch('title_en')}
                  daValue={form.watch('title_da')}
                  onEnChange={(v) => form.setValue('title_en', v)}
                  onDaChange={(v) => form.setValue('title_da', v)}
                  enPlaceholder="Post Title"
                  daPlaceholder="Indlægstitel"
                />
                {(form.formState.errors.title_en || form.formState.errors.title_da) && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Title is required in both languages (min 5 chars)
                  </p>
                )}

                <TranslatableField
                  label="Excerpt"
                  enValue={form.watch('excerpt_en') || ''}
                  daValue={form.watch('excerpt_da') || ''}
                  onEnChange={(v) => form.setValue('excerpt_en', v)}
                  onDaChange={(v) => form.setValue('excerpt_da', v)}
                  multiline rows={2}
                  enPlaceholder="Brief summary for search engines..."
                  daPlaceholder="Kort resumé til søgemaskiner..."
                />
                <p className="text-[11px] text-muted-foreground">
                  💡 Keep excerpts under 160 characters for optimal SEO display.
                  Currently: <span className={cn('font-mono', contentStats.excerptLen > 160 ? 'text-red-500' : 'text-green-600')}>{contentStats.excerptLen}/160</span>
                </p>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4 text-primary" />
                    Content
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{contentStats.readingTime} min read
                    </span>
                    <span className="font-mono">{contentStats.enWords}w EN</span>
                    <span className="font-mono">{contentStats.daWords}w DA</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <TranslatableField
                  label="Content"
                  enValue={form.watch('content_en')}
                  daValue={form.watch('content_da')}
                  onEnChange={(v) => form.setValue('content_en', v)}
                  onDaChange={(v) => form.setValue('content_da', v)}
                  richText
                  stacked
                  enPlaceholder="Write your content here..."
                  daPlaceholder="Skriv dit indhold her..."
                />
                {(form.formState.errors.content_en || form.formState.errors.content_da) && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Content is required in both languages (min 50 chars)
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ═══ RIGHT: Sidebar ═══════════════════════════════ */}
          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">

            {/* Publish Controls */}
            <Card className={cn(
              'border-2 transition-colors',
              isPublished ? 'border-green-200 dark:border-green-800' : 'border-border'
            )}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPublished ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-semibold text-sm">{isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={(checked) => form.setValue('is_published', checked)}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button type="submit" disabled={saveMutation.isPending} className="gap-1.5">
                    {saveMutation.isPending ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="h-3.5 w-3.5" /> {isEditing ? 'Update' : 'Save'}</>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')}>
                    Cancel
                  </Button>
                </div>
                {errorCount > 0 && (
                  <p className="text-xs text-destructive flex items-center gap-1.5 bg-destructive/10 rounded-lg p-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errorCount} field{errorCount > 1 ? 's' : ''} need{errorCount === 1 ? 's' : ''} attention
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coverImage ? (
                  <div className="relative group rounded-xl overflow-hidden">
                    <img src={coverImage} alt="Cover" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                      <Button
                        type="button" variant="secondary" size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-1.5"
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        <ImageIcon className="h-3.5 w-3.5" /> Change
                      </Button>
                      <Button
                        type="button" variant="destructive" size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-1.5"
                        onClick={() => setCoverImage('')}
                      >
                        <X className="h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground/40 mb-2 group-hover:text-primary transition-colors" />
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Upload image</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">or drag and drop</p>
                        </>
                      )}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5" onClick={() => setMediaPickerOpen(true)}>
                      <ImageIcon className="h-3.5 w-3.5" /> Browse Media Library
                    </Button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </CardContent>
            </Card>

            {/* SEO Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  SEO Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border bg-white dark:bg-gray-950 p-3.5 space-y-1">
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-medium line-clamp-1 hover:underline cursor-default">
                    {form.watch('title_en') || 'Blog Post Title'} — Ecofy Journal
                  </p>
                  <p className="text-[11px] text-green-700 dark:text-green-500 font-mono">
                    ecofy.dk/journal/{form.watch('slug') || 'post-slug'}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {form.watch('excerpt_en')?.slice(0, 160) || form.watch('content_en')?.slice(0, 160) || 'Post excerpt will appear here as it would look in Google search results...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Content Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <StatPill label="Words (EN)" value={`${contentStats.enWords}`} status={contentStats.enWords >= 100 ? 'ok' : contentStats.enWords > 0 ? 'warn' : 'error'} />
                <StatPill label="Words (DA)" value={`${contentStats.daWords}`} status={contentStats.daWords >= 100 ? 'ok' : contentStats.daWords > 0 ? 'warn' : 'error'} />
                <StatPill label="Reading Time" value={`~${contentStats.readingTime} min`} status="ok" />
                <StatPill label="Cover Image" value={coverImage ? '✓ Set' : '✗ Missing'} status={coverImage ? 'ok' : 'error'} />
                <Separator className="my-2" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Translation</span>
                    <span className={cn(
                      'font-bold',
                      contentStats.translationPct === 100 ? 'text-green-600' : contentStats.translationPct >= 50 ? 'text-amber-600' : 'text-red-500'
                    )}>{contentStats.translationPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        contentStats.translationPct === 100 ? 'bg-green-500' : contentStats.translationPct >= 50 ? 'bg-amber-500' : 'bg-red-400'
                      )}
                      style={{ width: `${contentStats.translationPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[11px] text-muted-foreground">
                  {[
                    'Write a compelling excerpt (under 160 chars) for SEO',
                    'Use the 🤖 Auto Translate button to fill Danish fields',
                    'Add a cover image — posts with images get 94% more views',
                    'Aim for 500+ words for better search ranking',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-primary/60" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* ── Media Picker Dialog ──────────────────────────────── */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => { setCoverImage(url); setMediaPickerOpen(false); }}
      />
    </div>
  );
};

export default BlogEditor;
