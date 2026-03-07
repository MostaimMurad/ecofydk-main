import { Client } from 'ssh2';

const VPS = {
    host: '187.77.76.221',
    port: 22,
    username: 'root',
    password: 'Bangla21@2121',
};

// Insert homepage_founder content blocks using WHERE NOT EXISTS
const blocks = [
    {
        section: 'homepage_founder', block_key: 'founder_main',
        title_en: 'Meet the Founder', title_da: 'Mød Grundlæggeren',
        description_en: 'See how Ecofy started and our vision for a sustainable future',
        description_da: 'Se hvordan Ecofy startede og vores vision for en bæredygtig fremtid',
        value: '', icon: 'User', color: 'bg-primary/10 text-primary', sort_order: 0,
        metadata: JSON.stringify({ founder_name: 'Mostaim Ahmed', founder_title: 'Founder & CEO, Ecofy ApS', initials: 'MA', quote_en: 'We started Ecofy with one simple idea: replace plastic with jute, one product at a time. Today we deliver to 200+ businesses across Europe, and we are just getting started.', quote_da: 'Vi startede Ecofy med én enkel idé: at erstatte plastik med jute, ét produkt ad gangen.' }),
    },
    { section: 'homepage_founder', block_key: 'founder_stat_founded', title_en: '2019', title_da: 'Grundlagt', description_en: 'Founded', description_da: 'Grundlagt', value: '2019', sort_order: 1, metadata: '{}' },
    { section: 'homepage_founder', block_key: 'founder_stat_clients', title_en: 'B2B Clients', title_da: 'B2B Kunder', description_en: 'B2B Clients', description_da: 'B2B Kunder', value: '200+', sort_order: 2, metadata: '{}' },
    { section: 'homepage_founder', block_key: 'founder_stat_products', title_en: 'Products', title_da: 'Produkter', description_en: 'Products', description_da: 'Produkter', value: '14+', sort_order: 3, metadata: '{}' },
];

function makeInsert(b) {
    const meta = b.metadata.replace(/'/g, "''");
    const icon = b.icon ? `'${b.icon}'` : 'NULL';
    const color = b.color ? `'${b.color}'` : 'NULL';
    const val = b.value || '';
    return `INSERT INTO content_blocks (section, block_key, title_en, title_da, description_en, description_da, value, icon, color, sort_order, status, metadata) SELECT '${b.section}','${b.block_key}','${b.title_en}','${b.title_da}','${b.description_en}','${b.description_da}','${val}',${icon},${color},${b.sort_order},'published','${meta}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM content_blocks WHERE block_key='${b.block_key}');`;
}


function sshExec(conn, cmd, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timeout')), timeoutMs);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let out = '';
            stream.on('data', d => { out += d.toString(); process.stdout.write(d.toString()); });
            stream.stderr.on('data', d => { out += d.toString(); process.stderr.write(d.toString()); });
            stream.on('close', () => { clearTimeout(timer); resolve(out); });
        });
    });
}

const conn = new Client();
conn.on('ready', async () => {
    console.log('✅ SSH connected');
    try {
        for (const b of blocks) {
            const sql = makeInsert(b);
            const escaped = sql.replace(/"/g, '\\"');
            const result = await sshExec(conn,
                `docker exec supabase-db psql -U supabase_admin -d postgres -c "${escaped}" 2>&1`
            );
            console.log(`  ${b.block_key}:`, result.trim());
        }
        console.log('\n✅ All blocks inserted!');
    } catch (e) {
        console.error('\n❌', e.message);
    }
    conn.end();
});
conn.on('error', e => { console.error('SSH Error:', e.message); process.exit(1); });
conn.connect(VPS);
