import { NodeSSH } from 'node-ssh';
import * as dotenv from 'dotenv';
dotenv.config();

const ssh = new NodeSSH();

const SQL = `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;`;

async function run() {
    console.log('🔌 Connecting to VPS...');
    await ssh.connect({
        host: '187.77.76.221',
        username: 'root',
        password: process.env.VPS_PASSWORD,
    });

    console.log('✅ Connected. Applying migration...');
    const result = await ssh.execCommand(
        `docker exec $(docker ps -q --filter name=supabase-db) psql -U postgres -d postgres -c "${SQL.replace(/"/g, '\\"')}"`
    );

    if (result.stdout) console.log('✅', result.stdout);
    if (result.stderr) console.log('⚠️', result.stderr);

    ssh.dispose();
    console.log('🎉 Migration complete!');
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
