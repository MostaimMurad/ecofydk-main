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
    'nav.products': 'Products',
    'nav.our-story': 'Our Story',
    'nav.sustainability': 'Sustainability',
    'nav.journal': 'Journal',
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
  },
  da: {
    'nav.home': 'Hjem',
    'nav.products': 'Produkter',
    'nav.our-story': 'Vores Historie',
    'nav.sustainability': 'Bæredygtighed',
    'nav.journal': 'Journal',
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
  },
};

// Safe default for components that render outside the provider
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
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
