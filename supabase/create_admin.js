const https = require('https');
const fs = require('fs');

const data = JSON.stringify({ email: 'admin@ecofy.dk', password: '11223344++' });
const url = new URL('https://ecofy.dk/auth/v1/signup');

const options = {
    hostname: url.hostname, port: 443, path: url.pathname, method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxMzIyODAzLCJleHAiOjE5MjkwMDI4MDN9.KdIGQkPOt8cDCyRrGgtTBlWN2nc-8EcHWyDp8j9Zaic',
        'Content-Length': Buffer.byteLength(data)
    },
    rejectUnauthorized: false
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        const result = `Status: ${res.statusCode}\nBody: ${body}`;
        fs.writeFileSync('d:/Mostaim Dev/ecofydk-main/supabase/signup_result.txt', result);
    });
});

req.on('error', (e) => {
    fs.writeFileSync('d:/Mostaim Dev/ecofydk-main/supabase/signup_result.txt', `Error: ${e.message}`);
});

req.write(data);
req.end();
