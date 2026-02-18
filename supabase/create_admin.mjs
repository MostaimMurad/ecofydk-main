// Use Supabase JS client to sign up the admin user
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
    'https://ecofy.dk',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxMzIyODAzLCJleHAiOjE5MjkwMDI4MDN9.KdIGQkPOt8cDCyRrGgtTBlWN2nc-8EcHWyDp8j9Zaic'
);

async function createAdmin() {
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@ecofy.dk',
        password: '11223344++',
        options: { data: { full_name: 'Admin' } }
    });

    const result = JSON.stringify({ data, error }, null, 2);
    fs.writeFileSync('d:/Mostaim Dev/ecofydk-main/supabase/signup_result.txt', result);
    process.exit(0);
}

createAdmin();
