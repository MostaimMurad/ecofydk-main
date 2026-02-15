import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Loader2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const SocialSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_twitter: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        social_facebook: settings.social_facebook || '',
        social_instagram: settings.social_instagram || '',
        social_linkedin: settings.social_linkedin || '',
        social_twitter: settings.social_twitter || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast({ title: 'Saved', description: 'Social links updated successfully!' });
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

  const socialFields = [
    { 
      id: 'social_facebook', 
      label: 'Facebook', 
      icon: Facebook, 
      placeholder: 'https://facebook.com/yourpage',
      color: 'text-blue-600'
    },
    { 
      id: 'social_instagram', 
      label: 'Instagram', 
      icon: Instagram, 
      placeholder: 'https://instagram.com/yourhandle',
      color: 'text-pink-500'
    },
    { 
      id: 'social_linkedin', 
      label: 'LinkedIn', 
      icon: Linkedin, 
      placeholder: 'https://linkedin.com/company/yourcompany',
      color: 'text-blue-700'
    },
    { 
      id: 'social_twitter', 
      label: 'Twitter / X', 
      icon: Twitter, 
      placeholder: 'https://twitter.com/yourhandle',
      color: 'text-sky-500'
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Social Links</h1>
            <p className="text-muted-foreground">Connect your social media profiles</p>
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
            <CardTitle>Social Media Profiles</CardTitle>
            <CardDescription>
              Add links to your social media profiles. These will appear in your site's footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {socialFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="flex items-center gap-2">
                    <field.icon className={`h-4 w-4 ${field.color}`} />
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    type="url"
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [field.id]: e.target.value 
                    }))}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
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

export default SocialSettings;
