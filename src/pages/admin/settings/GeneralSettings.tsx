import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const GeneralSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    site_title_en: '',
    site_title_da: '',
    site_tagline_en: '',
    site_tagline_da: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_title_en: settings.site_title_en || '',
        site_title_da: settings.site_title_da || '',
        site_tagline_en: settings.site_tagline_en || '',
        site_tagline_da: settings.site_tagline_da || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast({ title: 'Saved', description: 'General settings updated successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">General Settings</h1>
            <p className="text-muted-foreground">Configure your site's basic information</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Site Identity</CardTitle>
            <CardDescription>
              Set your site's name and tagline in both English and Danish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* English */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">English</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_title_en">Site Title</Label>
                  <Input
                    id="site_title_en"
                    value={formData.site_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_title_en: e.target.value }))}
                    placeholder="e.g., Ecofy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline_en">Tagline</Label>
                  <Input
                    id="site_tagline_en"
                    value={formData.site_tagline_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_tagline_en: e.target.value }))}
                    placeholder="e.g., Sustainable Jute Products"
                  />
                </div>
              </div>
            </div>

            {/* Danish */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Danish</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_title_da">Site Title</Label>
                  <Input
                    id="site_title_da"
                    value={formData.site_title_da}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_title_da: e.target.value }))}
                    placeholder="e.g., Ecofy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline_da">Tagline</Label>
                  <Input
                    id="site_tagline_da"
                    value={formData.site_tagline_da}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_tagline_da: e.target.value }))}
                    placeholder="e.g., Bæredygtige juteprodukter"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={updateSettings.isPending}
              className="w-full sm:w-auto"
            >
              {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GeneralSettings;
