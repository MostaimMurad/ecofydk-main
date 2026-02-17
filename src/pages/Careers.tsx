import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Leaf, TrendingUp, Users, ArrowRight, MapPin, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
    Globe: <Globe className="h-6 w-6" />,
    TrendingUp: <TrendingUp className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />,
    Users: <Users className="h-6 w-6" />,
    Leaf: <Leaf className="h-6 w-6" />,
    Sparkles: <Sparkles className="h-6 w-6" />,
};

const Careers = () => {
    const { language } = useLanguage();

    const { data: positionBlocks } = useContentBlocks('careers_positions');
    const { data: perkBlocks } = useContentBlocks('careers_perks');

    const openPositions = useMemo(() =>
        (positionBlocks || []).map(b => {
            const meta = (b.metadata || {}) as any;
            return {
                title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
                location: String(meta.location || ''),
                type: String(meta.type || ''),
                department: String(meta.department || ''),
                desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
            };
        }),
        [positionBlocks, language]
    );

    const perks = useMemo(() =>
        (perkBlocks || []).map(b => ({
            icon: iconMap[(b.icon || 'Globe')] || <Globe className="h-6 w-6" />,
            title: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        })),
        [perkBlocks, language]
    );

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                            <Heart className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Join Our Team</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            {language === 'da' ? 'Arbejd Med Os' : 'Work With Purpose'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {language === 'da'
                                ? 'Bliv en del af et team der erstatter plastik med bæredygtige alternativer — ét produkt ad gangen.'
                                : 'Join a team that\'s replacing plastic with sustainable alternatives — one product at a time. Based in Denmark, impacting the world.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Ecofy */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Hvorfor Ecofy?' : 'Why Ecofy?'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {perks.map((perk, index) => (
                            <motion.div
                                key={perk.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg transition-all"
                            >
                                <div className="p-3 rounded-xl bg-primary/10 text-primary inline-flex mb-4">{perk.icon}</div>
                                <h3 className="font-bold mb-2">{perk.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'da' ? 'Ledige Stillinger' : 'Open Positions'}
                        </h2>
                        <p className="text-muted-foreground">
                            {language === 'da'
                                ? `${openPositions.length} aktive stillinger`
                                : `${openPositions.length} active positions`}
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {openPositions.map((pos, index) => (
                            <motion.div
                                key={pos.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ x: 5 }}
                                className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{pos.department}</span>
                                            <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{pos.type}</span>
                                        </div>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">{pos.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{pos.desc}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{pos.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pos.type}</span>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" className="rounded-full border-primary/30 hover:bg-primary/5 flex-shrink-0 self-start">
                                        <Link to="/contact">
                                            {language === 'da' ? 'Ansøg' : 'Apply'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-purple-500/10">
                <div className="container max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'da' ? 'Kan du ikke finde den rette stilling?' : 'Don\'t See the Right Role?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {language === 'da'
                                ? 'Send en open application — vi er altid interesseret i talentfulde mennesker der deler vores passion.'
                                : 'Send an open application — we\'re always interested in talented people who share our passion for sustainability.'}
                        </p>
                        <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
                            <Link to="/contact">
                                {language === 'da' ? 'Send Open Application' : 'Send Open Application'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Careers;
