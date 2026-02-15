import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import HeroContent from './HeroContent';

const HeroPatternVariant = () => {
  // Earth tone color palette
  const colors = {
    juteBrown: '#8B7355',
    deepGreen: '#4A5D23',
    cream: '#F5F1EB',
    gold: '#C9A961',
  };

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.cream }}>
      {/* SVG Pattern Background */}
      <div className="absolute inset-0 z-0">
        {/* Organic wave shapes at bottom */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-48 md:h-64"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <motion.path 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={colors.deepGreen}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path 
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={colors.juteBrown}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          />
        </svg>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Diamond shapes */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`diamond-${i}`}
              className="absolute"
              style={{
                left: `${5 + i * 25}%`,
                top: `${10 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                rotate: [0, 45, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path 
                  d="M20 0 L40 20 L20 40 L0 20 Z" 
                  fill="none" 
                  stroke={i % 2 === 0 ? colors.deepGreen : colors.juteBrown}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </svg>
            </motion.div>
          ))}

          {/* Hexagon shapes */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`hex-${i}`}
              className="absolute"
              style={{
                right: `${10 + i * 20}%`,
                top: `${20 + i * 25}%`,
              }}
              animate={{
                y: [10, -10, 10],
                rotate: [0, 60, 0],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon 
                  points="30,2 55,17 55,47 30,62 5,47 5,17" 
                  fill="none" 
                  stroke={colors.gold}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(0,-2)"
                />
              </svg>
            </motion.div>
          ))}

          {/* Floating leaf icons */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute"
              style={{
                left: `${8 + i * 22}%`,
                top: `${25 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-15, 15, -15],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            >
              <Leaf 
                size={20 + i * 4} 
                className="text-primary/30"
                strokeWidth={1}
              />
            </motion.div>
          ))}

          {/* Circle accents */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 8 + i * 4,
                height: 8 + i * 4,
                left: `${12 + i * 15}%`,
                bottom: `${15 + (i % 3) * 10}%`,
                backgroundColor: i % 3 === 0 ? colors.gold : i % 3 === 1 ? colors.deepGreen : colors.juteBrown,
                opacity: 0.15,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Jute fiber texture pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%238B7355' stroke-width='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top decorative border */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: colors.deepGreen }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
        {/* Decorative top element */}
        <motion.div
          className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="w-12 h-px"
            style={{ backgroundColor: colors.juteBrown }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <Leaf size={20} style={{ color: colors.deepGreen }} strokeWidth={1.5} />
          <motion.div 
            className="w-12 h-px"
            style={{ backgroundColor: colors.juteBrown }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <HeroContent 
          textColor="dark" 
          alignment="center"
          showStats={true}
          showScrollIndicator={false}
          showBadge={true}
          showDecorativeLines={true}
          className="relative"
        />

        {/* Decorative corner elements */}
        <motion.div 
          className="absolute top-20 left-8 md:left-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path 
              d="M0 60 L0 0 L60 0" 
              fill="none" 
              stroke={colors.juteBrown}
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </motion.div>
        <motion.div 
          className="absolute top-20 right-8 md:right-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path 
              d="M60 60 L60 0 L0 0" 
              fill="none" 
              stroke={colors.juteBrown}
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-8 md:left-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path 
              d="M0 0 L0 60 L60 60" 
              fill="none" 
              stroke={colors.juteBrown}
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-8 md:right-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path 
              d="M60 0 L60 60 L0 60" 
              fill="none" 
              stroke={colors.juteBrown}
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator - positioned at bottom center of section */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div 
          className="flex flex-col items-center cursor-pointer group"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div 
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5 group-hover:border-opacity-70 transition-colors"
            style={{ borderColor: colors.juteBrown }}
          >
            <motion.div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.juteBrown }}
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroPatternVariant;
