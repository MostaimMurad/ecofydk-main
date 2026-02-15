
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
