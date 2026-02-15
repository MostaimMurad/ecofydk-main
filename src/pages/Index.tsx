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

const Index = () => {
  const { data: settings } = useSiteSettings();
  const heroVariant = (settings?.hero_variant || 'video') as HeroVariant;

  return (
    <>
      <HeroSection variant={heroVariant} />
      <TrustedPartners />
      <FeaturedProducts />
      <ImpactCounter />
      <AboutSection />
      <HowItWorks />
      <SustainabilityHighlights />
      <RecentPosts />
      <Testimonials />
      <FounderVideo />
      <FAQ />
      <Newsletter />
    </>
  );
};

export default Index;
