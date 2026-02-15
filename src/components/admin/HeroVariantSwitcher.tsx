import { motion } from 'framer-motion';
import { Monitor, Palette, Image, Layers, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteSettings, useUpdateSiteSettings, HeroVariant } from '@/hooks/useSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const variants: {
  id: HeroVariant;
  name: string;
  description: string;
  icon: typeof Monitor;
  preview: string;
}[] = [
  {
    id: 'video',
    name: 'Video Cinematic',
    description: 'Full-screen video with dark overlays and floating particles',
    icon: Monitor,
    preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  },
  {
    id: 'gradient',
    name: 'Animated Gradient',
    description: 'Dynamic mesh gradient with geometric shapes',
    icon: Palette,
    preview: 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600',
  },
  {
    id: 'image',
    name: 'Split-Screen Image',
    description: 'Editorial 60/40 split layout with parallax image',
    icon: Image,
    preview: 'bg-gradient-to-r from-amber-100 via-stone-200 to-stone-800',
  },
  {
    id: 'pattern',
    name: 'Geometric Pattern',
    description: 'Artistic SVG patterns with earth tones',
    icon: Layers,
    preview: 'bg-gradient-to-br from-amber-700 via-stone-600 to-emerald-800',
  },
];

const HeroVariantSwitcher = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const handleVariantChange = (variant: HeroVariant) => {
    if (variant !== settings?.hero_variant) {
      updateSettings.mutate({ hero_variant: variant });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Hero Section Style
        </CardTitle>
        <CardDescription>
          Choose the visual style for your homepage hero section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {variants.map((variant) => {
            const isActive = settings?.hero_variant === variant.id;
            const Icon = variant.icon;

            return (
              <motion.button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                disabled={updateSettings.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative group rounded-xl border-2 p-4 text-left transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                {/* Preview gradient */}
                <div
                  className={cn(
                    'h-16 rounded-lg mb-3 flex items-center justify-center',
                    variant.preview
                  )}
                >
                  <Icon className="h-8 w-8 text-white/80" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{variant.name}</h3>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground"
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {variant.description}
                  </p>
                </div>

                {/* Loading overlay */}
                {updateSettings.isPending && (
                  <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Last updated info */}
        {settings?.updated_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date(settings.updated_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HeroVariantSwitcher;
