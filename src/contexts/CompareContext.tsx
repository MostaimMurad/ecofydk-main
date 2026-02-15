import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/hooks/useProducts';

interface CompareContextType {
    compareList: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    clearCompare: () => void;
    isInCompare: (productId: string) => boolean;
    isDrawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
    const [compareList, setCompareList] = useState<Product[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const addToCompare = (product: Product) => {
        if (compareList.length >= 3) return; // Max 3 products
        if (compareList.find((p) => p.id === product.id)) return;
        setCompareList((prev) => [...prev, product]);
    };

    const removeFromCompare = (productId: string) => {
        setCompareList((prev) => prev.filter((p) => p.id !== productId));
    };

    const clearCompare = () => setCompareList([]);

    const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare, isDrawerOpen, setDrawerOpen }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error('useCompare must be used within CompareProvider');
    return ctx;
};
