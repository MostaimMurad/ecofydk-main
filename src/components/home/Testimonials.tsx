import { Star, Quote, ChevronLeft, ChevronRight, Leaf, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTestimonials } from '@/hooks/useTestimonials';

// Floating leaf component
const FloatingLeaf = ({ delay, duration, startX, startY }: { delay: number; duration: number; startX: string; startY: string }) => (
  <motion.div
    className="absolute text-primary/10 pointer-events-none"
    style={{ left: startX, top: startY }}
    initial={{ opacity: 0, rotate: 0, y: 0 }}
    animate={{
      opacity: [0, 0.3, 0.3, 0],
      rotate: [0, 180, 360],
      y: [0, -100, -200],
      x: [0, 30, -30, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Leaf className="h-8 w-8" />
  </motion.div>
);

const Testimonials = () => {
  const { language, t } = useLanguage();
  const { data: testimonials = [] } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Reset index when testimonials change
  useEffect(() => {
    if (activeIndex >= testimonials.length && testimonials.length > 0) {
      setActiveIndex(0);
    }
  }, [testimonials.length, activeIndex]);

  if (testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Decorative gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating leaves */}
      <FloatingLeaf delay={0} duration={12} startX="10%" startY="80%" />
      <FloatingLeaf delay={2} duration={15} startX="85%" startY="70%" />
      <FloatingLeaf delay={4} duration={10} startX="20%" startY="90%" />
      <FloatingLeaf delay={6} duration={14} startX="70%" startY="85%" />
      <FloatingLeaf delay={8} duration={11} startX="50%" startY="75%" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 px-5 py-2.5 mb-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t('home.testimonials.badge')}
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en'
              ? 'Hear from businesses who have made the sustainable switch with Ecofy'
              : 'Hør fra virksomheder, der har foretaget det bæredygtige skifte med Ecofy'
            }
          </p>
        </motion.div>

        {/* Featured Testimonial - Glass morphism card */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/20 p-8 md:p-12 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            {/* Animated quote decoration */}
            <motion.div
              className="absolute top-8 right-8"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Quote className="h-24 w-24 text-primary/15" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Animated Stars */}
                <div className="flex gap-1.5 mb-8">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <Star className="h-7 w-7 fill-accent text-accent drop-shadow-lg" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed text-foreground mb-10">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text">
                    "{language === 'en' ? current.text_en : current.text_da}"
                  </span>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-5">
                  <motion.div className="relative" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50" />
                    <img
                      src={current.image_url || ''}
                      alt={current.name}
                      className="relative h-16 w-16 rounded-full object-cover ring-4 ring-white/50 dark:ring-white/20"
                    />
                  </motion.div>
                  <div>
                    <div className="text-xl font-bold">{current.name}</div>
                    <div className="text-muted-foreground">{current.role}</div>
                    <div className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {current.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={prevTestimonial}
                  className="rounded-full h-12 w-12 backdrop-blur-xl bg-white/50 dark:bg-white/10 border-white/30 dark:border-white/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={nextTestimonial}
                  className="rounded-full h-12 w-12 backdrop-blur-xl bg-white/50 dark:bg-white/10 border-white/30 dark:border-white/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
              <motion.div className="h-full bg-gradient-to-r from-primary to-accent" initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }} key={activeIndex} />
            </div>

            {/* Mobile progress dots */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {testimonials.map((_, index) => (
                <motion.button key={index}
                  onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
                  className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-gradient-to-r from-primary to-accent' : 'w-2 bg-border/50'}`}
                  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Testimonial Cards Grid */}
        <motion.div className="grid gap-6 md:grid-cols-3 mt-12"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          {testimonials.map((testimonial, index) => (
            <motion.button key={testimonial.id}
              onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
              className={`text-left p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 ${index === activeIndex
                  ? 'bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/40 shadow-xl shadow-primary/10'
                  : 'bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 hover:border-primary/30 hover:shadow-lg'
                }`}
              whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-4">
                <motion.div className="relative" whileHover={{ rotate: 5 }}>
                  {index === activeIndex && (
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md"
                      layoutId="activeGlow" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
                  )}
                  <img src={testimonial.image_url || ''} alt={testimonial.name}
                    className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white/50" />
                </motion.div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              {index === activeIndex && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-b-2xl" layoutId="activeBar" />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
