import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HeroVariantSwitcher from '@/components/admin/HeroVariantSwitcher';

const AppearanceSettings = () => {
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Choose the visual style for your homepage hero section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeroVariantSwitcher />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AppearanceSettings;
