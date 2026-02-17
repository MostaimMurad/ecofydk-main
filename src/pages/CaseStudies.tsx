import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Leaf, ArrowRight, Quote, Package, Sparkles, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="h-6 w-6" />,
    Package: <Package className="h-6 w-6" />,
    Leaf: <Leaf className="h-6 w-6" />,
    Sparkles: <Sparkles className="h-6 w-6" />,
};

const CaseStudies = () => {
    const { language } = useLanguage();

    const { data: caseBlocks } = useContentBlocks('casestudies_list');
    const { data: industryBlocks } = useContentBlocks('casestudies_industries');

    const caseStudies = useMemo(() =>
        (caseBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                company: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                industry: String(meta.industry || ''),
                logo: String(meta.logo || ''),
                challenge: language === 'da' ? (meta.challenge_da || meta.challenge_en || '') : (meta.challenge_en || ''),
                solution: language === 'da' ? (meta.solution_da || meta.solution_en || '') : (meta.solution_en || ''),
                results: (meta.results || []) as { metric: string; label: string }[],
                quote: language === 'da' ? (meta.quote_da || meta.quote_en || '') : (meta.quote_en || ''),
                quotePerson: String(meta.quote_person || ''),
                color: b.color || 'from-blue-500 to-cyan-600',
            };
        }),
        [caseBlocks, language]
    );

    const industries = useMemo(() =>
        (industryBlocks || []).map(b => ({
            name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            icon: iconMap[(b.icon || 'Building2')] || <Building2 className="h-6 w-6" />,
            count: b.value || '0',
        })),
        [industryBlocks, language]
    );

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Success Stories</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Kundehistorier' : 'Case Studies'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Se hvordan virksomheder har transformeret deres emballagstrategi med bæredygtige juteprodukter.'
                                : 'See how businesses have transformed their packaging strategy with sustainable jute products.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Industry Stats */}
            <section className="py-12 bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {industries.map((ind, index) => (
                            <motion.div
                                key={ind.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-background/80 border border-border/50"
                            >
                                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">{ind.icon}</div>
                                <div className="text-2xl font-bold text-primary">{ind.count}</div>
                                <div className="text-xs text-muted-foreground font-medium">{ind.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Study Cards */}
            <section className="py-16 md:py-24">
                <div className="container max-w-5xl space-y-16">
                    {caseStudies.map((cs, index) => (
                        <motion.div
                            key={cs.company}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl bg-background/80 backdrop-blur-sm border border-border/50 overflow-hidden hover:shadow-xl transition-all"
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${cs.color} p-6 md:p-8 text-white`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">{cs.logo}</div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold">{cs.company}</h3>
                                        <span className="text-sm text-white/80">{cs.industry}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {/* Challenge & Solution */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">
                                            {language === 'da' ? 'Udfordring' : 'Challenge'}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{cs.challenge}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-2">
                                            {language === 'da' ? 'Løsning' : 'Solution'}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{cs.solution}</p>
                                    </div>
                                </div>

                                {/* Results */}
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        {language === 'da' ? 'Resultater' : 'Results'}
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {cs.results.map((r) => (
                                            <div key={r.label} className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                                                <div className="text-2xl font-bold text-primary">{r.metric}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{r.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quote */}
                                <div className="flex gap-4 items-start p-5 rounded-2xl bg-muted/30 border border-border/30">
                                    <Quote className="h-8 w-8 text-primary/30 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm italic text-foreground leading-relaxed">"{cs.quote}"</p>
                                        <p className="text-xs text-muted-foreground mt-2 font-medium">— {cs.quotePerson}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-blue-500/10">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Klar til at blive vores næste succeshistorie?' : 'Ready to Be Our Next Success Story?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Lad os diskutere hvordan Ecofy kan hjælpe din virksomhed med at skifte til bæredygtig emballage.'
                                : 'Let\'s discuss how Ecofy can help your business switch to sustainable packaging.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                                <Link to="/contact">
                                    {language === 'da' ? 'Kontakt Os' : 'Get In Touch'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/custom-solutions">
                                    {language === 'da' ? 'Byg Dit Produkt' : 'Build Your Product'}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default CaseStudies;
