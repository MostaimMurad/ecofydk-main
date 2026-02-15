import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Globe, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOfficeLocations } from '@/hooks/useOfficeLocations';

/**
 * Imperatively managed iframe to prevent React DOM reconciliation conflicts.
 * Google Maps iframes (and browser extensions) can modify the DOM around them,
 * causing React's removeChild to fail. By managing the iframe via refs/useEffect,
 * React only owns the container div — never the iframe itself.
 */
const MapEmbed = ({ lat, lng, title }: { lat: number; lng: number; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.title = title;
    iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${lat}!5e0!3m2!1sen!2sdk!4v1600000000000!5m2!1sen!2sdk`;
    iframe.className = 'h-full w-full border-0 grayscale-[30%] group-hover:grayscale-0 transition-all duration-500';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';

    container.appendChild(iframe);

    return () => {
      if (container.contains(iframe)) {
        container.removeChild(iframe);
      }
    };
  }, [lat, lng, title]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

const OfficeLocations = () => {
  const { language, t } = useLanguage();
  const { data: offices = [] } = useOfficeLocations();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hq': return Building2;
      case 'office': return Globe;
      default: return MapPin;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hq': return language === 'en' ? 'Headquarters' : 'Hovedkontor';
      case 'office': return language === 'en' ? 'Regional Office' : 'Regionalt Kontor';
      case 'warehouse': return language === 'en' ? 'Warehouse' : 'Lager';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hq': return 'from-blue-500 to-cyan-500';
      case 'office': return 'from-emerald-500 to-green-500';
      default: return 'from-amber-500 to-orange-500';
    }
  };

  if (offices.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-4">
            <Globe className="h-4 w-4" />
            {language === 'da' ? 'Global Tilstedeværelse' : 'Global Presence'}
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{t('contact.offices.title')}</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">{t('contact.offices.subtitle')}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {offices.map((office, index) => {
            const Icon = getTypeIcon(office.type);
            const colorClass = getTypeColor(office.type);
            const officeName = language === 'en' ? office.name_en : office.name_da;
            
            return (
              <motion.div key={office.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.15 }} whileHover={{ y: -5 }} className="group">
                <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl overflow-hidden border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Google Maps Embed */}
                  {office.lat && office.lng && (
                    <div className="relative aspect-video w-full bg-muted overflow-hidden">
                      <MapEmbed
                        lat={office.lat}
                        lng={office.lng}
                        title={`Map of ${officeName}`}
                      />
                      {office.flag && (
                        <div className="absolute top-4 right-4 text-3xl bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          {office.flag}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                        className={`rounded-2xl bg-gradient-to-br ${colorClass} p-3 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-serif font-semibold text-lg text-foreground">{officeName}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-r ${colorClass} text-white`}>
                            {getTypeLabel(office.type)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{office.address}</p>
                        <p className="text-muted-foreground">{office.city}, {office.country}</p>
                        
                        <motion.a whileHover={{ x: 5 }}
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.address}, ${office.city}, ${office.country}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
                          <MapPin className="h-4 w-4" />
                          {language === 'en' ? 'Get Directions' : 'Få Rutevejledning'}
                          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfficeLocations;
