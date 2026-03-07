import { Client } from 'ssh2';

const VPS = {
    host: '187.77.76.221',
    port: 22,
    username: 'root',
    password: 'Bangla21@2121',
};

const SQL = 'ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;';

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
        // Find the supabase postgres container
        const containers = await sshExec(conn, "docker ps --format '{{.Names}}'");
        const dbContainer = containers.split('\n').find(n => n.includes('supabase') && (n.includes('db') || n.includes('postgres')));
        console.log('\n📦 DB container:', dbContainer || '(not found, trying direct psql)');

        if (dbContainer) {
            // Try multiple admin users — supabase uses 'supabase_admin' as the owner
            const container = dbContainer.trim();
            const cmd = `docker exec ${container} psql -U supabase_admin -d postgres -c "ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;" 2>&1 || docker exec ${container} psql -U postgres -d postgres -U postgres -c "SET ROLE supabase_admin; ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;" 2>&1`;
            await sshExec(conn, cmd);
        } else {
            console.log('No supabase-db container found.');
        }
        console.log('\n✅ Migration applied!');
    } catch (e) {
        console.error('\n❌', e.message);
    }
    conn.end();
});

conn.on('error', e => { console.error('SSH Error:', e.message); process.exit(1); });
conn.connect(VPS);
