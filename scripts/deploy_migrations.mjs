import { Client } from 'ssh2';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const VPS = {
    host: '187.77.76.221',
    port: 22,
    username: 'root',
    password: 'Bangla21@2121',
};

const PG_CONTAINER = 'supabase-db';

function sshExec(conn, cmd) {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let stdout = '', stderr = '';
            stream.on('data', d => stdout += d.toString());
            stream.stderr.on('data', d => stderr += d.toString());
            stream.on('close', () => resolve({ stdout: stdout.trim(), stderr: stderr.trim() }));
        });
    });
}

async function run() {
    const conn = new Client();

    await new Promise((resolve, reject) => {
        conn.on('ready', resolve);
        conn.on('error', reject);
        conn.connect(VPS);
    });
    console.log('✅ SSH connected to', VPS.host);

    // Verify container is running
    const { stdout: check } = await sshExec(conn, `docker ps --format '{{.Names}}' | grep ${PG_CONTAINER}`);
    if (!check) {
        console.log('❌ Container', PG_CONTAINER, 'not found!');
        conn.end();
        return;
    }
    console.log('🐘 PostgreSQL container:', PG_CONTAINER, '✅');

    // Get the DB password from env
    const { stdout: dbPass } = await sshExec(conn, `docker exec ${PG_CONTAINER} env | grep POSTGRES_PASSWORD`);
    console.log('🔑', dbPass || 'Using default postgres user');

    // Migration files to run in order
    const migrations = [
        '20260220073000_seed_homepage_dynamic_content.sql',
        '20260221_content_versions.sql',
        '20260222_media_library.sql',
    ];

    for (const migFile of migrations) {
        const filePath = join(rootDir, 'supabase', 'migrations', migFile);
        let sql;
        try {
            sql = readFileSync(filePath, 'utf-8');
        } catch (e) {
            console.log(`❌ Cannot read ${migFile}:`, e.message);
            continue;
        }

        // Write SQL to a temp file on the server, then execute
        // Base64 encode to avoid shell escaping issues
        const b64 = Buffer.from(sql).toString('base64');

        console.log(`\n🔄 Running migration: ${migFile}...`);

        // Write base64 SQL to temp file, decode, execute
        const { stdout, stderr } = await sshExec(conn,
            `echo '${b64}' | base64 -d > /tmp/_migration.sql && docker exec -i ${PG_CONTAINER} psql -U supabase_admin -d postgres < /tmp/_migration.sql 2>&1`
        );

        const output = (stdout + '\n' + stderr).trim();
        if (output.includes('ERROR')) {
            console.log(`⚠️  ${migFile} had errors:`);
            // Show only error lines
            output.split('\n').filter(l => l.includes('ERROR') || l.includes('NOTICE')).forEach(l => console.log('  ', l));
        } else {
            console.log(`✅ ${migFile}: SUCCESS`);
        }
        console.log('   Output:', output.substring(0, 300));
    }

    // Cleanup
    await sshExec(conn, 'rm -f /tmp/_migration.sql');

    conn.end();
    console.log('\n🎉 All migrations complete!');
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
