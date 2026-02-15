import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Palette, Ruler, Printer, Send, ArrowRight, ArrowLeft, Leaf, CheckCircle, Sparkles, ShieldCheck, Clock, Truck, Factory, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const FloatingLeaf = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
    <motion.div
        className="absolute text-primary/10 pointer-events-none"
        initial={{ y: -20, x, opacity: 0, rotate: 0 }}
        animate={{ y: '100vh', opacity: [0, 0.3, 0], rotate: 360 }}
        transition={{ duration: 15 + Math.random() * 10, delay, repeat: Infinity, ease: 'linear' }}
    >
        <Leaf className="h-6 w-6" />
    </motion.div>
);

const processIconMap: Record<string, React.ReactNode> = {
    MessageSquare: <MessageSquare className="h-7 w-7" />,
    Palette: <Palette className="h-7 w-7" />,
    Package: <Package className="h-7 w-7" />,
    Factory: <Factory className="h-7 w-7" />,
    Truck: <Truck className="h-7 w-7" />,
};

const whyIconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="h-7 w-7" />,
    Factory: <Factory className="h-7 w-7" />,
    Clock: <Clock className="h-7 w-7" />,
    Leaf: <Leaf className="h-7 w-7" />,
};

const CustomSolutions = () => {
    const { language } = useLanguage();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({
        product: '',
        material: '',
        size: '',
        branding: '',
    });

    const { data: productTypeBlocks } = useContentBlocks('custom_product_types');
    const { data: materialBlocks } = useContentBlocks('custom_materials');
    const { data: sizeBlocks } = useContentBlocks('custom_sizes');
    const { data: brandingBlocks } = useContentBlocks('custom_branding');
    const { data: processBlocks } = useContentBlocks('custom_process');
    const { data: whyBlocks } = useContentBlocks('custom_why');

    const productTypes = useMemo(() =>
        (productTypeBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                id: String(meta.id || b.sort_order),
                name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                icon: String(meta.icon || '📦'),
                desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            };
        }),
        [productTypeBlocks, language]
    );

    const materials = useMemo(() =>
        (materialBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                id: String(meta.id || b.sort_order),
                name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                icon: String(meta.icon || '🌿'),
                desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            };
        }),
        [materialBlocks, language]
    );

    const sizes = useMemo(() =>
        (sizeBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                id: String(meta.id || b.sort_order),
                name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                icon: String(meta.icon || '📏'),
                dims: String(meta.dims || ''),
            };
        }),
        [sizeBlocks, language]
    );

    const brandingOptions = useMemo(() =>
        (brandingBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                id: String(meta.id || b.sort_order),
                name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                icon: String(meta.icon || '🖌️'),
                desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            };
        }),
        [brandingBlocks, language]
    );

    const processSteps = useMemo(() =>
        (processBlocks || []).map(b => ({
            icon: processIconMap[(b.icon || 'MessageSquare')] || <MessageSquare className="h-7 w-7" />,
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            color: b.color || 'from-blue-500 to-cyan-600',
        })),
        [processBlocks, language]
    );

    const whyItems = useMemo(() =>
        (whyBlocks || []).map(b => ({
            icon: whyIconMap[(b.icon || 'ShieldCheck')] || <ShieldCheck className="h-7 w-7" />,
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        })),
        [whyBlocks, language]
    );

    const steps = [
        { label: 'Product Type', icon: <Package className="h-4 w-4" /> },
        { label: 'Material', icon: <Leaf className="h-4 w-4" /> },
        { label: 'Size', icon: <Ruler className="h-4 w-4" /> },
        { label: 'Branding', icon: <Printer className="h-4 w-4" /> },
        { label: 'Summary', icon: <Send className="h-4 w-4" /> },
    ];

    const canNext = () => {
        if (step === 0) return !!selections.product;
        if (step === 1) return !!selections.material;
        if (step === 2) return !!selections.size;
        if (step === 3) return !!selections.branding;
        return true;
    };

    const getSelectionName = (type: string, id: string) => {
        if (type === 'product') return productTypes.find(p => p.id === id)?.name || id;
        if (type === 'material') return materials.find(m => m.id === id)?.name || id;
        if (type === 'size') return sizes.find(s => s.id === id)?.name || id;
        if (type === 'branding') return brandingOptions.find(b => b.id === id)?.name || id;
        return id;
    };

    const renderOptions = (
        options: Array<{ id: string; name: string; icon: string; desc?: string; dims?: string }>,
        field: keyof typeof selections
    ) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((opt) => (
                <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3 }}
                    onClick={() => setSelections({ ...selections, [field]: opt.id })}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${selections[field] === opt.id
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border/50 bg-background/80 hover:border-primary/30'
                        }`}
                >
                    {selections[field] === opt.id && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                        >
                            <CheckCircle className="h-5 w-5 text-primary" />
                        </motion.div>
                    )}
                    <span className="text-3xl mb-3 block">{opt.icon}</span>
                    <h3 className="font-bold text-sm mb-1">{opt.name}</h3>
                    {opt.desc && <p className="text-xs text-muted-foreground">{opt.desc}</p>}
                    {opt.dims && <p className="text-xs text-primary font-medium mt-1">{opt.dims}</p>}
                </motion.button>
            ))}
        </div>
    );

    return (
        <>
            <Breadcrumb items={[{ label: language === 'da' ? 'Tilpassede Løsninger' : 'Custom Solutions' }]} />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(4)].map((_, i) => (
                    <FloatingLeaf key={i} delay={i * 3} x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)} />
                ))}
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">B2B Customization</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Tilpassede Juteløsninger' : 'Custom Jute Solutions'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Design dine egne bæredygtige juteprodukter med dit brand. Fra idé til levering.'
                                : 'Design your own sustainable jute products with your branding. From idea to delivery — we handle everything.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Product Builder Wizard */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Byg Dit Produkt' : 'Build Your Product'}
                        </h2>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <button
                                    onClick={() => { if (i < step) setStep(i); }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${i === step ? 'bg-primary text-white shadow-lg shadow-primary/25' :
                                        i < step ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20' :
                                            'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {i < step ? <CheckCircle className="h-3.5 w-3.5" /> : s.icon}
                                    <span className="hidden sm:inline">{s.label}</span>
                                    <span className="sm:hidden">{i + 1}</span>
                                </button>
                                {i < steps.length - 1 && <div className={`w-6 md:w-10 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-xl font-bold mb-6 text-center">Choose Product Type</h3>
                                    {renderOptions(productTypes, 'product')}
                                </motion.div>
                            )}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-xl font-bold mb-6 text-center">Select Material</h3>
                                    {renderOptions(materials, 'material')}
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-xl font-bold mb-6 text-center">Pick a Size</h3>
                                    {renderOptions(sizes, 'size')}
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-xl font-bold mb-6 text-center">Branding Options</h3>
                                    {renderOptions(brandingOptions, 'branding')}
                                </motion.div>
                            )}
                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-xl font-bold mb-6 text-center">Your Custom Product Summary</h3>
                                    <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-primary/20 p-8 max-w-lg mx-auto">
                                        {[
                                            { label: 'Product', val: getSelectionName('product', selections.product) },
                                            { label: 'Material', val: getSelectionName('material', selections.material) },
                                            { label: 'Size', val: getSelectionName('size', selections.size) },
                                            { label: 'Branding', val: getSelectionName('branding', selections.branding) },
                                        ].map((item, idx) => (
                                            <div key={idx} className={`flex justify-between items-center py-4 ${idx < 3 ? 'border-b border-border/50' : ''}`}>
                                                <span className="text-sm text-muted-foreground">{item.label}</span>
                                                <span className="font-semibold text-sm text-primary">{item.val}</span>
                                            </div>
                                        ))}
                                        <div className="mt-6 pt-4 border-t border-primary/20">
                                            <p className="text-xs text-muted-foreground text-center mb-4">MOQ: 500 units • Lead time: 4-6 weeks</p>
                                            <Button asChild className="w-full rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg">
                                                <Link to={`/contact?product=${selections.product}&material=${selections.material}&size=${selections.size}&branding=${selections.branding}`}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Request Quotation
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            className="rounded-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button
                            onClick={() => setStep(Math.min(4, step + 1))}
                            disabled={!canNext() || step === 4}
                            className="rounded-full bg-gradient-to-r from-primary to-emerald-600"
                        >
                            {step === 3 ? 'View Summary' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Sådan Fungerer Det' : 'How It Works'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da' ? 'Fra idé til levering på 5 enkle trin' : 'From idea to delivery in 5 simple steps'}
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-primary/30 to-teal-500/20 -translate-y-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                            {processSteps.map((pStep, index) => (
                                <motion.div
                                    key={pStep.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${pStep.color} flex items-center justify-center text-white shadow-lg mb-4`}
                                    >
                                        {pStep.icon}
                                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                                            {index + 1}
                                        </div>
                                    </motion.div>
                                    <h3 className="font-bold text-lg mb-2">{pStep.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{pStep.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Customize With Us */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Hvorfor Vælge Os?' : 'Why Customize With Ecofy?'}
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyItems.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-6 text-center hover:border-primary/30 hover:shadow-xl transition-all"
                            >
                                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">{item.icon}</div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Parat til at begynde?' : 'Ready to Get Started?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Kontakt os i dag for at diskutere dit næste bæredygtige emballageprojekt.'
                                : 'Contact us today to discuss your next sustainable packaging project. Minimum order: 500 units.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                                <Link to="/contact">
                                    <Send className="mr-2 h-5 w-5" /> Request Quotation
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/products">
                                    View Products <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default CustomSolutions;
