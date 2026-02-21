import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

const rows = [
    // Impact counters
    { section: 'homepage_impact', block_key: 'impact_bags', title_en: 'Eco-Friendly Bags Delivered', title_da: 'Poser leveret', value: '50000', icon: 'Package', color: 'from-primary to-emerald-600', metadata: { suffix: '+' }, sort_order: 1 },
    { section: 'homepage_impact', block_key: 'impact_co2', title_en: 'CO2 Emissions Saved', title_da: 'CO2 sparet', value: '18', icon: 'TreePine', color: 'from-green-500 to-emerald-600', metadata: { suffix: 't' }, sort_order: 2 },
    { section: 'homepage_impact', block_key: 'impact_plastic', title_en: 'Plastic Pollution Prevented', title_da: 'Plastforurening forhindret', value: '12', icon: 'Recycle', color: 'from-blue-500 to-cyan-600', metadata: { suffix: 't' }, sort_order: 3 },
    { section: 'homepage_impact', block_key: 'impact_clients', title_en: 'B2B Clients Served', title_da: 'B2B kunder', value: '200', icon: 'Building2', color: 'from-purple-500 to-violet-600', metadata: { suffix: '+' }, sort_order: 4 },
    // How It Works
    { section: 'homepage_howitworks', block_key: 'step_1', title_en: 'Tell Us Your Needs', title_da: 'Fortæl Os', description_en: 'Share your requirements — product type, quantity, branding, and delivery timeline', description_da: 'Del dine krav — produkttype, mængde, branding og levering', icon: 'MessageSquare', color: 'from-blue-500 to-cyan-600', sort_order: 1 },
    { section: 'homepage_howitworks', block_key: 'step_2', title_en: 'We Design & Sample', title_da: 'Vi Designer', description_en: 'Receive design mockups and physical samples for your approval', description_da: 'Få design mockups og fysiske prøver til godkendelse', icon: 'Palette', color: 'from-purple-500 to-violet-600', sort_order: 2 },
    { section: 'homepage_howitworks', block_key: 'step_3', title_en: 'Production', title_da: 'Produktion', description_en: 'Bulk manufacturing with strict quality control at our partner factories', description_da: 'Masseproduktion med streng kvalitetskontrol i Bangladesh', icon: 'Package', color: 'from-amber-500 to-orange-600', sort_order: 3 },
    { section: 'homepage_howitworks', block_key: 'step_4', title_en: 'Delivery to Your Door', title_da: 'Levering', description_en: 'Direct shipping to your EU warehouse with full compliance documentation', description_da: 'Direkte forsendelse til dit EU-lager med fuld dokumentation', icon: 'Truck', color: 'from-emerald-500 to-teal-600', sort_order: 4 },
    // Founder
    { section: 'homepage_founder', block_key: 'founder_main', title_en: 'Meet the Founder', title_da: 'Mød Grundlæggeren', description_en: 'See how Ecofy started and our vision for a sustainable future', description_da: 'Se hvordan Ecofy startede og vores vision for en bæredygtig fremtid', value: 'https://www.youtube.com/embed/dQw4w9WgXcQ', metadata: { founder_name: 'Mostaim Ahmed', founder_title: 'Founder & CEO, Ecofy ApS', initials: 'MA', quote_en: 'We started Ecofy with one simple idea: replace plastic with jute, one product at a time.', quote_da: 'Vi startede Ecofy med en enkel ide: at erstatte plastik med jute, et produkt ad gangen.' }, sort_order: 1 },
    { section: 'homepage_founder', block_key: 'founder_stat_1', title_en: 'Founded', title_da: 'Grundlagt', value: '2019', metadata: {}, sort_order: 2 },
    { section: 'homepage_founder', block_key: 'founder_stat_2', title_en: 'B2B Clients', title_da: 'B2B Kunder', value: '200+', metadata: {}, sort_order: 3 },
    { section: 'homepage_founder', block_key: 'founder_stat_3', title_en: 'Products', title_da: 'Produkter', value: '14+', metadata: {}, sort_order: 4 },
    // Mission
    { section: 'story_mission', block_key: 'mission_main', title_en: 'Crafting a Sustainable Future, One Bag at a Time', title_da: 'Skaber en Bæredygtig Fremtid, En Pose ad Gangen', description_en: 'Ecofy was born from a simple belief: businesses should not have to choose between quality and sustainability.', description_da: 'Ecofy blev født af en simpel overbevisning: virksomheder bør ikke stå over for valget mellem kvalitet og bæredygtighed.', metadata: { description2_en: 'Our artisan partners handcraft each product using traditional techniques passed down through generations.', description2_da: 'Vores håndværkspartnere fremstiller hvert produkt i hånden med traditionelle teknikker.', overlay_value: '6+', overlay_label_en: 'Years Experience', overlay_label_da: 'Års Erfaring' }, sort_order: 1 },
];

async function seed() {
    for (const row of rows) {
        const { error } = await supabase.from('content_blocks').upsert(row, { onConflict: 'section,block_key' });
        if (error) {
            console.error(`ERROR [${row.section}/${row.block_key}]:`, error.message);
        } else {
            console.log(`OK [${row.section}/${row.block_key}]`);
        }
    }

    // Add map columns to site_settings
    const { error: rpcErr } = await supabase.rpc('exec_sql', { query: "ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS map_embed_url text DEFAULT ''" });
    if (rpcErr) console.log('Map column note:', rpcErr.message, '(may already exist or need manual migration)');

    console.log('\nDone!');
}

seed();
