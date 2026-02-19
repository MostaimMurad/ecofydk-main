import { motion } from 'framer-motion';
import { Leaf, Droplets, Recycle, TreePine, Target, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';

interface ESGImpactProps {
  product?: Product;
}

const ESGImpact = ({ product }: ESGImpactProps) => {
  const { language } = useLanguage();

  const data = product?.esg_impact && Object.keys(product.esg_impact).length > 0
    ? product.esg_impact
    : null;

  const defaultIcons = [TrendingDown, Droplets, Recycle, TreePine];

  const metrics = data?.metrics?.length
    ? data.metrics.map((m, i) => ({
      icon: defaultIcons[i % defaultIcons.length],
      label: language === 'da' ? m.label_da : m.label_en,
      value: m.value,
      description: language === 'da' ? m.description_da : m.description_en,
    }))
    : [
      { icon: TrendingDown, label: language === 'da' ? 'CO₂ Aftryk' : 'Carbon Footprint', value: '-75%', description: language === 'da' ? 'vs. plastik alternativer' : 'vs. plastic alternatives' },
      { icon: Droplets, label: language === 'da' ? 'Vandforbrug' : 'Water Usage', value: '-60%', description: language === 'da' ? 'vs. bomuldsproduktion' : 'vs. cotton production' },
      { icon: Recycle, label: language === 'da' ? 'Genanvendelighed' : 'Recyclability', value: '100%', description: language === 'da' ? 'biologisk nedbrydeligt' : 'biodegradable' },
      { icon: TreePine, label: language === 'da' ? 'Træer Plantet' : 'Trees Planted', value: '1', description: language === 'da' ? 'per 10 solgte produkter' : 'per 10 products sold' },
    ];

  const sdgGoals = data?.sdg_goals?.length
    ? data.sdg_goals.map(g => ({ number: g.number, title: language === 'da' ? g.title_da : g.title_en }))
    : [
      { number: 8, title: language === 'da' ? 'Anstændigt Arbejde' : 'Decent Work' },
      { number: 12, title: language === 'da' ? 'Ansvarligt Forbrug' : 'Responsible Consumption' },
      { number: 13, title: language === 'da' ? 'Klimaindsats' : 'Climate Action' },
      { number: 15, title: language === 'da' ? 'Livet på Land' : 'Life on Land' },
    ];

  const climateBadge = data
    ? (language === 'da' ? data.climate_badge_da : data.climate_badge_en) || ''
    : (language === 'da' ? 'Certificeret Klimaneutral Produktion' : 'Certified Climate Neutral Production');

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
          <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          {language === 'da' ? 'Bæredygtighed & ESG Påvirkning' : 'Sustainability & ESG Impact'}
        </motion.h2>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map(({ icon: Icon, label, value, description }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="text-center p-5 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/40 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/30"
            >
              <div className="p-3 bg-white dark:bg-background rounded-xl inline-flex shadow-sm mb-3">
                <Icon className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-bold text-2xl text-green-600 mb-1">{value}</p>
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>

        {/* SDG Goals */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Target className="h-4 w-4" />
            {language === 'da' ? 'UN Bæredygtige Udviklingsmål' : 'UN Sustainable Development Goals'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {sdgGoals.map((goal, index) => (
              <motion.div
                key={goal.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="text-xs font-bold text-primary">SDG {goal.number}</span>
                <span className="text-xs text-foreground">{goal.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Climate Badge */}
        {climateBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Leaf className="h-4 w-4 text-green-500" />
            <span>{climateBadge}</span>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ESGImpact;
