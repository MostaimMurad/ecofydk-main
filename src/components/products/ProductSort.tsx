import { ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'default' | 'newest' | 'oldest' | 'name-asc' | 'name-desc';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const ProductSort = ({ sortBy, onSortChange }: ProductSortProps) => {
  const { language } = useLanguage();

  const sortOptions: { value: SortOption; label: string }[] = [
    { 
      value: 'default', 
      label: language === 'da' ? 'Standard' : 'Default' 
    },
    { 
      value: 'newest', 
      label: language === 'da' ? 'Nyeste først' : 'Newest First' 
    },
    { 
      value: 'oldest', 
      label: language === 'da' ? 'Ældste først' : 'Oldest First' 
    },
    { 
      value: 'name-asc', 
      label: language === 'da' ? 'Navn (A-Å)' : 'Name (A-Z)' 
    },
    { 
      value: 'name-desc', 
      label: language === 'da' ? 'Navn (Å-A)' : 'Name (Z-A)' 
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
