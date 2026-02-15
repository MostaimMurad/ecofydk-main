import { motion } from 'framer-motion';
import HeroContent from './HeroContent';

const HeroGradientVariant = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-800/80 to-cyan-900/90 dark:from-emerald-950 dark:via-teal-900 dark:to-cyan-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/20 blur-3xl"
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-500/30 to-blue-500/20 blur-3xl"
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 80, -20, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-400/10 to-yellow-500/15 blur-3xl"
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -60, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className="absolute rounded-full border border-white/10 backdrop-blur-sm"
              style={{
                width: 80 + i * 40,
                height: 80 + i * 40,
                left: `${10 + i * 20}%`,
                top: `${15 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}
          
          {/* Floating squares */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`square-${i}`}
              className="absolute backdrop-blur-md bg-white/5 border border-white/10"
              style={{
                width: 60 + i * 20,
                height: 60 + i * 20,
                right: `${5 + i * 15}%`,
                bottom: `${20 + i * 15}%`,
                borderRadius: 8,
              }}
              animate={{
                y: [20, -20, 20],
                rotate: [0, 90, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
            />
          ))}
        </div>

        {/* Noise/Grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Glowing accent lines */}
        <motion.div
          className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* Glassmorphic content container */}
      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
        <motion.div
          className="relative rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          
          <HeroContent 
            textColor="light" 
            alignment="center"
            showStats={true}
            showScrollIndicator={false}
            compact={true}
          />
        </motion.div>
        
        {/* External scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-3 cursor-pointer group"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white/80 transition-colors">
              Scroll
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 group-hover:border-white/50 transition-colors">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-white/70"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroGradientVariant;
