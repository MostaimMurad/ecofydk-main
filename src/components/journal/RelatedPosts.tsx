import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/hooks/useBlogPosts';

interface RelatedPostsProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

const RelatedPosts = ({ posts, isLoading }: RelatedPostsProps) => {
  const { language, t } = useLanguage();

  const getLocalizedContent = (post: BlogPost, field: 'title' | 'excerpt') => {
    const key = `${field}_${language}` as keyof BlogPost;
    return post[key] as string || '';
  };

  if (isLoading) {
    return (
      <section className="mt-16 pt-12 relative">
        {/* Section Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-2xl font-serif font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
        >
          {t('journal.related')}
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 shadow-lg"
            >
              <div className="aspect-[16/10] bg-muted/50 animate-pulse" />
              <div className="p-5">
                <div className="h-5 w-20 bg-muted/50 rounded-full animate-pulse mb-3" />
                <div className="h-6 w-full bg-muted/50 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 relative">
      {/* Section Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h2 className="mb-8 text-2xl font-serif font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          {t('journal.related')}
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/journal/${post.slug}`} className="block group">
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                {/* Corner Gradient Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Image Container */}
                {post.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <motion.img
                      src={post.cover_image}
                      alt={getLocalizedContent(post, 'title')}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-primary/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ArrowRight className="h-4 w-4 text-primary-foreground" />
                    </motion.div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {post.category && (
                    <Badge 
                      variant="secondary" 
                      className="mb-3 backdrop-blur-md bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {post.category}
                    </Badge>
                  )}
                  
                  <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {getLocalizedContent(post, 'title')}
                  </h3>
                  
                  {post.published_at && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(post.published_at), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
