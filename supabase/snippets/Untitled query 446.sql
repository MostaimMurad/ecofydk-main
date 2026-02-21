INSERT INTO content_blocks (section, block_key, title_en, title_da, value, icon, color, metadata, sort_order) values('homepage_impact', 'impact_co2', 'CO2 Emissions Saved', 'CO2 sparet', '18', 'TreePine', 'from-green-500 to-emerald-600', '{"suffix": "t"}', 2),
('homepage_impact', 'impact_clients', 'B2B Clients Served', 'B2B kunder', '200', 'Building2', 'from-purple-500 to-violet-600', '{"suffix": "+"}', 4)
ON CONFLICT (section, block_key) DO NOTHING;
