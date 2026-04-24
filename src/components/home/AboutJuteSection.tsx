import { motion } from 'framer-motion';
import { Leaf, Sparkles, ArrowRight, MessageSquare, Palette, Package, Truck, Droplets, Recycle, Wind } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const processIconMap: Record<string, React.ReactElement> = {
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  Truck: <Truck className="h-5 w-5" />,
};

const defaultSteps = [
  { title_en: 'Tell Us Your Needs', title_da: 'Fortæl Os Dine Behov', desc_en: 'Share your requirements — product type, quantity, branding, and delivery timeline', desc_da: 'Del dine krav — produkttype, mængde, branding og levering', icon: 'MessageSquare', color: 'from-blue-500 to-cyan-600' },
  { title_en: 'We Design & Sample', title_da: 'Vi Designer & Prøver', desc_en: 'Receive design mockups and physical samples for your approval', desc_da: 'Få design mockups og fysiske prøver til godkendelse', icon: 'Palette', color: 'from-purple-500 to-violet-600' },
  { title_en: 'Production', title_da: 'Produktion', desc_en: 'Bulk manufacturing with strict quality control at our partner factories', desc_da: 'Masseproduktion med streng kvalitetskontrol i Bangladesh', icon: 'Package', color: 'from-amber-500 to-orange-600' },
  { title_en: 'Delivery to Your Door', title_da: 'Levering til Din Dør', desc_en: 'Direct shipping to your EU warehouse with full compliance documentation', desc_da: 'Direkte forsendelse til dit EU-lager med fuld dokumentation', icon: 'Truck', color: 'from-emerald-500 to-teal-600' },
];

const AboutJuteSection = () => {
  const { language, t } = useLanguage();
  const { data: howItWorksBlocks } = useContentBlocks('homepage_howitworks');

  const steps = (howItWorksBlocks && howItWorksBlocks.length > 0)
    ? howItWorksBlocks.map(block => ({
      icon: processIconMap[block.icon || 'MessageSquare'] || <MessageSquare className="h-5 w-5" />,
      title: language === 'da' ? (block.title_da || block.title_en || '') : (block.title_en || ''),
      desc: language === 'da' ? (block.description_da || block.description_en || '') : (block.description_en || ''),
      color: block.color || 'from-blue-500 to-cyan-600',
    }))
    : defaultSteps.map(d => ({
      icon: processIconMap[d.icon] || <MessageSquare className="h-5 w-5" />,
      title: language === 'da' ? d.title_da : d.title_en,
      desc: language === 'da' ? d.desc_da : d.desc_en,
      color: d.color,
    }));

  const juteFeatures = language === 'da'
    ? [
      { icon: <Leaf className="h-5 w-5" />, text: '100% biologisk nedbrydeligt og kompostérbart' },
      { icon: <Droplets className="h-5 w-5" />, text: 'Kræver minimal vand sammenlignet med bomuld' },
      { icon: <Recycle className="h-5 w-5" />, text: 'Genanvendeligt og bæredygtigt materiale' },
      { icon: <Wind className="h-5 w-5" />, text: 'Absorberer CO₂ under vækst' },
    ]
    : [
      { icon: <Leaf className="h-5 w-5" />, text: '100% biodegradable and compostable' },
      { icon: <Droplets className="h-5 w-5" />, text: 'Requires minimal water compared to cotton' },
      { icon: <Recycle className="h-5 w-5" />, text: 'Recyclable and sustainable material' },
      { icon: <Wind className="h-5 w-5" />, text: 'Absorbs CO₂ during growth' },
    ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-50/30 dark:via-emerald-950/10 to-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Floating decorations */}
      {[...Array(3)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: `${15 + i * 30}%`, top: `${10 + i * 20}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}>
          <Leaf className="h-10 w-10 text-primary/15" />
        </motion.div>
      ))}

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              {t('home.aboutjute.badge')}
            </span>
          </motion.div>

          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-600 to-teal-600">
            {t('home.aboutjute.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('home.aboutjute.subtitle')}
          </p>
        </motion.div>

        {/* Why Jute Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {juteFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="rounded-2xl bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-primary/10 p-6 h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <p className="text-sm text-foreground font-medium leading-relaxed">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works — inline sub-content (NOT a separate section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Small sub-heading, not a full section header */}
          <h3 className="text-center text-lg font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            {t('home.howitworks.title')}
          </h3>

          {/* Steps as a compact inline row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                    {step.icon}
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-primary/40 text-[10px] font-bold text-primary flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Single CTA for the entire About Jute section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8 group">
            <Link to="/why-jute">
              {t('home.aboutjute.cta')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutJuteSection;
