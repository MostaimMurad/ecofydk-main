import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Send, Loader2, CheckCircle, Leaf, ArrowUpRight, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import ecofyLogo from '@/assets/ecofy-logo.png';

const Footer = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscribeMutation = useNewsletterSubscribe();
  const { data: certifications = [] } = useContentBlocks('footer_certifications');

  const siteTitle = language === 'da' ? settings?.site_title_da : settings?.site_title_en;
  const footerText = language === 'da' ? settings?.footer_text_da : settings?.footer_text_en;

  const socialLinks = [
    settings?.social_facebook && { icon: Facebook, href: settings.social_facebook, label: 'Facebook' },
    settings?.social_instagram && { icon: Instagram, href: settings.social_instagram, label: 'Instagram' },
    settings?.social_twitter && { icon: Twitter, href: settings.social_twitter, label: 'Twitter' },
    settings?.social_linkedin && { icon: Linkedin, href: settings.social_linkedin, label: 'LinkedIn' },
  ].filter(Boolean) as { icon: typeof Facebook; href: string; label: string }[];

  const quickLinks = [
    { href: '/products', label: t('nav.products') },
    { href: '/why-jute', label: language === 'da' ? 'Hvorfor Jute?' : 'Why Jute?' },
    { href: '/our-story', label: t('nav.our-story') },
    { href: '/sustainability', label: t('nav.sustainability') },
    { href: '/impact', label: language === 'da' ? 'Vores Påvirkning' : 'Our Impact' },
    { href: '/custom-solutions', label: language === 'da' ? 'Tilpassede Løsninger' : 'Custom Solutions' },
    { href: '/certifications', label: language === 'da' ? 'Certificeringer' : 'Certifications' },
    { href: '/case-studies', label: language === 'da' ? 'Kundehistorier' : 'Case Studies' },
    { href: '/pricing', label: language === 'da' ? 'Priser' : 'Pricing' },
    { href: '/resources', label: language === 'da' ? 'Ressourcer' : 'Resources' },
    { href: '/careers', label: language === 'da' ? 'Karriere' : 'Careers' },
    { href: '/journal', label: t('nav.journal') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: language === 'en' ? 'Invalid Email' : 'Ugyldig Email',
        description: language === 'en' ? 'Please enter a valid email address.' : 'Indtast venligst en gyldig email adresse.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await subscribeMutation.mutateAsync(email);
      setIsSubscribed(true);
      setEmail('');
      toast({
        title: language === 'en' ? 'Subscribed!' : 'Tilmeldt!',
        description: t('footer.newsletter.success'),
      });
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch {
      toast({
        title: language === 'en' ? 'Error' : 'Fejl',
        description: language === 'en' ? 'Failed to subscribe.' : 'Tilmelding mislykkedes.',
        variant: 'destructive',
      });
    }
  };

  return (
    <footer className="relative overflow-hidden text-primary-foreground" style={{ background: 'linear-gradient(180deg, #0f2e1e 0%, #1a3c2a 50%, #0c2818 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
      </div>

      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: `${15 + i * 20}%`, top: `${20 + i * 10}%` }}
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}>
          <Leaf className="h-6 w-6 text-white/10" />
        </motion.div>
      ))}

      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-6">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <img src={settings?.logo_url || ecofyLogo} alt={`${siteTitle || 'Ecofy'} logo`}
                  className="h-12 w-12 rounded-xl shadow-lg ring-2 ring-white/20 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = ecofyLogo; }} />
              </motion.div>
              <div className="flex items-center gap-1">
                <span className="font-serif text-3xl font-bold">{siteTitle || 'Ecofy'}</span>
                <Leaf className="h-4 w-4 text-white/60 -mt-3" />
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {footerText || 'Crafting Sustainable Stories — Premium eco-friendly jute products from Bangladesh to Europe.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ scale: 1.15, y: -3 }}
                    className="rounded-full bg-white/10 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 border border-white/10 hover:border-white/20"
                    aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6 md:col-span-2">
            <h4 className="font-serif text-xl font-semibold flex items-center gap-2">
              {t('footer.quickLinks')}
              <span className="h-px flex-1 bg-white/20 ml-2" />
            </h4>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              {quickLinks.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}>
                  <Link to={link.href} className="group flex items-center gap-2 py-1.5 text-sm text-primary-foreground/70 transition-all duration-300 hover:text-primary-foreground hover:pl-2">
                    <span className="h-1 w-1 rounded-full bg-white/40 group-hover:bg-white/80 group-hover:w-2 transition-all duration-300" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
            <h4 className="font-serif text-xl font-semibold flex items-center gap-2">
              {t('nav.contact')}
              <span className="h-px flex-1 bg-white/20 ml-2" />
            </h4>
            <div className="flex flex-col gap-4">
              {settings?.contact_address && (
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3 group">
                  <div className="rounded-lg bg-white/10 p-2.5 group-hover:bg-white/20 transition-colors"><MapPin className="h-4 w-4" /></div>
                  <span className="text-sm text-primary-foreground/70 pt-2">{settings.contact_address}</span>
                </motion.div>
              )}
              {settings?.contact_email && (
                <motion.a href={`mailto:${settings.contact_email}`} whileHover={{ x: 5 }} className="flex items-center gap-3 group">
                  <div className="rounded-lg bg-white/10 p-2.5 group-hover:bg-white/20 transition-colors"><Mail className="h-4 w-4" /></div>
                  <span className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{settings.contact_email}</span>
                </motion.a>
              )}
              {settings?.contact_phone && (
                <motion.a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} whileHover={{ x: 5 }} className="flex items-center gap-3 group">
                  <div className="rounded-lg bg-white/10 p-2.5 group-hover:bg-white/20 transition-colors"><Phone className="h-4 w-4" /></div>
                  <span className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{settings.contact_phone}</span>
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
            <h4 className="font-serif text-xl font-semibold flex items-center gap-2">
              {t('footer.newsletter.title')}
              <span className="h-px flex-1 bg-white/20 ml-2" />
            </h4>
            <p className="text-sm text-primary-foreground/70">{t('footer.newsletter.description')}</p>
            {isSubscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-emerald-300">{t('footer.newsletter.success')}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Input type="email" placeholder={t('newsletter.placeholder')} value={email} onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-xl h-12 pl-4 pr-4 focus:border-white/40 focus:ring-white/20 transition-all" maxLength={255} />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" size="icon" variant="secondary" disabled={subscribeMutation.isPending}
                    className="h-12 w-12 rounded-xl flex-shrink-0 bg-white/20 hover:bg-white/30 border-0 shadow-lg">
                    {subscribeMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </motion.div>
              </form>
            )}

            {/* Certifications from CMS */}
            {certifications.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-primary-foreground/50 mb-3">{t('footer.certifications')}</p>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <motion.span key={cert.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ scale: 1.05 }}
                      className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm border border-white/10 ${cert.color || 'bg-white/20 text-white'}`}>
                      {language === 'en' ? cert.title_en : cert.title_da}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="flex items-center gap-2 text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} {siteTitle || 'Ecofy'}. {t('footer.rights')}.
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-400 fill-red-400 animate-pulse" /> for the planet
            </span>
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground">{t('footer.privacy')}</Link>
            <Link to="/terms" className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground">{t('footer.terms')}</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
