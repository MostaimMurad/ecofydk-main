import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories, Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProductListCardProps {
  product: Product;
  index: number;
}

const ProductListCard = ({ product, index }: ProductListCardProps) => {
  const { language, t } = useLanguage();
  const { data: categories } = useCategories();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const name = language === 'da' ? product.name_da : product.name_en;
  const description = language === 'da' ? product.description_da : product.description_en;
  const category = categories?.find((c) => c.id === product.category_id);
  const categoryName = category
    ? language === 'da'
      ? category.name_da
      : category.name_en
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 overflow-hidden rounded-lg">
          {/* Skeleton - shows while image is loading */}
          {!isImageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full z-10 rounded-lg" />
          )}
          <img
            src={product.image_url}
            alt={name}
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-300 group-hover:scale-105",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground z-20">
              {language === 'da' ? 'Udvalgt' : 'Featured'}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {categoryName && (
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                {categoryName}
              </span>
            )}
            <h3 className="mt-1 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            
            {/* Specs */}
            {(product.spec_material || product.spec_size) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.spec_material && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {product.spec_material}
                  </span>
                )}
                {product.spec_size && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {product.spec_size}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="group/btn p-0">
              {t('products.viewDetails')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductListCard;
