import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-our-story.jpg';
import HeroContent from './HeroContent';

const HeroImageVariant = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Image Side - 60% on desktop */}
        <motion.div 
          className="relative w-full lg:w-[55%] h-[50vh] lg:h-screen overflow-hidden"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Image with parallax */}
          <motion.div 
            className="absolute inset-0"
            style={{ y: imageY, scale: imageScale }}
          >
            <img 
              src={heroImage} 
              alt="Jute artisan crafting" 
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
          
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 lg:hidden" />
          
          {/* Decorative frame */}
          <motion.div 
            className="absolute inset-8 border-2 border-white/20 rounded-lg pointer-events-none hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          
          {/* Vertical text accent */}
          <motion.div 
            className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span 
              className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {language === 'en' ? 'Handcrafted with Love' : 'Håndlavet med Kærlighed'}
            </span>
          </motion.div>
          
          {/* Bottom corner accent */}
          <motion.div 
            className="absolute bottom-8 right-8 flex flex-col items-end hidden lg:flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <span className="text-6xl font-bold text-white/20">2020</span>
            <span className="text-xs uppercase tracking-wider text-white/50 mt-1">Est.</span>
          </motion.div>
        </motion.div>

        {/* Content Side - 40% on desktop */}
        <motion.div 
          className="relative w-full lg:w-[45%] flex items-center bg-background dark:bg-background"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground" />
            </svg>
          </div>
          
          {/* Decorative accent line */}
          <motion.div 
            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-primary to-transparent hidden lg:block"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          
          <div className="container relative py-12 lg:py-20 px-8 lg:px-12 xl:px-20">
            <HeroContent 
              textColor="dark" 
              alignment="left"
              showStats={true}
              showScrollIndicator={false}
              showDecorativeLines={false}
              compact={true}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - positioned at bottom center */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-3 cursor-pointer group"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1.5 group-hover:border-foreground/50 transition-colors">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-foreground/70"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroImageVariant;
