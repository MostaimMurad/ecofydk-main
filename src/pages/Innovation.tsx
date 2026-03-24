import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Cpu, Zap, FlaskConical, Layers, Globe, CheckCircle, ArrowRight, Sparkles, Target, Shield, TrendingUp, Puzzle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb, Rocket, Cpu, Zap, FlaskConical, Layers, Globe, CheckCircle, Shield, Target, Sparkles, TrendingUp, Puzzle,
};

// Floating particle component for background animation
const FloatingParticle = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
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
    <Lightbulb className="w-6 h-6 text-indigo-500/20" />
  </motion.div>
);

const Innovation = () => {
  const { t, language } = useLanguage();
  const { data: practicesData } = useContentBlocks('innovation_practices');
  const { data: statsData } = useContentBlocks('innovation_stats');
  const { data: goalsData } = useContentBlocks('innovation_goals');
  const { data: processData } = useContentBlocks('innovation_process');

  const practiceIconDefaults: Record<string, React.ComponentType<{ className?: string }>> = {
    research: FlaskConical,
    technology: Cpu,
    materials: Layers,
    process: Zap,
    design: Lightbulb,
    collaboration: Globe,
  };

  const statsIconDefaults: Record<string, React.ComponentType<{ className?: string }>> = {
    patents: Shield,
    projects: Rocket,
    partners: Globe,
    years: TrendingUp,
  };

  const practices = (practicesData || []).map(block => ({
    icon: iconMap[block.icon || ''] || practiceIconDefaults[block.block_key] || Lightbulb,
    title: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    desc: language === 'da' ? (block.description_da || '') : (block.description_en || ''),
    color: block.color || 'from-indigo-500 to-blue-600',
  }));

  const stats = (statsData || []).map(block => ({
    value: block.value || '',
    label: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    icon: iconMap[block.icon || ''] || statsIconDefaults[block.block_key] || Lightbulb,
  }));

  const goals = (goalsData || []).map(block => ({
    number: parseInt(block.value || '0'),
    title: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    desc: language === 'da' ? (block.description_da || '') : (block.description_en || ''),
    color: block.color || 'bg-indigo-500',
    icon: iconMap[block.icon || ''] || Lightbulb,
  }));

  const processSteps = (processData || []).map(block =>
    language === 'da' ? (block.title_da || '') : (block.title_en || '')
  );

  // Fallback content when content blocks are empty
  const fallbackPractices = [
    { icon: FlaskConical, title: language === 'da' ? 'Materialeforskning' : 'Material Research', desc: language === 'da' ? 'Vi udforsker konstant nye bæredygtige materialer og kombinationer for at forbedre vores produkter.' : 'We constantly explore new sustainable materials and combinations to improve our products.', color: 'from-indigo-500 to-blue-600' },
    { icon: Cpu, title: language === 'da' ? 'Smart Produktion' : 'Smart Manufacturing', desc: language === 'da' ? 'Integration af moderne teknologi i traditionelle håndværksteknikker for højere kvalitet.' : 'Integrating modern technology with traditional craftsmanship techniques for higher quality.', color: 'from-blue-500 to-cyan-600' },
    { icon: Layers, title: language === 'da' ? 'Produktdesign' : 'Product Design', desc: language === 'da' ? 'Innovative designs der kombinerer æstetik med funktionalitet og bæredygtighed.' : 'Innovative designs that combine aesthetics with functionality and sustainability.', color: 'from-violet-500 to-purple-600' },
    { icon: Zap, title: language === 'da' ? 'Procesoptimering' : 'Process Optimization', desc: language === 'da' ? 'Kontinuerlig forbedring af vores produktionsprocesser for at reducere spild.' : 'Continuous improvement of our production processes to reduce waste.', color: 'from-cyan-500 to-teal-600' },
    { icon: Globe, title: language === 'da' ? 'Globale Partnerskaber' : 'Global Partnerships', desc: language === 'da' ? 'Samarbejde med forskningsinstitutioner og innovatører verden over.' : 'Collaborating with research institutions and innovators worldwide.', color: 'from-indigo-600 to-violet-600' },
    { icon: Lightbulb, title: language === 'da' ? 'Kreativ Tænkning' : 'Creative Thinking', desc: language === 'da' ? 'Vi fremmer en kultur af kreativitet og nytænkning i alle aspekter af vores arbejde.' : 'We foster a culture of creativity and innovative thinking in all aspects of our work.', color: 'from-blue-600 to-indigo-600' },
  ];

  const fallbackStats = [
    { value: '15+', label: language === 'da' ? 'Innovationsprojekter' : 'Innovation Projects', icon: Rocket },
    { value: '8', label: language === 'da' ? 'Forskningspartnere' : 'Research Partners', icon: Globe },
    { value: '30+', label: language === 'da' ? 'Nye Produktvarianter' : 'New Product Variants', icon: Layers },
    { value: '3', label: language === 'da' ? 'År af R&D' : 'Years of R&D', icon: TrendingUp },
  ];

  const fallbackProcessSteps = language === 'da'
    ? ['Idéudvikling & Research', 'Prototype & Test', 'Materialevalg', 'Pilot Produktion', 'Kvalitetssikring', 'Markedslancering']
    : ['Ideation & Research', 'Prototyping & Testing', 'Material Selection', 'Pilot Production', 'Quality Assurance', 'Market Launch'];

  const displayPractices = practices.length > 0 ? practices : fallbackPractices;
  const displayStats = stats.length > 0 ? stats : fallbackStats;
  const displayProcess = processSteps.length > 0 ? processSteps : fallbackProcessSteps;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 30, 50, 70, 90].map((x, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
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
              <Badge className="mb-6 bg-indigo-500/20 text-white border-indigo-400/30 px-4 py-2">
                <Lightbulb className="mr-2 h-4 w-4" />
                {language === 'da' ? 'Innovation & Udvikling' : 'Innovation & Development'}
              </Badge>
            </motion.div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
              {language === 'da' ? 'Banebrydende Innovation' : 'Pioneering Innovation'}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
            >
              {language === 'da'
                ? 'Vi kombinerer traditionelt håndværk med moderne teknologi for at skabe morgendagens bæredygtige løsninger.'
                : 'We combine traditional craftsmanship with modern technology to create tomorrow\'s sustainable solutions.'}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
      </section>

      {/* Innovation Practices Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[15, 35, 55, 75, 92].map((x, i) => (
            <FloatingParticle key={i} x={x} delay={i * 2.5} />
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" />
              {language === 'da' ? 'Vores Innovationsområder' : 'Our Innovation Areas'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
              {language === 'da' ? 'Drivkraften Bag Vores Innovation' : 'The Drive Behind Our Innovation'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {language === 'da'
                ? 'Vi investerer i forskning og udvikling for at skubbe grænserne for bæredygtig produktinnovation.'
                : 'We invest in research and development to push the boundaries of sustainable product innovation.'}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayPractices.map((practice, index) => (
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

      {/* Innovation Stats Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700" />
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
              <Rocket className="h-8 w-8" />
            </motion.div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
              {language === 'da' ? 'Innovation i Tal' : 'Innovation in Numbers'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 text-lg">
              {language === 'da'
                ? 'Vores engagement i innovation afspejles i vores resultater.'
                : 'Our commitment to innovation is reflected in our results.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {displayStats.map((stat, index) => (
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
              {language === 'da'
                ? 'Hos Ecofy handler innovation ikke kun om nye produkter — det handler om at gentænke hele vores tilgang til bæredygtig produktion, fra råmaterialeforsyning til det færdige produkt.'
                : 'At Ecofy, innovation is not just about new products — it\'s about rethinking our entire approach to sustainable manufacturing, from raw material sourcing to the finished product.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Innovation Goals Section */}
      {goals.length > 0 && (
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full text-violet-600 dark:text-violet-400 text-sm font-medium mb-4"
              >
                <Target className="h-4 w-4" />
                {language === 'da' ? 'Vores Mål' : 'Our Goals'}
              </motion.div>
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                {language === 'da' ? 'Innovationsmål' : 'Innovation Goals'}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {language === 'da'
                  ? 'Vores strategiske mål for at drive bæredygtig innovation.'
                  : 'Our strategic goals for driving sustainable innovation.'}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {goals.map((goal, index) => (
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
                      className={`mx-auto w-20 h-20 rounded-2xl ${goal.color} flex items-center justify-center shadow-lg`}
                    >
                      <goal.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <p className="mt-6 font-medium text-foreground">{goal.title}</p>
                    {goal.desc && <p className="mt-2 text-sm text-muted-foreground">{goal.desc}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Innovation Process Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
              >
                <Puzzle className="h-4 w-4" />
                {language === 'da' ? 'Vores Proces' : 'Our Process'}
              </motion.div>

              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                {language === 'da' ? 'Fra Idé til Virkelighed' : 'From Idea to Reality'}
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                {language === 'da'
                  ? 'Vores innovationsproces sikrer, at hver idé gennemgår grundig forskning, test og kvalitetssikring før lancering.'
                  : 'Our innovation process ensures that every idea undergoes thorough research, testing, and quality assurance before launch.'}
              </p>

              <div className="mt-8 space-y-4">
                {displayProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg">
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-violet-500/5" />
                <div className="relative z-10 aspect-square p-8 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl mb-8"
                  >
                    <Lightbulb className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {language === 'da' ? 'Innovation med Formål' : 'Innovation with Purpose'}
                  </h3>
                  <p className="mt-4 text-muted-foreground max-w-sm">
                    {language === 'da'
                      ? 'Hver innovation vi skaber, er designet til at gøre en positiv forskel for mennesker og planeten.'
                      : 'Every innovation we create is designed to make a positive difference for people and the planet.'}
                  </p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600" />
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

                <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                  {language === 'da' ? 'Vil du innovere med os?' : 'Want to Innovate With Us?'}
                </h2>
                <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
                  {language === 'da'
                    ? 'Vi er altid på udkig efter nye partnerskaber og samarbejdsmuligheder inden for bæredygtig innovation.'
                    : 'We are always looking for new partnerships and collaboration opportunities in sustainable innovation.'}
                </p>

                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90 shadow-xl h-14 px-8 text-lg">
                      <Link to="/products">
                        {language === 'da' ? 'Se Produkter' : 'View Products'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white h-14 px-8 text-lg">
                      <Link to="/contact">{language === 'da' ? 'Kontakt Os' : 'Contact Us'}</Link>
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

export default Innovation;
