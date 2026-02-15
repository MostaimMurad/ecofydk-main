
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
