-- ============================================================
-- Seed homepage dynamic content blocks
-- ============================================================

-- 0. Hero Section Content (tagline, subtitle, CTA buttons)
INSERT INTO content_blocks (section, block_key, title_en, title_da, sort_order) VALUES
('hero', 'tagline',       'Crafting Sustainable Stories',                                      'Skaber Bæredygtige Historier',                                            10),
('hero', 'subtitle',      'Premium eco-friendly jute products from Bangladesh to Europe',      'Premium miljøvenlige juteprodukter fra Bangladesh til Europa',             11),
('hero', 'cta_primary',   'Explore Collection',                                                 'Udforsk Kollektion',                                                      12),
('hero', 'cta_secondary', 'Learn More',                                                         'Lær Mere',                                                                13)
ON CONFLICT (section, block_key) DO NOTHING;

-- 1. Homepage Impact Counters
INSERT INTO content_blocks (section, block_key, title_en, title_da, value, icon, color, metadata, sort_order) VALUES
('homepage_impact', 'impact_bags',    'Eco-Friendly Bags Delivered',   'Øko-venlige poser leveret',    '50000', 'Package',   'from-primary to-emerald-600',    '{"suffix": "+"}',  1),
('homepage_impact', 'impact_co2',     'CO₂ Emissions Saved',          'CO₂ udledning sparet',         '18',    'TreePine',  'from-green-500 to-emerald-600',  '{"suffix": "t"}',  2),
('homepage_impact', 'impact_plastic', 'Plastic Pollution Prevented',  'Plastforurening forhindret',   '12',    'Recycle',   'from-blue-500 to-cyan-600',      '{"suffix": "t"}',  3),
('homepage_impact', 'impact_clients', 'B2B Clients Served',           'B2B kunder',                   '200',   'Building2', 'from-purple-500 to-violet-600',  '{"suffix": "+"}',  4)
ON CONFLICT (section, block_key) DO NOTHING;

-- 2. Homepage How It Works Steps
INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, icon, color, sort_order) VALUES
('homepage_howitworks', 'step_1', 'Tell Us Your Needs',     'Fortæl Os',       'Share your requirements — product type, quantity, branding, and delivery timeline',       'Del dine krav — produkttype, mængde, branding og levering',                        'MessageSquare', 'from-blue-500 to-cyan-600',      1),
('homepage_howitworks', 'step_2', 'We Design & Sample',     'Vi Designer',     'Receive design mockups and physical samples for your approval',                           'Få design mockups og fysiske prøver til godkendelse',                              'Palette',       'from-purple-500 to-violet-600',  2),
('homepage_howitworks', 'step_3', 'Production',             'Produktion',      'Bulk manufacturing with strict quality control at our partner factories',                 'Masseproduktion med streng kvalitetskontrol i Bangladesh',                          'Package',       'from-amber-500 to-orange-600',   3),
('homepage_howitworks', 'step_4', 'Delivery to Your Door',  'Levering',        'Direct shipping to your EU warehouse with full compliance documentation',                 'Direkte forsendelse til dit EU-lager med fuld dokumentation',                       'Truck',         'from-emerald-500 to-teal-600',   4)
ON CONFLICT (section, block_key) DO NOTHING;

-- 3. Homepage Founder Section
INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, value, metadata, sort_order) VALUES
('homepage_founder', 'founder_main', 'Meet the Founder', 'Mød Grundlæggeren',
 'See how Ecofy started and our vision for a sustainable future',
 'Se hvordan Ecofy startede og vores vision for en bæredygtig fremtid',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 '{"founder_name": "Mostaim Ahmed", "founder_title": "Founder & CEO, Ecofy ApS", "initials": "MA", "quote_en": "\"We started Ecofy with one simple idea: replace plastic with jute, one product at a time. Today we deliver to 200+ businesses across Europe, and we are just getting started.\"", "quote_da": "\"Vi startede Ecofy med én enkel idé: at erstatte plastik med jute, ét produkt ad gangen. I dag leverer vi til 200+ virksomheder i hele Europa, og vi er kun lige begyndt.\""}',
 1),
('homepage_founder', 'founder_stat_1', 'Founded', 'Grundlagt', NULL, NULL, '2019', '{}', 2),
('homepage_founder', 'founder_stat_2', 'B2B Clients', 'B2B Kunder', NULL, NULL, '200+', '{}', 3),
('homepage_founder', 'founder_stat_3', 'Products', 'Produkter', NULL, NULL, '14+', '{}', 4)
ON CONFLICT (section, block_key) DO NOTHING;

-- 4. Our Story Mission Section
INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, image_url, metadata, sort_order) VALUES
('story_mission', 'mission_main',
 'Crafting a Sustainable Future, One Bag at a Time',
 'Skaber en Bæredygtig Fremtid, Én Pose ad Gangen',
 'Ecofy was born from a simple belief: businesses shouldn''t have to choose between quality and sustainability. We bridge Bangladesh''s centuries-old jute craftsmanship with modern European design standards.',
 'Ecofy blev født af en simpel overbevisning: virksomheder bør ikke stå over for valget mellem kvalitet og bæredygtighed. Vi bygger bro mellem Bangladeshs århundredgamle jutehåndværk og moderne europæiske designstandarder.',
 NULL,
 '{"description2_en": "Our artisan partners handcraft each product using traditional techniques passed down through generations, ensuring every piece carries authentic craftsmanship while meeting the highest quality standards.", "description2_da": "Vores håndværkspartnere fremstiller hvert produkt i hånden med traditionelle teknikker, der er gået i arv gennem generationer, og sikrer, at hvert stykke bærer autentisk håndværk, mens de opfylder de højeste kvalitetsstandarder.", "overlay_value": "6+", "overlay_label_en": "Years Experience", "overlay_label_da": "Års Erfaring"}',
 1)
ON CONFLICT (section, block_key) DO NOTHING;

-- 5. Add Google Maps fields to site_settings (if columns don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'map_embed_url') THEN
        ALTER TABLE site_settings ADD COLUMN map_embed_url text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'map_latitude') THEN
        ALTER TABLE site_settings ADD COLUMN map_latitude text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'map_longitude') THEN
        ALTER TABLE site_settings ADD COLUMN map_longitude text DEFAULT '';
    END IF;
END
$$;

-- 6. Homepage Section Translations (badges, headings, subtitles, CTAs)
INSERT INTO translations (key, value_en, value_da, is_active) VALUES
('home.impact.title',            'Our Impact So Far',                                                         'Vores Påvirkning Indtil Videre',                                                    true),
('home.impact.subtitle',         'Every product counts. Here''s what we''ve achieved together with our clients.','Hvert produkt tæller. Her er hvad vi har opnået sammen med vores kunder.',          true),
('home.howitworks.badge',        'Simple Process',                                                             'Enkel Proces',                                                                      true),
('home.howitworks.title',        'How It Works',                                                               'Hvordan Det Fungerer',                                                              true),
('home.howitworks.subtitle',     'From inquiry to delivery — we make it simple for you',                       'Fra forespørgsel til levering — vi gør det enkelt for dig',                         true),
('home.howitworks.cta',          'Start Your Project',                                                         'Start Dit Projekt',                                                                 true),
('home.founder.badge',           'Our Story',                                                                  'Vores Historie',                                                                    true),
('home.founder.watchvideo',      'Watch Video (2 min)',                                                        'Se video (2 min)',                                                                  true),
('home.partners.badge',          'Trusted By',                                                                 'Betroet af',                                                                        true),
('home.partners.title',          '200+ B2B Businesses Across Europe',                                          '200+ B2B-virksomheder i hele Europa',                                               true),
('home.products.badge',          'Featured Collection',                                                        'Udvalgt Kollektion',                                                                true),
('home.products.subtitle',       'Handcrafted with love by Bangladeshi artisans, each piece tells a unique story','Håndlavet med kærlighed af bangladeshiske håndværkere, hvert stykke fortæller en unik historie', true),
('home.products.viewdetails',    'View Details',                                                               'Se Detaljer',                                                                       true),
('home.products.featured',       'Featured',                                                                   'Udvalgt',                                                                           true),
('home.products.learnmore',      'Learn More',                                                                 'Læs Mere',                                                                          true),
('home.products.exploreall',     'Explore All Products',                                                       'Udforsk Alle Produkter',                                                            true),
('home.about.badge',             'About Us',                                                                   'Om Os',                                                                             true),
('home.sustainability.badge',    'Our Commitment',                                                             'Vores Engagement',                                                                  true),
('home.sustainability.subtitle', 'Every choice we make reflects our dedication to the planet and its people',  'Hvert valg vi træffer afspejler vores dedikation til planeten og dens mennesker',   true),
('home.sustainability.cta',      'Learn About Our Mission',                                                    'Læs Om Vores Mission',                                                              true),
('home.newsletter.badge',        'Stay Connected',                                                             'Hold Forbindelsen',                                                                 true),
('home.newsletter.subscribed',   'You''re subscribed!',                                                        'Du er tilmeldt!',                                                                   true),
('home.testimonials.badge',      'Testimonials',                                                               'Anbefalinger',                                                                      true),
('home.hero.scroll',             'Explore',                                                                    'Udforsk',                                                                           true),
('home.hero.handcrafted',        'Handcrafted with Love',                                                      'Håndlavet med Kærlighed',                                                           true)
ON CONFLICT (key) DO NOTHING;
