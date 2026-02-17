import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Sparkles, Leaf } from 'lucide-react';
import { format } from 'date-fns';

// Floating leaf animation component
const FloatingLeaf = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left }}
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{
      y: ['0%', '100vh'],
      opacity: [0, 1, 1, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <Leaf className="h-4 w-4 text-primary/20" />
  </motion.div>
);

const Journal = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading: postsLoading } = useBlogPosts(selectedCategory, currentPage);
  const { data: categories } = useBlogCategories();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const getLocalizedContent = (post: NonNullable<typeof data>['posts'][number], field: 'title' | 'excerpt' | 'content') => {
    const key = `${field}_${language}` as keyof typeof post;
    return post[key] as string || '';
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (!data) return [];
    const pages: (number | 'ellipsis')[] = [];
    const { totalPages } = data;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Premium Styling */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background py-16 md:py-24">
        {/* Floating Leaves */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <FloatingLeaf
              key={i}
              delay={i * 2}
              duration={15 + i * 2}
              left={`${10 + i * 12}%`}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative z-10">

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-primary/20 px-4 py-2 text-sm shadow-lg"
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                {t('journal.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                {t('journal.title')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              {t('journal.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Filter with Glass-morphism */}
      <section className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg"
        >
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full transition-all duration-300 ${selectedCategory === 'all'
                ? 'shadow-lg shadow-primary/25'
                : 'hover:bg-primary/10'
              }`}
          >
            {t('journal.filter.all')}
          </Button>
          {categories?.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full transition-all duration-300 ${selectedCategory === cat
                  ? 'shadow-lg shadow-primary/25'
                  : 'hover:bg-primary/10'
                }`}
            >
              {cat}
            </Button>
          ))}
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative container pb-20">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {postsLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-20 mb-3 rounded-full" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative">
              {data.posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                >
                  <Link to={`/journal/${post.slug}`}>
                    <motion.article
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                    >
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

                          {/* Read indicator on hover */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex items-center gap-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium shadow-lg">
                              <BookOpen className="h-4 w-4" />
                              {t('journal.read-more')}
                            </div>
                          </div>
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
                        <h2 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {getLocalizedContent(post, 'title')}
                        </h2>

                        {/* Excerpt */}
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
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
            </div>

            {/* Premium Pagination */}
            {data.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-16 flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-primary/10 shadow-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => handlePageClick(page)}
                          className={`h-10 w-10 rounded-xl transition-all duration-300 ${currentPage === page
                              ? 'shadow-lg shadow-primary/25'
                              : 'hover:bg-primary/10'
                            }`}
                        >
                          {page}
                        </Button>
                      )
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage === data.totalPages}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground">
                  {language === 'da'
                    ? `Side ${currentPage} af ${data.totalPages}`
                    : `Page ${currentPage} of ${data.totalPages}`
                  }
                </span>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-20 text-center"
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary/50" />
            </div>
            <h3 className="text-2xl font-semibold">{t('journal.empty.title')}</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">{t('journal.empty.description')}</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Journal;
