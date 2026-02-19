import { motion } from 'framer-motion';
import { MapPin, Users, Award, ExternalLink, Heart, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';

interface OriginSupplierProps {
  product?: Product;
}

const OriginSupplier = ({ product }: OriginSupplierProps) => {
  const { language } = useLanguage();

  // Use dynamic data if available, otherwise fall back to hardcoded
  const data = product?.origin_supplier && Object.keys(product.origin_supplier).length > 0
    ? product.origin_supplier
    : null;

  const supplierName = data?.supplier_name || 'EcoFy Bangladesh';
  const location = data?.location || 'Dhaka, Bangladesh';
  const artisans = data?.artisans || '150+';
  const established = data?.established || '2018';
  const certifications = data?.certifications || ['Fair Trade', 'SA8000', 'SEDEX'];
  const story = language === 'da'
    ? (data?.story_da || 'Vores produkter er håndlavet af dygtige håndværkere i Bangladesh, der har arvet traditionelle jutefremstillingsteknikker gennem generationer. Vi sikrer fair løn og sikre arbejdsforhold for alle vores producenter.')
    : (data?.story_en || 'Our products are handcrafted by skilled artisans in Bangladesh who have inherited traditional jute-making techniques through generations. We ensure fair wages and safe working conditions for all our producers.');
  const transparency = language === 'da'
    ? (data?.transparency_da || 'Vi tror på fuld gennemsigtighed i vores forsyningskæde og er stolte af at samarbejde med certificerede leverandører.')
    : (data?.transparency_en || 'We believe in full transparency in our supply chain and are proud to partner with certified suppliers.');

  const highlights = [
    { icon: MapPin, label: language === 'da' ? 'Lokation' : 'Location', value: location },
    { icon: Users, label: language === 'da' ? 'Håndværkere' : 'Artisans', value: artisans },
    { icon: Award, label: language === 'da' ? 'Etableret' : 'Established', value: established },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 border border-border/50 shadow-xl">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl">
            <MapPin className="h-6 w-6 text-emerald-600" />
          </div>
          {language === 'da' ? 'Oprindelse & Leverandør' : 'Origin & Supplier'}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Supplier Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-3 bg-primary/10 rounded-xl">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{supplierName}</h3>
                <p className="text-sm text-muted-foreground">{language === 'da' ? 'Verificeret Partner' : 'Verified Partner'}</p>
              </div>
            </motion.div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-3">
              {highlights.map(({ icon: Icon, label, value }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 rounded-xl bg-muted/50 border border-border/30"
                >
                  <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold text-sm text-foreground">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {language === 'da' ? 'Certificeringer' : 'Certifications'}
              </p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <Award className="h-3 w-3" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Story */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-2" />
              <p className="text-muted-foreground leading-relaxed">{story}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/10"
            >
              <p className="text-sm text-muted-foreground italic">{transparency}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OriginSupplier;
