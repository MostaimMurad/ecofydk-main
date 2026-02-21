import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const TrustedPartners = () => {
    const { language, t } = useLanguage();

    const { data: partnerBlocks } = useContentBlocks('home_partners');

    const partnerLogos = useMemo(() =>
        (partnerBlocks || []).map(b => ({
            name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
            initials: b.value || '',
        })),
        [partnerBlocks, language]
    );

    if (partnerLogos.length === 0) return null;

    return (
        <section className="py-16 md:py-20 overflow-hidden">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        {t('home.partners.badge')}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground/80">
                        {t('home.partners.title')}
                    </h3>
                </motion.div>

                {/* Infinite scroll marquee */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                    <div className="flex gap-8 animate-marquee">
                        {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                            <motion.div
                                key={`${partner.name}-${index}`}
                                whileHover={{ scale: 1.05 }}
                                className="flex-shrink-0 group"
                            >
                                <div className="w-40 h-20 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center gap-3 px-4 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-primary font-bold text-sm">
                                        {partner.initials}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                                        {partner.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default TrustedPartners;
