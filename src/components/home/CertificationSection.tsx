import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, FileCheck, Globe, Leaf, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-7 w-7" />,
  FileCheck: <FileCheck className="h-7 w-7" />,
  Award: <Award className="h-7 w-7" />,
  Globe: <Globe className="h-7 w-7" />,
  Leaf: <Leaf className="h-7 w-7" />,
  CheckCircle: <CheckCircle className="h-7 w-7" />,
};

const CertificationSection = () => {
  const { language, t } = useLanguage();
  const { data: certBlocks } = useContentBlocks('cert_list');

  const fallback = [
    { name: 'OEKO-TEX® Standard 100', desc: language === 'da' ? 'Testet for skadelige stoffer — sikker for mennesker og miljø.' : 'Tested for harmful substances — safe for people and the environment.', icon: <ShieldCheck className="h-7 w-7" />, color: 'from-green-500 to-emerald-600' },
    { name: 'ISO 9001:2015', desc: language === 'da' ? 'International kvalitetsstyring certificering.' : 'International quality management certification.', icon: <Award className="h-7 w-7" />, color: 'from-blue-500 to-cyan-600' },
    { name: 'FSC Certified', desc: language === 'da' ? 'Ansvarlig skovforvaltning og bæredygtig produktion.' : 'Responsible forestry and sustainable production.', icon: <Leaf className="h-7 w-7" />, color: 'from-emerald-500 to-teal-600' },
    { name: 'EU REACH Compliant', desc: language === 'da' ? 'Fuld overensstemmelse med EU kemikalieforordning.' : 'Full compliance with EU chemical regulation.', icon: <FileCheck className="h-7 w-7" />, color: 'from-violet-500 to-purple-600' },
    { name: 'Fair Trade', desc: language === 'da' ? 'Retfærdige arbejdsforhold og fair løn til håndværkere.' : 'Fair working conditions and fair wages for artisans.', icon: <Globe className="h-7 w-7" />, color: 'from-amber-500 to-orange-600' },
    { name: 'GRS Certified', desc: language === 'da' ? 'Global Recycled Standard for bæredygtige materialer.' : 'Global Recycled Standard for sustainable materials.', icon: <CheckCircle className="h-7 w-7" />, color: 'from-teal-500 to-green-600' },
  ];

  const certs = useMemo(() => {
    if (certBlocks && certBlocks.length > 0) {
      return certBlocks.slice(0, 6).map(b => ({
        name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
        desc: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
        icon: iconMap[b.icon || 'ShieldCheck'] || <ShieldCheck className="h-7 w-7" />,
        color: b.color || 'from-green-500 to-emerald-600',
      }));
    }
    return fallback;
  }, [certBlocks, language]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">{t('home.certification.badge')}</span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">{t('home.certification.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.certification.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certs.map((cert, index) => (
            <motion.div key={cert.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }} className="group">
              <div className="h-full rounded-2xl bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className={`h-1.5 bg-gradient-to-r ${cert.color}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.color} text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    {cert.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8 group">
            <Link to="/certifications">{t('home.certification.cta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationSection;
