-- Create product categories table
CREATE TABLE public.product_categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_da TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.product_categories (id, name_en, name_da) VALUES
  ('bags', 'Bags', 'Tasker'),
  ('sacks', 'Sacks', 'Sække'),
  ('decor', 'Home Décor', 'Boligindretning'),
  ('rope', 'Rope & Twine', 'Reb & Snor');

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category_id TEXT NOT NULL REFERENCES public.product_categories(id),
  name_en TEXT NOT NULL,
  name_da TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_da TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  spec_size TEXT,
  spec_weight TEXT,
  spec_material TEXT,
  use_cases_en JSONB DEFAULT '[]'::jsonb,
  use_cases_da JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster filtering
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (showcase website)
CREATE POLICY "Categories are publicly readable"
  ON public.product_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Active products are publicly readable"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (slug, category_id, name_en, name_da, description_en, description_da, image_url, gallery, spec_size, spec_weight, spec_material, use_cases_en, use_cases_da, featured, sort_order) VALUES
  ('jute-tote-bag', 'bags', 'Premium Jute Tote Bag', 'Premium Jute Taske', 
   'Handcrafted jute tote bag with reinforced handles, perfect for everyday shopping and carrying essentials sustainably.',
   'Håndlavet jute taske med forstærkede håndtag, perfekt til daglig indkøb og bæredygtig transport af dine ting.',
   'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop"]',
   '40 x 35 x 12 cm', '250g', '100% Natural Jute',
   '["Grocery shopping", "Beach trips", "Daily commute", "Gift packaging"]',
   '["Dagligvareindkøb", "Strandture", "Daglig pendling", "Gaveemballage"]',
   true, 1),
  
  ('burlap-sack-50kg', 'sacks', 'Industrial Burlap Sack 50kg', 'Industriel Sæk 50kg',
   'Heavy-duty jute sack designed for agricultural and industrial use. Perfect for storing grains, coffee beans, and produce.',
   'Kraftig jutesæk designet til landbrugs- og industriel brug. Perfekt til opbevaring af korn, kaffebønner og afgrøder.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop"]',
   '100 x 60 cm', '500g', 'Heavy-duty Jute Fiber',
   '["Agricultural storage", "Coffee bean packaging", "Rice storage", "Bulk goods"]',
   '["Landbrugsopbevaring", "Kaffebønneemballage", "Risopbevaring", "Bulkvarer"]',
   true, 2),
  
  ('jute-planter-basket', 'decor', 'Jute Planter Basket', 'Jute Plantekurv',
   'Beautiful handwoven jute basket perfect for indoor plants. Adds natural warmth to any room while being completely eco-friendly.',
   'Smuk håndvævet jutekurv perfekt til indendørs planter. Tilføjer naturlig varme til ethvert rum og er helt miljøvenlig.',
   'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop"]',
   '25 x 25 x 30 cm', '180g', 'Handwoven Natural Jute',
   '["Indoor plants", "Storage basket", "Home décor", "Gift item"]',
   '["Indendørs planter", "Opbevaringskurv", "Boligindretning", "Gaveartikel"]',
   true, 3),
  
  ('natural-jute-rope', 'rope', 'Natural Jute Rope 6mm', 'Naturlig Jute Reb 6mm',
   'Premium quality natural jute rope, ideal for crafts, gardening, and decorative purposes. Strong and biodegradable.',
   'Premium kvalitet naturligt jutereb, ideel til håndværk, havearbejde og dekorative formål. Stærkt og bionedbrydelig.',
   'https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=800&h=800&fit=crop"]',
   '6mm diameter x 50m', '1.2kg', '100% Natural Jute Fiber',
   '["Gardening", "DIY crafts", "Packaging", "Home décor projects"]',
   '["Havearbejde", "DIY håndværk", "Emballage", "Boligindretningsprojekter"]',
   false, 4),
  
  ('shopping-bag-printed', 'bags', 'Printed Jute Shopping Bag', 'Trykt Jute Indkøbstaske',
   'Stylish printed jute shopping bag with custom branding options. Perfect for retail stores and promotional events.',
   'Stilfuld trykt jute indkøbstaske med brugerdefinerede brandingmuligheder. Perfekt til detailbutikker og salgsfremmende arrangementer.',
   'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=800&h=800&fit=crop"]',
   '35 x 30 x 15 cm', '200g', 'Natural Jute with Laminated Interior',
   '["Retail bags", "Corporate gifts", "Trade shows", "Sustainable branding"]',
   '["Detailtasker", "Virksomhedsgaver", "Messer", "Bæredygtig branding"]',
   false, 5),
  
  ('cocoa-bag-70kg', 'sacks', 'Cocoa Bean Sack 70kg', 'Kakaobønne Sæk 70kg',
   'Specialized jute sack for cocoa bean storage and transport. Breathable fabric maintains product quality.',
   'Specialiseret jutesæk til opbevaring og transport af kakaobønner. Åndbar stof opretholder produktkvaliteten.',
   'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop"]',
   '110 x 70 cm', '600g', 'Premium Breathable Jute',
   '["Cocoa storage", "Coffee export", "Grain storage", "Agricultural use"]',
   '["Kakaoopbevaring", "Kaffeeksport", "Kornopbevaring", "Landbrugsbrug"]',
   false, 6),
  
  ('jute-wall-hanging', 'decor', 'Macramé Jute Wall Hanging', 'Makramé Jute Vægdekoration',
   'Handcrafted macramé wall hanging made from natural jute. A beautiful bohemian addition to any living space.',
   'Håndlavet makramé vægdekoration lavet af naturlig jute. En smuk boheme tilføjelse til ethvert opholdsrum.',
   'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop"]',
   '60 x 80 cm', '350g', 'Natural Jute Macramé',
   '["Wall décor", "Living room accent", "Bedroom styling", "Gift item"]',
   '["Vægdekoration", "Stueaccent", "Soveværelsesstyling", "Gaveartikel"]',
   false, 7),
  
  ('garden-twine', 'rope', 'Biodegradable Garden Twine', 'Bionedbrydelig Havesnor',
   'Eco-friendly garden twine perfect for tying plants and garden tasks. Completely biodegradable and compostable.',
   'Miljøvenlig havesnor perfekt til at binde planter og haveopgaver. Fuldstændig bionedbrydelig og kompostérbar.',
   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
   '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop"]',
   '3mm diameter x 100m', '400g', '100% Natural Jute',
   '["Plant support", "Garden projects", "Craft projects", "Sustainable packaging"]',
   '["Plantestøtte", "Haveprojekter", "Håndværksprojekter", "Bæredygtig emballage"]',
   false, 8);