import { HeroSection, HeroVariant } from '@/components/home/hero';
import AboutSection from '@/components/home/AboutSection';
import AboutJuteSection from '@/components/home/AboutJuteSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OurStorySection from '@/components/home/OurStorySection';
import InnovationSection from '@/components/home/InnovationSection';
import CertificationSection from '@/components/home/CertificationSection';
import GallerySection from '@/components/home/GallerySection';
import RecentPosts from '@/components/home/RecentPosts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePageSectionVisibility } from '@/hooks/useSectionVisibility';

const Index = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const heroVariant = (settings?.hero_variant || 'pattern') as HeroVariant;
  const { isVisible } = usePageSectionVisibility('homepage');

  return (
    <>
      {/* 1. Hero */}
      {isLoading ? (
        <div className="relative min-h-screen bg-gradient-to-br from-background to-muted" />
      ) : (
        isVisible('hero') && <HeroSection variant={heroVariant} />
      )}

      {/* 2. About Us — personal details */}
      {isVisible('about') && <AboutSection />}

      {/* 3. About Jute — with How It Works as sub-content */}
      {isVisible('about_jute') && <AboutJuteSection />}

      {/* 4. Product Highlight (renamed from Our Collection) */}
      {isVisible('featured_products') && <FeaturedProducts />}

      {/* 5. Our Story — details about work process */}
      {isVisible('our_story') && <OurStorySection />}

      {/* 6. Innovation */}
      {isVisible('innovation') && <InnovationSection />}

      {/* 7. Certification / Membership */}
      {isVisible('certification') && <CertificationSection />}

      {/* 8. Gallery */}
      {isVisible('gallery') && <GallerySection />}

      {/* 9. Blog */}
      {isVisible('recent_posts') && <RecentPosts />}
    </>
  );
};

export default Index;
