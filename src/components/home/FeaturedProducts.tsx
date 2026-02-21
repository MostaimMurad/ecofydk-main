import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const { language, t } = useLanguage();
  const { data: products, isLoading } = useFeaturedProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              {t('home.products.badge')}
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
            {t('products.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.products.subtitle')}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-card">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products && (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {products.map((product, index) => {
              const name = language === 'en' ? product.name_en : product.name_da;
              const description = language === 'en' ? product.description_en : product.description_da;

              return (
                <motion.div key={product.id} variants={itemVariants}>
                  <Link to={`/products/${product.slug}`}>
                    <motion.div
                      className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm"
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <motion.img
                          src={product.image_url}
                          alt={name}
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6 }}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Quick view button */}
                        <motion.div
                          className="absolute bottom-4 left-4 right-4"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <Button
                              size="sm"
                              className="w-full backdrop-blur-sm bg-white/90 text-foreground hover:bg-white"
                            >
                              {t('home.products.viewdetails')}
                            </Button>
                          </div>
                        </motion.div>

                        {/* Featured badge */}
                        {index === 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-lg">
                              <Sparkles className="h-3 w-3" />
                              {t('home.products.featured')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                          {t(`products.filter.${product.category_id}`)}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {name}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {description}
                        </p>

                        {/* View link */}
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>{t('home.products.learnmore')}</span>
                          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group gap-2 px-8 py-6 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <Link to="/products">
              {t('home.products.exploreall')}
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
