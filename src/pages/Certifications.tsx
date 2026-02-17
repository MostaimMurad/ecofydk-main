import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, FileCheck, Globe, Leaf, CheckCircle, ArrowRight, Sparkles, Download, QrCode, Factory, Truck, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="h-8 w-8" />,
    FileCheck: <FileCheck className="h-8 w-8" />,
    Award: <Award className="h-8 w-8" />,
    Globe: <Globe className="h-8 w-8" />,
    Leaf: <Leaf className="h-8 w-8" />,
    CheckCircle: <CheckCircle className="h-8 w-8" />,
};

const iconMapSm: Record<string, React.ReactNode> = {
    Leaf: <Leaf className="h-6 w-6" />,
    Factory: <Factory className="h-6 w-6" />,
    Eye: <Eye className="h-6 w-6" />,
    Truck: <Truck className="h-6 w-6" />,
    Globe: <Globe className="h-6 w-6" />,
};

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

const Certifications = () => {
    const { language } = useLanguage();

    const { data: certBlocks } = useContentBlocks('cert_list');
    const { data: supplyBlocks } = useContentBlocks('cert_supply_chain');
    const { data: regBlocks } = useContentBlocks('cert_eu_regulations');

    const certifications = useMemo(() =>
        (certBlocks || []).map(b => ({
            name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            icon: iconMap[(b.icon || 'ShieldCheck')] || <ShieldCheck className="h-8 w-8" />,
            status: b.value || 'Active',
            color: b.color || 'from-green-500 to-emerald-600',
        })),
        [certBlocks, language]
    );

    const supplyChainSteps = useMemo(() =>
        (supplyBlocks || []).map(b => ({
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            icon: iconMapSm[(b.icon || 'Leaf')] || <Leaf className="h-6 w-6" />,
            location: b.value || '',
        })),
        [supplyBlocks, language]
    );

    const euRegulations = useMemo(() =>
        (regBlocks || []).map(b => ({
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            year: b.value || '',
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            impact: String((b.metadata as any)?.impact || 'Medium'),
        })),
        [regBlocks, language]
    );

    return (
        <>
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(4)].map((_, i) => (
                    <FloatingLeaf key={i} delay={i * 3} x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)} />
                ))}
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Verified & Trusted</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Certificeringer & Compliance' : 'Certifications & Compliance'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Alle vores produkter opfylder EU-standarder for bæredygtighed, sikkerhed og kvalitet. Fuld gennemsigtighed fra kilde til levering.'
                                : 'All our products meet EU standards for sustainability, safety, and quality. Full transparency from source to delivery.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Certifications Grid */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Vores Certificeringer' : 'Our Certifications'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={cert.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className={`h-1.5 bg-gradient-to-r ${cert.color}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${cert.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            {cert.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cert.status === 'Active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                            }`}>
                                            {cert.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{cert.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supply Chain Transparency */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Forsyningskæde Gennemsigtighed' : 'Supply Chain Transparency'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Følg hvert produkt fra råvare til levering'
                                : 'Track every product from raw material to delivery — every step verified and documented'}
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {supplyChainSteps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-5 items-start"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                        {step.icon}
                                    </div>
                                    {index < supplyChainSteps.length - 1 && (
                                        <div className="w-0.5 h-16 bg-gradient-to-b from-primary/30 to-primary/10 mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 rounded-2xl bg-background/80 border border-border/50 p-5 hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold">{step.title}</h3>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{step.location}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Digital Product Passport */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5">
                <div className="container max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-background/80 backdrop-blur-sm border border-primary/20 overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 mb-4 w-fit">
                                    <Sparkles className="h-3 w-3 text-indigo-500" />
                                    <span className="text-xs font-medium text-indigo-500">Coming Soon</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">Digital Product Passport</h2>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Every Ecofy product will feature a QR code providing instant access to material origin, carbon footprint data, certifications, and care instructions — meeting upcoming EU Digital Product Passport requirements.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {['Material origin & composition', 'Carbon footprint per unit', 'Active certifications', 'Care & end-of-life instructions'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-sm">
                                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-primary/10 to-indigo-500/10 p-8 md:p-10 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-48 h-48 rounded-3xl bg-background/80 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-4"
                                >
                                    <QrCode className="h-20 w-20 text-primary/60" />
                                    <span className="text-xs text-primary font-medium">Scan for product info</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EU Regulations */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'EU Regulering Alignment' : 'EU Regulation Alignment'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'da'
                                ? 'Vores produkter er på forkant med kommende EU-krav'
                                : 'Our products are ahead of upcoming EU sustainability requirements'}
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {euRegulations.map((reg, index) => (
                            <motion.div
                                key={reg.title}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="rounded-2xl bg-background/80 border border-border/50 p-5 hover:border-primary/20 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-sm">{reg.title}</h3>
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{reg.year}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{reg.desc}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${reg.impact === 'High' ? 'bg-green-500/10 text-green-600' :
                                        reg.impact === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                                            'bg-blue-500/10 text-blue-600'
                                        }`}>
                                        {reg.impact} Impact
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-indigo-500/10">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Har du brug for compliance dokumentation?' : 'Need Compliance Documentation?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Vi leverer fuld dokumentation for EU-compliance med alle ordrer.'
                                : 'We provide full EU compliance documentation with every order. Request certificates, test reports, and product specifications.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                                <Link to="/contact">
                                    <Download className="mr-2 h-5 w-5" />
                                    {language === 'da' ? 'Anmod Om Dokumenter' : 'Request Documents'}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
                                <Link to="/impact">
                                    {language === 'da' ? 'Se Vores Påvirkning' : 'View Our Impact'}
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

export default Certifications;
