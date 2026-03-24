import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Search, Filter, Grid3X3, Sparkles, ArrowRight, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useContentBlocks } from '@/hooks/useContentBlocks';

/* ──────────────────────── types ──────────────────────── */
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

/* ──────────────────────── fallback data ──────────────── */
const fallbackCategories = [
  { key: 'all', en: 'All', da: 'Alle' },
  { key: 'products', en: 'Products', da: 'Produkter' },
  { key: 'activities', en: 'Activities', da: 'Aktiviteter' },
  { key: 'factory', en: 'Factory', da: 'Fabrik' },
  { key: 'events', en: 'Events', da: 'Begivenheder' },
];

const fallbackItems: GalleryItem[] = [
  { id: '1', title: 'Handcrafted Jute Bags', description: 'Premium jute tote bags ready for European markets', image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop', category: 'products' },
  { id: '2', title: 'Artisan Weaving', description: 'Traditional weaving techniques passed through generations', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=500&fit=crop', category: 'activities' },
  { id: '3', title: 'Jute Fiber Processing', description: 'From raw jute to premium fiber in our facility', image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=450&fit=crop', category: 'factory' },
  { id: '4', title: 'Eco-friendly Packaging', description: 'Sustainable gift packaging solutions', image_url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop', category: 'products' },
  { id: '5', title: 'Copenhagen Trade Fair 2025', description: 'Showcasing our latest collection at the trade fair', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=500&fit=crop', category: 'events' },
  { id: '6', title: 'Quality Control', description: 'Rigorous quality checks at every production stage', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', category: 'factory' },
  { id: '7', title: 'Community Workshops', description: 'Training local artisans in sustainable practices', image_url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=450&fit=crop', category: 'activities' },
  { id: '8', title: 'Natural Jute Rugs', description: 'Hand-woven jute rugs for modern Scandinavian interiors', image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=500&fit=crop', category: 'products' },
  { id: '9', title: 'Berlin Sustainability Summit', description: 'Presenting our green initiatives to European leaders', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop', category: 'events' },
  { id: '10', title: 'Dyeing Workshop', description: 'Natural dyeing process using eco-friendly pigments', image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=450&fit=crop', category: 'activities' },
  { id: '11', title: 'Jute Home Decor', description: 'Decorative jute baskets and storage solutions', image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop', category: 'products' },
  { id: '12', title: 'Spinning Unit', description: 'Modern spinning equipment for premium jute yarns', image_url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=500&fit=crop', category: 'factory' },
];

/* ──────────────── floating particle ──────────────────── */
const FloatingDot = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none w-2 h-2 rounded-full bg-teal-400/20"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: [0, 0.5, 0], y: [0, 350] }}
    transition={{ duration: 14, delay, repeat: Infinity, ease: 'linear' }}
    style={{ left: `${x}%`, top: 0 }}
  />
);

/* ──────────────────────── page ────────────────────────── */
const Gallery = () => {
  const { t, language } = useLanguage();
  const { data: cmsItems } = useContentBlocks('gallery_items');

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* resolve items — CMS first, then fallback */
  const items: GalleryItem[] = (cmsItems && cmsItems.length > 0)
    ? cmsItems.map(b => ({
        id: b.id,
        title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
        description: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        image_url: b.image_url || '',
        category: b.block_key || 'products',
      }))
    : fallbackItems;

  /* filter */
  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  /* lightbox helpers */
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null), [filtered.length]);

  /* masonry-ish height classes */
  const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80', 'h-72', 'h-64', 'h-96', 'h-72', 'h-80', 'h-64'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

        {/* Animated orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        {/* Floating dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 30, 50, 70, 90].map((x, i) => (
            <FloatingDot key={i} x={x} delay={i * 2} />
          ))}
        </div>

        <div className="container relative z-10 flex h-full items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Badge className="mb-6 bg-white/15 text-white border-white/25 px-4 py-2 backdrop-blur-sm">
                <Camera className="mr-2 h-4 w-4" />
                {language === 'da' ? 'Fotogalleri' : 'Photo Gallery'}
              </Badge>
            </motion.div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
              {language === 'da' ? 'Vores Galleri' : 'Our Gallery'}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
            >
              {language === 'da'
                ? 'Udforsk vores verden af bæredygtige juteprodukter, håndværk og begivenheder'
                : 'Explore our world of sustainable jute products, craftsmanship, and events'}
            </motion.p>
          </motion.div>
        </div>

      </section>

      {/* ─────────── Filter & Search Bar ─────────── */}
      <section className="py-8 relative z-20 -mt-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6 backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl border border-border/50 shadow-xl"
          >
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              <Filter className="h-5 w-5 text-teal-600 mr-1 mt-1.5 hidden md:block" />
              {fallbackCategories.map(cat => (
                <motion.button
                  key={cat.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.key
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-muted/50 text-muted-foreground hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700'
                  }`}
                >
                  {language === 'da' ? cat.da : cat.en}
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'da' ? 'Søg billeder...' : 'Search images...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-border/50 bg-muted/30 focus:ring-teal-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── Masonry Grid ─────────── */}
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 rounded-full text-teal-600 dark:text-teal-400 text-sm font-medium">
              <Grid3X3 className="h-4 w-4" />
              {filtered.length} {language === 'da' ? 'billeder' : 'images'}
            </div>
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ImageIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {language === 'da' ? 'Ingen billeder fundet' : 'No images found'}
              </p>
            </motion.div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-card/80 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className={`relative ${heights[index % heights.length]} overflow-hidden`}>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="text-white"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-500/30 backdrop-blur-sm border border-teal-300/30 capitalize">
                                {language === 'da'
                                  ? fallbackCategories.find(c => c.key === item.category)?.da || item.category
                                  : fallbackCategories.find(c => c.key === item.category)?.en || item.category
                                }
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-white/80 mt-1 line-clamp-2">{item.description}</p>
                          </motion.div>
                        </div>

                        {/* Zoom icon top-right */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <ZoomIn className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ─────────── Lightbox Modal ─────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all"
              onClick={e => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="relative max-w-5xl w-full mx-4 md:mx-16"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].image_url}
                alt={filtered[lightboxIndex].title}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <h3 className="text-xl font-semibold text-white">{filtered[lightboxIndex].title}</h3>
                <p className="text-sm text-white/80 mt-1">{filtered[lightboxIndex].description}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all"
              onClick={e => { e.stopPropagation(); nextImage(); }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm border border-white/20">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────── CTA Section ─────────── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10 py-16 px-8 md:py-20 text-center text-white">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mx-auto w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8" />
                </motion.div>

                <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                  {language === 'da' ? 'Vil Du Se Mere?' : 'Want to See More?'}
                </h2>
                <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
                  {language === 'da'
                    ? 'Udforsk vores fulde produktkollektion eller kontakt os for tilpassede løsninger'
                    : 'Explore our full product collection or contact us for custom solutions'}
                </p>

                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-white/90 shadow-xl h-14 px-8 text-lg">
                      <Link to="/products">
                        {language === 'da' ? 'Se Produkter' : 'View Products'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white h-14 px-8 text-lg">
                      <Link to="/contact">
                        {language === 'da' ? 'Kontakt Os' : 'Contact Us'}
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
