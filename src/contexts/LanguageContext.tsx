import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export type Language = 'en' | 'da';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

/**
 * Hardcoded fallback translations — used while the DB query is loading
 * or if the DB is unreachable. This keeps the UI functional at all times.
 */
const fallbackTranslations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about-us': 'About Us',
    'nav.about-jute': 'About Jute',
    'nav.products': 'Products',
    'nav.our-story': 'Our Story',
    'nav.sustainability': 'Sustainability',
    'nav.innovation': 'Innovation',
    'nav.gallery': 'Gallery',
    'nav.partnerships': 'Partnerships',
    'nav.journal': 'Journal',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.tagline': 'Crafting Sustainable Stories',
    'hero.subtitle': 'Premium eco-friendly jute products from Bangladesh to Europe',
    'hero.cta': 'Explore Collection',
    'about.title': 'Our Story',
    'about.subtitle': 'From the fertile lands of Bangladesh to your home',
    'about.cta': 'Learn More',
    'products.title': 'Our Collection',
    'products.request-quote': 'Request Quote',
    'products.search.placeholder': 'Search products...',
    'testimonials.title': 'What Our Partners Say',
    'newsletter.title': 'Stay Connected',
    'newsletter.subtitle': 'Subscribe to our newsletter for updates on new products and sustainable living tips',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.button': 'Subscribe',
    'footer.rights': 'All rights reserved',
    'contact.title': 'Get in Touch',
    'contact.form.submit': 'Send Request',
    'journal.title': 'Our Journal',
    'journal.read-more': 'Read More',
    // Homepage section headings & badges
    'home.impact.title': 'Our Impact So Far',
    'home.impact.subtitle': 'Every product counts. Here\'s what we\'ve achieved together with our clients.',
    'home.howitworks.badge': 'Simple Process',
    'home.howitworks.title': 'How It Works',
    'home.howitworks.subtitle': 'From inquiry to delivery — we make it simple for you',
    'home.howitworks.cta': 'Start Your Project',
    'home.founder.badge': 'Our Story',
    'home.founder.watchvideo': 'Watch Video (2 min)',
    'home.partners.badge': 'Trusted By',
    'home.partners.title': '200+ B2B Businesses Across Europe',
    'home.products.badge': 'Product Highlight',
    'home.products.title': 'Product Highlight',
    'home.products.subtitle': 'Handcrafted with love by Bangladeshi artisans, each piece tells a unique story',
    'home.products.viewdetails': 'View Details',
    'home.products.featured': 'Featured',
    'home.products.learnmore': 'Learn More',
    'home.products.exploreall': 'Explore All Products',
    'home.about.badge': 'About Us',
    'home.aboutjute.badge': 'About Jute',
    'home.aboutjute.title': 'Why Choose Jute?',
    'home.aboutjute.subtitle': 'Nature\'s answer to the plastic crisis — sustainable, biodegradable, and stronger than you think.',
    'home.aboutjute.cta': 'Learn More About Jute',
    'home.ourstory.badge': 'Our Story',
    'home.ourstory.title': 'Our Journey',
    'home.ourstory.subtitle': 'From a small idea in Denmark to connecting Bangladeshi artisans with European businesses — this is our story of sustainable impact.',
    'home.ourstory.cta': 'Read Our Full Story',
    'home.innovation.badge': 'Innovation',
    'home.innovation.title': 'Pioneering Innovation',
    'home.innovation.subtitle': 'We combine traditional craftsmanship with modern technology to create sustainable solutions.',
    'home.innovation.cta': 'Explore Our Innovation',
    'home.certification.badge': 'Certifications & Membership',
    'home.certification.title': 'Certifications & Compliance',
    'home.certification.subtitle': 'All our products meet EU standards for sustainability, safety, and quality.',
    'home.certification.cta': 'View All Certifications',
    'home.gallery.badge': 'Gallery',
    'home.gallery.title': 'Our Gallery',
    'home.gallery.subtitle': 'Explore our world of sustainable jute products, craftsmanship, and events.',
    'home.gallery.cta': 'View Full Gallery',
    'home.sustainability.badge': 'Our Commitment',
    'home.sustainability.subtitle': 'Every choice we make reflects our dedication to the planet and its people',
    'home.sustainability.cta': 'Learn About Our Mission',
    'home.newsletter.badge': 'Stay Connected',
    'home.newsletter.subscribed': 'You\'re subscribed!',
    'home.testimonials.badge': 'Testimonials',
    'home.hero.scroll': 'Explore',
    'home.hero.handcrafted': 'Handcrafted with Love',
  },
  da: {
    'nav.home': 'Hjem',
    'nav.products': 'Produkter',
    'nav.our-story': 'Vores Historie',
    'nav.sustainability': 'Bæredygtighed',
    'nav.about-us': 'Om Os',
    'nav.about-jute': 'Om Jute',
    'nav.innovation': 'Innovation',
    'nav.gallery': 'Galleri',
    'nav.partnerships': 'Partnerskaber',
    'nav.journal': 'Journal',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.admin': 'Admin',
    'hero.tagline': 'Skaber Bæredygtige Historier',
    'hero.subtitle': 'Premium miljøvenlige juteprodukter fra Bangladesh til Europa',
    'hero.cta': 'Udforsk Kollektionen',
    'about.title': 'Vores Historie',
    'about.subtitle': 'Fra de frugtbare lande i Bangladesh til dit hjem',
    'about.cta': 'Læs Mere',
    'products.title': 'Vores Kollektion',
    'products.request-quote': 'Anmod om Tilbud',
    'products.search.placeholder': 'Søg produkter...',
    'testimonials.title': 'Hvad Vores Partnere Siger',
    'newsletter.title': 'Hold Dig Opdateret',
    'newsletter.subtitle': 'Tilmeld dig vores nyhedsbrev for opdateringer om nye produkter og bæredygtige livsstilstips',
    'newsletter.placeholder': 'Indtast din email',
    'newsletter.button': 'Tilmeld',
    'footer.rights': 'Alle rettigheder forbeholdes',
    'contact.title': 'Kontakt Os',
    'contact.form.submit': 'Send Anmodning',
    'journal.title': 'Vores Journal',
    'journal.read-more': 'Læs Mere',
    // Homepage section headings & badges
    'home.impact.title': 'Vores Påvirkning Indtil Videre',
    'home.impact.subtitle': 'Hvert produkt tæller. Her er hvad vi har opnået sammen med vores kunder.',
    'home.howitworks.badge': 'Enkel Proces',
    'home.howitworks.title': 'Hvordan Det Fungerer',
    'home.howitworks.subtitle': 'Fra forespørgsel til levering — vi gør det enkelt for dig',
    'home.howitworks.cta': 'Start Dit Projekt',
    'home.founder.badge': 'Vores Historie',
    'home.founder.watchvideo': 'Se video (2 min)',
    'home.partners.badge': 'Betroet af',
    'home.partners.title': '200+ B2B-virksomheder i hele Europa',
    'home.products.badge': 'Produkt Highlights',
    'home.products.title': 'Produkt Highlights',
    'home.products.subtitle': 'Håndlavet med kærlighed af bangladeshiske håndværkere, hvert stykke fortæller en unik historie',
    'home.products.viewdetails': 'Se Detaljer',
    'home.products.featured': 'Udvalgt',
    'home.products.learnmore': 'Læs Mere',
    'home.products.exploreall': 'Udforsk Alle Produkter',
    'home.about.badge': 'Om Os',
    'home.aboutjute.badge': 'Om Jute',
    'home.aboutjute.title': 'Hvorfor Vælge Jute?',
    'home.aboutjute.subtitle': 'Naturens svar på plastikkrisen — bæredygtig, biologisk nedbrydelig og stærkere end du tror.',
    'home.aboutjute.cta': 'Læs Mere Om Jute',
    'home.ourstory.badge': 'Vores Historie',
    'home.ourstory.title': 'Vores Rejse',
    'home.ourstory.subtitle': 'Fra en lille idé i Danmark til at forbinde bangladeshiske håndværkere med europæiske virksomheder — dette er vores historie om bæredygtig påvirkning.',
    'home.ourstory.cta': 'Læs Vores Fulde Historie',
    'home.innovation.badge': 'Innovation',
    'home.innovation.title': 'Banebrydende Innovation',
    'home.innovation.subtitle': 'Vi kombinerer traditionelt håndværk med moderne teknologi for at skabe bæredygtige løsninger.',
    'home.innovation.cta': 'Udforsk Vores Innovation',
    'home.certification.badge': 'Certificeringer & Medlemskab',
    'home.certification.title': 'Certificeringer & Compliance',
    'home.certification.subtitle': 'Alle vores produkter opfylder EU-standarder for bæredygtighed, sikkerhed og kvalitet.',
    'home.certification.cta': 'Se Alle Certificeringer',
    'home.gallery.badge': 'Galleri',
    'home.gallery.title': 'Vores Galleri',
    'home.gallery.subtitle': 'Udforsk vores verden af bæredygtige juteprodukter, håndværk og begivenheder.',
    'home.gallery.cta': 'Se Fuldt Galleri',
    'home.sustainability.badge': 'Vores Engagement',
    'home.sustainability.subtitle': 'Hvert valg vi træffer afspejler vores dedikation til planeten og dens mennesker',
    'home.sustainability.cta': 'Læs Om Vores Mission',
    'home.newsletter.badge': 'Hold Forbindelsen',
    'home.newsletter.subscribed': 'Du er tilmeldt!',
    'home.testimonials.badge': 'Anbefalinger',
    'home.hero.scroll': 'Udforsk',
    'home.hero.handcrafted': 'Håndlavet med Kærlighed',
  },
};

// Safe default for components that render outside the provider
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  t: (key: string) => fallbackTranslations.en[key] || key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const { data: dbTranslations } = useTranslations();

  const t = useCallback(
    (key: string): string => {
      // 1. Try DB translations first
      if (dbTranslations && dbTranslations[key]) {
        return language === 'da' ? dbTranslations[key].da : dbTranslations[key].en;
      }
      // 2. Fall back to hardcoded essentials
      return fallbackTranslations[language][key] || key;
    },
    [language, dbTranslations],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => useContext(LanguageContext);
