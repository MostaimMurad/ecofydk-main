import { HeroSection, HeroVariant } from '@/components/home/hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustedPartners from '@/components/home/TrustedPartners';
import AboutSection from '@/components/home/AboutSection';
import ImpactCounter from '@/components/home/ImpactCounter';
import HowItWorks from '@/components/home/HowItWorks';
import SustainabilityHighlights from '@/components/home/SustainabilityHighlights';
import FounderVideo from '@/components/home/FounderVideo';
import RecentPosts from '@/components/home/RecentPosts';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Newsletter from '@/components/home/Newsletter';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePageSectionVisibility } from '@/hooks/useSectionVisibility';

const Index = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const heroVariant = (settings?.hero_variant || 'pattern') as HeroVariant;
  const { isVisible } = usePageSectionVisibility('homepage');

  return (
    <>
      {isLoading ? (
        <div className="relative min-h-screen bg-gradient-to-br from-background to-muted" />
      ) : (
        isVisible('hero') && <HeroSection variant={heroVariant} />
      )}
      {isVisible('trusted_partners') && <TrustedPartners />}
      {isVisible('featured_products') && <FeaturedProducts />}
      {isVisible('impact_counter') && <ImpactCounter />}
      {isVisible('about') && <AboutSection />}
      {isVisible('how_it_works') && <HowItWorks />}
      {isVisible('sustainability_highlights') && <SustainabilityHighlights />}
      {isVisible('recent_posts') && <RecentPosts />}
      {isVisible('testimonials') && <Testimonials />}
      {isVisible('founder_video') && <FounderVideo />}
      {isVisible('faq') && <FAQ />}
      {isVisible('newsletter') && <Newsletter />}
    </>
  );
};

export default Index;
