import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Wind, Recycle, Timer, ShieldCheck, TrendingDown, Factory, Sprout, Globe, ArrowRight, ChevronDown, Sparkles, TreePine, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    Wind: <Wind className="h-5 w-5" />,
    Droplets: <Droplets className="h-5 w-5" />,
    Recycle: <Recycle className="h-5 w-5" />,
    ShieldCheck: <ShieldCheck className="h-5 w-5" />,
    Timer: <Timer className="h-5 w-5" />,
    TreePine: <TreePine className="h-5 w-5" />,
    Globe: <Globe className="h-6 w-6" />,
    TrendingDown: <TrendingDown className="h-6 w-6" />,
    Leaf: <Leaf className="h-6 w-6" />,
    Zap: <Zap className="h-6 w-6" />,
    Sprout: <Sprout className="h-7 w-7" />,
    Factory: <Factory className="h-7 w-7" />,
};

const iconMapLg: Record<string, React.ReactNode> = {
    TreePine: <TreePine className="h-8 w-8" />,
    Droplets: <Droplets className="h-8 w-8" />,
    Recycle: <Recycle className="h-8 w-8" />,
    Leaf: <Leaf className="h-8 w-8" />,
};

// Floating Leaf component for background animation
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

interface ComparisonData {
    metric: string;
    icon: React.ReactNode;
    jute: { value: string; score: number };
    plastic: { value: string; score: number };
    paper: { value: string; score: number };
}

const WhyJute = () => {
    const { language } = useLanguage();
    const [activeComparison, setActiveComparison] = useState<number>(0);

    const { data: comparisonBlocks } = useContentBlocks('whyjute_comparison');
    const { data: lifecycleBlocks } = useContentBlocks('whyjute_lifecycle');
    const { data: factBlocks } = useContentBlocks('whyjute_facts');
    const { data: statBlocks } = useContentBlocks('whyjute_stats');
    const { data: heroBlocks } = useContentBlocks('whyjute_hero');

    const comparisonData: ComparisonData[] = useMemo(() =>
        (comparisonBlocks || []).map(b => ({
            metric: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            icon: iconMap[(b.icon || 'Wind')] || <Wind className="h-5 w-5" />,
            jute: { value: String((b.metadata as any)?.jute_value || ''), score: Number((b.metadata as any)?.jute_score || 0) },
            plastic: { value: String((b.metadata as any)?.plastic_value || ''), score: Number((b.metadata as any)?.plastic_score || 0) },
            paper: { value: String((b.metadata as any)?.paper_value || ''), score: Number((b.metadata as any)?.paper_score || 0) },
        })),
        [comparisonBlocks, language]
    );

    const lifecycleSteps = useMemo(() =>
        (lifecycleBlocks || []).map(b => ({
            icon: iconMap[(b.icon || 'Sprout')] || <Sprout className="h-7 w-7" />,
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            color: b.color || 'from-green-500 to-emerald-600',
        })),
        [lifecycleBlocks, language]
    );

    const facts = useMemo(() =>
        (factBlocks || []).map(b => ({
            icon: iconMap[(b.icon || 'Globe')] || <Globe className="h-6 w-6" />,
            fact: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        })),
        [factBlocks, language]
    );

    const co2Stats = useMemo(() =>
        (statBlocks || []).map(b => ({
            value: String((b.metadata as any)?.value || b.value || '0'),
            unit: String((b.metadata as any)?.unit || ''),
            label: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            icon: iconMapLg[(b.icon || 'Leaf')] || <Leaf className="h-8 w-8" />,
            color: b.color || 'from-green-500 to-emerald-600',
        })),
        [statBlocks, language]
    );

    const hero = heroBlocks?.[0];

    return (
        <>
            <Breadcrumb items={[{ label: language === 'da' ? 'Hvorfor Jute?' : 'Why Jute?' }]} />

            {/* Floating leaves background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(6)].map((_, i) => (
                    <FloatingLeaf key={i} delay={i * 3} x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)} />
                ))}
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                {hero ? (language === 'da' ? hero.title_da : hero.title_en) : 'The Golden Fiber'}
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Hvorfor Vælge Jute?' : 'Why Choose Jute?'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {hero
                                ? (language === 'da' ? hero.description_da : hero.description_en)
                                : (language === 'da'
                                    ? 'Jute er naturens svar på plastic-krisen. Bæredygtig, biologisk nedbrydelig og stærkere end du tror.'
                                    : "Nature's answer to the plastic crisis. Sustainable, biodegradable, and stronger than you think. Discover why jute is the world's most eco-friendly packaging material.")}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Comparison Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Jute vs Plast vs Papir' : 'Jute vs Plastic vs Paper'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Se den reelle miljøpåvirkning side om side'
                                : 'See the real environmental impact side by side'}
                        </p>
                    </motion.div>

                    {/* Comparison Cards - Desktop */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="p-4 font-semibold text-lg">Metric</div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 text-center">
                                <div className="flex items-center justify-center gap-2 font-bold text-primary text-lg mb-1">
                                    <Leaf className="h-5 w-5" /> Jute
                                </div>
                                <span className="text-xs text-primary/70 font-medium px-2 py-0.5 rounded-full bg-primary/10">🏆 Winner</span>
                            </div>
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                                <div className="flex items-center justify-center gap-2 font-bold text-red-500 text-lg">
                                    <Factory className="h-5 w-5" /> Plastic
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                                <div className="flex items-center justify-center gap-2 font-bold text-amber-600 text-lg">
                                    <Wind className="h-5 w-5" /> Paper
                                </div>
                            </div>
                        </div>
                        {comparisonData.map((item, index) => (
                            <motion.div
                                key={item.metric}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="grid grid-cols-4 gap-4 mb-3"
                            >
                                <div className="p-4 rounded-xl bg-background border border-border/50 flex items-center gap-3">
                                    <span className="text-primary">{item.icon}</span>
                                    <span className="font-medium text-sm">{item.metric}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-primary/20 text-center">
                                    <div className="font-semibold text-primary text-sm mb-2">{item.jute.value}</div>
                                    <div className="w-full bg-primary/10 rounded-full h-2.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.jute.score}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-red-500/10 text-center">
                                    <div className="font-semibold text-red-500 text-sm mb-2">{item.plastic.value}</div>
                                    <div className="w-full bg-red-500/10 rounded-full h-2.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.plastic.score}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="bg-gradient-to-r from-red-400 to-red-500 h-2.5 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-amber-500/10 text-center">
                                    <div className="font-semibold text-amber-600 text-sm mb-2">{item.paper.value}</div>
                                    <div className="w-full bg-amber-500/10 rounded-full h-2.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.paper.score}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comparison Cards - Mobile */}
                    <div className="md:hidden space-y-4">
                        {comparisonData.map((item, index) => (
                            <motion.div
                                key={item.metric}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="rounded-2xl bg-background border border-border/50 overflow-hidden"
                            >
                                <button
                                    onClick={() => setActiveComparison(activeComparison === index ? -1 : index)}
                                    className="w-full p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary">{item.icon}</span>
                                        <span className="font-semibold">{item.metric}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeComparison === index ? 'rotate-180' : ''}`} />
                                </button>
                                {activeComparison === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="px-4 pb-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                                            <div className="flex items-center gap-2">
                                                <Leaf className="h-4 w-4 text-primary" />
                                                <span className="font-medium text-primary text-sm">Jute</span>
                                            </div>
                                            <span className="text-sm font-semibold text-primary">{item.jute.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                            <div className="flex items-center gap-2">
                                                <Factory className="h-4 w-4 text-red-500" />
                                                <span className="font-medium text-red-500 text-sm">Plastic</span>
                                            </div>
                                            <span className="text-sm font-semibold text-red-500">{item.plastic.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                            <div className="flex items-center gap-2">
                                                <Wind className="h-4 w-4 text-amber-600" />
                                                <span className="font-medium text-amber-600 text-sm">Paper</span>
                                            </div>
                                            <span className="text-sm font-semibold text-amber-600">{item.paper.value}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifecycle Section */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Jutens Livscyklus' : 'The Jute Lifecycle'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Fra jord til produkt — en 100% naturlig proces'
                                : 'From soil to product — a 100% natural process'}
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/20 via-primary/30 to-emerald-500/20 -translate-y-1/2" />

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                            {lifecycleSteps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mb-4`}
                                        >
                                            {step.icon}
                                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                                                {index + 1}
                                            </div>
                                        </motion.div>
                                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                    </div>
                                    {index < lifecycleSteps.length - 1 && (
                                        <div className="hidden md:flex absolute top-10 -right-2 text-primary/30">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CO₂ Stats Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Miljøpåvirkning i Tal' : 'Environmental Impact in Numbers'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {co2Stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="relative group"
                            >
                                <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-8 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                        <motion.span
                                            className="text-5xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                        >
                                            {stat.value}
                                        </motion.span>
                                        <span className="text-2xl font-bold text-primary">{stat.unit}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Did You Know Facts */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? '💡 Vidste du det?' : '💡 Did You Know?'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facts.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -3 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 flex items-center justify-center text-primary">
                                        {item.icon}
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{item.fact}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-teal-500/10">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Klar til at skifte til jute?' : 'Ready to Switch to Jute?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Udforsk vores bæredygtige juteprodukter og tag det første skridt mod en grønnere fremtid.'
                                : 'Explore our sustainable jute products and take the first step towards a greener future.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 px-8">
                                <Link to="/products">
                                    <Leaf className="mr-2 h-5 w-5" />
                                    {language === 'da' ? 'Se Produkter' : 'View Products'}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/contact">
                                    {language === 'da' ? 'Kontakt Os' : 'Contact Us'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default WhyJute;
