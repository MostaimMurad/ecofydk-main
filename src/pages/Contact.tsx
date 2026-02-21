import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, Sparkles, Leaf, MessageCircle, Building2, User, FileText, Package } from 'lucide-react';
import OfficeLocations from '@/components/contact/OfficeLocations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAllProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Floating Leaf component for background animation
const FloatingLeaf = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x }}
    animate={{
      opacity: [0, 0.5, 0],
      y: [0, 350],
      x: [x, x + 40, x - 25, x + 15],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 14,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: `${x}%`, top: 0 }}
  >
    <Leaf className="w-5 h-5 text-primary/20" />
  </motion.div>
);

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  product_id: z.string().optional(),
  quantity: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const { data: products } = useAllProducts();
  const { data: settings } = useSiteSettings();
  const { data: contactBlocks = [] } = useContentBlocks('contact');

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      product_id: '',
      quantity: '',
      message: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const { error } = await supabase.from('quotation_requests').insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        product_id: data.product_id || null,
        quantity: data.quantity || null,
        message: data.message,
        status: 'pending',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      toast({
        title: language === 'en' ? 'Request Sent!' : 'Anmodning Sendt!',
        description: t('contact.form.success'),
      });
    },
    onError: () => {
      toast({
        title: language === 'en' ? 'Error' : 'Fejl',
        description: t('contact.form.error'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    submitMutation.mutate(data);
  };

  const contactAddress = settings?.contact_address || 'Copenhagen, Denmark';
  const contactEmail = settings?.contact_email || 'info@ecofy.dk';
  const contactPhone = settings?.contact_phone || '+45 12 34 56 78';

  const businessHoursBlock = contactBlocks.find(b => b.block_key === (language === 'da' ? 'business_hours_da' : 'business_hours_en'));
  const businessHours = businessHoursBlock?.value || t('contact.info.hours.value');

  const whatsappBlock = contactBlocks.find(b => b.block_key === 'whatsapp_number');
  const whatsappNumber = whatsappBlock?.value || '+4520123456';

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.info.address'),
      value: contactAddress,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: contactPhone,
      href: `tel:${contactPhone.replace(/\s/g, '')}`,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Clock,
      label: t('contact.info.hours'),
      value: businessHours,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const whatsappMessage = encodeURIComponent(
    language === 'da'
      ? 'Hej! Jeg vil gerne have mere information om jeres produkter.'
      : 'Hi! I would like more information about your products.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Premium Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/20 dark:to-background py-16 sm:py-24">
        {/* Floating leaves animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[12, 28, 45, 62, 78, 92].map((x, i) => (
            <FloatingLeaf key={i} x={x} delay={i * 2.2} />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="container relative z-10">

          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              {language === 'da' ? 'Vi Svarer Inden for 24 Timer' : 'We Respond Within 24 Hours'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground"
            >
              {t('contact.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {t('contact.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 sm:p-8 border border-border/50 shadow-xl">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 mb-6 shadow-lg shadow-emerald-500/30"
                    >
                      <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-serif text-3xl font-bold text-foreground mb-3"
                    >
                      {language === 'en' ? 'Thank You!' : 'Tak!'}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-muted-foreground mb-8 text-lg"
                    >
                      {t('contact.form.success')}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button onClick={() => setSubmitted(false)} variant="outline" size="lg" className="rounded-full">
                        {language === 'en' ? 'Send Another Request' : 'Send Endnu En Anmodning'}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Form Header */}
                    <div className="mb-8">
                      <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        {language === 'da' ? 'Anmod om Tilbud' : 'Request a Quote'}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        {language === 'da'
                          ? 'Udfyld formularen nedenfor, så vender vi tilbage hurtigst muligt.'
                          : 'Fill out the form below and we\'ll get back to you as soon as possible.'}
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {t('contact.form.name')} *
                        </Label>
                        <Input
                          id="name"
                          {...form.register('name')}
                          placeholder={language === 'en' ? 'John Doe' : 'Jens Jensen'}
                          className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {t('contact.form.email')} *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                          placeholder="email@company.com"
                          className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {t('contact.form.company')}
                        </Label>
                        <Input
                          id="company"
                          {...form.register('company')}
                          placeholder={language === 'en' ? 'Your Company' : 'Din Virksomhed'}
                          className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {t('contact.form.phone')}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register('phone')}
                          placeholder="+45 12 34 56 78"
                          className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {t('contact.form.product')}
                        </Label>
                        <Select
                          value={form.watch('product_id') || ''}
                          onValueChange={(value) => form.setValue('product_id', value)}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50">
                            <SelectValue placeholder={t('contact.form.product.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {products?.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {language === 'en' ? product.name_en : product.name_da}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">{t('contact.form.quantity')}</Label>
                        <Input
                          id="quantity"
                          {...form.register('quantity')}
                          placeholder={language === 'en' ? 'e.g., 500 units' : 'f.eks. 500 stk'}
                          className="h-12 rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {t('contact.form.message')} *
                      </Label>
                      <Textarea
                        id="message"
                        {...form.register('message')}
                        rows={5}
                        placeholder={
                          language === 'en'
                            ? 'Tell us about your requirements, custom branding needs, or any questions...'
                            : 'Fortæl os om dine krav, brugerdefinerede branding-behov eller eventuelle spørgsmål...'
                        }
                        className="rounded-xl border-border/50 bg-white/50 dark:bg-background/50 focus:border-primary focus:ring-primary/20 transition-all resize-none"
                      />
                      {form.formState.errors.message && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 group"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {language === 'en' ? 'Sending...' : 'Sender...'}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            {t('contact.form.submit')}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Info Cards */}
              <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  {t('contact.info.title')}
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${info.color} shadow-lg`}>
                        <info.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

                <div className="relative z-10 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {language === 'da' ? 'Chat med Os' : 'Chat with Us'}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {language === 'da' ? 'Hurtigste svar' : 'Fastest response'}
                      </p>
                    </div>
                  </div>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="w-full bg-white text-green-600 hover:bg-white/90 shadow-lg"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        WhatsApp
                        <span className="ml-2 px-2 py-0.5 bg-green-100 rounded-full text-xs font-medium text-green-700">
                          Online
                        </span>
                      </Button>
                    </motion.div>
                  </a>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl"
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {language === 'da' ? 'Hvorfor Vælge Os' : 'Why Choose Us'}
                </h3>
                <ul className="space-y-3">
                  {[
                    language === 'da' ? '✓ Gratis prøver tilgængelige' : '✓ Free samples available',
                    language === 'da' ? '✓ Konkurrencedygtige bulkpriser' : '✓ Competitive bulk pricing',
                    language === 'da' ? '✓ Tilpasset branding muligheder' : '✓ Custom branding options',
                    language === 'da' ? '✓ Global levering' : '✓ Global shipping',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="text-sm text-muted-foreground"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      {(settings as any)?.map_embed_url && (
        <section className="py-12 sm:py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-3xl font-bold text-foreground">
                {language === 'da' ? 'Find Os' : 'Find Us'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === 'da' ? 'Besøg os på vores kontor' : 'Visit us at our office'}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl overflow-hidden border border-border/50 shadow-xl"
            >
              <iframe
                src={(settings as any).map_embed_url}
                className="w-full h-[400px] md:h-[500px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Office Locations with Maps */}
      <OfficeLocations />
    </div>
  );
};

export default Contact;
