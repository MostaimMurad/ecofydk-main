import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: '55be3be4-3650-49f5-9799-1fab1dcb0a38', role: 'admin' })
    .select();

if (error) {
    console.log('Error:', error.message);
} else {
    console.log('Success! Admin role assigned:', JSON.stringify(data));
}

// Verify
const { data: roles } = await supabase.from('user_roles').select('*');
console.log('All roles:', JSON.stringify(roles));
