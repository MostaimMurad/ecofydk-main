import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, BookOpen, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/hooks/useBlogPosts';

// Floating leaf component for background decoration
const FloatingLeaf = ({ delay, duration, x, y }: { delay: number; duration: number; x: string; y: string }) => (
  <motion.div
    className="absolute text-primary/10"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Leaf className="h-8 w-8" />
  </motion.div>
);

const RecentPosts = () => {
  const { language, t } = useLanguage();
  const { data, isLoading } = useBlogPosts();

  const recentPosts = data?.posts?.slice(0, 3) || [];

  const getLocalizedContent = (post: BlogPost, field: 'title' | 'excerpt') => {
    const key = `${field}_${language}` as keyof BlogPost;
    return post[key] as string || '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (isLoading) {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-primary/5" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-20 mb-3 rounded-full" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-primary/5" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Floating leaves */}
      <FloatingLeaf delay={0} duration={4} x="5%" y="20%" />
      <FloatingLeaf delay={1.5} duration={5} x="90%" y="30%" />
      <FloatingLeaf delay={0.8} duration={4.5} x="15%" y="70%" />
      <FloatingLeaf delay={2} duration={5.5} x="85%" y="60%" />
      
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 px-4 py-2 backdrop-blur-xl bg-primary/10 border-primary/20 text-primary"
            >
              <BookOpen className="h-3.5 w-3.5 mr-2" />
              {t('journal.badge')}
            </Badge>
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            {t('home.journal.title')}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('home.journal.subtitle')}
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="group"
            >
              <Link to={`/journal/${post.slug}`}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  {/* Image Container */}
                  {post.cover_image && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={post.cover_image}
                        alt={getLocalizedContent(post, 'title')}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category badge on image */}
                      {post.category && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-4 left-4"
                        >
                          <Badge 
                            variant="secondary" 
                            className="backdrop-blur-xl bg-white/80 dark:bg-black/50 border-white/30 text-xs font-medium shadow-lg"
                          >
                            {post.category}
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 relative">
                    {/* Date */}
                    {post.published_at && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <Calendar className="h-3 w-3 text-primary" />
                        </div>
                        <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {getLocalizedContent(post, 'title')}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {getLocalizedContent(post, 'excerpt')}
                    </p>
                    
                    {/* Read More Link */}
                    <motion.div 
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {t('journal.read-more')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              asChild 
              size="lg"
              className="px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              <Link to="/journal">
                {t('home.journal.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentPosts;
