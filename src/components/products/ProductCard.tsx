import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, Package, Scale, Layers, Check, Sparkles, GitCompareArrows } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';
import { useCompare } from '@/contexts/CompareContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuickViewImageLoaded, setIsQuickViewImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const name = language === 'en' ? product.name_en : product.name_da;
  const description = language === 'en' ? product.description_en : product.description_da;
  const useCases = language === 'en' ? product.use_cases_en : product.use_cases_da;

  const specs = [
    { icon: Package, label: 'Size', value: product.spec_size },
    { icon: Scale, label: 'Weight', value: product.spec_weight },
    { icon: Layers, label: 'Material', value: product.spec_material },
  ].filter((spec) => spec.value);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/products/${product.slug}`}
          className="group block relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/40"
        >
          {/* Glow effect on hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/20 rounded-2xl blur-sm pointer-events-none z-0"
          />

          <div className="relative z-10 bg-card rounded-2xl overflow-hidden">
            <div className="relative overflow-hidden">
              <AspectRatio ratio={1}>
                {/* Skeleton - shows while image is loading */}
                {!isImageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full z-10" />
                )}
                <motion.img
                  src={product.image_url}
                  alt={name}
                  onLoad={() => setIsImageLoaded(true)}
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "w-full h-full object-cover",
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
                {/* Gradient overlay on hover */}
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                />
              </AspectRatio>

              {/* Featured badge with shimmer effect */}
              {product.featured && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-3 left-3"
                >
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Featured' : 'Fremhævet'}
                  </Badge>
                </motion.div>
              )}

              {/* Compare button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isInCompare(product.id)) {
                    removeFromCompare(product.id);
                  } else {
                    addToCompare(product);
                  }
                }}
                className={cn(
                  'absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-lg transition-all',
                  isInCompare(product.id)
                    ? 'bg-primary text-white'
                    : 'bg-white/80 text-foreground hover:bg-primary hover:text-white'
                )}
              >
                <GitCompareArrows className="h-4 w-4" />
              </motion.button>

              {/* Quick View button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuickView}
                  className="shadow-xl backdrop-blur-md bg-white/90 hover:bg-white text-foreground"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t('products.quickView')}
                </Button>
              </motion.div>
            </div>

            <div className="p-5">
              <motion.h3
                animate={{ color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
                transition={{ duration: 0.3 }}
                className="font-serif text-lg font-semibold line-clamp-1"
              >
                {name}
              </motion.h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>

              {/* Trust Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  <Check className="h-2.5 w-2.5" /> EU Certified
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  <Check className="h-2.5 w-2.5" /> 100% Eco-Friendly
                </span>
              </div>

              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center text-primary font-medium text-sm"
              >
                <span>{t('products.request-quote')}</span>
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Dialog */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-card/95 border-border/50">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-muted">
              <AspectRatio ratio={1}>
                {/* Skeleton - shows while quick view image is loading */}
                {!isQuickViewImageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full z-10" />
                )}
                <img
                  src={product.image_url}
                  alt={name}
                  onLoad={() => setIsQuickViewImageLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isQuickViewImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
              </AspectRatio>
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Category */}
              <Badge variant="secondary" className="capitalize">
                {product.category_id}
              </Badge>

              {/* Description */}
              <p className="text-muted-foreground">{description}</p>

              {/* Specifications */}
              {specs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">
                    {language === 'en' ? 'Specifications' : 'Specifikationer'}
                  </h4>
                  <div className="grid gap-2">
                    {specs.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{label}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {useCases.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">
                    {language === 'en' ? 'Perfect For' : 'Perfekt Til'}
                  </h4>
                  <ul className="grid grid-cols-2 gap-1">
                    {useCases.slice(0, 4).map((useCase, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="line-clamp-1">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="shadow-lg">
                  <Link to={`/products/${product.slug}`}>
                    {language === 'en' ? 'View Full Details' : 'Se Alle Detaljer'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">
                    {t('products.request-quote')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
