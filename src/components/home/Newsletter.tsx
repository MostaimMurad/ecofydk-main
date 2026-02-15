import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Leaf, Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { useContentBlocks } from '@/hooks/useContentBlocks';

// Floating Leaf component
const FloatingLeaf = ({ delay, duration, left, size = 'h-5 w-5' }: { delay: number; duration: number; left: string; size?: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left }}
    initial={{ y: '100%', opacity: 0, rotate: 0 }}
    animate={{ y: ['-20%', '-120%'], opacity: [0, 0.3, 0.3, 0], rotate: [0, 180] }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
  >
    <Leaf className={`${size} text-white/20`} />
  </motion.div>
);

const Newsletter = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscribeMutation = useNewsletterSubscribe();
  const { data: trustIndicators = [] } = useContentBlocks('newsletter_trust');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await subscribeMutation.mutateAsync(email);
      toast({
        title: language === 'en' ? 'Subscribed!' : 'Tilmeldt!',
        description: language === 'en' 
          ? 'Thank you for subscribing to our newsletter.' 
          : 'Tak fordi du abonnerer på vores nyhedsbrev.',
      });
      setEmail('');
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch {
      toast({
        title: language === 'en' ? 'Error' : 'Fejl',
        description: language === 'en' ? 'Failed to subscribe. Please try again.' : 'Tilmelding mislykkedes. Prøv igen.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 md:py-28">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Floating Leaves */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <FloatingLeaf key={i} delay={i * 1.5} duration={10 + i * 2} left={`${5 + i * 12}%`} size={i % 2 === 0 ? 'h-4 w-4' : 'h-6 w-6'} />
        ))}
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySC0yNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-white/90 shadow-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Stay Connected' : 'Hold Forbindelsen'}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t('newsletter.title')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
            {t('newsletter.subtitle')}
          </motion.p>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10">
            {isSubscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-emerald-400/30 px-8 py-4 shadow-xl">
                <div className="rounded-full bg-emerald-500/20 p-2">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-lg font-medium text-white">
                  {language === 'en' ? 'You\'re subscribed!' : 'Du er tilmeldt!'}
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative mx-auto max-w-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('newsletter.placeholder')}
                      className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-base" required />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" variant="secondary" size="lg"
                      className="h-14 gap-2 px-8 rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg font-semibold w-full sm:w-auto"
                      disabled={subscribeMutation.isPending}>
                      {subscribeMutation.isPending ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <>{t('newsletter.button')}<Send className="h-4 w-4" /></>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            )}

            {/* Trust Indicators - from CMS */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              {trustIndicators.map((indicator) => (
                <div key={indicator.id} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>{language === 'en' ? indicator.title_en : indicator.title_da}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
