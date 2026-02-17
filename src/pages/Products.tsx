import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, Product } from '@/hooks/useProducts';
import CategoryFilter from '@/components/products/CategoryFilter';
import ProductSearch from '@/components/products/ProductSearch';
import ProductSort, { SortOption } from '@/components/products/ProductSort';
import ViewToggle, { ViewMode } from '@/components/products/ViewToggle';
import ProductCard from '@/components/products/ProductCard';
import ProductListCard from '@/components/products/ProductListCard';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Floating Leaf component for background animation
const FloatingLeaf = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [0, 400],
      x: [x, x + 50, x - 30, x + 20],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 15,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: `${x}%`, top: 0 }}
  >
    <Leaf className="w-6 h-6 text-primary/20" />
  </motion.div>
);

const Products = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data, isLoading, error } = useProducts(activeCategory, currentPage);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Sort and filter products
  const sortedAndFilteredProducts = useMemo(() => {
    if (!data?.products) return [];

    let products = [...data.products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter((product) => {
        const name = language === 'da' ? product.name_da : product.name_en;
        const description = language === 'da' ? product.description_da : product.description_en;
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        products.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name-asc':
        products.sort((a, b) => {
          const nameA = language === 'da' ? a.name_da : a.name_en;
          const nameB = language === 'da' ? b.name_da : b.name_en;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name-desc':
        products.sort((a, b) => {
          const nameA = language === 'da' ? a.name_da : a.name_en;
          const nameB = language === 'da' ? b.name_da : b.name_en;
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        // Keep original sort_order
        break;
    }

    return products;
  }, [data?.products, searchQuery, sortBy, language]);

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

  // Generate page numbers to show
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Premium Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/20 dark:to-background pt-6 pb-16 sm:pt-8 sm:pb-24">
        {/* Floating leaves animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[10, 25, 40, 55, 70, 85].map((x, i) => (
            <FloatingLeaf key={i} x={x} delay={i * 2.5} />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="container relative z-10">

          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              {language === 'da' ? 'Premium Miljøvenlig Kollektion' : 'Premium Eco-Friendly Collection'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground"
            >
              {t('products.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {language === 'da'
                ? 'Oplev vores udvalg af premium, miljøvenlige juteprodukter håndlavet med omhu af dygtige håndværkere i Bangladesh.'
                : 'Discover our range of premium, eco-friendly jute products crafted with care by skilled artisans in Bangladesh.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter & Products Section */}
      <section className="py-12 sm:py-16">
        <div className="container">
          {/* Glass-morphism Filter Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 sm:p-8 border border-border/50 shadow-xl mb-10"
          >
            {/* Search, View Toggle & Sort */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <ProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <div className="flex items-center gap-3">
                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Category Filter with enhanced styling */}
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 backdrop-blur-xl bg-destructive/5 rounded-2xl border border-destructive/20"
            >
              <p className="text-destructive">
                {language === 'da' ? 'Kunne ikke indlæse produkter. Prøv igen senere.' : 'Failed to load products. Please try again later.'}
              </p>
            </motion.div>
          )}

          {/* Products Grid/List */}
          {!isLoading && !error && sortedAndFilteredProducts && sortedAndFilteredProducts.length > 0 && (
            viewMode === 'grid' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {sortedAndFilteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                {sortedAndFilteredProducts.map((product, index) => (
                  <ProductListCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )
          )}

          {/* Empty State - No products in category */}
          {!isLoading && !error && data?.products?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 backdrop-blur-xl bg-muted/30 rounded-2xl border border-border/30"
            >
              <Leaf className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'da' ? 'Ingen produkter fundet i denne kategori.' : 'No products found in this category.'}
              </p>
            </motion.div>
          )}

          {/* Empty State - No search results */}
          {!isLoading && !error && data?.products && data.products.length > 0 && sortedAndFilteredProducts?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 backdrop-blur-xl bg-muted/30 rounded-2xl border border-border/30"
            >
              <p className="text-muted-foreground">{t('products.search.noResults')}</p>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && !error && data && data.totalPages > 1 && !searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-full backdrop-blur-sm bg-background/80 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
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
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handlePageClick(page)}
                      className={`h-10 w-10 rounded-full transition-all ${currentPage === page
                        ? 'shadow-lg shadow-primary/25'
                        : 'backdrop-blur-sm bg-background/80 border-border/50 hover:bg-primary/10 hover:border-primary/30'
                        }`}
                    >
                      {page}
                    </Button>
                  )
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === data.totalPages}
                className="h-10 w-10 rounded-full backdrop-blur-sm bg-background/80 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Page info */}
              <span className="ml-4 text-sm text-muted-foreground">
                {language === 'da'
                  ? `Side ${currentPage} af ${data.totalPages}`
                  : `Page ${currentPage} of ${data.totalPages}`
                }
              </span>
            </motion.div>
          )}
          {/* B2B Quick Quote CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10 border border-primary/20 p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {language === 'da' ? 'Brug for tilpassede produkter?' : 'Need Custom Products?'}
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              {language === 'da'
                ? 'Vi designer og producerer skræddersyede juteprodukter med dit brand. MOQ fra 500 stk.'
                : 'We design and manufacture custom jute products with your branding. MOQ from 500 units.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 px-6">
                <Link to="/custom-solutions">
                  <Send className="mr-2 h-4 w-4" />
                  {language === 'da' ? 'Byg Dit Produkt' : 'Build Your Product'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-primary/30 hover:bg-primary/5 px-6">
                <Link to="/contact">
                  {language === 'da' ? 'Anmod om Tilbud' : 'Request a Quote'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;
