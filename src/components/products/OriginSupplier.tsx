import { motion } from 'framer-motion';
import { MapPin, Users, Building2, Award, Globe, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const OriginSupplier = () => {
  const { language } = useLanguage();

  const supplierInfo = {
    name: 'EcoFy Bangladesh',
    location: 'Dhaka, Bangladesh',
    established: '2018',
    artisans: '150+',
    certifications: ['Fair Trade', 'SA8000', 'SEDEX'],
  };

  const trustIndicators = [
    { icon: Users, label: language === 'da' ? 'Håndværkere' : 'Artisans', value: '150+' },
    { icon: Building2, label: language === 'da' ? 'Etableret' : 'Established', value: '2018' },
    { icon: Award, label: language === 'da' ? 'Certificeringer' : 'Certifications', value: '3+' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 border border-border/50 shadow-xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3 relative z-10"
        >
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          {language === 'da' ? 'Oprindelse & Leverandør' : 'Origin & Supplier Information'}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Left: Origin Map & Info */}
          <div className="space-y-6">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 border border-emerald-200/50 dark:border-emerald-800/30"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-3 bg-white dark:bg-background rounded-xl shadow-lg"
                >
                  <MapPin className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{supplierInfo.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {supplierInfo.location}
                  </p>
                </div>
              </div>
              
              {/* Made in Bangladesh Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-background/80 rounded-full shadow-sm"
              >
                <span className="text-2xl">🇧🇩</span>
                <span className="font-medium text-sm text-foreground">
                  {language === 'da' ? 'Fremstillet i Bangladesh' : 'Made in Bangladesh'}
                </span>
              </motion.div>
            </motion.div>

            {/* Artisan Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-foreground">
                  {language === 'da' ? 'Håndværkerhistorie' : 'Artisan Story'}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === 'da' 
                  ? 'Vores produkter er håndlavet af dygtige håndværkere i Bangladesh, der har arvet traditionelle jutefremstillingsteknikker gennem generationer. Vi sikrer fair løn og sikre arbejdsforhold.'
                  : 'Our products are handcrafted by skilled artisans in Bangladesh who have inherited traditional jute-making techniques through generations. We ensure fair wages and safe working conditions.'}
              </p>
            </motion.div>
          </div>

          {/* Right: Trust Indicators & Certifications */}
          <div className="space-y-6">
            {/* Trust Indicators Grid */}
            <div className="grid grid-cols-3 gap-3">
              {trustIndicators.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-2xl bg-muted/50 border border-border/30"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="mx-auto w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-muted/30 border border-border/30"
            >
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                {language === 'da' ? 'Leverandørcertificeringer' : 'Supplier Certifications'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {supplierInfo.certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  >
                    <Badge variant="secondary" className="px-3 py-1">
                      {cert}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Transparency Statement */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground italic"
            >
              {language === 'da'
                ? '"Vi tror på fuld gennemsigtighed i vores forsyningskæde og er stolte af at samarbejde med certificerede leverandører."'
                : '"We believe in full transparency in our supply chain and are proud to partner with certified suppliers."'}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OriginSupplier;
