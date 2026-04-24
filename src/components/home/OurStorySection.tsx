import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Globe, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OurStorySection = () => {
  const { language, t } = useLanguage();

  const milestones = [
    { year: '2019', title: language === 'da' ? 'Grundlagt i Danmark' : 'Founded in Denmark', color: 'from-primary to-emerald-600' },
    { year: '2020', title: language === 'da' ? 'Første B2B-partnerskab' : 'First B2B Partnership', color: 'from-blue-500 to-cyan-600' },
    { year: '2023', title: language === 'da' ? '200+ Europæiske kunder' : '200+ European Clients', color: 'from-violet-500 to-purple-600' },
    { year: '2025', title: language === 'da' ? 'Global bæredygtighedspris' : 'Global Sustainability Award', color: 'from-amber-500 to-orange-600' },
  ];

  const processSteps = language === 'da'
    ? [
      { icon: <Heart className="h-6 w-6" />, title: 'Passion for Bæredygtighed', desc: 'Hvert produkt er skabt med kærlighed til planeten' },
      { icon: <Globe className="h-6 w-6" />, title: 'Fra Bangladesh til Europa', desc: 'Vi forbinder håndværkere med europæiske virksomheder' },
      { icon: <Users className="h-6 w-6" />, title: 'Fællesskab Først', desc: 'Vi styrker lokale samfund gennem fair trade' },
    ]
    : [
      { icon: <Heart className="h-6 w-6" />, title: 'Passion for Sustainability', desc: 'Every product is crafted with love for the planet' },
      { icon: <Globe className="h-6 w-6" />, title: 'From Bangladesh to Europe', desc: 'We connect artisans with European businesses' },
      { icon: <Users className="h-6 w-6" />, title: 'Community First', desc: 'We empower local communities through fair trade' },
    ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Badge variant="secondary" className="mb-6 bg-primary/10 border-primary/20 px-4 py-2 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              {t('home.ourstory.badge')}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6">{t('home.ourstory.title')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t('home.ourstory.subtitle')}</p>

            <div className="space-y-5 mb-10">
              {processSteps.map((step, index) => (
                <motion.div key={step.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.1 }} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">{step.icon}</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all group">
              <Link to="/our-story">{t('home.ourstory.cta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div key={milestone.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.15 }} whileHover={{ x: 5 }} className="relative group">
                    <div className="absolute -left-8 top-3 w-4 h-4">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${milestone.color} shadow-lg group-hover:scale-125 transition-transform`} />
                    </div>
                    <div className="rounded-2xl bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border/50 p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-primary">{milestone.year}</span>
                      </div>
                      <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
