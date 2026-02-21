import { motion } from 'framer-motion';
import { MessageSquare, Palette, Package, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactElement> = {
    MessageSquare: <MessageSquare className="h-7 w-7" />,
    Palette: <Palette className="h-7 w-7" />,
    Package: <Package className="h-7 w-7" />,
    Truck: <Truck className="h-7 w-7" />,
};

const defaultSteps = [
    { title_en: 'Tell Us Your Needs', title_da: 'Fortæl Os', desc_en: 'Share your requirements — product type, quantity, branding, and delivery timeline', desc_da: 'Del dine krav — produkttype, mængde, branding og levering', icon: 'MessageSquare', color: 'from-blue-500 to-cyan-600' },
    { title_en: 'We Design & Sample', title_da: 'Vi Designer', desc_en: 'Receive design mockups and physical samples for your approval', desc_da: 'Få design mockups og fysiske prøver til godkendelse', icon: 'Palette', color: 'from-purple-500 to-violet-600' },
    { title_en: 'Production', title_da: 'Produktion', desc_en: 'Bulk manufacturing with strict quality control at our partner factories', desc_da: 'Masseproduktion med streng kvalitetskontrol i Bangladesh', icon: 'Package', color: 'from-amber-500 to-orange-600' },
    { title_en: 'Delivery to Your Door', title_da: 'Levering', desc_en: 'Direct shipping to your EU warehouse with full compliance documentation', desc_da: 'Direkte forsendelse til dit EU-lager med fuld dokumentation', icon: 'Truck', color: 'from-emerald-500 to-teal-600' },
];

const HowItWorks = () => {
    const { language, t } = useLanguage();
    const { data: blocks } = useContentBlocks('homepage_howitworks');

    const steps = (blocks && blocks.length > 0)
        ? blocks.map(block => ({
            icon: iconMap[block.icon || 'MessageSquare'] || <MessageSquare className="h-7 w-7" />,
            title: language === 'da' ? (block.title_da || block.title_en || '') : (block.title_en || ''),
            desc: language === 'da' ? (block.description_da || block.description_en || '') : (block.description_en || ''),
            color: block.color || 'from-blue-500 to-cyan-600',
        }))
        : defaultSteps.map(d => ({
            icon: iconMap[d.icon] || <MessageSquare className="h-7 w-7" />,
            title: language === 'da' ? d.title_da : d.title_en,
            desc: language === 'da' ? d.desc_da : d.desc_en,
            color: d.color,
        }));

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

            <div className="container relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6"
                    >
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                            {t('home.howitworks.badge')}
                        </span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {t('home.howitworks.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('home.howitworks.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500/20 via-primary/30 to-emerald-500/20" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl mb-6`}
                            >
                                {step.icon}
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary shadow-md">
                                    {index + 1}
                                </div>
                            </motion.div>
                            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 px-8"
                    >
                        <Link to="/custom-solutions">
                            {t('home.howitworks.cta')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
