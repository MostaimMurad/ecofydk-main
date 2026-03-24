import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTestimonials } from '@/hooks/useTestimonials';

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
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FAFAF8]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #8B7355 1px, transparent 0)`,
        backgroundSize: '48px 48px',
      }} />

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
            className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-5 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t('home.testimonials.badge')}
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl text-foreground">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en'
              ? 'Hear from businesses who have made the sustainable switch with Ecofy'
              : 'Hør fra virksomheder, der har foretaget det bæredygtige skifte med Ecofy'
            }
          </p>
        </motion.div>

        {/* Main testimonial area — two-column layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* ─── Left: Featured testimonial card ─── */}
            <motion.div
              className="lg:col-span-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-full rounded-3xl bg-white border border-border/60 p-8 md:p-12 shadow-sm overflow-hidden">
                {/* Decorative accent — top-left green bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-l-3xl" />

                {/* Quote icon */}
                <div className="absolute top-8 right-8 md:top-10 md:right-10">
                  <Quote className="h-16 w-16 md:h-20 md:w-20 text-primary/8" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10 flex flex-col justify-between h-full"
                  >
                    {/* Stars */}
                    <div>
                      <div className="flex gap-1 mb-8">
                        {Array.from({ length: current.rating }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                          >
                            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Quote Text */}
                      <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed text-foreground/90 mb-10">
                        "{language === 'en' ? current.text_en : current.text_da}"
                      </blockquote>
                    </div>

                    {/* Author + Navigation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={current.image_url || ''}
                            alt={current.name}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/10"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{current.name}</div>
                          <div className="text-sm text-muted-foreground">{current.role}</div>
                          <div className="text-sm font-medium text-primary">{current.company}</div>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="hidden md:flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevTestimonial}
                          className="rounded-full h-10 w-10 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextTestimonial}
                          className="rounded-full h-10 w-10 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/20">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    key={activeIndex}
                  />
                </div>
              </div>
            </motion.div>

            {/* ─── Right: Testimonial selector cards ─── */}
            <motion.div
              className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={testimonial.id}
                  onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
                  className={`relative flex-shrink-0 w-full text-left p-5 rounded-2xl transition-all duration-300 border ${
                    index === activeIndex
                      ? 'bg-white border-primary/30 shadow-md'
                      : 'bg-white/60 border-border/40 hover:bg-white hover:border-border/60 hover:shadow-sm'
                  }`}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Active indicator */}
                  {index === activeIndex && (
                    <motion.div
                      className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image_url || ''}
                      alt={testimonial.name}
                      className={`h-11 w-11 rounded-full object-cover transition-all ${
                        index === activeIndex ? 'ring-2 ring-primary/30' : 'ring-1 ring-border/30'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm truncate ${index === activeIndex ? 'text-foreground' : 'text-foreground/70'}`}>
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{testimonial.company}</div>
                    </div>
                  </div>

                  {/* Mini stars */}
                  <div className="flex gap-0.5 mt-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${
                        index === activeIndex ? 'fill-amber-400 text-amber-400' : 'fill-amber-300/60 text-amber-300/60'
                      }`} />
                    ))}
                  </div>

                  {/* Preview text */}
                  <p className={`mt-2 text-xs leading-relaxed line-clamp-2 ${
                    index === activeIndex ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  }`}>
                    "{(language === 'en' ? testimonial.text_en : testimonial.text_da).substring(0, 80)}..."
                  </p>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Mobile navigation */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-border/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
