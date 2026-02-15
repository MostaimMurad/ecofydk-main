import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  slug: string;
  category_id: string;
  name_en: string;
  name_da: string;
  description_en: string;
  description_da: string;
  image_url: string;
  gallery: string[];
  spec_size: string | null;
  spec_weight: string | null;
  spec_material: string | null;
  use_cases_en: string[];
  use_cases_da: string[];
  featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_da: string;
}

export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const PRODUCTS_PER_PAGE = 8;

// Fetch paginated products
export const useProducts = (categoryId?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['products', categoryId, page],
    queryFn: async (): Promise<PaginatedProducts> => {
      // First, get total count
      let countQuery = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (categoryId && categoryId !== 'all') {
        countQuery = countQuery.eq('category_id', categoryId);
      }

      const { count, error: countError } = await countQuery;
      if (countError) throw countError;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
      
      // Then fetch paginated data
      const from = (page - 1) * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .range(from, to);

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const products = (data || []).map((product) => ({
        ...product,
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        use_cases_en: Array.isArray(product.use_cases_en) ? product.use_cases_en : [],
        use_cases_da: Array.isArray(product.use_cases_da) ? product.use_cases_da : [],
      })) as Product[];

      return {
        products,
        totalCount,
        totalPages,
        currentPage: page,
      };
    },
  });
};

// Fetch single product by slug
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        use_cases_en: Array.isArray(data.use_cases_en) ? data.use_cases_en : [],
        use_cases_da: Array.isArray(data.use_cases_da) ? data.use_cases_da : [],
      } as Product;
    },
    enabled: !!slug,
  });
};

// Fetch featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('sort_order', { ascending: true })
        .limit(4);

      if (error) throw error;

      return (data || []).map((product) => ({
        ...product,
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        use_cases_en: Array.isArray(product.use_cases_en) ? product.use_cases_en : [],
        use_cases_da: Array.isArray(product.use_cases_da) ? product.use_cases_da : [],
      })) as Product[];
    },
  });
};

// Fetch all products (for dropdowns, etc. - no pagination)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return (data || []).map((product) => ({
        ...product,
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        use_cases_en: Array.isArray(product.use_cases_en) ? product.use_cases_en : [],
        use_cases_da: Array.isArray(product.use_cases_da) ? product.use_cases_da : [],
      })) as Product[];
    },
  });
};

// Fetch categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('id');

      if (error) throw error;
      return data as Category[];
    },
  });
};
