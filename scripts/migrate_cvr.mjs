import { Client } from 'ssh2';

const VPS = {
    host: '187.77.76.221',
    port: 22,
    username: 'root',
    password: 'Bangla21@2121',
};

function sshExec(conn, cmd, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timeout: ${cmd.substring(0, 60)}`)), timeoutMs);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let stdout = '', stderr = '';
            stream.on('data', d => { stdout += d.toString(); });
            stream.stderr.on('data', d => { stderr += d.toString(); });
            stream.on('close', () => {
                clearTimeout(timer);
                resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
            });
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
    console.log('✅ SSH connected');

    // Get DB password
    const { stdout: dbPass } = await sshExec(conn,
        "docker exec supabase-db bash -c \"echo \\$POSTGRES_PASSWORD\"");
    console.log('DB password:', dbPass ? '***' : '(empty)');

    // Run CVR migration
    const sql = `ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cvr_number TEXT DEFAULT '';`;
    const sqlB64 = Buffer.from(sql).toString('base64');
    const cmd = `docker exec supabase-db bash -c "echo '${sqlB64}' | base64 -d | psql -U supabase_admin -d postgres"`;

    console.log('\n📦 Adding cvr_number column...');
    const { stdout, stderr } = await sshExec(conn, cmd);
    console.log('Result:', stdout);
    if (stderr) console.log('Stderr:', stderr);

    conn.end();
    console.log('\n✅ Migration complete!');
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
