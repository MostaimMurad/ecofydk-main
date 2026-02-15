
-- Create translations table for full i18n CMS management
CREATE TABLE public.translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value_en text NOT NULL,
  value_da text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Public read for active translations
CREATE POLICY "Translations are publicly readable"
  ON public.translations FOR SELECT
  USING (is_active = true);

-- Admin write policies
CREATE POLICY "Admins can create translations"
  ON public.translations FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update translations"
  ON public.translations FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete translations"
  ON public.translations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_translations_key ON public.translations(key);
CREATE INDEX idx_translations_category ON public.translations(category);

-- Seed all translation strings from LanguageContext
INSERT INTO public.translations (key, value_en, value_da, category) VALUES
  -- Navigation
  ('nav.home', 'Home', 'Hjem', 'navigation'),
  ('nav.products', 'Products', 'Produkter', 'navigation'),
  ('nav.our-story', 'Our Story', 'Vores Historie', 'navigation'),
  ('nav.sustainability', 'Sustainability', 'Bæredygtighed', 'navigation'),
  ('nav.journal', 'Journal', 'Journal', 'navigation'),
  ('nav.contact', 'Contact', 'Kontakt', 'navigation'),
  ('nav.admin', 'Admin', 'Admin', 'navigation'),

  -- Hero
  ('hero.tagline', 'Crafting Sustainable Stories', 'Skaber Bæredygtige Historier', 'hero'),
  ('hero.subtitle', 'Premium eco-friendly jute products from Bangladesh to Europe', 'Premium miljøvenlige juteprodukter fra Bangladesh til Europa', 'hero'),
  ('hero.cta', 'Explore Collection', 'Udforsk Kollektionen', 'hero'),

  -- About
  ('about.title', 'Our Story', 'Vores Historie', 'about'),
  ('about.subtitle', 'From the fertile lands of Bangladesh to your home', 'Fra de frugtbare lande i Bangladesh til dit hjem', 'about'),
  ('about.cta', 'Learn More', 'Læs Mere', 'about'),

  -- Sustainability highlights (home)
  ('sustainability.title', 'Our Commitment', 'Vores Forpligtelse', 'sustainability'),
  ('sustainability.eco.title', 'Eco-Friendly', 'Miljøvenlig', 'sustainability'),
  ('sustainability.eco.desc', '100% biodegradable and sustainable materials', '100% bionedbrydelige og bæredygtige materialer', 'sustainability'),
  ('sustainability.artisan.title', 'Artisan Support', 'Håndværkerstøtte', 'sustainability'),
  ('sustainability.artisan.desc', 'Empowering local craftspeople with fair wages', 'Styrker lokale håndværkere med fair løn', 'sustainability'),
  ('sustainability.zero.title', 'Zero Waste', 'Nul Affald', 'sustainability'),
  ('sustainability.zero.desc', 'Minimal environmental footprint in production', 'Minimal miljøpåvirkning i produktionen', 'sustainability'),

  -- Products
  ('products.title', 'Our Collection', 'Vores Kollektion', 'products'),
  ('products.filter.all', 'All Products', 'Alle Produkter', 'products'),
  ('products.filter.bags', 'Bags', 'Tasker', 'products'),
  ('products.filter.sacks', 'Sacks', 'Sække', 'products'),
  ('products.filter.decor', 'Home Décor', 'Boligindretning', 'products'),
  ('products.filter.rope', 'Rope & Twine', 'Reb & Snor', 'products'),
  ('products.request-quote', 'Request Quote', 'Anmod om Tilbud', 'products'),
  ('products.search.placeholder', 'Search products...', 'Søg produkter...', 'products'),
  ('products.search.clear', 'Clear search', 'Ryd søgning', 'products'),
  ('products.search.noResults', 'No products found matching your search.', 'Ingen produkter fundet, der matcher din søgning.', 'products'),
  ('products.quickView', 'Quick View', 'Hurtigt Kig', 'products'),
  ('products.relatedProducts', 'Related Products', 'Relaterede Produkter', 'products'),

  -- Testimonials
  ('testimonials.title', 'What Our Partners Say', 'Hvad Vores Partnere Siger', 'testimonials'),

  -- Newsletter
  ('newsletter.title', 'Stay Connected', 'Hold Dig Opdateret', 'newsletter'),
  ('newsletter.subtitle', 'Subscribe to our newsletter for updates on new products and sustainable living tips', 'Tilmeld dig vores nyhedsbrev for opdateringer om nye produkter og bæredygtige livsstilstips', 'newsletter'),
  ('newsletter.placeholder', 'Enter your email', 'Indtast din email', 'newsletter'),
  ('newsletter.button', 'Subscribe', 'Tilmeld', 'newsletter'),

  -- Home Journal
  ('home.journal.title', 'From Our Journal', 'Fra Vores Journal', 'home'),
  ('home.journal.subtitle', 'Stories, insights, and updates from the world of sustainable craftsmanship', 'Historier, indsigt og opdateringer fra bæredygtigt håndværks verden', 'home'),
  ('home.journal.cta', 'View All Posts', 'Se Alle Indlæg', 'home'),

  -- Home FAQ
  ('home.faq.badge', 'FAQ', 'FAQ', 'faq'),
  ('home.faq.title', 'Frequently Asked Questions', 'Ofte Stillede Spørgsmål', 'faq'),
  ('home.faq.subtitle', 'Find answers to common questions about our products and services.', 'Find svar på almindelige spørgsmål om vores produkter og tjenester.', 'faq'),
  ('home.faq.q1', 'What materials are your products made from?', 'Hvilke materialer er jeres produkter lavet af?', 'faq'),
  ('home.faq.a1', 'All our products are made from 100% natural jute fiber, sourced sustainably from Bangladesh. Jute is one of the most eco-friendly fibers available, being fully biodegradable and renewable.', 'Alle vores produkter er lavet af 100% naturlig jutefiber, bæredygtigt indkøbt fra Bangladesh. Jute er en af de mest miljøvenlige fibre, da den er fuldt bionedbrydelig og fornybar.', 'faq'),
  ('home.faq.q2', 'What is the minimum order quantity for bulk orders?', 'Hvad er minimumordremængden for bulkordrer?', 'faq'),
  ('home.faq.a2', 'Our minimum order quantity varies by product type. For most items, we accept orders starting from 100 units. Contact us for specific product requirements and we''ll be happy to discuss your needs.', 'Vores minimumordremængde varierer efter produkttype. For de fleste varer accepterer vi ordrer fra 100 enheder. Kontakt os for specifikke produktkrav, og vi hjælper gerne.', 'faq'),
  ('home.faq.q3', 'Do you offer custom branding and private labeling?', 'Tilbyder I tilpasset branding og private labels?', 'faq'),
  ('home.faq.a3', 'Yes! We offer full customization including custom sizes, colors, printing, and private labeling. Our design team can work with you to create products that perfectly match your brand identity.', 'Ja! Vi tilbyder fuld tilpasning inklusiv brugerdefinerede størrelser, farver, tryk og private labels. Vores designteam kan arbejde sammen med dig om at skabe produkter, der passer perfekt til din brandidentitet.', 'faq'),
  ('home.faq.q4', 'What are the shipping options to Europe?', 'Hvad er forsendelsesmulighederne til Europa?', 'faq'),
  ('home.faq.a4', 'We ship to all European countries via sea and air freight. Delivery times typically range from 2-4 weeks for sea freight and 5-7 days for air freight. We handle all customs documentation.', 'Vi sender til alle europæiske lande via sø- og luftfragt. Leveringstider er typisk 2-4 uger for søfragt og 5-7 dage for luftfragt. Vi håndterer al tolddokumentation.', 'faq'),
  ('home.faq.q5', 'Are your products certified sustainable?', 'Er jeres produkter certificeret bæredygtige?', 'faq'),
  ('home.faq.a5', 'Yes, our products are OEKO-TEX certified and we follow Fair Trade practices. We also hold ISO 14001 environmental management certification and GOTS certification for our organic jute products.', 'Ja, vores produkter er OEKO-TEX-certificerede, og vi følger Fair Trade-praksis. Vi har også ISO 14001-miljøcertificering og GOTS-certificering for vores økologiske juteprodukter.', 'faq'),
  ('home.faq.q6', 'How do I request a quote?', 'Hvordan anmoder jeg om et tilbud?', 'faq'),
  ('home.faq.a6', 'You can request a quote by visiting our Contact page and filling out the quotation form. Provide details about the products you''re interested in, quantities, and any customization requirements. We typically respond within 24-48 hours.', 'Du kan anmode om et tilbud ved at besøge vores kontaktside og udfylde tilbudsformularen. Angiv detaljer om de produkter, du er interesseret i, mængder og eventuelle tilpasningskrav. Vi svarer typisk inden for 24-48 timer.', 'faq'),

  -- Footer
  ('footer.rights', 'All rights reserved', 'Alle rettigheder forbeholdes', 'footer'),
  ('footer.privacy', 'Privacy Policy', 'Privatlivspolitik', 'footer'),
  ('footer.terms', 'Terms of Service', 'Servicevilkår', 'footer'),
  ('footer.quickLinks', 'Quick Links', 'Hurtige Links', 'footer'),
  ('footer.certifications', 'Certifications', 'Certificeringer', 'footer'),
  ('footer.newsletter.title', 'Stay Updated', 'Hold Dig Opdateret', 'footer'),
  ('footer.newsletter.description', 'Subscribe to get the latest news, product updates, and sustainability tips.', 'Tilmeld dig for at få de seneste nyheder, produktopdateringer og bæredygtige tips.', 'footer'),
  ('footer.newsletter.success', 'Thank you for subscribing!', 'Tak fordi du tilmeldte dig!', 'footer'),

  -- Contact
  ('contact.title', 'Get in Touch', 'Kontakt Os', 'contact'),
  ('contact.subtitle', 'We''d love to hear from you. Send us a message or request a quote for your business.', 'Vi vil meget gerne høre fra dig. Send os en besked eller anmod om et tilbud til din virksomhed.', 'contact'),
  ('contact.form.name', 'Your Name', 'Dit Navn', 'contact'),
  ('contact.form.email', 'Email Address', 'Email Adresse', 'contact'),
  ('contact.form.company', 'Company Name', 'Virksomhedsnavn', 'contact'),
  ('contact.form.phone', 'Phone Number', 'Telefonnummer', 'contact'),
  ('contact.form.product', 'Product Interest', 'Produktinteresse', 'contact'),
  ('contact.form.product.placeholder', 'Select a product (optional)', 'Vælg et produkt (valgfrit)', 'contact'),
  ('contact.form.quantity', 'Estimated Quantity', 'Estimeret Mængde', 'contact'),
  ('contact.form.message', 'Your Message', 'Din Besked', 'contact'),
  ('contact.form.submit', 'Send Request', 'Send Anmodning', 'contact'),
  ('contact.form.success', 'Thank you! Your request has been submitted. We will contact you soon.', 'Tak! Din anmodning er blevet sendt. Vi kontakter dig snart.', 'contact'),
  ('contact.form.error', 'Something went wrong. Please try again.', 'Noget gik galt. Prøv venligst igen.', 'contact'),
  ('contact.info.title', 'Contact Information', 'Kontaktoplysninger', 'contact'),
  ('contact.info.address', 'Address', 'Adresse', 'contact'),
  ('contact.info.email', 'Email', 'Email', 'contact'),
  ('contact.info.phone', 'Phone', 'Telefon', 'contact'),
  ('contact.info.hours', 'Business Hours', 'Åbningstider', 'contact'),
  ('contact.info.hours.value', 'Mon - Fri: 9:00 AM - 5:00 PM (CET)', 'Man - Fre: 9:00 - 17:00 (CET)', 'contact'),
  ('contact.offices.title', 'Our Offices', 'Vores Kontorer', 'contact'),
  ('contact.offices.subtitle', 'Visit us at our locations in Europe and Asia.', 'Besøg os på vores lokationer i Europa og Asien.', 'contact'),

  -- Our Story
  ('story.hero.title', 'Weaving Tradition into Tomorrow', 'Væver Tradition ind i Morgendagen', 'story'),
  ('story.hero.subtitle', 'For over six years, Ecofy has been bridging the rich heritage of Bangladeshi craftsmanship with the sustainable needs of the European market.', 'I over seks år har Ecofy bygget bro mellem den rige arv fra bangladeshisk håndværk og det europæiske markeds bæredygtige behov.', 'story'),
  ('story.mission.title', 'Our Mission', 'Vores Mission', 'story'),
  ('story.mission.description', 'At Ecofy, we believe that sustainable business can empower communities while protecting our planet. Our mission is to bring the finest eco-friendly jute products from Bangladesh to homes and businesses across Denmark and Europe.', 'Hos Ecofy tror vi på, at bæredygtig forretning kan styrke samfund og samtidig beskytte vores planet. Vores mission er at bringe de fineste miljøvenlige juteprodukter fra Bangladesh til hjem og virksomheder i Danmark og Europa.', 'story'),
  ('story.mission.description2', 'We work directly with skilled artisans in rural Bangladesh, ensuring fair wages, safe working conditions, and opportunities for growth. Every product we create tells a story of tradition, sustainability, and human connection.', 'Vi arbejder direkte med dygtige håndværkere i landdistrikterne i Bangladesh og sikrer fair løn, sikre arbejdsforhold og muligheder for vækst. Hvert produkt vi skaber fortæller en historie om tradition, bæredygtighed og menneskelig forbindelse.', 'story'),
  ('story.mission.years', 'Years of Excellence', 'År med Excellence', 'story'),
  ('story.stats.artisans', 'Artisans Empowered', 'Håndværkere Styrket', 'story'),
  ('story.stats.products', 'Unique Products', 'Unikke Produkter', 'story'),
  ('story.stats.countries', 'Countries Served', 'Lande Betjent', 'story'),
  ('story.stats.sustainable', 'Sustainable Materials', 'Bæredygtige Materialer', 'story'),
  ('story.timeline.title', 'Our Journey', 'Vores Rejse', 'story'),
  ('story.timeline.subtitle', 'From a small idea to an international sustainable brand', 'Fra en lille idé til et internationalt bæredygtigt brand', 'story'),
  ('story.timeline.2018', 'Founded with a vision to bring sustainable jute products to Europe', 'Grundlagt med en vision om at bringe bæredygtige juteprodukter til Europa', 'story'),
  ('story.timeline.2019', 'Established partnerships with 50+ artisan families in Bangladesh', 'Etablerede partnerskaber med 50+ håndværkerfamilier i Bangladesh', 'story'),
  ('story.timeline.2021', 'Expanded product line and entered Danish retail market', 'Udvidede produktlinjen og indtrådte på det danske detailmarked', 'story'),
  ('story.timeline.2023', 'Achieved Fair Trade certification and expanded to 10+ European countries', 'Opnåede Fair Trade-certificering og udvidede til 10+ europæiske lande', 'story'),
  ('story.timeline.2024', 'Launched B2B wholesale program and sustainable packaging initiative', 'Lancerede B2B engros-program og bæredygtigt emballageinitiativ', 'story'),
  ('story.values.title', 'Our Core Values', 'Vores Kerneværdier', 'story'),
  ('story.values.subtitle', 'The principles that guide everything we do', 'Principperne der guider alt hvad vi gør', 'story'),
  ('story.values.sustainability.title', 'Sustainability First', 'Bæredygtighed Først', 'story'),
  ('story.values.sustainability.desc', 'Every decision we make considers its environmental impact, from sourcing to shipping.', 'Hver beslutning vi træffer tager hensyn til dens miljøpåvirkning, fra sourcing til forsendelse.', 'story'),
  ('story.values.quality.title', 'Uncompromising Quality', 'Kompromisløs Kvalitet', 'story'),
  ('story.values.quality.desc', 'We never sacrifice quality for cost. Each product meets the highest European standards.', 'Vi ofrer aldrig kvalitet for omkostninger. Hvert produkt opfylder de højeste europæiske standarder.', 'story'),
  ('story.values.community.title', 'Community Focused', 'Samfundsfokuseret', 'story'),
  ('story.values.community.desc', 'We invest in the communities that create our products, ensuring lasting positive impact.', 'Vi investerer i de samfund der skaber vores produkter og sikrer varig positiv indvirkning.', 'story'),
  ('story.values.transparency.title', 'Full Transparency', 'Fuld Gennemsigtighed', 'story'),
  ('story.values.transparency.desc', 'From farm to doorstep, we maintain complete visibility in our supply chain.', 'Fra mark til dørtrin opretholder vi komplet synlighed i vores forsyningskæde.', 'story'),
  ('story.artisans.title', 'Meet Our Artisans', 'Mød Vores Håndværkere', 'story'),
  ('story.artisans.subtitle', 'The skilled hands behind every Ecofy product', 'De dygtige hænder bag hvert Ecofy-produkt', 'story'),
  ('story.artisans.weaver', 'Master Weaver', 'Mestervæver', 'story'),
  ('story.artisans.craftsman', 'Senior Craftsman', 'Senior Håndværker', 'story'),
  ('story.artisans.designer', 'Pattern Designer', 'Mønsterdesigner', 'story'),
  ('story.artisans.years', 'years of experience', 'års erfaring', 'story'),
  ('story.artisans.impact.title', 'Creating Lasting Impact', 'Skaber Varig Indvirkning', 'story'),
  ('story.artisans.impact.description', 'By working directly with artisan families, we ensure 40% higher wages than industry average, provide healthcare support, and fund educational programs for their children. Your purchase directly supports these communities.', 'Ved at arbejde direkte med håndværkerfamilier sikrer vi 40% højere lønninger end branchegennemsnittet, yder sundhedsstøtte og finansierer uddannelsesprogrammer for deres børn. Dit køb støtter direkte disse samfund.', 'story'),
  ('story.certifications.title', 'Certified Excellence', 'Certificeret Excellence', 'story'),
  ('story.certifications.description', 'Our products meet the highest international standards for sustainability, quality, and ethical production.', 'Vores produkter opfylder de højeste internationale standarder for bæredygtighed, kvalitet og etisk produktion.', 'story'),

  -- Sustainability Page
  ('sust.badge', 'Eco-Friendly', 'Miljøvenlig', 'sustainability-page'),
  ('sust.hero.title', 'Sustainability at Our Core', 'Bæredygtighed i Vores Kerne', 'sustainability-page'),
  ('sust.hero.subtitle', 'From seed to shelf, every step of our process is designed to minimize environmental impact while maximizing positive social change.', 'Fra frø til hylde er hvert trin i vores proces designet til at minimere miljøpåvirkningen og samtidig maksimere positiv social forandring.', 'sustainability-page'),
  ('sust.jute.title', 'Why Jute is the Golden Fiber', 'Hvorfor Jute er den Gyldne Fiber', 'sustainability-page'),
  ('sust.jute.subtitle', 'Jute is one of the most environmentally friendly fibers on the planet. Here''s how we harness its potential.', 'Jute er en af de mest miljøvenlige fibre på planeten. Her er hvordan vi udnytter dens potentiale.', 'sustainability-page'),
  ('sust.practices.biodegradable.title', '100% Biodegradable', '100% Bionedbrydelig', 'sustainability-page'),
  ('sust.practices.biodegradable.desc', 'Jute decomposes completely within 2-3 months, leaving no harmful residue in the environment.', 'Jute nedbrydes fuldstændigt inden for 2-3 måneder og efterlader ingen skadelige rester i miljøet.', 'sustainability-page'),
  ('sust.practices.water.title', 'Low Water Usage', 'Lavt Vandforbrug', 'sustainability-page'),
  ('sust.practices.water.desc', 'Jute requires 80% less water than cotton, making it one of the most water-efficient natural fibers.', 'Jute kræver 80% mindre vand end bomuld, hvilket gør det til en af de mest vandeffektive naturlige fibre.', 'sustainability-page'),
  ('sust.practices.carbon.title', 'Carbon Negative', 'Kulstof Negativ', 'sustainability-page'),
  ('sust.practices.carbon.desc', 'Jute plants absorb 15 tonnes of CO2 per hectare during their growth cycle, actively fighting climate change.', 'Juteplanter optager 15 ton CO2 per hektar under deres vækstcyklus og bekæmper aktivt klimaforandringer.', 'sustainability-page'),
  ('sust.practices.waste.title', 'Zero Waste Production', 'Nul Affald Produktion', 'sustainability-page'),
  ('sust.practices.waste.desc', 'Every part of the jute plant is utilized - nothing goes to waste in our production process.', 'Hver del af juteplanten bruges - intet går til spilde i vores produktionsproces.', 'sustainability-page'),
  ('sust.practices.reforestation.title', 'Supports Reforestation', 'Støtter Genplantning', 'sustainability-page'),
  ('sust.practices.reforestation.desc', 'We plant 10 trees for every 100 products sold, contributing to global reforestation efforts.', 'Vi planter 10 træer for hver 100 solgte produkter og bidrager til global genplantning.', 'sustainability-page'),
  ('sust.practices.energy.title', 'Renewable Energy', 'Vedvarende Energi', 'sustainability-page'),
  ('sust.practices.energy.desc', 'Our production facilities run on 100% renewable energy, further reducing our carbon footprint.', 'Vores produktionsfaciliteter kører på 100% vedvarende energi, hvilket yderligere reducerer vores CO2-aftryk.', 'sustainability-page'),
  ('sust.carbon.title', 'Our Carbon Commitment', 'Vores Kulstofforpligtelse', 'sustainability-page'),
  ('sust.carbon.subtitle', 'We''re committed to becoming carbon negative by 2030. Here''s our progress so far.', 'Vi er forpligtet til at blive kulstof-negative inden 2030. Her er vores fremskridt indtil videre.', 'sustainability-page'),
  ('sust.carbon.reduction', 'Less Carbon vs. Plastic', 'Mindre Kulstof vs. Plastik', 'sustainability-page'),
  ('sust.carbon.plastic', 'Single-Use Plastics', 'Engangsplastik', 'sustainability-page'),
  ('sust.carbon.renewable', 'Renewable Energy', 'Vedvarende Energi', 'sustainability-page'),
  ('sust.carbon.trees', 'Trees Planted Monthly', 'Træer Plantet Månedligt', 'sustainability-page'),
  ('sust.carbon.description', 'Through partnerships with certified carbon offset programs and our own reforestation initiatives, we''re not just reducing our impact - we''re actively healing the planet. Every product you purchase contributes to this mission.', 'Gennem partnerskaber med certificerede kulstofkompensationsprogrammer og vores egne genplantningsinitiativer reducerer vi ikke bare vores påvirkning - vi helbreder aktivt planeten. Hvert produkt du køber bidrager til denne mission.', 'sustainability-page'),
  ('sust.cert.title', 'Certifications & Standards', 'Certificeringer & Standarder', 'sustainability-page'),
  ('sust.cert.subtitle', 'Our commitment to sustainability is verified by leading international organizations.', 'Vores engagement i bæredygtighed er verificeret af førende internationale organisationer.', 'sustainability-page'),
  ('sust.cert.oeko', 'Tested for harmful substances. Guarantees product safety for human health and environmental safety.', 'Testet for skadelige stoffer. Garanterer produktsikkerhed for menneskers helbred og miljøsikkerhed.', 'sustainability-page'),
  ('sust.cert.fairtrade', 'Ensures fair wages, safe working conditions, and sustainable practices for all workers.', 'Sikrer fair løn, sikre arbejdsforhold og bæredygtige praksisser for alle arbejdere.', 'sustainability-page'),
  ('sust.cert.iso', 'International standard for effective environmental management systems.', 'International standard for effektive miljøledelsessystemer.', 'sustainability-page'),
  ('sust.cert.gots', 'Global Organic Textile Standard certification for organic fiber processing.', 'Global Organic Textile Standard-certificering for økologisk fiberforarbejdning.', 'sustainability-page'),
  ('sust.sdg.title', 'UN Sustainable Development Goals', 'FN''s Verdensmål for Bæredygtig Udvikling', 'sustainability-page'),
  ('sust.sdg.subtitle', 'Our work contributes directly to four key UN Sustainable Development Goals.', 'Vores arbejde bidrager direkte til fire centrale FN Verdensmål.', 'sustainability-page'),
  ('sust.sdg.8', 'Decent Work & Economic Growth', 'Anstændige Jobs & Økonomisk Vækst', 'sustainability-page'),
  ('sust.sdg.12', 'Responsible Consumption & Production', 'Ansvarligt Forbrug & Produktion', 'sustainability-page'),
  ('sust.sdg.13', 'Climate Action', 'Klimaindsats', 'sustainability-page'),
  ('sust.sdg.15', 'Life on Land', 'Livet på Land', 'sustainability-page'),
  ('sust.supply.title', 'Transparent Supply Chain', 'Gennemsigtig Forsyningskæde', 'sustainability-page'),
  ('sust.supply.description', 'We maintain complete visibility from farm to finished product. Our supply chain is designed for traceability, fairness, and minimal environmental impact.', 'Vi opretholder komplet synlighed fra mark til færdigt produkt. Vores forsyningskæde er designet til sporbarhed, retfærdighed og minimal miljøpåvirkning.', 'sustainability-page'),
  ('sust.supply.step1', 'Organic jute farming in Bangladesh', 'Økologisk jutedyrkning i Bangladesh', 'sustainability-page'),
  ('sust.supply.step2', 'Fair-wage processing facilities', 'Fair-løn forarbejdningsfaciliteter', 'sustainability-page'),
  ('sust.supply.step3', 'Eco-friendly packaging & shipping', 'Miljøvenlig emballage & forsendelse', 'sustainability-page'),
  ('sust.supply.step4', 'Direct delivery to European markets', 'Direkte levering til europæiske markeder', 'sustainability-page'),
  ('sust.supply.impact.title', 'From Farm to You', 'Fra Mark til Dig', 'sustainability-page'),
  ('sust.supply.impact.desc', 'Every product can be traced back to the artisan who made it.', 'Hvert produkt kan spores tilbage til håndværkeren der lavede det.', 'sustainability-page'),
  ('sust.cta.title', 'Join Our Sustainable Journey', 'Deltag i Vores Bæredygtige Rejse', 'sustainability-page'),
  ('sust.cta.subtitle', 'Choose products that are good for you and the planet.', 'Vælg produkter der er gode for dig og planeten.', 'sustainability-page'),
  ('sust.cta.products', 'Explore Products', 'Udforsk Produkter', 'sustainability-page'),
  ('sust.cta.contact', 'Partner With Us', 'Bliv Partner', 'sustainability-page'),

  -- Journal
  ('journal.badge', 'Blog', 'Blog', 'journal'),
  ('journal.title', 'Our Journal', 'Vores Journal', 'journal'),
  ('journal.subtitle', 'Stories, insights, and updates from the world of sustainable jute craftsmanship.', 'Historier, indsigt og opdateringer fra verden af bæredygtigt jute-håndværk.', 'journal'),
  ('journal.filter.all', 'All Posts', 'Alle Indlæg', 'journal'),
  ('journal.read-more', 'Read More', 'Læs Mere', 'journal'),
  ('journal.back', 'Back to Journal', 'Tilbage til Journal', 'journal'),
  ('journal.empty.title', 'No Posts Yet', 'Ingen Indlæg Endnu', 'journal'),
  ('journal.empty.description', 'We''re working on sharing our stories. Check back soon!', 'Vi arbejder på at dele vores historier. Kom tilbage snart!', 'journal'),
  ('journal.notfound.title', 'Post Not Found', 'Indlæg Ikke Fundet', 'journal'),
  ('journal.notfound.description', 'The article you''re looking for doesn''t exist or has been removed.', 'Artiklen du leder efter eksisterer ikke eller er blevet fjernet.', 'journal'),
  ('journal.related', 'Related Posts', 'Relaterede Indlæg', 'journal'),
  ('journal.readingTime', 'min read', 'min læsning', 'journal'),
  ('journal.toc.title', 'Table of Contents', 'Indholdsfortegnelse', 'journal');
