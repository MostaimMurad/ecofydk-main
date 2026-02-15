import { Leaf, Users, Recycle, Heart, Globe, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = { Leaf, Users, Recycle, Heart, Globe, Award };

const SustainabilityHighlights = () => {
  const { t, language } = useLanguage();
  const { data: highlightBlocks = [] } = useContentBlocks('sustainability_highlights');
  const { data: statBlocks = [] } = useContentBlocks('sustainability_stats');

  const highlights = highlightBlocks.map((block) => ({
    icon: iconMap[block.icon || 'Leaf'] || Leaf,
    title: (language === 'en' ? block.title_en : block.title_da) || '',
    desc: (language === 'en' ? block.description_en : block.description_da) || '',
    color: block.color || 'from-green-500/20 to-emerald-500/20',
  }));

  const stats = statBlocks.map((block) => ({
    value: block.value || '',
    label: (language === 'en' ? block.title_en : block.title_da) || '',
    icon: iconMap[block.icon || 'Heart'] || Heart,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="container relative">
        {/* Section Header */}
        <motion.div className="mb-16 text-center md:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <motion.div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Leaf className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {language === 'en' ? 'Our Commitment' : 'Vores Engagement'}
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">{t('sustainability.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Every choice we make reflects our dedication to the planet and its people'
              : 'Hvert valg vi træffer afspejler vores dedikation til planeten og dens mennesker'}
          </p>
        </motion.div>

        {/* Highlights Cards */}
        {highlights.length > 0 && (
          <motion.div className="grid gap-8 md:grid-cols-3 mb-20" variants={containerVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            {highlights.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <motion.div className={`relative h-full rounded-3xl bg-gradient-to-br ${item.color} p-8 border border-border/50 backdrop-blur-sm overflow-hidden`}
                  whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full" />
                  <motion.div className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                    <item.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="absolute bottom-6 right-6 text-7xl font-bold text-foreground/5">0{index + 1}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Row */}
        {stats.length > 0 && (
          <motion.div className="relative rounded-3xl bg-card border border-border/50 p-8 md:p-12 overflow-hidden"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <div className="relative grid gap-8 md:grid-cols-3 text-center">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}>
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-5xl md:text-6xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground font-medium">{stat.label}</div>
                  {index < stats.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 bg-border" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Button asChild size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
            <Link to="/sustainability">
              {language === 'en' ? 'Learn About Our Mission' : 'Læs Om Vores Mission'}
              <Leaf className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SustainabilityHighlights;
