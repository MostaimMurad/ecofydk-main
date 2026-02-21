import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

// Test: try to read media_assets
const { data, error } = await supabase.from('media_assets').select('id').limit(1);
if (error) {
    console.log('media_assets not found:', error.message);
    console.log('Run: npx supabase db reset   to apply migrations');
} else {
    console.log('✅ media_assets table exists!');
}

// Test storage bucket
const { data: buckets } = await supabase.storage.listBuckets();
const hasBucket = buckets?.some(b => b.name === 'media');
console.log(hasBucket ? '✅ media storage bucket exists!' : '❌ media bucket not found');
