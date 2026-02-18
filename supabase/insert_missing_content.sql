-- Insert missing whyjute_comparison blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000001-0001-4000-a000-000000000001', 'whyjute_comparison', 'carbon', 'Carbon Footprint', 'CO2-aftryk', NULL, NULL, NULL, 'Wind', NULL, NULL, '{"jute_value":"0.5 kg CO₂","jute_score":9,"plastic_value":"3.1 kg CO₂","plastic_score":2,"paper_value":"1.8 kg CO₂","paper_score":5}', 1, true),
('a0000001-0001-4000-a000-000000000002', 'whyjute_comparison', 'biodegradable', 'Biodegradability', 'Bionedbrydning', NULL, NULL, NULL, 'Leaf', NULL, NULL, '{"jute_value":"2-3 months","jute_score":10,"plastic_value":"450+ years","plastic_score":1,"paper_value":"2-6 weeks","paper_score":9}', 2, true),
('a0000001-0001-4000-a000-000000000003', 'whyjute_comparison', 'durability', 'Durability', 'Holdbarhed', NULL, NULL, NULL, 'Shield', NULL, NULL, '{"jute_value":"3-5 years","jute_score":8,"plastic_value":"1-2 years","plastic_score":6,"paper_value":"1-2 uses","paper_score":2}', 3, true),
('a0000001-0001-4000-a000-000000000004', 'whyjute_comparison', 'water', 'Water Usage', 'Vandforbrug', NULL, NULL, NULL, 'Droplets', NULL, NULL, '{"jute_value":"Low","jute_score":8,"plastic_value":"Moderate","plastic_score":4,"paper_value":"Very High","paper_score":2}', 4, true),
('a0000001-0001-4000-a000-000000000005', 'whyjute_comparison', 'reusable', 'Reusability', 'Genanvendelighed', NULL, NULL, NULL, 'Recycle', NULL, NULL, '{"jute_value":"100+ uses","jute_score":10,"plastic_value":"5-10 uses","plastic_score":4,"paper_value":"1-2 uses","paper_score":2}', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing whyjute_lifecycle blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000001-0002-4000-a000-000000000001', 'whyjute_lifecycle', 'step1', 'Seed & Grow', 'Så & Dyrk', 'Jute grows in 4-6 months with minimal water and no pesticides', 'Jute vokser på 4-6 måneder med minimalt vand og ingen pesticider', NULL, 'Sprout', 'from-green-500 to-emerald-600', NULL, '{}', 1, true),
('a0000001-0002-4000-a000-000000000002', 'whyjute_lifecycle', 'step2', 'Harvest & Process', 'Høst & Forarbejd', 'Fibers extracted through natural retting process', 'Fibre udvindes gennem naturlig rødningsproces', NULL, 'Factory', 'from-amber-500 to-orange-600', NULL, '{}', 2, true),
('a0000001-0002-4000-a000-000000000003', 'whyjute_lifecycle', 'step3', 'Weave & Create', 'Væv & Skab', 'Skilled artisans craft products by hand and machine', 'Dygtige håndværkere fremstiller produkter i hånd og maskine', NULL, 'Package', 'from-blue-500 to-cyan-600', NULL, '{}', 3, true),
('a0000001-0002-4000-a000-000000000004', 'whyjute_lifecycle', 'step4', 'Use & Reuse', 'Brug & Genbrug', 'Products last 3-5 years with proper care', 'Produkter holder 3-5 år med korrekt pleje', NULL, 'Heart', 'from-primary to-teal-600', NULL, '{}', 4, true),
('a0000001-0002-4000-a000-000000000005', 'whyjute_lifecycle', 'step5', 'Return to Earth', 'Vend Tilbage til Jorden', 'Fully biodegrades in 2-3 months, enriching the soil', 'Fuldt bionedbrydeligt på 2-3 måneder og beriger jorden', NULL, 'Leaf', 'from-emerald-500 to-green-600', NULL, '{}', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing whyjute_facts blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000001-0003-4000-a000-000000000001', 'whyjute_facts', 'fact1', 'Golden Fiber', 'Gyldne Fiber', 'Jute is known as the ''Golden Fiber'' — the second most produced natural fiber after cotton', 'Jute er kendt som ''Gyldne Fiber'' — den næstmest producerede naturfiber efter bomuld', NULL, 'Star', NULL, NULL, '{}', 1, true),
('a0000001-0003-4000-a000-000000000002', 'whyjute_facts', 'fact2', 'CO₂ Absorption', 'CO₂ Absorption', 'One hectare of jute absorbs 15 tonnes of CO₂ and releases 11 tonnes of oxygen', 'En hektar jute absorberer 15 tons CO₂ og frigiver 11 tons ilt', NULL, 'TreePine', NULL, NULL, '{}', 2, true),
('a0000001-0003-4000-a000-000000000003', 'whyjute_facts', 'fact3', 'No Pesticides', 'Ingen Pesticider', 'Jute requires no pesticides or fertilizers to grow — naturally pest-resistant', 'Jute kræver ingen pesticider eller gødning — naturligt skadedyrsresistent', NULL, 'ShieldCheck', NULL, NULL, '{}', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing whyjute_stats blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000001-0004-4000-a000-000000000001', 'whyjute_stats', 'co2_saved', 'CO₂ Saved Per Bag', 'CO₂ Besparet Per Taske', NULL, NULL, '2.6 kg', 'Wind', NULL, NULL, '{}', 1, true),
('a0000001-0004-4000-a000-000000000002', 'whyjute_stats', 'plastic_replaced', 'Plastic Bags Replaced', 'Plastikposer Erstattet', NULL, NULL, '500+', 'Recycle', NULL, NULL, '{}', 2, true),
('a0000001-0004-4000-a000-000000000003', 'whyjute_stats', 'decompose', 'Months to Decompose', 'Måneder til Nedbrydning', NULL, NULL, '2-3', 'Clock', NULL, NULL, '{}', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing cert_list blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000002-0001-4000-a000-000000000001', 'cert_list', 'oekotex', 'OEKO-TEX Standard 100', 'OEKO-TEX Standard 100', 'Tested for harmful substances — safe for direct skin contact', 'Testet for skadelige stoffer — sikkert for direkte hudkontakt', 'Active', 'ShieldCheck', 'from-green-500 to-emerald-600', NULL, '{}', 1, true),
('a0000002-0001-4000-a000-000000000002', 'cert_list', 'reach', 'EU REACH Compliance', 'EU REACH Overholdelse', 'Full compliance with EU chemical safety regulations for textile imports', 'Fuld overholdelse af EU''s kemikaliesikkerhedsregler for tekstilimport', 'Active', 'FileCheck', 'from-blue-500 to-cyan-600', NULL, '{}', 2, true),
('a0000002-0001-4000-a000-000000000003', 'cert_list', 'gots', 'GOTS Certified', 'GOTS Certificeret', 'Global Organic Textile Standard — organic fiber processing verified', 'Global Organic Textile Standard — organisk fiberbearbejdning verificeret', 'Active', 'Award', 'from-emerald-500 to-teal-600', NULL, '{}', 3, true),
('a0000002-0001-4000-a000-000000000004', 'cert_list', 'iso14001', 'ISO 14001', 'ISO 14001', 'Environmental management system — minimizing environmental impact across operations', 'Miljøledelsessystem — minimerer miljøpåvirkning på tværs af operationer', 'Active', 'Globe', 'from-purple-500 to-violet-600', NULL, '{}', 4, true),
('a0000002-0001-4000-a000-000000000005', 'cert_list', 'fairtrade', 'Fair Trade Certified', 'Fair Trade Certificeret', 'Ensuring fair wages and ethical working conditions for all artisans', 'Sikrer retfærdige lønninger og etiske arbejdsforhold for alle håndværkere', 'Active', 'CheckCircle', 'from-amber-500 to-orange-600', NULL, '{}', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing cert_supply_chain blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000002-0002-4000-a000-000000000001', 'cert_supply_chain', 'sourcing', 'Raw Material Sourcing', 'Råvareindkøb', 'Jute fibers sourced from certified farms in Bangladesh — no child labor, fair wages guaranteed', 'Jutefibre fra certificerede landbrug i Bangladesh — intet børnearbejde, retfærdige lønninger garanteret', 'Bangladesh', 'Leaf', NULL, NULL, '{}', 1, true),
('a0000002-0002-4000-a000-000000000002', 'cert_supply_chain', 'manufacturing', 'Manufacturing', 'Produktion', 'Products crafted in our partner factory with ISO 14001 certified environmental management', 'Produkter fremstillet på vores partnerfabrik med ISO 14001 certificeret miljøledelse', 'Dhaka, Bangladesh', 'Factory', NULL, NULL, '{}', 2, true),
('a0000002-0002-4000-a000-000000000003', 'cert_supply_chain', 'quality', 'Quality Inspection', 'Kvalitetsinspektion', 'Every batch undergoes rigorous quality checks before shipping — AQL 2.5 standard', 'Hvert parti gennemgår strenge kvalitetskontroller før forsendelse — AQL 2.5 standard', 'Bangladesh', 'Eye', NULL, NULL, '{}', 3, true),
('a0000002-0002-4000-a000-000000000004', 'cert_supply_chain', 'shipping', 'Shipping & Logistics', 'Forsendelse & Logistik', 'Sea freight to EU ports with carbon-offset options and full customs documentation', 'Søfragt til EU-havne med kulstofkompensation og fuld toldokumentation', 'EU Ports', 'Truck', NULL, NULL, '{}', 4, true),
('a0000002-0002-4000-a000-000000000005', 'cert_supply_chain', 'delivery', 'EU Distribution', 'EU Distribution', 'Final delivery from Copenhagen warehouse to your business within 5-7 days', 'Endelig levering fra København lager til din virksomhed inden for 5-7 dage', 'Copenhagen, DK', 'Globe', NULL, NULL, '{}', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing cert_eu_regulations blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000002-0003-4000-a000-000000000001', 'cert_eu_regulations', 'supd', 'EU Single-Use Plastics Directive', 'EU''s Engangsplastdirektiv', 'Bans certain single-use plastic products. Jute bags are a compliant alternative.', 'Forbyder visse engangsplastprodukter. Jutetasker er et kompatibelt alternativ.', '2021', NULL, NULL, NULL, '{"impact":"High"}', 1, true),
('a0000002-0003-4000-a000-000000000002', 'cert_eu_regulations', 'ppwr', 'EU Packaging & Packaging Waste Regulation', 'EU''s Emballage- og Emballageaffaldsforordning', 'New recyclability and reuse targets for packaging. Jute products exceed requirements.', 'Nye genbrugs- og genanvendelsesmål for emballage. Juteprodukter overgår kravene.', '2025', NULL, NULL, NULL, '{"impact":"High"}', 2, true),
('a0000002-0003-4000-a000-000000000003', 'cert_eu_regulations', 'csrd', 'Corporate Sustainability Reporting Directive', 'Direktiv om Virksomheders Bæredygtighedsrapportering', 'Requires companies to report sustainability data. Our products help meet supply chain requirements.', 'Kræver at virksomheder rapporterer bæredygtighedsdata. Vores produkter hjælper med at opfylde forsyningskædekrav.', '2024', NULL, NULL, NULL, '{"impact":"Medium"}', 3, true),
('a0000002-0003-4000-a000-000000000004', 'cert_eu_regulations', 'dpp', 'EU Digital Product Passport', 'EU Digitalt Produktpas', 'Upcoming requirement for product lifecycle data. Ecofy is already preparing QR-based passports.', 'Kommende krav om produktlivscyklusdata. Ecofy forbereder allerede QR-baserede pas.', '2027', NULL, NULL, NULL, '{"impact":"Medium"}', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Insert missing home_partners blocks
INSERT INTO content_blocks (id, section, block_key, title_en, title_da, description_en, description_da, value, icon, color, image_url, metadata, sort_order, is_active)
VALUES
('a0000003-0001-4000-a000-000000000001', 'home_partners', 'nr', 'Nordic Retail', 'Nordic Retail', NULL, NULL, 'NR', NULL, NULL, NULL, '{}', 1, true),
('a0000003-0001-4000-a000-000000000002', 'home_partners', 'gp', 'GreenPack EU', 'GreenPack EU', NULL, NULL, 'GP', NULL, NULL, NULL, '{}', 2, true),
('a0000003-0001-4000-a000-000000000003', 'home_partners', 'ds', 'Dansk Supermarked', 'Dansk Supermarked', NULL, NULL, 'DS', NULL, NULL, NULL, '{}', 3, true),
('a0000003-0001-4000-a000-000000000004', 'home_partners', 'es', 'EcoStore', 'EcoStore', NULL, NULL, 'ES', NULL, NULL, NULL, '{}', 4, true),
('a0000003-0001-4000-a000-000000000005', 'home_partners', 'bp', 'BioPack Nordic', 'BioPack Nordic', NULL, NULL, 'BP', NULL, NULL, NULL, '{}', 5, true),
('a0000003-0001-4000-a000-000000000006', 'home_partners', 'sb', 'SustainaBag', 'SustainaBag', NULL, NULL, 'SB', NULL, NULL, NULL, '{}', 6, true),
('a0000003-0001-4000-a000-000000000007', 'home_partners', 'ft', 'FairTrade DK', 'FairTrade DK', NULL, NULL, 'FT', NULL, NULL, NULL, '{}', 7, true),
('a0000003-0001-4000-a000-000000000008', 'home_partners', 'gl', 'GreenLogistics', 'GreenLogistics', NULL, NULL, 'GL', NULL, NULL, NULL, '{}', 8, true)
ON CONFLICT (id) DO NOTHING;
