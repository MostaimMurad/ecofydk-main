import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Loader2, Mail, MapPin, Map, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const ContactSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    cvr_number: '',
    map_embed_url: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        cvr_number: (settings as any).cvr_number || '',
        map_embed_url: (settings as any).map_embed_url || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData as any);
      toast({ title: 'Saved', description: 'Contact settings updated successfully!' });
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
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Contact Information</h1>
            <p className="text-muted-foreground">Update your business contact details</p>
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
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>
              These details will be displayed on your website's contact page and footer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="e.g., info@ecofy.dk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="e.g., +45 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Business Address
              </Label>
              <Textarea
                id="contact_address"
                value={formData.contact_address}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_address: e.target.value }))}
                placeholder="e.g., Kolding 6000, Denmark"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvr_number" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                CVR Number
              </Label>
              <Input
                id="cvr_number"
                value={formData.cvr_number}
                onChange={(e) => setFormData(prev => ({ ...prev, cvr_number: e.target.value }))}
                placeholder="e.g., DK-12345678"
              />
              <p className="text-xs text-muted-foreground">
                Danish company registration number (CVR) displayed in footer and legal pages
              </p>
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

      {/* Google Map Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Google Map Location
            </CardTitle>
            <CardDescription>
              Paste a Google Maps embed URL to show your location on the contact page.
              Go to Google Maps → Share → Embed a map → Copy the <code>src</code> URL from the iframe code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="map_embed_url" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Map Embed URL
              </Label>
              <Input
                id="map_embed_url"
                type="url"
                value={formData.map_embed_url}
                onChange={(e) => setFormData(prev => ({ ...prev, map_embed_url: e.target.value }))}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>

            {/* Map Preview */}
            {formData.map_embed_url && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Preview</Label>
                <div className="aspect-video rounded-xl overflow-hidden border border-border/50 shadow-sm">
                  <iframe
                    src={formData.map_embed_url}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map Preview"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="w-full sm:w-auto"
            >
              {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Map Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContactSettings;

