import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Video, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeroVariantSwitcher from '@/components/admin/HeroVariantSwitcher';
import MediaPicker from '@/components/admin/MediaPicker';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';

const AppearanceSettings = () => {
  const { data: settings } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.hero_video_url) {
      setHeroVideoUrl(settings.hero_video_url);
    }
  }, [settings]);

  const handleSaveVideo = async () => {
    setSaving(true);
    await updateSettings.mutateAsync({ hero_video_url: heroVideoUrl || null });
    setSaving(false);
  };

  const handleClearVideo = async () => {
    setHeroVideoUrl('');
    setSaving(true);
    await updateSettings.mutateAsync({ hero_video_url: null });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Appearance</h1>
            <p className="text-muted-foreground">Customize the visual appearance of your website</p>
          </div>
        </div>
      </motion.div>

      {/* Hero Style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Style</CardTitle>
            <CardDescription>
              Choose the visual style for your homepage hero section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeroVariantSwitcher />
          </CardContent>
        </Card>
      </motion.div>

      {/* Hero Video */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Hero Background Video</CardTitle>
            </div>
            <CardDescription>
              Upload or link an MP4 video to use as the full-screen hero background.
              Leave empty to use the default bundled video.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL (MP4)</Label>
              <div className="flex gap-2">
                <Input
                  value={heroVideoUrl}
                  onChange={e => setHeroVideoUrl(e.target.value)}
                  placeholder="https://... or pick from Media Library"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMediaPickerOpen(true)}
                  className="gap-2 shrink-0"
                >
                  <Upload className="h-4 w-4" />
                  Browse
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: MP4, max 20MB, landscape 16:9, ideally 1920×1080 or higher.
              </p>
            </div>

            {/* Video Preview */}
            {heroVideoUrl && (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-muted border">
                <video
                  key={heroVideoUrl}
                  src={heroVideoUrl}
                  muted
                  className="w-full h-full object-cover"
                  controls
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 bg-black/50 hover:bg-black/70 text-white"
                  onClick={handleClearVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {!heroVideoUrl && (
              <div className="rounded-xl border border-dashed bg-muted/30 aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Video className="h-8 w-8 opacity-40" />
                <p className="text-sm">Using default bundled video</p>
                <p className="text-xs">Upload a video or paste a URL above to override</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveVideo} disabled={saving || updateSettings.isPending} className="gap-2">
                {saving ? 'Saving...' : 'Save Video'}
              </Button>
              {heroVideoUrl && (
                <Button variant="outline" onClick={handleClearVideo} disabled={saving} className="gap-2 text-destructive hover:text-destructive">
                  <X className="h-4 w-4" /> Use Default
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Media Picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => {
          setHeroVideoUrl(url);
          setMediaPickerOpen(false);
        }}
        accept="video"
      />
    </div>
  );
};

export default AppearanceSettings;
