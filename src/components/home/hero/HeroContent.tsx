import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useContentBlocks, useContentBlock } from '@/hooks/useContentBlocks';

interface HeroContentProps {
  textColor?: 'light' | 'dark';
  alignment?: 'center' | 'left';
  showStats?: boolean;
  showScrollIndicator?: boolean;
  showBadge?: boolean;
  showDecorativeLines?: boolean;
  className?: string;
  compact?: boolean;
}

const HeroContent = ({
  textColor = 'light',
  alignment = 'center',
  showStats = true,
  showScrollIndicator = true,
  showBadge = true,
  showDecorativeLines = true,
  className,
  compact = false,
}: HeroContentProps) => {
  const { t, language } = useLanguage();
  const { data: heroStats = [] } = useContentBlocks('hero_stats');
  const { data: badgeBlock } = useContentBlock('hero', 'badge');
  const { data: sinceBlock } = useContentBlock('hero', 'since');
  const { data: taglineBlock } = useContentBlock('hero', 'tagline');
  const { data: subtitleBlock } = useContentBlock('hero', 'subtitle');
  const { data: ctaPrimaryBlock } = useContentBlock('hero', 'cta_primary');
  const { data: ctaSecondaryBlock } = useContentBlock('hero', 'cta_secondary');

  const isLight = textColor === 'light';
  const isCenter = alignment === 'center';

  const textClasses = {
    primary: isLight ? 'text-white' : 'text-foreground',
    secondary: isLight ? 'text-white/70' : 'text-muted-foreground',
    tertiary: isLight ? 'text-white/50' : 'text-muted-foreground/70',
    accent: isLight ? 'text-white/80' : 'text-foreground/80',
    badge: isLight ? 'bg-white/10 border-white/20 text-white/90' : 'bg-primary/10 border-primary/20 text-primary',
    decorLine: isLight ? 'via-white/50 to-white/50' : 'via-primary/50 to-primary/50',
    statValue: isLight ? 'text-white' : 'text-foreground',
    statLabel: isLight ? 'text-white/60' : 'text-muted-foreground',
    scrollBorder: isLight ? 'border-white/30 hover:border-white/50' : 'border-foreground/30 hover:border-foreground/50',
    scrollDot: isLight ? 'bg-white/70' : 'bg-foreground/70',
  };

  const sinceText = sinceBlock
    ? (language === 'en' ? sinceBlock.title_en : sinceBlock.title_da) || 'Since 2020'
    : 'Since 2020';

  const badgeText = badgeBlock
    ? (language === 'en' ? badgeBlock.title_en : badgeBlock.title_da) || 'Premium Sustainable Jute'
    : language === 'en' ? 'Premium Sustainable Jute' : 'Premium Bæredygtig Jute';

  const heroTagline = taglineBlock
    ? (language === 'en' ? taglineBlock.title_en : taglineBlock.title_da) || t('hero.tagline')
    : t('hero.tagline');

  const heroSubtitle = subtitleBlock
    ? (language === 'en' ? subtitleBlock.title_en : subtitleBlock.title_da) || t('hero.subtitle')
    : t('hero.subtitle');

  const ctaPrimaryText = ctaPrimaryBlock
    ? (language === 'en' ? ctaPrimaryBlock.title_en : ctaPrimaryBlock.title_da) || t('hero.cta')
    : t('hero.cta');

  const ctaSecondaryText = ctaSecondaryBlock
    ? (language === 'en' ? ctaSecondaryBlock.title_en : ctaSecondaryBlock.title_da) || t('about.cta')
    : t('about.cta');

  const stats = heroStats.map((block) => ({
    value: block.value || '',
    label: (language === 'en' ? block.title_en : block.title_da) || '',
  }));

  // Fallback stats if none from CMS
  const displayStats = stats.length > 0 ? stats : [
    { value: '50+', label: language === 'en' ? 'Products' : 'Produkter' },
    { value: '100%', label: language === 'en' ? 'Sustainable' : 'Bæredygtig' },
    { value: '500+', label: language === 'en' ? 'Happy Clients' : 'Glade Kunder' },
  ];

  return (
    <div className={cn('flex flex-col', isCenter ? 'items-center text-center' : 'items-start text-left', className)}>
      {/* Premium Badge */}
      {showBadge && (
        <motion.div className={cn("mb-8 flex items-center gap-2", compact && "mb-6")}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.div className={cn("flex items-center gap-2 rounded-full backdrop-blur-md px-5 py-2.5 border", textClasses.badge)}
            whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium tracking-wide">{badgeText}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Decorative Lines */}
      {showDecorativeLines && (
        <motion.div className={cn("mb-6 flex items-center gap-4", compact && "mb-4")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <motion.div className={cn("h-px w-16 bg-gradient-to-r from-transparent", textClasses.decorLine)}
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.4 }} />
          <span className={cn("text-xs font-semibold uppercase tracking-[0.3em]", textClasses.accent)}>
            {sinceText}
          </span>
          <motion.div className={cn("h-px w-16 bg-gradient-to-l from-transparent", textClasses.decorLine)}
            initial={{ scaleX: 0, originX: 1 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.4 }} />
        </motion.div>
      )}

      {/* Main Heading */}
      <motion.h1 className={cn("font-bold leading-[1.1] tracking-tight", textClasses.primary,
        compact ? "text-4xl md:text-5xl lg:text-6xl max-w-3xl" : "text-5xl md:text-6xl lg:text-8xl max-w-5xl")}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
        <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          {heroTagline}
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p className={cn("mt-8 leading-relaxed", textClasses.secondary,
        compact ? "text-base md:text-lg max-w-xl" : "text-lg md:text-xl lg:text-2xl max-w-2xl")}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
        {heroSubtitle}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div className={cn("mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6", compact && "mt-8")}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
        <Button asChild size="lg" className={cn(
          "group relative gap-3 font-semibold shadow-2xl shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105 overflow-hidden",
          compact ? "px-8 py-6 text-sm" : "px-10 py-7 text-base")}>
          <Link to="/products">
            <span className="relative z-10">{ctaPrimaryText}</span>
            <motion.span className="relative z-10" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className={compact ? "h-4 w-4" : "h-5 w-5"} />
            </motion.span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-accent/50 to-primary"
              initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6 }} />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className={cn(
          "group gap-3 font-semibold transition-all hover:scale-105",
          isLight ? "bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/15 hover:border-white/40"
            : "bg-background/50 backdrop-blur-md border-primary/20 hover:bg-primary/5 hover:border-primary/40",
          compact ? "px-8 py-6 text-sm" : "px-10 py-7 text-base")}>
          <Link to="/our-story">
            <Play className="h-4 w-4" />
            {ctaSecondaryText}
          </Link>
        </Button>
      </motion.div>

      {/* Stats Section */}
      {showStats && (
        <motion.div className={cn("flex flex-wrap gap-8 md:gap-16", isCenter ? "justify-center" : "justify-start", compact ? "mt-12" : "mt-20")}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}>
          {displayStats.map((stat, index) => (
            <motion.div key={stat.label} className={isCenter ? "text-center" : "text-left"}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}>
              <div className={cn("font-bold", textClasses.statValue, compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl")}>
                {stat.value}
              </div>
              <div className={cn("mt-1 text-sm uppercase tracking-wider", textClasses.statLabel)}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Scroll Indicator */}
      {showScrollIndicator && isCenter && (
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }}>
          <motion.div className="flex flex-col items-center gap-3 cursor-pointer group"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <span className={cn("text-xs uppercase tracking-[0.2em] transition-colors", textClasses.tertiary)}>
              {t('home.hero.scroll')}
            </span>
            <div className={cn("w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5 transition-colors", textClasses.scrollBorder)}>
              <motion.div className={cn("w-1.5 h-1.5 rounded-full", textClasses.scrollDot)}
                animate={{ y: [0, 16, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HeroContent;
