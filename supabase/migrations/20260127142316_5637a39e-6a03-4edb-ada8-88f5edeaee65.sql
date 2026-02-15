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