import { motion } from 'framer-motion';
import { Play, Leaf, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

const FounderVideo = () => {
    const { language } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

            <div className="container relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6"
                    >
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                            {language === 'da' ? 'Vores Historie' : 'Our Story'}
                        </span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {language === 'da' ? 'Mød Grundlæggeren' : 'Meet the Founder'}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {language === 'da'
                            ? 'Se hvordan Ecofy startede og vores vision for en bæredygtig fremtid'
                            : 'See how Ecofy started and our vision for a sustainable future'}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                    {/* Video Embed */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-emerald-500/20 aspect-video shadow-2xl border border-border/50">
                            {!isPlaying ? (
                                <>
                                    {/* Placeholder with play button */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-emerald-700/80 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsPlaying(true)}
                                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mb-4 mx-auto hover:bg-white/30 transition-all group-hover:scale-110"
                                            >
                                                <Play className="h-8 w-8 text-white ml-1" />
                                            </motion.button>
                                            <p className="text-sm font-medium text-white/80">
                                                {language === 'da' ? 'Se video (2 min)' : 'Watch Video (2 min)'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                        <span className="text-xs font-medium text-white">Ecofy ApS</span>
                                    </div>
                                </>
                            ) : (
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                    title="Ecofy Founder Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Quote & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="relative">
                            <Quote className="h-10 w-10 text-primary/20 absolute -top-2 -left-2" />
                            <blockquote className="text-lg md:text-xl italic text-foreground leading-relaxed pl-8 border-l-4 border-primary/30">
                                {language === 'da'
                                    ? '"Vi startede Ecofy med én enkel idé: at erstatte plastik med jute, ét produkt ad gangen. I dag leverer vi til 200+ virksomheder i hele Europa, og vi er kun lige begyndt."'
                                    : '"We started Ecofy with one simple idea: replace plastic with jute, one product at a time. Today we deliver to 200+ businesses across Europe, and we\'re just getting started."'}
                            </blockquote>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                MA
                            </div>
                            <div>
                                <p className="font-bold text-foreground">Mostaim Ahmed</p>
                                <p className="text-sm text-muted-foreground">Founder & CEO, Ecofy ApS</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { value: '2019', label: language === 'da' ? 'Grundlagt' : 'Founded' },
                                { value: '200+', label: language === 'da' ? 'B2B Kunder' : 'B2B Clients' },
                                { value: '14+', label: language === 'da' ? 'Produkter' : 'Products' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FounderVideo;
