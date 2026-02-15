import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Trash2, GitCompareArrows } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from '@/contexts/CompareContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CompareDrawer = () => {
    const { compareList, removeFromCompare, clearCompare, isDrawerOpen, setDrawerOpen } = useCompare();
    const { language } = useLanguage();

    if (compareList.length === 0) return null;

    return (
        <>
            {/* Floating Compare Badge — shows always when items in compare */}
            {!isDrawerOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
                    onClick={() => setDrawerOpen(true)}
                >
                    <GitCompareArrows className="h-5 w-5" />
                    <span className="font-medium text-sm">
                        {language === 'da' ? 'Sammenlign' : 'Compare'} ({compareList.length})
                    </span>
                </motion.button>
            )}

            {/* Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl border-t border-border/50 shadow-2xl max-h-[80vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-background/95 backdrop-blur-md z-10 px-6 py-4 border-b border-border/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GitCompareArrows className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold">
                                        {language === 'da' ? 'Sammenlign Produkter' : 'Compare Products'}
                                    </h3>
                                    <Badge variant="secondary" className="text-xs">{compareList.length}/3</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={clearCompare} className="text-muted-foreground text-xs">
                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                        {language === 'da' ? 'Ryd alle' : 'Clear all'}
                                    </Button>
                                    <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Compare Grid */}
                            <div className="p-6">
                                <div className={`grid gap-4 ${compareList.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                    {compareList.map((product) => {
                                        const name = language === 'en' ? product.name_en : product.name_da;
                                        const description = language === 'en' ? product.description_en : product.description_da;
                                        return (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="relative rounded-2xl border border-border/50 overflow-hidden bg-card"
                                            >
                                                {/* Remove button */}
                                                <button
                                                    onClick={() => removeFromCompare(product.id)}
                                                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-white transition-colors"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Image */}
                                                <div className="aspect-square overflow-hidden">
                                                    <img src={product.image_url} alt={name} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Info */}
                                                <div className="p-4 space-y-3">
                                                    <h4 className="font-semibold text-sm line-clamp-1">{name}</h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>

                                                    {/* Specs */}
                                                    <div className="space-y-1.5 text-xs">
                                                        {product.spec_size && (
                                                            <div className="flex justify-between py-1 border-b border-border/30">
                                                                <span className="text-muted-foreground">{language === 'da' ? 'Størrelse' : 'Size'}</span>
                                                                <span className="font-medium">{product.spec_size}</span>
                                                            </div>
                                                        )}
                                                        {product.spec_weight && (
                                                            <div className="flex justify-between py-1 border-b border-border/30">
                                                                <span className="text-muted-foreground">{language === 'da' ? 'Vægt' : 'Weight'}</span>
                                                                <span className="font-medium">{product.spec_weight}</span>
                                                            </div>
                                                        )}
                                                        {product.spec_material && (
                                                            <div className="flex justify-between py-1 border-b border-border/30">
                                                                <span className="text-muted-foreground">{language === 'da' ? 'Materiale' : 'Material'}</span>
                                                                <span className="font-medium">{product.spec_material}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between py-1">
                                                            <span className="text-muted-foreground">{language === 'da' ? 'Kategori' : 'Category'}</span>
                                                            <Badge variant="secondary" className="text-[10px] capitalize px-1.5 py-0">{product.category_id}</Badge>
                                                        </div>
                                                    </div>

                                                    {/* View Button */}
                                                    <Button asChild size="sm" variant="outline" className="w-full rounded-lg text-xs h-8">
                                                        <Link to={`/products/${product.slug}`}>
                                                            {language === 'da' ? 'Se Detaljer' : 'View Details'}
                                                            <ArrowRight className="h-3 w-3 ml-1" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Add more hint */}
                                {compareList.length < 3 && (
                                    <p className="text-center text-sm text-muted-foreground mt-6">
                                        {language === 'da'
                                            ? `Du kan tilføje ${3 - compareList.length} flere produkt(er) til sammenligning`
                                            : `You can add ${3 - compareList.length} more product(s) to compare`}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CompareDrawer;
