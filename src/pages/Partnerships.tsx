import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Handshake, Globe, Factory, Award, Building2, Send, Users, Microscope, BadgeCheck, MapPin, ExternalLink, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/* ──────────────── icon map ──────────────── */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Microscope, Globe, Factory, Award, Building2, Users, BadgeCheck, Handshake, MapPin,
};

/* ──────────────── partner card type ──────────────── */
interface PartnerCard {
  name: string;
  type: string;
  country: string;
  area: string;
  description: string;
  website?: string;
  logo_url?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/* ──────────────── fallback data ──────────────── */
const fallbackResearchPartners: PartnerCard[] = [
  { name: 'DTU Environment', type: 'University', country: '🇩🇰 Denmark', area: 'Sustainable Materials', description: 'Joint research on bio-composite jute materials for industrial applications', icon: Microscope, color: 'from-violet-500 to-purple-600' },
  { name: 'BJRI Bangladesh', type: 'Research Institute', country: '🇧🇩 Bangladesh', area: 'Fiber Innovation', description: 'Developing next-generation jute fiber processing technology', icon: Globe, color: 'from-violet-500 to-purple-600' },
  { name: 'Aalborg University', type: 'University', country: '🇩🇰 Denmark', area: 'Circular Economy', description: 'Studying lifecycle analysis and circular design for jute products', icon: Award, color: 'from-violet-500 to-purple-600' },
];

const fallbackManufacturingPartners: PartnerCard[] = [
  { name: 'Sonali Jute Mills', type: 'Primary Manufacturer', country: '🇧🇩 Bangladesh', area: 'Raw Jute Processing', description: 'ISO 9001 certified facility specializing in premium jute yarn and fabric', icon: Factory, color: 'from-amber-500 to-orange-600' },
  { name: 'Nordic Textile Solutions', type: 'Finishing Partner', country: '🇩🇰 Denmark', area: 'Product Finishing', description: 'European-standard finishing, quality control, and packaging', icon: Building2, color: 'from-amber-500 to-orange-600' },
  { name: 'Dhaka Craft Collective', type: 'Artisan Network', country: '🇧🇩 Bangladesh', area: 'Handcrafted Products', description: 'Network of 50+ skilled artisans creating bespoke jute homeware', icon: Users, color: 'from-amber-500 to-orange-600' },
];

const fallbackMemberships: PartnerCard[] = [
  { name: 'Danish Fashion & Textile', type: 'Industry Association', country: '🇩🇰 Denmark', area: 'Textile Industry', description: 'Active member promoting sustainable fashion and textiles', icon: BadgeCheck, color: 'from-emerald-500 to-teal-600' },
  { name: 'SEDEX', type: 'Ethical Trading', country: '🇬🇧 UK', area: 'Supply Chain Ethics', description: 'Ensuring ethical practices across our entire supply chain', icon: Award, color: 'from-emerald-500 to-teal-600' },
  { name: 'Bangladesh Jute Association', type: 'Trade Body', country: '🇧🇩 Bangladesh', area: 'Jute Trade', description: 'Founding member supporting the growth of the jute industry', icon: Globe, color: 'from-emerald-500 to-teal-600' },
  { name: 'Circular Economy Club', type: 'Global Network', country: '🌍 International', area: 'Circular Economy', description: 'Contributing to global circular economy best practices', icon: Handshake, color: 'from-emerald-500 to-teal-600' },
];

/* ──────────────────── floating dot ──────────────────── */
const FloatingDot = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute pointer-events-none w-2 h-2 rounded-full bg-violet-400/20"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: [0, 0.5, 0], y: [0, 350] }}
    transition={{ duration: 14, delay, repeat: Infinity, ease: 'linear' }}
    style={{ left: `${x}%`, top: 0 }}
  />
);

/* ──────────────── partner section component ──────────────── */
const PartnerSection = ({
  badge, badgeIcon: BadgeIcon, title, subtitle, partners, bgClass = '',
}: {
  badge: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  partners: PartnerCard[];
  bgClass?: string;
}) => (
  <section className={`py-16 md:py-24 relative overflow-hidden ${bgClass}`}>
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full text-violet-600 dark:text-violet-400 text-sm font-medium mb-4"
        >
          <BadgeIcon className="h-4 w-4" />
          {badge}
        </motion.div>
        <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-6 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-lg`}
                >
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="w-8 h-8 object-contain rounded" />
                  ) : (
                    <partner.icon className="h-7 w-7 text-white" />
                  )}
                </motion.div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.type}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {partner.country}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
                  {partner.area}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{partner.description}</p>

              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mt-3 font-medium"
                >
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────── main page ──────────────────── */
const Partnerships = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: researchCMS } = useContentBlocks('partners_research');
  const { data: manufacturingCMS } = useContentBlocks('partners_manufacturing');
  const { data: membershipsCMS } = useContentBlocks('partners_memberships');

  const [formData, setFormData] = useState({ company_name: '', contact_person: '', email: '', country: '', partnership_type: 'research', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapCMSToPartners = (cms: typeof researchCMS, defaults: PartnerCard[], defaultColor: string): PartnerCard[] => {
    if (!cms || cms.length === 0) return defaults;
    return cms.map(b => ({
      name: language === 'da' ? (b.title_da || b.title_en || '') : (b.title_en || ''),
      type: (b.metadata as Record<string, string>)?.org_type || '',
      country: (b.metadata as Record<string, string>)?.country || '',
      area: (b.metadata as Record<string, string>)?.area || '',
      description: language === 'da' ? (b.description_da || b.description_en || '') : (b.description_en || ''),
      website: (b.metadata as Record<string, string>)?.website,
      logo_url: b.image_url || undefined,
      icon: iconMap[b.icon || ''] || Globe,
      color: b.color || defaultColor,
    }));
  };

  const researchPartners = mapCMSToPartners(researchCMS, fallbackResearchPartners, 'from-violet-500 to-purple-600');
  const manufacturingPartners = mapCMSToPartners(manufacturingCMS, fallbackManufacturingPartners, 'from-amber-500 to-orange-600');
  const memberships = mapCMSToPartners(membershipsCMS, fallbackMemberships, 'from-emerald-500 to-teal-600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.company_name) {
      toast({ title: language === 'da' ? 'Udfyld alle påkrævede felter' : 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await (supabase.from as any)('partnership_inquiries').insert({
        company_name: formData.company_name,
        contact_person: formData.contact_person,
        email: formData.email,
        country: formData.country,
        partnership_type: formData.partnership_type,
        message: formData.message,
      });
      if (error) throw error;
      toast({
        title: language === 'da' ? 'Tak for din henvendelse!' : 'Thank you for your inquiry!',
        description: language === 'da' ? 'Vi vender tilbage hurtigst muligt.' : 'We will get back to you soon.',
      });
      setFormData({ company_name: '', contact_person: '', email: '', country: '', partnership_type: 'research', message: '' });
    } catch {
      toast({
        title: language === 'da' ? 'Fejl' : 'Error',
        description: language === 'da' ? 'Kunne ikke sende. Prøv igen.' : 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    { value: 'research', en: 'Research & Innovation', da: 'Forskning & Innovation' },
    { value: 'manufacturing', en: 'Manufacturing', da: 'Produktion' },
    { value: 'distribution', en: 'Distribution', da: 'Distribution' },
    { value: 'other', en: 'Other', da: 'Andet' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 30, 50, 70, 90].map((x, i) => (
            <FloatingDot key={i} x={x} delay={i * 2} />
          ))}
        </div>

        <div className="container relative z-10 flex h-full items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Badge className="mb-6 bg-white/15 text-white border-white/25 px-4 py-2 backdrop-blur-sm">
                <Handshake className="mr-2 h-4 w-4" />
                {language === 'da' ? 'Partnerskaber & Samarbejde' : 'Partnerships & Collaborations'}
              </Badge>
            </motion.div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
              {language === 'da' ? 'Vores Partnere' : 'Our Partners'}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
            >
              {language === 'da'
                ? 'Vi samarbejder med førende organisationer for at drive bæredygtig innovation fremad'
                : 'We collaborate with leading organizations to drive sustainable innovation forward'}
            </motion.p>
          </motion.div>
        </div>

      </section>

      {/* ─────── Section 1: Research & Innovation Partners ─────── */}
      <PartnerSection
        badge={language === 'da' ? 'Forskning & Innovation' : 'Research & Innovation'}
        badgeIcon={Microscope}
        title={language === 'da' ? 'Forskningspartnere' : 'Research Partners'}
        subtitle={language === 'da'
          ? 'Samarbejde med førende institutioner om bæredygtig materialeforskning'
          : 'Collaborating with leading institutions on sustainable materials research'}
        partners={researchPartners}
      />

      {/* ─────── Section 2: Manufacturing Partnerships ─────── */}
      <PartnerSection
        badge={language === 'da' ? 'Produktion' : 'Manufacturing'}
        badgeIcon={Factory}
        title={language === 'da' ? 'Produktionspartnere' : 'Manufacturing Partners'}
        subtitle={language === 'da'
          ? 'Certificerede faciliteter der sikrer kvalitet fra fiber til færdigt produkt'
          : 'Certified facilities ensuring quality from fiber to finished product'}
        partners={manufacturingPartners}
        bgClass="bg-gradient-to-b from-muted/30 to-background"
      />

      {/* ─────── Section 3: Our Memberships ─────── */}
      <PartnerSection
        badge={language === 'da' ? 'Medlemskaber' : 'Memberships'}
        badgeIcon={BadgeCheck}
        title={language === 'da' ? 'Vores Medlemskaber' : 'Our Memberships'}
        subtitle={language === 'da'
          ? 'Aktive medlemmer af førende bæredygtigheds- og brancheorganisationer'
          : 'Active members of leading sustainability and industry organizations'}
        partners={memberships}
      />

      {/* ─────── Section 4: Become a Partner (Contact Form) ─────── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8" />
              </motion.div>

              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                {language === 'da' ? 'Bliv Partner' : 'Become a Partner'}
              </h2>
              <p className="mt-6 text-white/90 text-lg leading-relaxed">
                {language === 'da'
                  ? 'Er du interesseret i at samarbejde med os? Vi er altid åbne for nye partnerskaber, der kan drive bæredygtig innovation fremad. Udfyld formularen, og vi vender tilbage hurtigst muligt.'
                  : 'Interested in collaborating with us? We are always open to new partnerships that can drive sustainable innovation forward. Fill out the form and we\'ll get back to you shortly.'}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Globe, text: language === 'da' ? 'Globalt netværk af partnere' : 'Global partner network' },
                  { icon: Award, text: language === 'da' ? 'Certificerede bæredygtighedsstandarder' : 'Certified sustainability standards' },
                  { icon: Users, text: language === 'da' ? 'Dedikeret partnersupport' : 'Dedicated partner support' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-white/90">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form
                onSubmit={handleSubmit}
                className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {language === 'da' ? 'Virksomhedsnavn *' : 'Company Name *'}
                    </label>
                    <Input
                      value={formData.company_name}
                      onChange={e => setFormData(p => ({ ...p, company_name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 rounded-xl"
                      placeholder="Ecofy ApS"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {language === 'da' ? 'Kontaktperson' : 'Contact Person'}
                    </label>
                    <Input
                      value={formData.contact_person}
                      onChange={e => setFormData(p => ({ ...p, contact_person: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">{language === 'da' ? 'Email *' : 'Email *'}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 rounded-xl"
                      placeholder="partner@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">{language === 'da' ? 'Land' : 'Country'}</label>
                    <Input
                      value={formData.country}
                      onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 rounded-xl"
                      placeholder="Denmark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {language === 'da' ? 'Partnerskabstype' : 'Partnership Type'}
                  </label>
                  <select
                    value={formData.partnership_type}
                    onChange={e => setFormData(p => ({ ...p, partnership_type: e.target.value }))}
                    aria-label={language === 'da' ? 'Partnerskabstype' : 'Partnership Type'}
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2.5 focus:outline-none focus:border-white/40 [&>option]:text-gray-900"
                  >
                    {partnershipTypes.map(pt => (
                      <option key={pt.value} value={pt.value}>
                        {language === 'da' ? pt.da : pt.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {language === 'da' ? 'Besked' : 'Message'}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 rounded-xl min-h-[120px]"
                    placeholder={language === 'da' ? 'Fortæl os om dit partnerskabsforslag...' : 'Tell us about your partnership proposal...'}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-violet-700 hover:bg-white/90 shadow-xl h-14 text-lg font-semibold rounded-xl"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 mr-2" />
                    )}
                    {language === 'da' ? 'Send Henvendelse' : 'Submit Inquiry'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
