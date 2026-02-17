-- ============================================
-- Migration: 20260126113204_ec244ed2-64f4-4961-9896-c82287c3c690.sql
-- ============================================

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

-- ============================================
-- Migration: 20260126114156_fc879173-0abb-4e61-92a1-920af17e7883.sql
-- ============================================

-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create quotation requests table
CREATE TABLE public.quotation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_da TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_da TEXT,
  content_en TEXT NOT NULL,
  content_da TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_quotation_requests_status ON public.quotation_requests(status);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'editor')
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Quotation requests policies
CREATE POLICY "Anyone can create quotation requests"
  ON public.quotation_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view quotation requests"
  ON public.quotation_requests FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update quotation requests"
  ON public.quotation_requests FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete quotation requests"
  ON public.quotation_requests FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts policies
CREATE POLICY "Published posts are publicly readable"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all posts"
  ON public.blog_posts FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Products write policies for admins
CREATE POLICY "Admins can create products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotation_requests_updated_at
  BEFORE UPDATE ON public.quotation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

-- Storage policies for blog images
CREATE POLICY "Blog images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Migration: 20260126132018_c3c75fcc-c665-4f5e-8d2c-219da17fcd58.sql
-- ============================================

-- Insert test blog post with cover image and category
INSERT INTO public.blog_posts (
  slug,
  title_en,
  title_da,
  excerpt_en,
  excerpt_da,
  content_en,
  content_da,
  category,
  cover_image,
  is_published,
  published_at
) VALUES (
  'the-art-of-jute-craftsmanship',
  'The Art of Jute Craftsmanship: A Journey from Bangladesh to Europe',
  'Jute-håndværkets kunst: En rejse fra Bangladesh til Europa',
  'Discover the centuries-old tradition of jute weaving and how our artisans transform golden fibers into sustainable products that reach homes across Europe.',
  'Oplev den århundreder gamle tradition med jute-vævning og hvordan vores håndværkere forvandler gyldne fibre til bæredygtige produkter, der når hjem i hele Europa.',
  '<h2>The Golden Fiber</h2>
<p>Jute, often called the "golden fiber," has been cultivated in the fertile lands of Bangladesh for centuries. This remarkable natural fiber is not just environmentally friendly—it carries with it a rich heritage of craftsmanship passed down through generations.</p>

<h2>Our Artisan Community</h2>
<p>At Ecofy, we work directly with over 200 skilled artisans in rural Bangladesh. These master craftspeople bring decades of experience to every product they create. From weaving intricate patterns to crafting durable bags and home décor items, their expertise is unmatched.</p>

<h2>Sustainable by Nature</h2>
<p>Unlike synthetic materials, jute is 100% biodegradable. It decomposes naturally within months, leaving no harmful residue. During its growth, jute plants absorb significant amounts of CO2, making it a carbon-negative crop.</p>

<h3>Key Benefits of Jute:</h3>
<ul>
<li>Biodegrades in 2-3 months</li>
<li>Requires 80% less water than cotton</li>
<li>Absorbs 15 tonnes of CO2 per hectare</li>
<li>Supports rural livelihoods</li>
</ul>

<h2>From Farm to Your Home</h2>
<p>Every Ecofy product travels from the jute fields of Bangladesh to your doorstep in Europe. We ensure complete transparency in our supply chain, fair wages for our artisans, and minimal environmental impact throughout the journey.</p>

<p>When you choose an Ecofy product, you''re not just buying a bag or a decorative piece—you''re supporting sustainable practices and empowering communities.</p>',
  '<h2>Den Gyldne Fiber</h2>
<p>Jute, ofte kaldet den "gyldne fiber," har været dyrket i Bangladeshs frugtbare jord i århundreder. Denne bemærkelsesværdige naturlige fiber er ikke kun miljøvenlig—den bærer en rig arv af håndværk videregivet gennem generationer.</p>

<h2>Vores Håndværkersamfund</h2>
<p>Hos Ecofy arbejder vi direkte med over 200 dygtige håndværkere i landdistrikterne i Bangladesh. Disse mesterhåndværkere bringer årtiers erfaring til hvert produkt, de skaber. Fra at væve indviklede mønstre til at lave holdbare tasker og boligindretningsartikler er deres ekspertise uovertruffen.</p>

<h2>Bæredygtig af Natur</h2>
<p>I modsætning til syntetiske materialer er jute 100% bionedbrydelig. Det nedbrydes naturligt inden for måneder uden at efterlade skadelige rester. Under sin vækst optager juteplanter betydelige mængder CO2, hvilket gør det til en kulstofnegativ afgrøde.</p>

<h3>Vigtigste Fordele ved Jute:</h3>
<ul>
<li>Nedbrydes på 2-3 måneder</li>
<li>Kræver 80% mindre vand end bomuld</li>
<li>Optager 15 ton CO2 per hektar</li>
<li>Støtter landdistrikters levebrød</li>
</ul>

<h2>Fra Mark til Dit Hjem</h2>
<p>Hvert Ecofy-produkt rejser fra jutemarkerne i Bangladesh til din dør i Europa. Vi sikrer fuldstændig gennemsigtighed i vores forsyningskæde, fair lønninger til vores håndværkere og minimal miljøpåvirkning gennem hele rejsen.</p>

<p>Når du vælger et Ecofy-produkt, køber du ikke bare en taske eller en dekorativ genstand—du støtter bæredygtige praksisser og styrker lokalsamfund.</p>',
  'Sustainability',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  true,
  NOW()
);

-- ============================================
-- Migration: 20260126132508_6cadd5d9-35fa-4a9c-b208-f5c037b12ce1.sql
-- ============================================

-- Insert additional test blog posts with different categories
INSERT INTO public.blog_posts (slug, title_en, title_da, excerpt_en, excerpt_da, content_en, content_da, category, cover_image, is_published, published_at) VALUES 
(
  'meet-our-master-weaver-fatima',
  'Meet Our Master Weaver: Fatima''s Story of 30 Years in Jute Craftsmanship',
  'Mød vores mestervæver: Fatimas historie om 30 år i jute-håndværk',
  'Fatima has been weaving jute for three decades. Her story represents the heart and soul of Ecofy''s artisan community.',
  'Fatima har vævet jute i tre årtier. Hendes historie repræsenterer hjertet og sjælen i Ecofys håndværkersamfund.',
  '<h2>A Legacy of Craftsmanship</h2>
<p>In a small village in northern Bangladesh, Fatima begins her day at sunrise. For 30 years, her skilled hands have transformed raw jute fibers into beautiful, functional products that now reach homes across Europe.</p>

<h2>Learning the Craft</h2>
<p>"My mother taught me to weave when I was just 12 years old," Fatima recalls with a warm smile. "Back then, we made simple mats and ropes. Today, I create intricate patterns for bags, baskets, and home décor that people in Denmark and Germany use every day."</p>

<h2>The Ecofy Partnership</h2>
<p>When Ecofy first visited Fatima''s village in 2019, it marked a turning point for the entire community. "Before Ecofy, we sold our products at local markets for very little money. Now, we receive fair wages, and our children can go to school."</p>

<h3>Impact on the Community:</h3>
<ul>
<li>40% higher wages than industry average</li>
<li>Healthcare support for all artisan families</li>
<li>Educational scholarships for children</li>
<li>Safe and comfortable working conditions</li>
</ul>

<h2>Preserving Tradition</h2>
<p>Fatima now trains younger women in her village, passing down techniques that have been refined over generations. "Every stitch carries our heritage," she says. "When someone in Europe holds our product, they''re holding a piece of Bangladesh."</p>',
  '<h2>En arv af håndværk</h2>
<p>I en lille landsby i det nordlige Bangladesh begynder Fatima sin dag ved solopgang. I 30 år har hendes dygtige hænder forvandlet rå jutefibre til smukke, funktionelle produkter, der nu når hjem i hele Europa.</p>

<h2>At lære håndværket</h2>
<p>"Min mor lærte mig at væve, da jeg kun var 12 år gammel," husker Fatima med et varmt smil. "Dengang lavede vi simple måtter og reb. I dag skaber jeg indviklede mønstre til tasker, kurve og boligindretning, som folk i Danmark og Tyskland bruger hver dag."</p>

<h2>Ecofy-partnerskabet</h2>
<p>Da Ecofy første gang besøgte Fatimas landsby i 2019, markerede det et vendepunkt for hele samfundet. "Før Ecofy solgte vi vores produkter på lokale markeder for meget få penge. Nu får vi fair lønninger, og vores børn kan gå i skole."</p>

<h3>Indvirkning på samfundet:</h3>
<ul>
<li>40% højere lønninger end branchegennemsnittet</li>
<li>Sundhedsstøtte til alle håndværkerfamilier</li>
<li>Uddannelsesstipendier til børn</li>
<li>Sikre og komfortable arbejdsforhold</li>
</ul>

<h2>Bevaring af tradition</h2>
<p>Fatima træner nu yngre kvinder i sin landsby og videregiver teknikker, der er blevet forfinet gennem generationer. "Hvert sting bærer vores arv," siger hun. "Når nogen i Europa holder vores produkt, holder de et stykke Bangladesh."</p>',
  'Craftsmanship',
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'ecofy-expands-to-nordic-markets',
  'Ecofy Expands to Nordic Markets: New Partnerships in Sweden and Norway',
  'Ecofy udvider til nordiske markeder: Nye partnerskaber i Sverige og Norge',
  'We''re thrilled to announce our expansion into Sweden and Norway, bringing sustainable jute products to more European homes.',
  'Vi er begejstrede for at annoncere vores udvidelse til Sverige og Norge og bringer bæredygtige juteprodukter til flere europæiske hjem.',
  '<h2>Growing Our European Footprint</h2>
<p>After three successful years serving the Danish market, Ecofy is proud to announce our expansion into Sweden and Norway. This milestone represents our commitment to making sustainable products accessible across the Nordic region.</p>

<h2>New Retail Partnerships</h2>
<p>We''ve partnered with leading sustainable retailers in both countries:</p>
<ul>
<li><strong>Sweden:</strong> Naturbutiken (15 locations), EcoLiving Stockholm</li>
<li><strong>Norway:</strong> Grønn Butikk (8 locations), Bergen Eco Market</li>
</ul>

<h2>What This Means for Our Artisans</h2>
<p>This expansion isn''t just good news for European consumers—it directly benefits our artisan community in Bangladesh. With increased demand, we''re able to partner with 50 additional artisan families, providing sustainable livelihoods to more communities.</p>

<h2>Launching New Products</h2>
<p>To celebrate our Nordic expansion, we''re introducing three new product lines specifically designed for Scandinavian homes:</p>
<ul>
<li>Nordic Minimalist Collection - Clean lines, neutral tones</li>
<li>Hygge Home Series - Cozy textures for comfortable living</li>
<li>Outdoor Adventure Range - Durable bags for Nordic explorers</li>
</ul>

<h2>Visit Us</h2>
<p>Find Ecofy products at our new partner stores starting March 2024. Follow us on social media for store locations and launch events.</p>',
  '<h2>Udvider vores europæiske fodaftryk</h2>
<p>Efter tre succesfulde år på det danske marked er Ecofy stolte af at annoncere vores udvidelse til Sverige og Norge. Denne milepæl repræsenterer vores forpligtelse til at gøre bæredygtige produkter tilgængelige i hele den nordiske region.</p>

<h2>Nye detailpartnerskaber</h2>
<p>Vi har indgået partnerskaber med førende bæredygtige forhandlere i begge lande:</p>
<ul>
<li><strong>Sverige:</strong> Naturbutiken (15 lokationer), EcoLiving Stockholm</li>
<li><strong>Norge:</strong> Grønn Butikk (8 lokationer), Bergen Eco Market</li>
</ul>

<h2>Hvad dette betyder for vores håndværkere</h2>
<p>Denne udvidelse er ikke kun godt nyt for europæiske forbrugere—det gavner direkte vores håndværkersamfund i Bangladesh. Med øget efterspørgsel kan vi samarbejde med 50 yderligere håndværkerfamilier og give bæredygtige levebrød til flere samfund.</p>

<h2>Lancering af nye produkter</h2>
<p>For at fejre vores nordiske udvidelse introducerer vi tre nye produktlinjer specifikt designet til skandinaviske hjem:</p>
<ul>
<li>Nordic Minimalist Collection - Rene linjer, neutrale toner</li>
<li>Hygge Home Series - Hyggelige teksturer til behageligt liv</li>
<li>Outdoor Adventure Range - Holdbare tasker til nordiske opdagelsesrejsende</li>
</ul>

<h2>Besøg os</h2>
<p>Find Ecofy-produkter i vores nye partnerbutikker fra marts 2024. Følg os på sociale medier for butiksplaceringer og lanceringsbegivenheder.</p>',
  'News',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '7 days'
),
(
  '5-ways-to-style-jute-bags',
  '5 Creative Ways to Style Your Jute Bag for Any Occasion',
  '5 kreative måder at style din jutetaske til enhver lejlighed',
  'From beach days to business meetings, discover how to make your sustainable jute bag work for every part of your life.',
  'Fra stranddage til forretningsmøder, opdag hvordan du får din bæredygtige jutetaske til at fungere i alle dele af dit liv.',
  '<h2>Versatile, Sustainable, Stylish</h2>
<p>Your jute bag is more than just an eco-friendly choice—it''s a versatile accessory that can complement any outfit and occasion. Here are five creative ways to style your favorite Ecofy jute bag.</p>

<h2>1. Beach Day Essential</h2>
<p>Pair your large woven jute tote with a flowing sundress and sandals. The natural texture of jute perfectly complements beachwear, and its durability means it can handle sand, sunscreen, and all your beach essentials.</p>
<p><em>Pro tip: Our jute bags are naturally resistant to moisture, making them ideal for seaside adventures.</em></p>

<h2>2. Farmers Market Chic</h2>
<p>Nothing says "sustainable living" quite like carrying your organic produce in a beautiful handwoven jute bag. Add a linen shirt and comfortable pants for the perfect market-day look.</p>

<h2>3. Office Professional</h2>
<p>Yes, jute can go to work! Our structured jute laptop bags and document holders pair beautifully with business casual attire. The natural tones complement navy, gray, and earth-toned professional wear.</p>

<h2>4. Weekend Brunch</h2>
<p>A medium-sized jute crossbody bag adds bohemian charm to your weekend outfit. Pair with denim, a white blouse, and statement earrings for effortless style.</p>

<h2>5. Evening Out</h2>
<p>Our embellished jute clutches prove that sustainable fashion can be glamorous. The handcrafted details and unique textures make a statement at any evening event.</p>

<h2>Care Tips</h2>
<p>To keep your jute bag looking its best: store in a dry place, spot clean with a damp cloth, and let it air out after heavy use. With proper care, your Ecofy bag will last for years.</p>',
  '<h2>Alsidig, bæredygtig, stilfuld</h2>
<p>Din jutetaske er mere end bare et miljøvenligt valg—det er et alsidigt tilbehør, der kan komplementere ethvert outfit og enhver lejlighed. Her er fem kreative måder at style din foretrukne Ecofy jutetaske.</p>

<h2>1. Stranddag essentials</h2>
<p>Par din store vævede jute-tote med en flydende sommerkjole og sandaler. Den naturlige tekstur af jute komplementerer perfekt strandtøj, og dens holdbarhed betyder, at den kan håndtere sand, solcreme og alle dine strandnødvendigheder.</p>
<p><em>Pro tip: Vores jutetasker er naturligt modstandsdygtige over for fugt, hvilket gør dem ideelle til eventyr ved havet.</em></p>

<h2>2. Bondemarked chic</h2>
<p>Intet siger "bæredygtigt liv" som at bære dine økologiske produkter i en smuk håndvævet jutetaske. Tilføj en hørskjorte og behagelige bukser for det perfekte markedsdag-look.</p>

<h2>3. Kontorprofessionel</h2>
<p>Ja, jute kan gå på arbejde! Vores strukturerede jute-laptoptasker og dokumentholdere passer smukt til business casual tøj. De naturlige toner komplementerer marineblåt, gråt og jordfarvet professionelt tøj.</p>

<h2>4. Weekend brunch</h2>
<p>En mellemstor jute crossbody-taske tilføjer bohemisk charme til dit weekendoutfit. Par med denim, en hvid bluse og statement-øreringe for ubesværet stil.</p>

<h2>5. Aften ude</h2>
<p>Vores udsmykkede jute-clutches beviser, at bæredygtig mode kan være glamourøs. De håndlavede detaljer og unikke teksturer gør et statement ved enhver aftenbegivenhed.</p>

<h2>Plejetips</h2>
<p>For at holde din jutetaske i bedste stand: opbevar på et tørt sted, pletren med en fugtig klud, og lad den lufte efter kraftig brug. Med ordentlig pleje vil din Ecofy-taske holde i årevis.</p>',
  'Tips',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '14 days'
);

-- ============================================
-- Migration: 20260126170737_fa705090-b4f0-4888-8a44-244d6a24e98f.sql
-- ============================================


-- Insert 5 new premium jute products
INSERT INTO products (slug, category_id, name_en, name_da, description_en, description_da, image_url, featured, is_active, sort_order, spec_material, spec_size, gallery, use_cases_en, use_cases_da) VALUES 
('jute-laptop-sleeve', 'bags', 'Eco Jute Laptop Sleeve', 'Øko Jute Laptop Sleeve', 'Stylish and sustainable laptop protection made from 100% natural jute fiber. Padded interior with magnetic closure keeps your device safe while making an eco-conscious statement.', 'Stilfuld og bæredygtig laptop-beskyttelse lavet af 100% naturlig jutefiber. Polstret indvendigt med magnetisk lukning holder din enhed sikker.', 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&h=800&fit=crop', true, true, 9, '100% Natural Jute with Cotton Lining', '35cm x 25cm (fits 13-15" laptops)', '[]', '["Office commute", "Business travel", "Student use", "Gift for professionals"]', '["Kontorpendling", "Forretningsrejser", "Studenterbrug", "Gave til professionelle"]'),

('jute-wine-bag', 'bags', 'Elegant Jute Wine Bottle Bag', 'Elegant Jute Vinflaske Taske', 'Elevate your gift-giving with our handcrafted jute wine bottle carrier. Features reinforced bottom and decorative rope handles for a rustic yet refined presentation.', 'Løft din gaveuddeling med vores håndlavede jute vinflaskeholder. Med forstærket bund og dekorative rebhåndtag for en rustik, men raffineret præsentation.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=800&fit=crop', true, true, 10, '100% Natural Jute', 'Single bottle (fits standard 750ml)', '[]', '["Wine gifts", "Holiday presents", "Corporate gifting", "Wedding favors"]', '["Vingaver", "Feriegaver", "Firmegaver", "Bryllupsdekorationer"]'),

('jute-table-runner', 'decor', 'Artisan Jute Table Runner', 'Håndværker Jute Bordløber', 'Transform your dining experience with our handwoven jute table runner. Natural fringe edges and neutral tones complement any table setting from rustic to modern.', 'Forvandl din spiseoplevelse med vores håndvævede jute bordløber. Naturlige frynsekanter og neutrale toner komplementerer enhver borddækning.', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=800&fit=crop', true, true, 11, '100% Natural Jute', '180cm x 35cm', '[]', '["Dining table decor", "Wedding centerpieces", "Holiday tablescapes", "Photo shoots"]', '["Spisebordsdekoration", "Bryllupscenterstykker", "Ferieborddækning", "Foto shoots"]'),

('heavy-duty-rope-10mm', 'rope', 'Heavy-Duty Jute Rope 10mm', 'Heavy-Duty Jute Reb 10mm', 'Industrial-strength 10mm jute rope perfect for demanding applications. Biodegradable and sustainable alternative to synthetic ropes with superior grip and durability.', 'Industriel styrke 10mm jute reb perfekt til krævende applikationer. Bionedbrydelig og bæredygtig alternativ til syntetiske reb med overlegen greb.', 'https://images.unsplash.com/photo-1589803508509-1fded0f79dd2?w=800&h=800&fit=crop', true, true, 12, '100% Natural Jute, 3-ply twisted', '10mm diameter, 50m coil', '[]', '["Maritime applications", "Construction", "Agriculture", "Landscaping"]', '["Maritime applikationer", "Byggeri", "Landbrug", "Landskabsarkitektur"]'),

('jute-coffee-sack', 'sacks', 'Premium Jute Coffee Bean Sack', 'Premium Jute Kaffebønne Sæk', 'The gold standard for coffee transportation. Our breathable jute sacks protect beans while allowing proper air circulation, preferred by specialty coffee roasters worldwide.', 'Guldstandarden for kaffetransport. Vores åndbare jutesække beskytter bønner mens de tillader ordentlig luftcirkulation, foretrukket af specialkaffe-ristere verden over.', 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&h=800&fit=crop', true, true, 13, '100% Natural Jute Burlap', '60kg capacity, 90cm x 60cm', '[]', '["Coffee storage", "Coffee transport", "Cafe decor", "Rustic events"]', '["Kaffeopbevaring", "Kaffetransport", "Cafe dekoration", "Rustikke arrangementer"]');

-- Update existing products to be featured (total 8 featured products)
UPDATE products SET featured = true WHERE slug IN ('natural-jute-rope', 'shopping-bag-printed', 'jute-wall-hanging');

-- Update blog post cover images with reliable jute-related images
UPDATE blog_posts 
SET cover_image = CASE slug
  WHEN 'the-art-of-jute-craftsmanship' THEN 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=1920&h=1080&fit=crop'
  WHEN 'meet-our-master-weaver-fatima' THEN 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d99?w=1920&h=1080&fit=crop'
  WHEN 'ecofy-expands-to-nordic-markets' THEN 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=1080&fit=crop'
  WHEN '5-ways-to-style-jute-bags' THEN 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1920&h=1080&fit=crop'
  ELSE cover_image
END
WHERE slug IN ('the-art-of-jute-craftsmanship', 'meet-our-master-weaver-fatima', 'ecofy-expands-to-nordic-markets', '5-ways-to-style-jute-bags');


-- ============================================
-- Migration: 20260126171056_47bc12af-03a5-4f24-8649-6905ebdb6b27.sql
-- ============================================


-- Fix broken blog cover images with more reliable Unsplash URLs
UPDATE blog_posts 
SET cover_image = CASE slug
  WHEN 'the-art-of-jute-craftsmanship' THEN 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&h=1080&fit=crop'
  WHEN 'meet-our-master-weaver-fatima' THEN 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&h=1080&fit=crop&crop=center'
  WHEN 'ecofy-expands-to-nordic-markets' THEN 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=1080&fit=crop'
  WHEN '5-ways-to-style-jute-bags' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop'
  ELSE cover_image
END
WHERE slug IN ('the-art-of-jute-craftsmanship', 'meet-our-master-weaver-fatima', 'ecofy-expands-to-nordic-markets', '5-ways-to-style-jute-bags');


-- ============================================
-- Migration: 20260126171912_db088540-f19b-4aff-afff-932d4435a04b.sql
-- ============================================

UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop'
WHERE slug = 'meet-our-master-weaver-fatima';

-- ============================================
-- Migration: 20260127112734_2fcbfd56-82e3-4008-a82c-49e6132d58a2.sql
-- ============================================

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=600&fit=crop'
WHERE slug = 'shopping-bag-printed';

-- ============================================
-- Migration: 20260127113513_3e53be61-019f-4f69-ad67-198707cb1b93.sql
-- ============================================

-- Update all product images with jute-related Unsplash images

-- Bags Category
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=600&h=600&fit=crop' 
WHERE slug = 'jute-tote-bag';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop' 
WHERE slug = 'shopping-bag-printed';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop' 
WHERE slug = 'jute-laptop-sleeve';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&h=600&fit=crop' 
WHERE slug = 'jute-wine-bag';

-- Sacks Category
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop' 
WHERE slug = 'burlap-sack-50kg';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop' 
WHERE slug = 'cocoa-bag-70kg';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&h=600&fit=crop' 
WHERE slug = 'jute-coffee-sack';

-- Decor Category
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop' 
WHERE slug = 'jute-planter-basket';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600&h=600&fit=crop' 
WHERE slug = 'jute-wall-hanging';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&h=600&fit=crop' 
WHERE slug = 'jute-table-runner';

-- Rope Category
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=600&h=600&fit=crop' 
WHERE slug = 'natural-jute-rope';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop' 
WHERE slug = 'garden-twine';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop' 
WHERE slug = 'heavy-duty-rope-10mm';

-- ============================================
-- Migration: 20260127120820_38b374c4-f9e8-48fd-8d57-7c7c6d039ac9.sql
-- ============================================

INSERT INTO products (
  slug, 
  category_id, 
  name_en, 
  name_da, 
  description_en, 
  description_da, 
  image_url, 
  gallery,
  spec_material, 
  spec_size,
  use_cases_en, 
  use_cases_da, 
  featured, 
  sort_order, 
  is_active
) VALUES (
  'eco-friendly-jute-shopping-bag',
  'bags',
  'Premium Eco-Friendly Jute Shopping Bag',
  'Premium Miljøvenlig Jute Indkøbstaske',
  'A premium eco-friendly jute shopping bag made from natural Bangladeshi jute fiber. Features modern minimalist design with strong stitched handles.',
  'En premium miljøvenlig jute indkøbstaske lavet af naturlig bangladeshisk jutefiber. Har et moderne minimalistisk design med stærke syede håndtag.',
  '/products/eco-jute-bag-1.jpg',
  '["/products/eco-jute-bag-2.jpg", "/products/eco-jute-bag-3.jpg"]'::jsonb,
  '100% Natural Jute',
  '40 x 35 x 15 cm',
  '["Grocery shopping", "Beach outings", "Everyday carry", "Gift packaging"]'::jsonb,
  '["Dagligvareindkøb", "Strandture", "Daglig brug", "Gaveindpakning"]'::jsonb,
  true,
  0,
  true
);

-- ============================================
-- Migration: 20260127142316_5637a39e-6a03-4edb-ada8-88f5edeaee65.sql
-- ============================================

-- Step 1: বিদ্যমান প্রোডাক্টের sort_order বাড়ানো
UPDATE products 
SET sort_order = sort_order + 1 
WHERE sort_order >= 1;

-- Step 2: নতুন ওয়াইন ব্যাগ ইনসার্ট করা
INSERT INTO products (
  slug, category_id, name_en, name_da, 
  description_en, description_da, 
  image_url, gallery,
  spec_material, spec_size,
  use_cases_en, use_cases_da, 
  featured, sort_order, is_active
) VALUES (
  'stylish-jute-wine-bag', 'bags',
  'Stylish Jute Wine Bag', 'Stilfuld Jute Vinpose',
  'A stylish jute wine bag made from high-quality natural jute. Features a slim vertical shape suitable for wine bottles with a premium handcrafted look and minimalist design. Perfect for eco-friendly luxury packaging.',
  'En stilfuld jute vinpose lavet af naturlig jute af høj kvalitet. Har en slank vertikal form velegnet til vinflasker med et premium håndlavet look og minimalistisk design. Perfekt til miljøvenlig luksusemballage.',
  '/products/jute-wine-bag-1.jpg',
  '["/products/jute-wine-bag-2.jpg", "/products/jute-wine-bag-3.jpg"]'::jsonb,
  '100% Natural Jute', '35 x 10 x 10 cm',
  '["Wine gifting", "Bottle packaging", "Special occasions", "Corporate gifts"]'::jsonb,
  '["Vingaver", "Flaskeemballage", "Særlige lejligheder", "Firmegaver"]'::jsonb,
  false, 1, true
);

-- ============================================
-- Migration: 20260127143018_070f2fa2-44f3-454e-8552-b9ed2d0b648f.sql
-- ============================================

-- Only insert admin role if the user exists in auth.users
INSERT INTO user_roles (user_id, role)
SELECT 'cb66c4b1-63e8-4663-a97b-2a4cdac7ddbf', 'admin'
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'cb66c4b1-63e8-4663-a97b-2a4cdac7ddbf'
);

-- ============================================
-- Migration: 20260127165311_98480c51-3b0a-4244-b21f-00bcc3226424.sql
-- ============================================

-- Create site settings table for storing configuration like hero variant
CREATE TABLE public.site_settings (
    id text PRIMARY KEY DEFAULT 'global',
    hero_variant text NOT NULL DEFAULT 'video',
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for public pages)
CREATE POLICY "Settings are publicly readable"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update settings"
ON public.site_settings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can insert settings
CREATE POLICY "Admins can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Insert default settings
INSERT INTO public.site_settings (id, hero_variant) VALUES ('global', 'video');

-- ============================================
-- Migration: 20260128161347_c9d9aeb4-9f08-4d47-9e30-caec7a88be79.sql
-- ============================================

-- Add more site settings columns
ALTER TABLE public.site_settings
ADD COLUMN site_title_en text DEFAULT 'Ecofy',
ADD COLUMN site_title_da text DEFAULT 'Ecofy',
ADD COLUMN site_tagline_en text DEFAULT 'Sustainable Jute Products from Bangladesh',
ADD COLUMN site_tagline_da text DEFAULT 'Bæredygtige juteprodukter fra Bangladesh',
ADD COLUMN logo_url text,
ADD COLUMN footer_text_en text DEFAULT 'Crafting sustainable stories since 2019',
ADD COLUMN footer_text_da text DEFAULT 'Skaber bæredygtige historier siden 2019',
ADD COLUMN contact_email text DEFAULT 'hello@ecofy.dk',
ADD COLUMN contact_phone text DEFAULT '+45 12 34 56 78',
ADD COLUMN contact_address text DEFAULT 'Copenhagen, Denmark',
ADD COLUMN social_facebook text,
ADD COLUMN social_instagram text,
ADD COLUMN social_linkedin text,
ADD COLUMN social_twitter text;

-- ============================================
-- Migration: 20260128165252_b7b41093-1dce-4393-850e-8d0c0f242fb6.sql
-- ============================================

-- Create storage bucket for site settings (logo, assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-settings', 'site-settings', true);

-- RLS: Everyone can view files
CREATE POLICY "Site settings files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-settings');

-- RLS: Only admins can upload
CREATE POLICY "Only admins can upload site settings files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);

-- RLS: Only admins can update
CREATE POLICY "Only admins can update site settings files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);

-- RLS: Only admins can delete
CREATE POLICY "Only admins can delete site settings files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);

-- ============================================
-- Migration: 20260208150847_adfb63c3-4083-43ea-8779-8c8b4033559e.sql
-- ============================================


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


-- ============================================
-- Migration: 20260208155448_16e16f3c-4584-43c5-a18b-b106d7d98e4d.sql
-- ============================================


-- Seed story values content blocks
INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, icon, color, sort_order) VALUES
('story_values', 'sustainability', 'Sustainability', 'Bæredygtighed', 'Every product we create is designed with the planet in mind, from raw materials to delivery.', 'Hvert produkt vi skaber er designet med planeten i tankerne, fra råmaterialer til levering.', 'Leaf', 'from-emerald-500 to-green-600', 1),
('story_values', 'quality', 'Quality', 'Kvalitet', 'We never compromise on craftsmanship. Each piece is made to last and made with love.', 'Vi går aldrig på kompromis med håndværk. Hvert stykke er lavet til at holde og lavet med kærlighed.', 'Heart', 'from-rose-500 to-pink-600', 2),
('story_values', 'community', 'Community', 'Fællesskab', 'We believe in empowering communities through fair wages, education, and sustainable practices.', 'Vi tror på at styrke fællesskaber gennem fair løn, uddannelse og bæredygtige praksisser.', 'Users', 'from-blue-500 to-cyan-600', 3),
('story_values', 'transparency', 'Transparency', 'Gennemsigtighed', 'From farm to shelf, we maintain complete transparency in our supply chain and business practices.', 'Fra mark til hylde opretholder vi fuldstændig gennemsigtighed i vores forsyningskæde og forretningspraksis.', 'Globe', 'from-amber-500 to-orange-600', 4);

-- Seed supply chain steps
INSERT INTO content_blocks (section, block_key, title_en, title_da, sort_order) VALUES
('supply_chain', 'step1', 'Ethically sourced raw jute from Bangladesh farms', 'Etisk indkøbt rå jute fra Bangladesh gårde', 1),
('supply_chain', 'step2', 'Handcrafted by skilled artisans in local cooperatives', 'Håndlavet af dygtige håndværkere i lokale kooperativer', 2),
('supply_chain', 'step3', 'Quality checked and certified to international standards', 'Kvalitetskontrolleret og certificeret efter internationale standarder', 3),
('supply_chain', 'step4', 'Carbon-neutral shipping to customers worldwide', 'CO2-neutral forsendelse til kunder over hele verden', 4);

-- Seed OurStory certifications (the cert names shown on OurStory page)
INSERT INTO content_blocks (section, block_key, title_en, title_da, sort_order) VALUES
('story_certifications', 'gots', 'GOTS', 'GOTS', 1),
('story_certifications', 'oekotex', 'OEKO-TEX', 'OEKO-TEX', 2),
('story_certifications', 'fairtrade', 'Fair Trade', 'Fair Trade', 3);


-- ============================================
-- Migration: 20260208161544_c874c4b9-3ae6-4aea-aa8d-40f93961a2ea.sql
-- ============================================


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


