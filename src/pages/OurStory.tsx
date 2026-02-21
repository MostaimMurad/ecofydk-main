import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf, Heart, Users, Globe, Award, Handshake, Sparkles, Star, Quote } from 'lucide-react';
import heroOurStory from '@/assets/hero-our-story.jpg';
import missionProduction from '@/assets/mission-production.jpg';
import artisanFatima from '@/assets/artisan-fatima.jpg';
import artisanKarim from '@/assets/artisan-karim.jpg';
import artisanRashida from '@/assets/artisan-rashida.jpg';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Heart, Users, Globe, Award, Handshake, Sparkles, Star, Quote,
};

const artisanImageMap: Record<string, string> = {
  '/src/assets/artisan-fatima.jpg': artisanFatima,
  '/src/assets/artisan-karim.jpg': artisanKarim,
  '/src/assets/artisan-rashida.jpg': artisanRashida,
};

// Floating Leaf component for background animation
const FloatingLeaf = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x }}
    animate={{
      opacity: [0, 0.5, 0],
      y: [0, 350],
      x: [x, x + 40, x - 25, x + 15],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 14,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: `${x}%`, top: 0 }}
  >
    <Leaf className="w-5 h-5 text-primary/20" />
  </motion.div>
);

const OurStory = () => {
  const { t, language } = useLanguage();
  const { data: timelineEvents } = useTimelineEvents();
  const { data: teamMembers } = useTeamMembers();
  const { data: storyStats } = useContentBlocks('story_stats');
  const { data: storyValues } = useContentBlocks('story_values');
  const { data: storyCerts } = useContentBlocks('story_certifications');
  const { data: missionBlocks } = useContentBlocks('story_mission');

  // Mission section dynamic data
  const missionBlock = missionBlocks?.find(b => b.block_key === 'mission_main');
  const missionTitle = missionBlock
    ? (language === 'da' ? (missionBlock.title_da || missionBlock.title_en) : missionBlock.title_en) || t('story.mission.title')
    : t('story.mission.title');
  const missionDesc1 = missionBlock
    ? (language === 'da' ? (missionBlock.description_da || missionBlock.description_en) : missionBlock.description_en) || t('story.mission.description')
    : t('story.mission.description');
  const missionDesc2 = missionBlock
    ? (language === 'da' ? ((missionBlock.metadata as Record<string, string>)?.description2_da || (missionBlock.metadata as Record<string, string>)?.description2_en) : (missionBlock.metadata as Record<string, string>)?.description2_en) || t('story.mission.description2')
    : t('story.mission.description2');
  const missionOverlayValue = (missionBlock?.metadata as Record<string, string>)?.overlay_value || '6+';
  const missionOverlayLabel = missionBlock
    ? (language === 'da' ? ((missionBlock.metadata as Record<string, string>)?.overlay_label_da || (missionBlock.metadata as Record<string, string>)?.overlay_label_en) : (missionBlock.metadata as Record<string, string>)?.overlay_label_en) || (language === 'da' ? 'Års Erfaring' : 'Years Experience')
    : (language === 'da' ? 'Års Erfaring' : 'Years Experience');
  const missionImage = missionBlock?.image_url || missionProduction;

  const statIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    artisans: Users,
    products: Leaf,
    countries: Globe,
    sustainable: Heart,
  };

  const timeline = (timelineEvents || []).map(event => ({
    year: event.year,
    text: language === 'da' ? event.title_da : event.title_en,
    color: event.color || 'from-primary to-emerald-600',
  }));

  const values = (storyValues || []).map(block => ({
    icon: iconMap[block.icon || 'Leaf'] || Leaf,
    title: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    desc: language === 'da' ? (block.description_da || '') : (block.description_en || ''),
    color: block.color || 'from-primary to-emerald-600',
  }));

  const artisans = (teamMembers || []).map(member => ({
    name: member.name,
    role: language === 'da' ? member.role_da : member.role_en,
    years: member.years_experience || 0,
    image: artisanImageMap[member.image_url || ''] || member.image_url || artisanFatima,
  }));

  const stats = (storyStats || []).map(block => ({
    value: block.value || '',
    label: language === 'da' ? (block.title_da || '') : (block.title_en || ''),
    icon: statIconMap[block.block_key] || Leaf,
  }));

  const certNames = (storyCerts || []).map(block =>
    language === 'da' ? (block.title_da || '') : (block.title_en || '')
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Premium Styling */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroOurStory})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 25, 45, 65, 80, 95].map((x, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [-20, 400],
              }}
              transition={{
                duration: 10,
                delay: i * 1.5,
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20"
            >
              <Sparkles className="h-4 w-4" />
              {language === 'da' ? 'Siden 2018' : 'Since 2018'}
            </motion.div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl">
              {t('story.hero.title')}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
            >
              {t('story.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Mission Section with Glass-morphism */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
              >
                <Heart className="h-4 w-4" />
                {language === 'da' ? 'Vores Mission' : 'Our Mission'}
              </motion.div>

              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {missionTitle}
              </h2>

              <div className="mt-8 backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {missionDesc1}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {missionDesc2}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-2xl">
                <img
                  src={missionImage}
                  alt="Jute production process - artisans at work"
                  className="h-full w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 backdrop-blur-xl bg-white/90 dark:bg-card/90 rounded-2xl p-6 shadow-xl border border-border/50"
              >
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">{missionOverlayValue}</p>
                <p className="text-sm text-muted-foreground">{missionOverlayLabel}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient Background */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-primary" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

        <div className="container relative z-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  className="mx-auto w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4"
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <motion.p
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  className="text-4xl font-bold text-white md:text-5xl"
                >
                  {stat.value}
                </motion.p>
                <p className="mt-2 text-sm text-white/90 md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section with Premium Cards */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[15, 35, 55, 75, 90].map((x, i) => (
            <FloatingLeaf key={i} x={x} delay={i * 2.5} />
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4"
            >
              <Star className="h-4 w-4" />
              {language === 'da' ? 'Vores Rejse' : 'Our Journey'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('story.timeline.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('story.timeline.subtitle')}
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-4xl">
            {/* Timeline line */}
            <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-emerald-500 to-primary/50 rounded-full" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative mb-12 flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-2xl p-6 border border-border/50 shadow-xl"
                  >
                    <span className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.year}
                    </span>
                    <p className="mt-3 text-muted-foreground">{item.text}</p>
                  </motion.div>
                </div>

                {/* Timeline dot */}
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className={`absolute left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </motion.div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section with Gradient Cards */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4"
            >
              <Heart className="h-4 w-4" />
              {language === 'da' ? 'Vores Værdier' : 'Our Values'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('story.values.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('story.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg mb-6`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans Section with Premium Cards */}
      <section className="py-16 md:py-24 relative overflow-hidden">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4"
            >
              <Users className="h-4 w-4" />
              {language === 'da' ? 'Mød Holdet' : 'Meet the Team'}
            </motion.div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('story.artisans.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('story.artisans.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {artisans.map((artisan, index) => (
              <motion.div
                key={artisan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl overflow-hidden border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={artisan.image}
                      alt={artisan.name}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-foreground">{artisan.name}</h3>
                    <p className="text-primary font-medium mt-1">{artisan.role}</p>
                    <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                      <Star className="h-3 w-3" />
                      {artisan.years} {t('story.artisans.years')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Impact Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-primary" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

              <div className="relative z-10 p-8 md:p-12 text-center text-white">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
                >
                  <Handshake className="h-8 w-8" />
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {t('story.artisans.impact.title')}
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-white/90 text-lg">
                  {t('story.artisans.impact.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg mb-6"
            >
              <Award className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('story.certifications.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('story.certifications.description')}
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              {certNames.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-2xl p-6 w-36 h-28 flex items-center justify-center border border-border/50 shadow-xl hover:shadow-2xl transition-all"
                >
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    {cert}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
