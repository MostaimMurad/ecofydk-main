import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Truck, Info, ArrowRight, Leaf, Check, Send, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const PricingGuide = () => {
    const { language } = useLanguage();
    const [quantity, setQuantity] = useState(1000);
    const [openFaq, setOpenFaq] = useState<number>(-1);

    const { data: tierBlocks } = useContentBlocks('pricing_tiers');
    const { data: shippingBlocks } = useContentBlocks('pricing_shipping');
    const { data: faqBlocks } = useContentBlocks('pricing_faq');

    const pricingTiers = useMemo(() =>
        (tierBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                moq: String(meta.moq || ''),
                unit: String(meta.unit || 'units'),
                priceRange: String(meta.price_range || ''),
                perUnit: String(meta.per_unit || 'per unit'),
                features: (meta.features || []) as string[],
                highlight: Boolean(meta.highlight),
                color: b.color || 'border-border/50',
                badge: meta.badge || null,
            };
        }),
        [tierBlocks, language]
    );

    const shippingInfo = useMemo(() =>
        (shippingBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                region: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                time: String(meta.time || ''),
                cost: String(meta.cost || ''),
                icon: String(meta.icon || '🌍'),
            };
        }),
        [shippingBlocks, language]
    );

    const faqs = useMemo(() =>
        (faqBlocks || []).map(b => ({
            q: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            a: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        })),
        [faqBlocks, language]
    );

    const getEstimate = () => {
        if (quantity < 500) return { min: 2.50 * quantity, max: 4.50 * quantity, tier: 'Below MOQ' };
        if (quantity < 1000) return { min: 2.50 * quantity, max: 4.50 * quantity, tier: 'Starter' };
        if (quantity < 5000) return { min: 1.80 * quantity, max: 3.50 * quantity, tier: 'Growth' };
        return { min: 1.20 * quantity, max: 2.80 * quantity, tier: 'Enterprise' };
    };

    const estimate = getEstimate();

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <Calculator className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Transparent Pricing</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'B2B Prisguide' : 'B2B Pricing Guide'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Gennemsigtige priser baseret på mængde. Ingen skjulte gebyrer.'
                                : 'Transparent volume-based pricing. No hidden fees. The more you order, the more you save.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ y: -5 }}
                                className={`relative rounded-3xl bg-background/80 backdrop-blur-sm border-2 ${tier.color} overflow-hidden transition-all hover:shadow-xl ${tier.highlight ? 'shadow-lg shadow-primary/10 scale-105' : ''}`}
                            >
                                {tier.badge && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                                        {tier.badge}
                                    </div>
                                )}
                                <div className="p-6 md:p-8">
                                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        MOQ: <span className="font-semibold text-foreground">{tier.moq}</span> {tier.unit}
                                    </p>
                                    <div className="mb-6">
                                        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">{tier.priceRange}</span>
                                        <span className="text-sm text-muted-foreground ml-2">{tier.perUnit}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {tier.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                                <span className="text-muted-foreground">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className={`w-full rounded-full ${tier.highlight ? 'bg-gradient-to-r from-primary to-emerald-600 shadow-lg' : ''}`} variant={tier.highlight ? 'default' : 'outline'}>
                                        <Link to="/contact">
                                            <Send className="mr-2 h-4 w-4" />
                                            {language === 'da' ? 'Anmod om Tilbud' : 'Request Quote'}
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Calculator */}
            <section className="py-16 md:py-24">
                <div className="container max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Hurtig Prisberegner' : 'Quick Price Calculator'}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-background/80 backdrop-blur-sm border border-border/50 p-8 shadow-xl"
                    >
                        <label className="block text-sm font-medium mb-3">
                            {language === 'da' ? 'Antal enheder' : 'Number of units'}
                        </label>
                        <input
                            type="range"
                            min={100}
                            max={10000}
                            step={100}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full h-2 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary mb-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mb-6">
                            <span>100</span>
                            <span className="text-lg font-bold text-primary">{quantity.toLocaleString()} units</span>
                            <span>10,000</span>
                        </div>

                        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 text-center">
                            <p className="text-xs text-muted-foreground mb-1">
                                {language === 'da' ? 'Estimeret prisinterval' : 'Estimated Price Range'} ({estimate.tier})
                            </p>
                            <p className="text-3xl font-bold text-primary">
                                €{estimate.min.toLocaleString()} — €{estimate.max.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                <Info className="h-3 w-3" />
                                {language === 'da' ? 'Afhænger af produkttype og branding' : 'Depends on product type and branding options'}
                            </p>
                        </div>

                        <Button asChild className="w-full mt-6 rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg" size="lg">
                            <Link to="/contact">
                                {language === 'da' ? 'Få Præcist Tilbud' : 'Get Exact Quote'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Shipping */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <Truck className="inline h-8 w-8 mr-2 text-primary" />
                            {language === 'da' ? 'Forsendelse & Logistik' : 'Shipping & Logistics'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {shippingInfo.map((ship, index) => (
                            <motion.div
                                key={ship.region}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-2xl bg-background/80 border border-border/50 p-5"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{ship.icon}</span>
                                    <span className="font-bold text-sm">{ship.region}</span>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>⏱️ {ship.time}</p>
                                    <p>💰 {ship.cost}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-24">
                <div className="container max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <HelpCircle className="inline h-8 w-8 mr-2 text-primary" />
                            {language === 'da' ? 'Ofte Stillede Spørgsmål' : 'Pricing FAQ'}
                        </h2>
                    </motion.div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-2xl bg-background/80 border border-border/50 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                    className="w-full p-5 flex items-center justify-between text-left"
                                >
                                    <span className="font-semibold text-sm pr-4">{faq.q}</span>
                                    <span className={`text-primary transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === index && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5">
                                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-amber-500/10">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Brug for et tilpasset tilbud?' : 'Need a Custom Quote?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Vores team er klar til at hjælpe dig med at finde den bedste løsning til din virksomhed.'
                                : 'Our team is ready to help you find the best solution for your business. Free samples available.'}
                        </p>
                        <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                            <Link to="/contact">
                                <Send className="mr-2 h-5 w-5" />
                                {language === 'da' ? 'Anmod om Tilbud' : 'Request Quote'}
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default PricingGuide;
