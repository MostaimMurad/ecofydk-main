import { motion } from 'framer-motion';
import { Package, Scale, Layers, Ruler, Droplets, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';

interface MaterialsCompositionProps {
  product: Product;
}

const MaterialsComposition = ({ product }: MaterialsCompositionProps) => {
  const { language } = useLanguage();

  const specs = [
    { icon: Ruler, label: language === 'da' ? 'Størrelse' : 'Size', value: product.spec_size, color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: Scale, label: language === 'da' ? 'Vægt' : 'Weight', value: product.spec_weight, color: 'from-amber-500/20 to-orange-500/20' },
    { icon: Layers, label: language === 'da' ? 'Materiale' : 'Material', value: product.spec_material, color: 'from-emerald-500/20 to-green-500/20' },
  ].filter((spec) => spec.value);

  // Use dynamic composition if available, otherwise fall back to hardcoded
  const hasComposition = product.composition && Array.isArray(product.composition) && product.composition.length > 0;
  const composition = hasComposition
    ? product.composition!.map(c => ({ name: language === 'da' ? c.name_da : c.name_en, percentage: c.percentage, icon: Leaf }))
    : [
      { name: language === 'da' ? '100% Naturlig Jute' : '100% Natural Jute', percentage: 85, icon: Leaf },
      { name: language === 'da' ? 'Bomuldsforstærkning' : 'Cotton Reinforcement', percentage: 10, icon: Droplets },
      { name: language === 'da' ? 'Naturlige Farvestoffer' : 'Natural Dyes', percentage: 5, icon: Package },
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
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          {language === 'da' ? 'Materialer & Sammensætning' : 'Materials & Composition'}
        </motion.h2>

        {/* Specifications Grid */}
        {specs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {specs.map(({ icon: Icon, label, value, color }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`relative p-5 rounded-2xl bg-gradient-to-br ${color} border border-border/30 overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start gap-4">
                  <div className="p-3 bg-white/80 dark:bg-background/80 rounded-xl shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {label}
                    </p>
                    <p className="font-semibold text-foreground mt-1">{value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Composition Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {language === 'da' ? 'Sammensætning' : 'Composition Breakdown'}
          </h3>
          <div className="space-y-3">
            {composition.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-primary">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Material Origin Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Leaf className="h-4 w-4 text-primary" />
          <span>{language === 'da' ? 'Alle materialer er naturligt nedbrydelige og bæredygtigt indkøbt' : 'All materials are naturally biodegradable and sustainably sourced'}</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MaterialsComposition;
