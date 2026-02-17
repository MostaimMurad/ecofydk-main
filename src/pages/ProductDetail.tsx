import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Leaf, Sparkles, Send, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import ProductGallery from '@/components/products/ProductGallery';
import QuickQuoteModal from '@/components/products/QuickQuoteModal';
import RelatedProducts from '@/components/products/RelatedProducts';
import MaterialsComposition from '@/components/products/MaterialsComposition';
import OriginSupplier from '@/components/products/OriginSupplier';
import ESGImpact from '@/components/products/ESGImpact';
import GovernanceCompliance from '@/components/products/GovernanceCompliance';
import ProductCTA from '@/components/products/ProductCTA';
import { Button } from '@/components/ui/button';

// Floating particle component
const FloatingParticle = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x }}
    animate={{
      opacity: [0, 0.4, 0],
      y: [0, 300],
      x: [x, x + 30, x - 20],
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: `${x}%`, top: 0 }}
  >
    <div className="w-2 h-2 bg-primary/30 rounded-full" />
  </motion.div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();

  const { data: product, isLoading, error } = useProduct(id || '');
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; mode: 'quote' | 'sample' }>({ open: false, mode: 'quote' });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-12 border border-border/50 shadow-xl"
        >
          <Leaf className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'da' ? 'Produkt ikke fundet' : 'Product not found'}
          </h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
            {language === 'da' ? 'Tilbage til Produkter' : 'Back to Products'}
          </Link>
        </motion.div>
      </div>
    );
  }

  const name = language === 'en' ? product.name_en : product.name_da;
  const description = language === 'en' ? product.description_en : product.description_da;
  const useCases = language === 'en' ? product.use_cases_en : product.use_cases_da;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Product Gallery */}
      <section className="relative overflow-hidden py-8 sm:py-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          {[15, 35, 55, 75, 90].map((x, i) => (
            <FloatingParticle key={i} x={x} delay={i * 2} />
          ))}
        </div>

        <div className="container relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductGallery
                images={product.gallery.length > 0 ? product.gallery : [product.image_url]}
                productName={name}
              />
            </motion.div>

            {/* Section 1: Product Description */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2"
              >
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 capitalize">
                  {product.category_id}
                </Badge>
                {product.featured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {language === 'da' ? 'Fremhævet' : 'Featured'}
                  </Badge>
                )}
              </motion.div>

              {/* Product Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
              >
                {name}
              </motion.h1>

              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-2xl p-6 border border-border/50 shadow-lg"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>

                {/* Use Cases */}
                {useCases.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" />
                      {language === 'da' ? 'Perfekt Til' : 'Perfect For'}
                    </h3>
                    <ul className="grid grid-cols-2 gap-3">
                      {useCases.map((useCase, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.05, type: 'spring' }}
                          >
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          </motion.div>
                          <span>{useCase}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* Quick Quote & Sample Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={() => setQuoteModal({ open: true, mode: 'quote' })}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 h-12 text-base"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {language === 'da' ? 'Få Hurtigt Tilbud' : 'Get Quick Quote'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setQuoteModal({ open: true, mode: 'sample' })}
                  className="flex-1 rounded-xl border-primary/30 hover:bg-primary/5 h-12 text-base"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {language === 'da' ? 'Anmod Gratis Prøve' : 'Request Free Sample'}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Information Sections */}
      <section className="pb-12 sm:pb-16">
        <div className="container max-w-5xl">
          {/* Section 2: Materials & Composition */}
          <MaterialsComposition product={product} />

          {/* Section 3: Origin & Supplier Information */}
          <OriginSupplier />

          {/* Section 4: Sustainability & ESG Impact */}
          <ESGImpact />

          {/* Section 5: Governance & Compliance */}
          <GovernanceCompliance />

          {/* Section 6: Request Sample / WhatsApp CTA */}
          <ProductCTA productName={name} />
        </div>
      </section>

      {/* Related Products Section */}
      <section className="pb-12 sm:pb-16 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="container">
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.category_id}
          />
        </div>
      </section>

      {/* Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={quoteModal.open}
        onClose={() => setQuoteModal({ ...quoteModal, open: false })}
        productName={name}
        mode={quoteModal.mode}
      />
    </div>
  );
};

export default ProductDetail;
