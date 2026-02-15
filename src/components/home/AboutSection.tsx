import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Award, Users, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContentBlocks, useContentBlock } from '@/hooks/useContentBlocks';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = { Award, Users, Globe, Leaf };

const AboutSection = () => {
  const { language, t } = useLanguage();
  const { data: statsBlocks = [] } = useContentBlocks('about_stats');
  const { data: featuresBlocks = [] } = useContentBlocks('about_features');
  const { data: imageBlock } = useContentBlock('about', 'main_image');

  const stats = statsBlocks.map((block) => ({
    value: block.value || '',
    label: (language === 'en' ? block.title_en : block.title_da) || '',
    icon: iconMap[block.icon || 'Award'] || Award,
  }));

  const features = featuresBlocks.map((block) =>
    (language === 'en' ? block.title_en : block.title_da) || ''
  );

  const mainImage = imageBlock?.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-secondary to-background py-24 md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {[...Array(4)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: `${20 + i * 25}%`, top: `${15 + i * 15}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}>
          <Leaf className="h-8 w-8 text-primary/10" />
        </motion.div>
      ))}

      <div className="container relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
                <img src={mainImage} alt="Bangladesh jute artisans" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </motion.div>

              {stats.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }} className="absolute -bottom-8 -right-4 md:-right-8 lg:-right-12">
                  <div className="grid gap-3">
                    {stats.map((stat, index) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.05, x: -5 }}
                        className="flex items-center gap-4 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-xl p-4 shadow-xl shadow-primary/10 border border-primary/10">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-6 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-primary/20 px-4 py-2 text-sm shadow-lg">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                {language === 'en' ? 'About Us' : 'Om Os'}
              </Badge>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t('about.title')}
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t('about.subtitle')}
            </motion.p>

            {features.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 space-y-4">
                {features.map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-1.5">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }} className="mt-10">
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group">
                <Link to="/our-story">
                  {t('about.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
