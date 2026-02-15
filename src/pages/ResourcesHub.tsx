import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, Leaf, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-7 w-7" />,
    Leaf: <Leaf className="h-7 w-7" />,
    ShieldCheck: <ShieldCheck className="h-7 w-7" />,
    BookOpen: <BookOpen className="h-7 w-7" />,
};

const ResourcesHub = () => {
    const { language } = useLanguage();

    const { data: resourceBlocks } = useContentBlocks('resources_items');

    // Group items by category (stored in metadata.category)
    const resources = useMemo(() => {
        const categoryMap = new Map<string, {
            category: string;
            icon: React.ReactNode;
            color: string;
            items: { title: string; desc: string; format: string; size: string }[];
        }>();

        (resourceBlocks || []).forEach(b => {
            const meta = (b.metadata || {}) as any;
            const catKey = String(meta.category || 'Other');
            const catIcon = String(meta.category_icon || 'FileText');
            const catColor = String(meta.category_color || 'from-blue-500 to-cyan-600');

            if (!categoryMap.has(catKey)) {
                categoryMap.set(catKey, {
                    category: catKey,
                    icon: iconMap[catIcon] || <FileText className="h-7 w-7" />,
                    color: catColor,
                    items: [],
                });
            }

            categoryMap.get(catKey)!.items.push({
                title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
                format: String(meta.format || 'PDF'),
                size: String(meta.size || ''),
            });
        });

        return Array.from(categoryMap.values());
    }, [resourceBlocks, language]);

    return (
        <>
            <Breadcrumb items={[{ label: language === 'da' ? 'Ressourcer' : 'Resources' }]} />

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <Download className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Free Downloads</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Ressource Center' : 'Resources Hub'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Download produktkataloger, bæredygtighedsrapporter og EU-reguleringsguider.'
                                : 'Download product catalogs, sustainability reports, and EU regulation guides — all free for B2B partners.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-16 md:py-24">
                <div className="container max-w-5xl space-y-12">
                    {resources.map((section, sectionIndex) => (
                        <motion.div
                            key={section.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: sectionIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold">{section.category}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {section.items.map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.08 }}
                                        whileHover={{ y: -3 }}
                                        className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{item.format}</span>
                                                <span className="text-xs text-muted-foreground">{item.size}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                                        <button className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                            <Download className="h-3.5 w-3.5" />
                                            {language === 'da' ? 'Download' : 'Download'}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Newsletter CTA for Resources */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-purple-500/10">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Brug for noget specifikt?' : 'Need Something Specific?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Vi kan sende dig tilpassede materialer, certificeringer og produktspecifikationer.'
                                : 'We can send you custom materials, certifications, and product specifications tailored to your needs.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                                <Link to="/contact">
                                    {language === 'da' ? 'Anmod om Materialer' : 'Request Materials'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/certifications">
                                    {language === 'da' ? 'Se Certificeringer' : 'View Certifications'}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default ResourcesHub;
