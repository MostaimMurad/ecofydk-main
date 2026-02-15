import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LogoUpload from '@/components/admin/LogoUpload';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const BrandingSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    logo_url: '',
    footer_text_en: '',
    footer_text_da: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        logo_url: settings.logo_url || '',
        footer_text_en: settings.footer_text_en || '',
        footer_text_da: settings.footer_text_da || '',
      });
    }
  }, [settings]);

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast({ title: 'Saved', description: 'Branding settings updated successfully!' });
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
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Branding</h1>
            <p className="text-muted-foreground">Manage your logo and footer branding</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Upload your site logo. Recommended size: 200x50px
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoUpload
                currentLogoUrl={formData.logo_url || null}
                onUploadComplete={handleLogoUpload}
                onRemove={handleLogoRemove}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Footer Text</CardTitle>
              <CardDescription>
                Set the text that appears in your website footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer_text_en">English</Label>
                <Textarea
                  id="footer_text_en"
                  value={formData.footer_text_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, footer_text_en: e.target.value }))}
                  placeholder="e.g., Crafting sustainable stories since 2019"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_text_da">Danish</Label>
                <Textarea
                  id="footer_text_da"
                  value={formData.footer_text_da}
                  onChange={(e) => setFormData(prev => ({ ...prev, footer_text_da: e.target.value }))}
                  placeholder="e.g., Skaber bæredygtige historier siden 2019"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          size="lg"
        >
          {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default BrandingSettings;
