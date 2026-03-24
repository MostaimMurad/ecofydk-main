-- ============================================================
-- Seed: Hero Collage Images & Trust Badges
-- Section: hero_collage, hero_trust_badges
-- ============================================================

-- ─── Hero Collage Images ────────────────────────────────────
-- These appear as a 2x2 grid on the right side of the hero section.
-- image_url should be updated with actual Supabase storage URLs after uploading.

INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, image_url, icon, sort_order, metadata)
VALUES
  (
    'hero_collage', 'collage_1',
    'Jute Bags', 'Jute Tasker',
    'Premium handcrafted jute tote bags', 'Premium håndlavede jute tasker',
    '/assets/hero-jute-bag.png',
    'ShoppingBag',
    1,
    '{}'::jsonb
  ),
  (
    'hero_collage', 'collage_2',
    'Home Décor', 'Boligindretning',
    'Woven jute baskets and home accessories', 'Vævede jute kurve og boligtilbehør',
    '/assets/hero-jute-basket.png',
    'Home',
    2,
    '{}'::jsonb
  ),
  (
    'hero_collage', 'collage_3',
    'From Bangladesh', 'Fra Bangladesh',
    'Sourced from the finest jute fields of Bangladesh', 'Hentet fra de fineste jutefelter i Bangladesh',
    '/assets/hero-jute-field.png',
    'MapPin',
    3,
    '{}'::jsonb
  ),
  (
    'hero_collage', 'collage_4',
    'Accessories', 'Tilbehør',
    'Handmade jute coasters and small items', 'Håndlavede jute bordskånere og småting',
    '/assets/hero-jute-coasters.png',
    'Layers',
    4,
    '{}'::jsonb
  )
ON CONFLICT (section, block_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_da = EXCLUDED.title_da,
  description_en = EXCLUDED.description_en,
  description_da = EXCLUDED.description_da,
  image_url = EXCLUDED.image_url,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;


-- ─── Hero Trust Badges ──────────────────────────────────────
-- Small trust indicators shown below the CTA buttons.

INSERT INTO content_blocks (section, block_key, title_en, title_da, icon, sort_order, metadata)
VALUES
  (
    'hero_trust_badges', 'badge_1',
    'Exporting to Europe', 'Eksport til Europa',
    'Globe',
    1,
    '{}'::jsonb
  ),
  (
    'hero_trust_badges', 'badge_2',
    'Certified Eco-Friendly', 'Certificeret Miljøvenlig',
    'ShieldCheck',
    2,
    '{}'::jsonb
  ),
  (
    'hero_trust_badges', 'badge_3',
    'Premium Quality', 'Premium Kvalitet',
    'Award',
    3,
    '{}'::jsonb
  )
ON CONFLICT (section, block_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_da = EXCLUDED.title_da,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;


-- ─── Hero Floating Cards ────────────────────────────────────
-- Floating stat/badge cards overlaid on the collage.

INSERT INTO content_blocks (section, block_key, title_en, title_da, value, icon, sort_order, metadata)
VALUES
  (
    'hero_floating', 'partners_card',
    'European Partners', 'Europæiske Partnere',
    '200+',
    'Globe',
    1,
    '{}'::jsonb
  ),
  (
    'hero_floating', 'certified_card',
    'Eco Certified', 'Øko Certificeret',
    NULL,
    'Award',
    2,
    '{}'::jsonb
  )
ON CONFLICT (section, block_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_da = EXCLUDED.title_da,
  value = EXCLUDED.value,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;
