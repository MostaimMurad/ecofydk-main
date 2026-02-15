import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Wind, Recycle, Award, TreePine, Factory, Globe, CheckCircle, ArrowRight, Sparkles, Target, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/layout/Breadcrumb';
import heroSustainability from '@/assets/hero-sustainability.jpg';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Droplets, Wind, Recycle, Award, TreePine, Factory, Globe, CheckCircle, Shield, Target, Sparkles,
};

// Floating Leaf component for background animation
const FloatingLeaf = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [0, 400],
      x: [x, x + 50, x - 30, x + 20],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 15,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: `${x}%`, top: 0 }}
  >
    <Leaf className="w-6 h-6 text-emerald-500/20" />
  </motion.div>
);

const Sustainability = () => {
  const { t, language } = useLanguage();
  const { data: practicesData } = useContentBlocks('sustainability_practices');
  const { data: carbonData } = useContentBlocks('carbon_stats');
  const { data: certsData } = useContentBlocks('certifications');
  const { data: sdgData } = useContentBlocks('sdg_goals');
  const { data: supplyData } = useContentBlocks('supply_chain');

  const practiceIconDefaults: Record<string, React.ComponentType<{ className?: string }>> = {
    biodegradable: Leaf,
    water: Droplets,
    carbon: Wind,
    waste: Recycle,
    reforestation: TreePine,
    energy: Factory,
  };

  const carbonIconDefaults: Record<string, React.ComponentType<{ className?: string }>> = {
    reduction: Wind,
    plastic: Recycle,
    renewable: Leaf,
    trees: TreePine,
  };

  const certIconDefaults: Record<string, React.ComponentType<{ className?: string }>> = {
    oekotex: Shield,
    fairtrade: Award,
    iso: CheckCircle,
    gots: Leaf,
  };

  const sdgColorDefaults: Record<string, string> = {
    sdg8: 'bg-red-500',
    sdg12: 'bg-amber-600',
    sdg13: 'bg-green-600',
    sdg15: 'bg-emerald-500',
  };

  const practices = (practicesData || []).map(block => ({
    icon: iconMap[block.icon || ''] || practiceIconDefaults[block.block_key] || Leaf,
    title: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    desc: language === 'da' ? (block.description_da || '') : (block.description_en || ''),
    color: block.color || 'from-primary to-emerald-600',
  }));

  const carbonStats = (carbonData || []).map(block => ({
    value: block.value || '',
    label: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    icon: iconMap[block.icon || ''] || carbonIconDefaults[block.block_key] || Leaf,
  }));

  const certifications = (certsData || []).map(block => ({
    name: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    desc: language === 'da' ? (block.description_da || '') : (block.description_en || ''),
    icon: iconMap[block.icon || ''] || certIconDefaults[block.block_key] || Award,
    color: block.color || 'from-primary to-emerald-600',
  }));

  const sdgGoals = (sdgData || []).map(block => ({
    number: parseInt(block.value || '0'),
    title: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    color: block.color || sdgColorDefaults[block.block_key] || 'bg-primary',
  }));

  const supplySteps = (supplyData || []).map(block =>
    language === 'da' ? (block.title_da || '') : (block.title_en || '')
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Premium Styling */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSustainability})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 30, 50, 70, 90].map((x, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [-20, 400],
              }}
              transition={{
                duration: 12,
                delay: i * 2,
                repeat: Infinity,
              }}
              style={{ left: `${x}%`, top: 0 }}
            />
          ))}
        </div>

        <div className="container relative z-10 flex h-full items-center">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-0"
          >
            <Breadcrumb className="text-white/80" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-6 bg-emerald-500/20 text-white border-emerald-400/30 px-4 py-2">
                <Leaf className="mr-2 h-4 w-4" />
                {t('sust.badge')}
              </Badge>
            </motion.div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
              {t('sust.hero.title')}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
            >
              {t('sust.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Jute Benefits Section with Glass Cards */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        {/* Floating leaves */}
        <div className="absolute inset-0 overflow-hidden">
          {[15, 35, 55, 75, 92].map((x, i) => (
            <FloatingLeaf key={i} x={x} delay={i * 2.5} />
          ))}
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" />
              {language === 'da' ? 'Naturens Gave' : "Nature's Gift"}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.jute.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('sust.jute.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {practices.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${practice.color} flex items-center justify-center shadow-lg mb-4`}
                  >
                    <practice.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground">{practice.title}</h3>
                  <p className="mt-2 text-muted-foreground">{practice.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Carbon Footprint Section with Gradient */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
        
        {/* Animated background orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-white"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="mx-auto w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
            >
              <Globe className="h-8 w-8" />
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.carbon.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 text-lg">
              {t('sust.carbon.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {carbonStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-3xl bg-white/10 backdrop-blur-sm p-6 text-center border border-white/20"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  className="mx-auto w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4"
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  className="text-4xl font-bold text-white md:text-5xl"
                >
                  {stat.value}
                </motion.div>
                <div className="mt-2 text-sm text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white/10 backdrop-blur-sm p-8 border border-white/20"
          >
            <p className="text-center text-white/95 text-lg leading-relaxed">
              {t('sust.carbon.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section with Premium Cards */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-4"
            >
              <Award className="h-4 w-4" />
              {language === 'da' ? 'Certificeret Kvalitet' : 'Certified Quality'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.cert.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('sust.cert.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group"
              >
                <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start gap-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg`}
                    >
                      <cert.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{cert.name}</h3>
                      <p className="mt-2 text-muted-foreground">{cert.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG Goals Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4"
            >
              <Target className="h-4 w-4" />
              {language === 'da' ? 'FN Verdensmål' : 'UN Global Goals'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.sdg.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('sust.sdg.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {sdgGoals.map((goal, index) => (
              <motion.div
                key={goal.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group"
              >
                <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 text-center border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`mx-auto w-20 h-20 rounded-2xl ${goal.color} flex items-center justify-center text-3xl font-bold text-white shadow-lg`}
                  >
                    {goal.number}
                  </motion.div>
                  <p className="mt-6 font-medium text-foreground">{goal.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supply Chain Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
              >
                <Globe className="h-4 w-4" />
                {language === 'da' ? 'Vores Forsyningskæde' : 'Our Supply Chain'}
              </motion.div>
              
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.supply.title')}</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                {t('sust.supply.description')}
              </p>
              
              <div className="mt-8 space-y-4">
                {supplySteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-primary/10 to-emerald-500/5" />
                <div className="relative z-10 aspect-square p-8 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-2xl mb-8"
                  >
                    <Leaf className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">{t('sust.supply.impact.title')}</h3>
                  <p className="mt-4 text-muted-foreground max-w-sm">{t('sust.supply.impact.desc')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-primary" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
              
              {/* Animated orbs */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              />
              
              <div className="relative z-10 py-16 px-8 md:py-20 text-center text-white">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                
                <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{t('sust.cta.title')}</h2>
                <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">{t('sust.cta.subtitle')}</p>
                
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl h-14 px-8 text-lg">
                      <Link to="/products">
                        {t('sust.cta.products')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white h-14 px-8 text-lg">
                      <Link to="/contact">{t('sust.cta.contact')}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;
