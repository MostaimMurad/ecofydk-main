
-- ==============================================
-- Phase 1-3: Complete CMS Dynamic Content Tables
-- ==============================================

-- 1. TESTIMONIALS TABLE
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  text_en TEXT NOT NULL,
  text_da TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are publicly readable" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create testimonials" ON public.testimonials FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed testimonials
INSERT INTO public.testimonials (name, company, role, text_en, text_da, rating, image_url, sort_order) VALUES
('Lars Jensen', 'GreenMart Copenhagen', 'Sustainability Director', 'Ecofy has been our trusted supplier for sustainable packaging. The quality of their jute bags is exceptional, and our customers love the eco-friendly approach.', 'Ecofy har været vores betroede leverandør af bæredygtig emballage. Kvaliteten af deres jutetasker er enestående, og vores kunder elsker den miljøvenlige tilgang.', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 1),
('Emma Sørensen', 'Nordic Home Design', 'Creative Director', 'The decorative jute products from Ecofy have been a hit in our stores. Beautiful craftsmanship and a great story behind each product.', 'De dekorative juteprodukter fra Ecofy har været et hit i vores butikker. Smukt håndværk og en fantastisk historie bag hvert produkt.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 2),
('Mikkel Andersen', 'Organic Farms EU', 'Operations Manager', 'We switched to Ecofy''s jute sacks for our grain packaging. Not only are they biodegradable, but they''re also incredibly durable. Highly recommended!', 'Vi skiftede til Ecofys jutesække til vores kornemballage. De er ikke kun bionedbrydelige, men også utroligt holdbare. Stærkt anbefalet!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 3);


-- 2. FAQS TABLE
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_da TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_da TEXT NOT NULL,
  icon TEXT DEFAULT '🌱',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are publicly readable" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create faqs" ON public.faqs FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed FAQs
INSERT INTO public.faqs (question_en, question_da, answer_en, answer_da, icon, sort_order) VALUES
('What makes jute a sustainable material?', 'Hvad gør jute til et bæredygtigt materiale?', 'Jute is 100% biodegradable and compostable. It grows quickly without pesticides, absorbs CO2 during growth, and requires minimal water compared to other natural fibers. Each hectare of jute plants absorbs about 15 tonnes of CO2 from the atmosphere.', 'Jute er 100% bionedbrydeligt og komposterbart. Det vokser hurtigt uden pesticider, absorberer CO2 under væksten og kræver minimal vand sammenlignet med andre naturlige fibre. Hver hektar juteplanter absorberer omkring 15 tons CO2 fra atmosfæren.', '🌱', 1),
('What are the minimum order quantities?', 'Hvad er minimum ordremængderne?', 'Our minimum order quantity varies by product type. For standard jute bags, the MOQ is typically 500 units. For customized products with branding, we recommend 1,000+ units for the best pricing. Contact us for specific product MOQs.', 'Vores minimum ordremængde varierer efter produkttype. For standard jutetasker er MOQ typisk 500 enheder. For tilpassede produkter med branding anbefaler vi 1.000+ enheder for den bedste pris. Kontakt os for specifikke produkt-MOQ''er.', '📦', 2),
('Do you ship internationally?', 'Sender I internationalt?', 'Yes! We ship to all EU countries and beyond. Our main logistics hub is in Copenhagen, Denmark, ensuring fast delivery within Europe. For international orders outside EU, we offer competitive shipping rates through our global logistics partners.', 'Ja! Vi sender til alle EU-lande og videre. Vores vigtigste logistikhub er i København, Danmark, hvilket sikrer hurtig levering inden for Europa. For internationale ordrer uden for EU tilbyder vi konkurrencedygtige fragtpriser gennem vores globale logistikpartnere.', '🌍', 3),
('Can you do custom branding on products?', 'Kan I lave brugerdefineret branding på produkter?', 'Absolutely! We offer full custom branding services including screen printing, embroidery, and custom labels. Our design team works closely with you to create products that perfectly represent your brand while maintaining our eco-friendly standards.', 'Absolut! Vi tilbyder fulde brugerdefinerede branding-tjenester inklusiv serigrafi, broderi og brugerdefinerede etiketter. Vores designteam arbejder tæt sammen med dig for at skabe produkter, der perfekt repræsenterer dit brand, mens vi opretholder vores miljøvenlige standarder.', '✨', 4),
('How do you ensure fair trade practices?', 'Hvordan sikrer I fair trade praksis?', 'We work directly with artisan cooperatives in Bangladesh, ensuring fair wages, safe working conditions, and community development. Our supply chain is transparent and audited regularly. We provide health benefits, education support, and skill development programs.', 'Vi arbejder direkte med håndværkerkooperativer i Bangladesh og sikrer retfærdige lønninger, sikre arbejdsforhold og samfundsudvikling. Vores forsyningskæde er gennemsigtig og revideres regelmæssigt. Vi tilbyder sundhedsydelser, uddannelsesstøtte og kompetenceudviklingsprogrammer.', '🤝', 5),
('What is the lifespan of jute products?', 'Hvad er levetiden for juteprodukter?', 'Our jute products are designed for durability. With proper care, jute bags and accessories can last 3-5 years of regular use. When they do reach end of life, they naturally decompose within 1-2 years, returning nutrients to the soil.', 'Vores juteprodukter er designet til holdbarhed. Med ordentlig pleje kan jutetasker og tilbehør holde 3-5 år ved regelmæssig brug. Når de når slutningen af deres levetid, nedbrydes de naturligt inden for 1-2 år og returnerer næringsstoffer til jorden.', '💚', 6);


-- 3. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));


-- 4. OFFICE LOCATIONS TABLE
CREATE TABLE public.office_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_da TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'office',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT DEFAULT '🏳️',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offices are publicly readable" ON public.office_locations FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create offices" ON public.office_locations FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update offices" ON public.office_locations FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete offices" ON public.office_locations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_office_locations_updated_at BEFORE UPDATE ON public.office_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed offices
INSERT INTO public.office_locations (name_en, name_da, type, address, city, country, flag, lat, lng, sort_order) VALUES
('Copenhagen HQ', 'København HQ', 'hq', 'Nørrebrogade 45, 2200', 'Copenhagen', 'Denmark', '🇩🇰', 55.6867, 12.5561, 1),
('Bangladesh Office', 'Bangladesh Kontor', 'office', 'Gulshan Avenue, Dhaka 1212', 'Dhaka', 'Bangladesh', '🇧🇩', 23.7806, 90.4193, 2);


-- 5. TIMELINE EVENTS TABLE
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_da TEXT NOT NULL,
  description_en TEXT,
  description_da TEXT,
  color TEXT DEFAULT 'from-primary to-emerald-600',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timeline events are publicly readable" ON public.timeline_events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create timeline events" ON public.timeline_events FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update timeline events" ON public.timeline_events FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete timeline events" ON public.timeline_events FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 6. TEAM MEMBERS TABLE
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_da TEXT NOT NULL,
  bio_en TEXT,
  bio_da TEXT,
  image_url TEXT,
  years_experience INTEGER DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are publicly readable" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create team members" ON public.team_members FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update team members" ON public.team_members FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete team members" ON public.team_members FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 7. CONTENT BLOCKS TABLE (Generic CMS for all remaining content)
CREATE TABLE public.content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  block_key TEXT NOT NULL,
  title_en TEXT,
  title_da TEXT,
  description_en TEXT,
  description_da TEXT,
  value TEXT,
  icon TEXT,
  color TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, block_key)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content blocks are publicly readable" ON public.content_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can create content blocks" ON public.content_blocks FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update content blocks" ON public.content_blocks FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete content blocks" ON public.content_blocks FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for fast section lookups
CREATE INDEX idx_content_blocks_section ON public.content_blocks(section);

-- ==============================================
-- SEED CONTENT BLOCKS DATA
-- ==============================================

-- About Section Stats
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, icon, sort_order) VALUES
('about_stats', 'years', 'Years of Excellence', 'År med Excellence', '5+', 'Award', 1),
('about_stats', 'artisans', 'Artisans Supported', 'Understøttede Håndværkere', '500+', 'Users', 2),
('about_stats', 'countries', 'Countries Reached', 'Lande Nået', '15+', 'Globe', 3);

-- About Section Features
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, sort_order) VALUES
('about_features', 'feature_1', 'Bridging Bangladeshi craftsmanship with European markets', 'Forbinder bangladeshisk håndværk med europæiske markeder', 1),
('about_features', 'feature_2', 'Supporting local artisans with fair trade practices', 'Støtter lokale håndværkere med fair trade praksis', 2),
('about_features', 'feature_3', 'Preserving traditional techniques for future generations', 'Bevarer traditionelle teknikker for fremtidige generationer', 3);

-- About Section Image
INSERT INTO public.content_blocks (section, block_key, image_url, sort_order) VALUES
('about', 'main_image', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop', 1);

-- Hero Stats
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, sort_order) VALUES
('hero_stats', 'products', 'Products', 'Produkter', '50+', 1),
('hero_stats', 'sustainable', 'Sustainable', 'Bæredygtig', '100%', 2),
('hero_stats', 'clients', 'Happy Clients', 'Glade Kunder', '500+', 3);

-- Hero Badge & Since
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, sort_order) VALUES
('hero', 'badge', 'Premium Sustainable Jute', 'Premium Bæredygtig Jute', NULL, 1),
('hero', 'since', 'Since 2020', 'Siden 2020', '2020', 2);

-- Sustainability Highlights
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, description_en, description_da, icon, color, sort_order) VALUES
('sustainability_highlights', 'eco', 'Eco-Friendly Materials', 'Miljøvenlige Materialer', 'All our products are made from 100% natural jute fiber, completely biodegradable and compostable.', 'Alle vores produkter er lavet af 100% naturlig jutefiber, fuldstændigt bionedbrydeligt og komposterbart.', 'Leaf', 'from-green-500/20 to-emerald-500/20', 1),
('sustainability_highlights', 'artisan', 'Artisan Empowerment', 'Håndværker Empowerment', 'We work directly with artisan communities in Bangladesh, ensuring fair wages and sustainable livelihoods.', 'Vi arbejder direkte med håndværkersamfund i Bangladesh og sikrer retfærdige lønninger og bæredygtige levebrød.', 'Users', 'from-amber-500/20 to-orange-500/20', 2),
('sustainability_highlights', 'zero', 'Zero Waste Production', 'Nul Affald Produktion', 'Our production process is designed to minimize waste. Any jute remnants are recycled or composted.', 'Vores produktionsproces er designet til at minimere affald. Alle juterester genanvendes eller komposteres.', 'Recycle', 'from-blue-500/20 to-cyan-500/20', 3);

-- Sustainability Highlight Stats
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, icon, sort_order) VALUES
('sustainability_stats', 'biodegradable', 'Biodegradable', 'Bionedbrydelig', '100%', 'Heart', 1),
('sustainability_stats', 'artisan_partners', 'Artisan Partners', 'Håndværker Partnere', '50+', 'Globe', 2),
('sustainability_stats', 'carbon', 'Carbon Footprint', 'CO2-aftryk', '0', 'Award', 3);

-- Our Story Stats
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, icon, sort_order) VALUES
('story_stats', 'artisans', 'Artisans Empowered', 'Håndværkere Styrket', '500+', 'Users', 1),
('story_stats', 'products', 'Products Crafted', 'Produkter Skabt', '50+', 'Leaf', 2),
('story_stats', 'countries', 'Countries Served', 'Lande Betjent', '15+', 'Globe', 3),
('story_stats', 'sustainable', 'Sustainable Materials', 'Bæredygtige Materialer', '100%', 'Heart', 4);

-- Footer Certifications
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, color, sort_order) VALUES
('footer_certifications', 'iso', 'ISO 14001', 'ISO 14001', 'bg-emerald-500/20 text-emerald-300', 1),
('footer_certifications', 'fairtrade', 'Fair Trade', 'Fair Trade', 'bg-amber-500/20 text-amber-300', 2),
('footer_certifications', 'gots', 'GOTS', 'GOTS', 'bg-sky-500/20 text-sky-300', 3),
('footer_certifications', 'oekotex', 'OEKO-TEX', 'OEKO-TEX', 'bg-purple-500/20 text-purple-300', 4);

-- Carbon Stats (Sustainability page)
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, icon, sort_order) VALUES
('carbon_stats', 'reduction', 'CO2 Reduction', 'CO2 Reduktion', '85%', 'Wind', 1),
('carbon_stats', 'plastic', 'Plastic Used', 'Plastik Brugt', '0', 'Recycle', 2),
('carbon_stats', 'renewable', 'Renewable Energy', 'Vedvarende Energi', '100%', 'Leaf', 3),
('carbon_stats', 'trees', 'Trees Planted', 'Træer Plantet', '50+', 'TreePine', 4);

-- Certifications (Sustainability page)
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, description_en, description_da, icon, color, sort_order) VALUES
('certifications', 'oekotex', 'OEKO-TEX Standard 100', 'OEKO-TEX Standard 100', 'Tested for harmful substances - safe for human use', 'Testet for skadelige stoffer - sikkert til menneskelig brug', 'Shield', 'from-blue-500 to-cyan-600', 1),
('certifications', 'fairtrade', 'Fair Trade Certified', 'Fair Trade Certificeret', 'Ensuring fair wages and ethical working conditions', 'Sikrer retfærdige lønninger og etiske arbejdsforhold', 'Award', 'from-amber-500 to-orange-600', 2),
('certifications', 'iso', 'ISO 14001', 'ISO 14001', 'Environmental management system certified', 'Miljøledelsessystem certificeret', 'CheckCircle', 'from-purple-500 to-violet-600', 3),
('certifications', 'gots', 'GOTS Certified', 'GOTS Certificeret', 'Global Organic Textile Standard compliant', 'Overholder Global Organic Textile Standard', 'Leaf', 'from-emerald-500 to-green-600', 4);

-- SDG Goals
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, value, color, sort_order) VALUES
('sdg_goals', 'sdg8', 'Decent Work & Economic Growth', 'Anstændigt Arbejde & Økonomisk Vækst', '8', 'bg-red-500', 1),
('sdg_goals', 'sdg12', 'Responsible Consumption & Production', 'Ansvarligt Forbrug & Produktion', '12', 'bg-amber-600', 2),
('sdg_goals', 'sdg13', 'Climate Action', 'Klimaindsats', '13', 'bg-green-600', 3),
('sdg_goals', 'sdg15', 'Life on Land', 'Livet på Land', '15', 'bg-emerald-500', 4);

-- Sustainability Practices
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, description_en, description_da, icon, color, sort_order) VALUES
('sustainability_practices', 'biodegradable', 'Biodegradable Products', 'Bionedbrydelige Produkter', 'Every product we create returns to nature within 1-2 years.', 'Hvert produkt vi skaber vender tilbage til naturen inden for 1-2 år.', 'Leaf', 'from-emerald-500 to-green-600', 1),
('sustainability_practices', 'water', 'Water Conservation', 'Vandbeskyttelse', 'Jute requires 80% less water than cotton production.', 'Jute kræver 80% mindre vand end bomuldsproduktion.', 'Droplets', 'from-blue-500 to-cyan-600', 2),
('sustainability_practices', 'carbon', 'Carbon Negative', 'Kulstof Negativ', 'Jute absorbs more CO2 than it emits during production.', 'Jute absorberer mere CO2 end det udleder under produktion.', 'Wind', 'from-sky-500 to-blue-600', 3),
('sustainability_practices', 'waste', 'Zero Waste', 'Nul Affald', 'All production waste is recycled or composted.', 'Alt produktionsaffald genanvendes eller komposteres.', 'Recycle', 'from-amber-500 to-orange-600', 4),
('sustainability_practices', 'reforestation', 'Reforestation Support', 'Skovrejsningsstøtte', 'We plant trees for every 100 products sold.', 'Vi planter træer for hver 100 solgte produkter.', 'TreePine', 'from-green-500 to-emerald-600', 5),
('sustainability_practices', 'energy', 'Clean Energy', 'Ren Energi', 'Our facilities run on renewable energy sources.', 'Vores faciliteter kører på vedvarende energikilder.', 'Factory', 'from-purple-500 to-violet-600', 6);

-- Newsletter trust indicators
INSERT INTO public.content_blocks (section, block_key, title_en, title_da, icon, sort_order) VALUES
('newsletter_trust', 'no_spam', 'No spam, ever', 'Aldrig spam', 'CheckCircle', 1),
('newsletter_trust', 'unsubscribe', 'Unsubscribe anytime', 'Afmeld når som helst', 'CheckCircle', 2),
('newsletter_trust', 'weekly', 'Weekly updates', 'Ugentlige opdateringer', 'CheckCircle', 3);

-- Contact page WhatsApp
INSERT INTO public.content_blocks (section, block_key, value, sort_order) VALUES
('contact', 'whatsapp_number', '+4520123456', 1),
('contact', 'business_hours_en', 'Mon - Fri: 9:00 AM - 5:00 PM (CET)', 2),
('contact', 'business_hours_da', 'Man - Fre: 9:00 - 17:00 (CET)', 3);

-- Seed timeline events
INSERT INTO public.timeline_events (year, title_en, title_da, color, sort_order) VALUES
('2018', 'Founded in Copenhagen with a vision to bring sustainable jute products to the Nordic market.', 'Grundlagt i København med en vision om at bringe bæredygtige juteprodukter til det nordiske marked.', 'from-emerald-500 to-green-600', 1),
('2019', 'Established direct partnerships with artisan cooperatives in Bangladesh.', 'Etablerede direkte partnerskaber med håndværkerkooperativer i Bangladesh.', 'from-blue-500 to-cyan-600', 2),
('2021', 'Expanded product line to over 50 products, serving businesses across Europe.', 'Udvidede produktlinjen til over 50 produkter og betjener virksomheder i hele Europa.', 'from-amber-500 to-orange-600', 3),
('2023', 'Reached 500+ artisan partnerships and launched our zero-waste initiative.', 'Nåede 500+ håndværkerpartnerskaber og lancerede vores nul-affald initiativ.', 'from-purple-500 to-violet-600', 4),
('2024', 'Continuing our mission to make sustainable jute products accessible worldwide.', 'Fortsætter vores mission med at gøre bæredygtige juteprodukter tilgængelige på verdensplan.', 'from-primary to-emerald-600', 5);

-- Seed team members (artisans)
INSERT INTO public.team_members (name, role_en, role_da, image_url, years_experience, sort_order) VALUES
('Fatima Begum', 'Master Weaver', 'Mestervæver', '/src/assets/artisan-fatima.jpg', 15, 1),
('Karim Mia', 'Senior Craftsman', 'Senior Håndværker', '/src/assets/artisan-karim.jpg', 20, 2),
('Rashida Khatun', 'Pattern Designer', 'Mønsterdesigner', '/src/assets/artisan-rashida.jpg', 8, 3);
