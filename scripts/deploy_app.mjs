import { Client } from 'ssh2';

const VPS = {
    host: '187.77.76.221',
    port: 22,
    username: 'root',
    password: 'Bangla21@2121',
};

const SUPABASE_URL = 'https://ecofy.dk';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxMzIyODAzLCJleHAiOjE5MjkwMDI4MDN9.KdIGQkPOt8cDCyRrGgtTBlWN2nc-8EcHWyDp8j9Zaic';

function sshExec(conn, cmd, timeoutMs = 600000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timeout: ${cmd.substring(0, 60)}`)), timeoutMs);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let stdout = '', stderr = '';
            stream.on('data', d => {
                const s = d.toString();
                stdout += s;
                // Print progress dots
                if (s.includes('Step') || s.includes('RUN') || s.includes('COPY') || s.includes('FROM') || s.includes('Successfully') || s.includes('error') || s.includes('Error')) {
                    process.stdout.write(s);
                } else {
                    process.stdout.write('.');
                }
            });
            stream.stderr.on('data', d => {
                const s = d.toString();
                stderr += s;
                if (s.includes('error') || s.includes('Error') || s.includes('Step') || s.includes('Successfully')) {
                    process.stderr.write(s);
                }
            });
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
    console.log('✅ SSH connected to', VPS.host);

    // Step 1: Clone or pull repo on server
    console.log('\n📦 Cloning repo on server...');
    const { stdout: cloneResult } = await sshExec(conn,
        `if [ -d /root/ecofydk-main ]; then cd /root/ecofydk-main && git pull origin main; else cd /root && git clone https://github.com/MostaimMurad/ecofydk-main.git; fi`,
        60000
    );
    console.log('\n' + cloneResult);

    // Step 2: Build Docker image on server
    console.log('\n🔨 Building Docker image on server (this may take 2-3 minutes)...');
    const { stdout: buildOut, stderr: buildErr } = await sshExec(conn,
        `cd /root/ecofydk-main && docker build --no-cache -t ecofydk-local:latest --build-arg VITE_SUPABASE_URL=${SUPABASE_URL} --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_ANON_KEY} . 2>&1`,
        600000
    );

    const fullBuildOutput = buildOut + '\n' + buildErr;
    if (fullBuildOutput.includes('Successfully built') || fullBuildOutput.includes('Successfully tagged') || fullBuildOutput.includes('exporting to image')) {
        console.log('\n✅ Build successful!');
    } else {
        console.log('\n⚠️ Build output (last 500 chars):', fullBuildOutput.slice(-500));
        if (fullBuildOutput.toLowerCase().includes('error')) {
            console.log('❌ Build may have failed. Check output above.');
            conn.end();
            return;
        }
    }

    // Step 3: Stop old container, start new
    console.log('\n🛑 Stopping old container...');
    await sshExec(conn, 'docker stop ecofydk-app 2>/dev/null; docker rm ecofydk-app 2>/dev/null', 15000);

    console.log('🚀 Starting new container...');
    const { stdout: runResult } = await sshExec(conn,
        'docker run -d --name ecofydk-app -p 3001:80 --restart unless-stopped ecofydk-local:latest',
        30000
    );
    console.log('Container ID:', runResult.substring(0, 12));

    // Step 4: Verify
    console.log('\n✅ Verifying...');
    const { stdout: verify } = await sshExec(conn, "sleep 2 && docker ps --filter 'name=ecofydk-app' --format '{{.Names}} {{.Image}} {{.Status}}'", 15000);
    console.log('Status:', verify);

    // Cleanup old images
    await sshExec(conn, 'docker image prune -f 2>/dev/null', 15000);

    conn.end();
    console.log('\n🎉 Deployment complete!');
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
