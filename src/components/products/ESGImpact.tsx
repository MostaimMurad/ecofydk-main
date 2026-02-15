import { motion } from 'framer-motion';
import { Leaf, Droplets, Wind, Recycle, Target, TreeDeciduous } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const ESGImpact = () => {
  const { language } = useLanguage();

  const metrics = [
    {
      icon: Wind,
      label: language === 'da' ? 'CO₂ Aftryk' : 'Carbon Footprint',
      value: '-75%',
      description: language === 'da' ? 'vs. plastik alternativer' : 'vs. plastic alternatives',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: Droplets,
      label: language === 'da' ? 'Vandforbrug' : 'Water Usage',
      value: '-60%',
      description: language === 'da' ? 'vs. bomuldsproduktion' : 'vs. cotton production',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Recycle,
      label: language === 'da' ? 'Genanvendelighed' : 'Recyclability',
      value: '100%',
      description: language === 'da' ? 'biologisk nedbrydeligt' : 'biodegradable',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: TreeDeciduous,
      label: language === 'da' ? 'Træer Plantet' : 'Trees Planted',
      value: '1',
      description: language === 'da' ? 'per 10 solgte produkter' : 'per 10 products sold',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  const sdgGoals = [
    { number: 8, title: language === 'da' ? 'Anstændigt Arbejde' : 'Decent Work', color: 'bg-red-500' },
    { number: 12, title: language === 'da' ? 'Ansvarligt Forbrug' : 'Responsible Consumption', color: 'bg-amber-600' },
    { number: 13, title: language === 'da' ? 'Klimaindsats' : 'Climate Action', color: 'bg-green-600' },
    { number: 15, title: language === 'da' ? 'Livet på Land' : 'Life on Land', color: 'bg-emerald-500' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/40 dark:to-green-950/30 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl" />
        
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-bold text-foreground mb-2 flex items-center gap-3 relative z-10"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-xl">
            <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          {language === 'da' ? 'Bæredygtighed & ESG Impact' : 'Sustainability & ESG Impact'}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-8 relative z-10"
        >
          {language === 'da' 
            ? 'Vores engagement i miljøvenlig produktion og social ansvarlighed'
            : 'Our commitment to eco-friendly production and social responsibility'}
        </motion.p>

        {/* ESG Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative p-5 rounded-2xl bg-white/80 dark:bg-background/80 border border-border/30 shadow-lg group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3 shadow-lg`}
              >
                <metric.icon className="h-6 w-6 text-white" />
              </motion.div>
              
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                className="text-3xl font-bold text-foreground"
              >
                {metric.value}
              </motion.p>
              <p className="text-sm font-medium text-foreground mt-1">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* SDG Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-background/60 border border-border/30 relative z-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'da' ? 'FN\'s Verdensmål Alignment' : 'UN Sustainable Development Goals'}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {sdgGoals.map((goal, index) => (
              <motion.div
                key={goal.number}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 border border-border/30"
              >
                <span className={`w-8 h-8 rounded-full ${goal.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {goal.number}
                </span>
                <span className="text-sm font-medium text-foreground">{goal.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Environmental Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center relative z-10"
        >
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-0 px-4 py-2">
            <Leaf className="h-4 w-4 mr-2 inline" />
            {language === 'da' ? 'Certificeret Klimaneutral Produktion' : 'Certified Climate Neutral Production'}
          </Badge>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ESGImpact;
