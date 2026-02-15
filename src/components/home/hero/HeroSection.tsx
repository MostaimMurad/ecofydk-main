import HeroVideoVariant from './HeroVideoVariant';
import HeroGradientVariant from './HeroGradientVariant';
import HeroImageVariant from './HeroImageVariant';
import HeroPatternVariant from './HeroPatternVariant';

export type HeroVariant = 'video' | 'gradient' | 'image' | 'pattern';

interface HeroSectionProps {
  variant?: HeroVariant;
}

const HeroSection = ({ variant = 'video' }: HeroSectionProps) => {
  switch (variant) {
    case 'gradient':
      return <HeroGradientVariant />;
    case 'image':
      return <HeroImageVariant />;
    case 'pattern':
      return <HeroPatternVariant />;
    case 'video':
    default:
      return <HeroVideoVariant />;
  }
};

export default HeroSection;
