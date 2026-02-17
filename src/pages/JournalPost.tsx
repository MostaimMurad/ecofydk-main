import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { useRelatedPosts } from '@/hooks/useRelatedPosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowLeft, User, Leaf, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import SocialShareButtons from '@/components/journal/SocialShareButtons';
import RelatedPosts from '@/components/journal/RelatedPosts';
import ReadingTime from '@/components/journal/ReadingTime';
import TableOfContents from '@/components/journal/TableOfContents';
import ReadingProgressBar from '@/components/journal/ReadingProgressBar';

// Floating leaf animation component
const FloatingLeaf = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left }}
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{
      y: ['0%', '100%'],
      opacity: [0, 0.5, 0.5, 0],
      rotate: [0, 180]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <Leaf className="h-3 w-3 text-primary/15" />
  </motion.div>
);

const JournalPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { language, t } = useLanguage();
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: relatedPosts, isLoading: relatedLoading } = useRelatedPosts(
    post?.id || '',
    post?.category || null
  );

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${location.pathname}`
    : '';

  const getLocalizedContent = (field: 'title' | 'excerpt' | 'content') => {
    if (!post) return '';
    const key = `${field}_${language}` as keyof typeof post;
    return post[key] as string || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-8 h-12 w-3/4" />
          <Skeleton className="mt-4 h-6 w-1/4" />
          <Skeleton className="mt-8 aspect-video w-full rounded-2xl" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <div className="container py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-primary/50" />
            </div>
            <h1 className="text-2xl font-bold">{t('journal.notfound.title')}</h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">{t('journal.notfound.description')}</p>
            <Button asChild className="mt-8 rounded-full shadow-lg shadow-primary/25">
              <Link to="/journal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('journal.back')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ReadingProgressBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        {/* Floating Leaves */}
        <div className="absolute inset-0 overflow-hidden h-[400px]">
          {[...Array(6)].map((_, i) => (
            <FloatingLeaf
              key={i}
              delay={i * 1.5}
              duration={12 + i * 2}
              left={`${15 + i * 15}%`}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <article className="container relative z-10 py-8 md:py-12">

          {/* Header */}
          <header className="mx-auto max-w-3xl mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {post.category && (
                <Badge
                  variant="secondary"
                  className="mb-6 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-primary/20 px-4 py-2 shadow-lg"
                >
                  {post.category}
                </Badge>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            >
              {getLocalizedContent('title')}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-between gap-4"
            >
              {/* Meta info with glass-morphism */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg">
                {post.published_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm">Ecofy Team</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <ReadingTime content={getLocalizedContent('content')} />
              </div>

              {/* Social Share */}
              <div className="p-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg">
                <SocialShareButtons url={currentUrl} title={getLocalizedContent('title')} />
              </div>
            </motion.div>
          </header>
        </article>
      </section>

      {/* Cover Image with Premium Styling */}
      {post.cover_image && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="container -mt-4"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
            <img
              src={post.cover_image}
              alt={getLocalizedContent('title')}
              className="aspect-video w-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Content Section */}
      <section className="container py-12 md:py-16">
        {/* Table of Contents with Glass-morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-3xl mb-10"
        >
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg">
            <TableOfContents content={getLocalizedContent('content')} />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="prose prose-lg mx-auto max-w-3xl dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
        >
          <div dangerouslySetInnerHTML={{ __html: getLocalizedContent('content') }} />
        </motion.div>

        {/* Social Share (Bottom) with Glass-morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-3xl flex justify-center"
        >
          <div className="flex items-center gap-4 p-4 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg">
            <span className="text-sm text-muted-foreground pl-2">
              {language === 'da' ? 'Del denne artikel' : 'Share this article'}
            </span>
            <SocialShareButtons url={currentUrl} title={getLocalizedContent('title')} />
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl mt-16"
        >
          <RelatedPosts posts={relatedPosts || []} isLoading={relatedLoading} />
        </motion.div>

        {/* Footer with Premium Button */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 max-w-3xl border-t border-primary/10 pt-10"
        >
          <Button asChild className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            <Link to="/journal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('journal.back')}
            </Link>
          </Button>
        </motion.footer>
      </section>
    </div>
  );
};

export default JournalPost;
