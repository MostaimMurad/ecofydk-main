import { motion } from 'framer-motion';
import { Camera, ArrowRight, Sparkles, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const fallbackImages = [
  { title: 'Handcrafted Jute Bags', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop' },
  { title: 'Artisan Weaving', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=500&fit=crop' },
  { title: 'Jute Fiber Processing', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=450&fit=crop' },
  { title: 'Eco-friendly Packaging', url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop' },
  { title: 'Quality Control', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop' },
  { title: 'Natural Jute Rugs', url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=500&fit=crop' },
];

const heights = ['h-64', 'h-80', 'h-72', 'h-80', 'h-72', 'h-64'];

const GallerySection = () => {
  const { language, t } = useLanguage();
  const { data: cmsItems } = useContentBlocks('gallery_items');

  const images = (cmsItems && cmsItems.length > 0)
    ? cmsItems.slice(0, 6).map(b => ({
      title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
      url: b.image_url || '',
    }))
    : fallbackImages;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/30" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 mb-6">
            <Camera className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-semibold uppercase tracking-widest text-teal-600">{t('home.gallery.badge')}</span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600">{t('home.gallery.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.gallery.subtitle')}</p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 mb-12">
          {images.map((img, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="break-inside-avoid group cursor-pointer">
              <Link to="/gallery">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-card/80 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className={`relative ${heights[index % heights.length]} overflow-hidden`}>
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <h3 className="text-white font-semibold text-sm">{img.title}</h3>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full border-teal-500/30 hover:bg-teal-500/5 px-8 group">
            <Link to="/gallery">{t('home.gallery.cta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
