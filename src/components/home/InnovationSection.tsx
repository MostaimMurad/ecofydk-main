import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Cpu, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Lightbulb, Rocket, Cpu, Layers };

const InnovationSection = () => {
  const { language, t } = useLanguage();
  const { data: practicesData } = useContentBlocks('innovation_practices');

  const fallback = [
    { icon: Cpu, title: language === 'da' ? 'Smart Produktion' : 'Smart Manufacturing', desc: language === 'da' ? 'Integration af moderne teknologi i traditionelle håndværksteknikker.' : 'Integrating modern technology with traditional craftsmanship.', color: 'from-indigo-500 to-blue-600' },
    { icon: Layers, title: language === 'da' ? 'Produktdesign' : 'Product Design', desc: language === 'da' ? 'Innovative designs der kombinerer æstetik med bæredygtighed.' : 'Innovative designs combining aesthetics with sustainability.', color: 'from-violet-500 to-purple-600' },
    { icon: Lightbulb, title: language === 'da' ? 'Kreativ Tænkning' : 'Creative Thinking', desc: language === 'da' ? 'Vi fremmer en kultur af nytænkning i alle aspekter.' : 'We foster a culture of innovative thinking in all aspects.', color: 'from-blue-600 to-indigo-600' },
    { icon: Rocket, title: language === 'da' ? 'Fremtidens Løsninger' : 'Future Solutions', desc: language === 'da' ? 'Vi udvikler morgendagens bæredygtige produkter i dag.' : 'We develop tomorrow\'s sustainable products today.', color: 'from-cyan-500 to-teal-600' },
  ];

  const practices = (practicesData && practicesData.length > 0)
    ? practicesData.slice(0, 4).map(b => ({
      icon: iconMap[b.icon || ''] || Lightbulb,
      title: language === 'da' ? (b.title_da || '') : (b.title_en || ''),
      desc: language === 'da' ? (b.description_da || '') : (b.description_en || ''),
      color: b.color || 'from-indigo-500 to-blue-600',
    }))
    : fallback;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 dark:from-indigo-950/20 via-background to-violet-50/30 dark:to-violet-950/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4" />
            {t('home.innovation.badge')}
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600">{t('home.innovation.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t('home.innovation.subtitle')}</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {practices.map((practice, index) => (
            <motion.div key={practice.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="group">
              <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${practice.color} flex items-center justify-center shadow-lg mb-4`}>
                  <practice.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground">{practice.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{practice.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full border-indigo-500/30 hover:bg-indigo-500/5 px-8 group">
            <Link to="/innovation">{t('home.innovation.cta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovationSection;
