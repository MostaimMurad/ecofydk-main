import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Globe, ShieldCheck, Award, Home, MapPin, Layers, ShoppingBag, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContentBlocks, useContentBlock } from '@/hooks/useContentBlocks';
import heroJuteBag from '@/assets/hero-jute-bag.png';
import heroJuteBasket from '@/assets/hero-jute-basket.png';
import heroJuteCoasters from '@/assets/hero-jute-coasters.png';
import heroJuteField from '@/assets/hero-jute-field.png';

// Icon mapper — maps string icon names from CMS to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Globe, ShieldCheck, Award, Home, MapPin, Layers, ShoppingBag, Sparkles,
};

// Fallback static images for collage (used when CMS image_url is a local asset path)
const fallbackImages: Record<string, string> = {
  '/assets/hero-jute-bag.png': heroJuteBag,
  '/assets/hero-jute-basket.png': heroJuteBasket,
  '/assets/hero-jute-field.png': heroJuteField,
  '/assets/hero-jute-coasters.png': heroJuteCoasters,
};

const HeroPatternVariant = () => {
  const { t, language } = useLanguage();
  const { data: heroStats = [] } = useContentBlocks('hero_stats');
  const { data: badgeBlock } = useContentBlock('hero', 'badge');
  const { data: sinceBlock } = useContentBlock('hero', 'since');
  const { data: taglineBlock } = useContentBlock('hero', 'tagline');
  const { data: subtitleBlock } = useContentBlock('hero', 'subtitle');
  const { data: ctaPrimaryBlock } = useContentBlock('hero', 'cta_primary');
  const { data: ctaSecondaryBlock } = useContentBlock('hero', 'cta_secondary');

  // ─── Dynamic CMS data ───
  const { data: collageBlocks = [] } = useContentBlocks('hero_collage');
  const { data: trustBadgeBlocks = [] } = useContentBlocks('hero_trust_badges');
  const { data: floatingBlocks = [] } = useContentBlocks('hero_floating');

  const badgeText = badgeBlock
    ? (language === 'en' ? badgeBlock.title_en : badgeBlock.title_da) || 'Premium Sustainable Jute'
    : language === 'en' ? 'Premium Sustainable Jute' : 'Premium Bæredygtig Jute';

  const sinceText = sinceBlock
    ? (language === 'en' ? sinceBlock.title_en : sinceBlock.title_da) || 'Since 2022'
    : 'Since 2022';

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

  const displayStats = stats.length > 0 ? stats : [
    { value: '50+', label: language === 'en' ? 'Products' : 'Produkter' },
    { value: '100%', label: language === 'en' ? 'Sustainable' : 'Bæredygtig' },
    { value: '500+', label: language === 'en' ? 'Happy Clients' : 'Glade Kunder' },
  ];

  // ─── Build collage images from CMS with fallback ───
  const defaultCollageImages = [
    { src: heroJuteBag, alt: 'Premium Jute Tote Bag', label: language === 'en' ? 'Jute Bags' : 'Jute Tasker' },
    { src: heroJuteBasket, alt: 'Woven Jute Basket', label: language === 'en' ? 'Home Décor' : 'Boligindretning' },
    { src: heroJuteField, alt: 'Bangladesh Jute Field', label: language === 'en' ? 'From Bangladesh' : 'Fra Bangladesh' },
    { src: heroJuteCoasters, alt: 'Handmade Jute Coasters', label: language === 'en' ? 'Accessories' : 'Tilbehør' },
  ];

  const collageImages = collageBlocks.length > 0
    ? collageBlocks.map((block) => {
        const imgUrl = block.image_url || '';
        // If the URL is a local fallback path, use the bundled asset; otherwise use the CMS URL directly
        const src = fallbackImages[imgUrl] || imgUrl;
        return {
          src,
          alt: (language === 'en' ? block.description_en : block.description_da) || block.title_en || '',
          label: (language === 'en' ? block.title_en : block.title_da) || '',
        };
      })
    : defaultCollageImages;

  // ─── Build trust badges from CMS with fallback ───
  const defaultTrustBadges = [
    { icon: Globe, text: language === 'en' ? 'Exporting to Europe' : 'Eksport til Europa' },
    { icon: ShieldCheck, text: language === 'en' ? 'Certified Eco-Friendly' : 'Certificeret Miljøvenlig' },
    { icon: Award, text: language === 'en' ? 'Premium Quality' : 'Premium Kvalitet' },
  ];

  const trustBadges = trustBadgeBlocks.length > 0
    ? trustBadgeBlocks.map((block) => ({
        icon: iconMap[block.icon || ''] || Sparkles,
        text: (language === 'en' ? block.title_en : block.title_da) || '',
      }))
    : defaultTrustBadges;

  // ─── Build floating cards from CMS with fallback ───
  const partnersCard = floatingBlocks.find(b => b.block_key === 'partners_card');
  const certifiedCard = floatingBlocks.find(b => b.block_key === 'certified_card');

  const partnersValue = partnersCard?.value || '200+';
  const partnersLabel = partnersCard 
    ? (language === 'en' ? partnersCard.title_en : partnersCard.title_da) || 'European Partners' 
    : language === 'en' ? 'European Partners' : 'Europæiske Partnere';
  const PartnersIcon = iconMap[partnersCard?.icon || 'Globe'] || Globe;

  const certifiedLabel = certifiedCard 
    ? (language === 'en' ? certifiedCard.title_en : certifiedCard.title_da) || 'Eco Certified'
    : language === 'en' ? 'Eco Certified' : 'Øko Certificeret';
  const CertifiedIcon = iconMap[certifiedCard?.icon || 'Award'] || Award;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F8F6F1] via-[#F5F1EB] to-[#EDE8DF]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%238B7355' stroke-width='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Top accent line */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Main Content — Split Layout */}
      <div className="container relative z-10 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-24 lg:py-20 w-full">
          
          {/* ─── Left: Text Content ─── */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary tracking-wide">{badgeText}</span>
              </span>
            </motion.div>

            {/* Since label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex items-center gap-3"
            >
              <div className="h-px w-10 bg-gradient-to-r from-primary/60 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">{sinceText}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-foreground"
            >
              {heroTagline}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              {heroSubtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="group gap-3 font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all px-8 py-7 text-base">
                <Link to="/products">
                  <span>{ctaPrimaryText}</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group gap-3 font-semibold bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all px-8 py-7 text-base">
                <Link to="/our-story">
                  <Play className="h-4 w-4" />
                  {ctaSecondaryText}
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges — Dynamic from CMS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-10 flex flex-wrap gap-6"
            >
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground/80">
                  <badge.icon className="h-4 w-4 text-primary/70" />
                  <span className="text-xs font-medium tracking-wide">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── Right: Image Collage Grid — Dynamic from CMS ─── */}
          <motion.div 
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {collageImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative group overflow-hidden rounded-2xl shadow-lg border border-primary/10"
                  initial={{ opacity: 0, y: 20 + i * 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className={`overflow-hidden ${i === 2 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Hover overlay with label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4">
                      <span className="text-white text-sm font-semibold">{img.label}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating stat card — Dynamic from CMS */}
            <motion.div
              className="absolute -bottom-3 -left-3 lg:-left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-primary/10 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PartnersIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{partnersValue}</div>
                  <div className="text-xs text-muted-foreground">{partnersLabel}</div>
                </div>
              </div>
            </motion.div>

            {/* Floating quality badge — Dynamic from CMS */}
            <motion.div
              className="absolute -top-3 -right-3 lg:-right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-primary/10 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <CertifiedIcon className="h-5 w-5 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">{certifiedLabel}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar — Bottom */}
      <motion.div
        className="relative z-10 border-t border-primary/10 bg-white/40 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="container py-8">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>


    </section>
  );
};

export default HeroPatternVariant;
