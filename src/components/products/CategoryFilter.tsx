import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const { language, t } = useLanguage();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  const allCategories = [
    { id: 'all', name_en: 'All Products', name_da: 'Alle Produkter' },
    ...(categories || []),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {allCategories.map((category) => {
        const name = language === 'en' ? category.name_en : category.name_da;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors",
              activeCategory === category.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeCategory === category.id && (
              <motion.span
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
