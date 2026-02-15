import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, TreePine, Droplets, Package, Truck, Recycle, Target, Users, Building2, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    Package: <Package className="h-8 w-8" />,
    Recycle: <Recycle className="h-8 w-8" />,
    TreePine: <TreePine className="h-8 w-8" />,
    Building2: <Building2 className="h-8 w-8" />,
    Users: <Users className="h-6 w-6" />,
    Globe: <Globe className="h-6 w-6" />,
    Droplets: <Droplets className="h-6 w-6" />,
    Sparkles: <Sparkles className="h-5 w-5" />,
    Truck: <Truck className="h-5 w-5" />,
    TrendingUp: <TrendingUp className="h-5 w-5" />,
    Target: <Target className="h-5 w-5" />,
    Award: <Award className="h-5 w-5" />,
    Leaf: <Leaf className="h-5 w-5" />,
};

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnView || hasStarted) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [startOnView, hasStarted]);

    useEffect(() => {
        if (!hasStarted && startOnView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, hasStarted, startOnView]);

    return { count, ref };
};

// Floating Leaf
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

const ImpactDashboard = () => {
    const { language } = useLanguage();

    const { data: statsBlocks } = useContentBlocks('impact_stats');
    const { data: sdgBlocks } = useContentBlocks('impact_sdg');
    const { data: milestoneBlocks } = useContentBlocks('impact_milestones');

    const impactStats = useMemo(() =>
        (statsBlocks || []).map(b => ({
            value: Number((b.metadata as any)?.numeric_value || b.value || 0),
            suffix: String((b.metadata as any)?.suffix || ''),
            label: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            icon: iconMap[(b.icon || 'Package')] || <Package className="h-8 w-8" />,
            color: b.color || 'from-primary to-emerald-600',
        })),
        [statsBlocks, language]
    );

    const sdgGoals = useMemo(() =>
        (sdgBlocks || []).map(b => ({
            number: Number(b.value || 0),
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            color: b.color || '#3F7E44',
            icon: iconMap[(b.icon || 'Globe')] || <Globe className="h-6 w-6" />,
        })),
        [sdgBlocks, language]
    );

    const milestones = useMemo(() =>
        (milestoneBlocks || []).map(b => ({
            year: b.value || '',
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            icon: iconMap[(b.icon || 'Sparkles')] || <Sparkles className="h-5 w-5" />,
        })),
        [milestoneBlocks, language]
    );

    const stat1 = useCountUp(impactStats[0]?.value || 0, 2500);
    const stat2 = useCountUp(impactStats[1]?.value || 0, 2000);
    const stat3 = useCountUp(impactStats[2]?.value || 0, 2000);
    const stat4 = useCountUp(impactStats[3]?.value || 0, 2000);
    const statRefs = [stat1, stat2, stat3, stat4];

    return (
        <>
            <Breadcrumb items={[{ label: language === 'da' ? 'Vores Påvirkning' : 'Our Impact' }]} />

            {/* Floating Leaves */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(5)].map((_, i) => (
                    <FloatingLeaf key={i} delay={i * 3} x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)} />
                ))}
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
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
                            <Globe className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Making a Difference</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Vores Miljøpåvirkning' : 'Our Environmental Impact'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Hvert juteprodukt vi leverer erstatter plastik og reducerer CO₂. Her er vores samlede indvirkning.'
                                : 'Every jute product we deliver replaces plastic and reduces CO₂. Here\'s our collective impact — measurable, transparent, and growing.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Impact Counters */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {impactStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative group"
                            >
                                <div
                                    ref={statRefs[index]?.ref}
                                    className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-8 text-center hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1 mb-3">
                                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent tabular-nums">
                                            {(statRefs[index]?.count || 0).toLocaleString()}
                                        </span>
                                        <span className="text-xl font-bold text-primary">{stat.suffix}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Timeline / Milestones */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Vores Rejse' : 'Our Journey'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Fra idé til effekt — se hvordan Ecofy har vokset'
                                : 'From idea to impact — see how Ecofy has grown'}
                        </p>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 md:-translate-x-0.5" />

                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.year}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex items-start gap-6 mb-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:text-${index % 2 === 0 ? 'right' : 'left'}`}
                            >
                                {/* Mobile layout */}
                                <div className="md:hidden flex items-start gap-4 w-full">
                                    <div className="relative z-10 flex-shrink-0">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg">
                                            {milestone.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-5 hover:border-primary/20 transition-all">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{milestone.year}</span>
                                        <h3 className="font-bold text-lg mt-2">{milestone.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{milestone.desc}</p>
                                    </div>
                                </div>

                                {/* Desktop layout */}
                                <div className="hidden md:flex items-center w-full">
                                    <div className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'text-right pr-8' : 'order-2 text-left pl-8'}`}>
                                        <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-5 hover:border-primary/20 transition-all hover:shadow-lg inline-block max-w-sm">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{milestone.year}</span>
                                            <h3 className="font-bold text-lg mt-2">{milestone.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{milestone.desc}</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex-shrink-0 mx-auto">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg"
                                        >
                                            {milestone.icon}
                                        </motion.div>
                                    </div>
                                    <div className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'order-2' : ''}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SDG Goals */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'UN Bæredygtighedsmål' : 'UN Sustainable Development Goals'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Vores produkter bidrager direkte til 6 af FNs verdensmål'
                                : 'Our products directly contribute to 6 of the United Nations SDGs'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sdgGoals.map((goal, index) => (
                            <motion.div
                                key={goal.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="h-1.5" style={{ backgroundColor: goal.color }} />
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: goal.color }}>
                                            <span className="text-lg font-bold">{goal.number}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base">{goal.title}</h3>
                                            <span className="text-xs text-muted-foreground">SDG {goal.number}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{goal.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency Pledge */}
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-gradient-to-br from-primary/10 via-emerald-500/5 to-blue-500/10 border border-primary/20 p-8 md:p-12 text-center"
                    >
                        <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                            <Award className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {language === 'da' ? 'Vores Gennemsigtighedsløfte' : 'Our Transparency Pledge'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                            {language === 'da'
                                ? 'Vi forpligter os til fuld åbenhed om vores forsyningskæde, miljøpåvirkning og forretningspraksis. Hvert produkt med QR-kode giver dig adgang til materialeoprindelse, CO₂-aftryk og certificeringer.'
                                : 'We commit to full transparency about our supply chain, environmental impact, and business practices. Every product with a Digital Product Passport QR code gives you access to material origin, carbon footprint, and certifications.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 px-8">
                                <Link to="/products">
                                    <Leaf className="mr-2 h-5 w-5" />
                                    {language === 'da' ? 'Se Produkter' : 'Explore Products'}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/contact">
                                    {language === 'da' ? 'Kontakt Os' : 'Get In Touch'}
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

export default ImpactDashboard;
