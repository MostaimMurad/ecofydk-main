// Import seed data into local Supabase content_blocks table
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

const files = [
    'content_blocks_pages.json',
    'content_blocks_pages2.json',
    'content_blocks_pages3.json',
    'content_blocks_pages4.json',
];

let totalInserted = 0;
let totalSkipped = 0;

for (const file of files) {
    const filePath = join(__dirname, file);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    console.log(`\n📄 Processing ${file} (${data.length} entries)...`);

    for (const entry of data) {
        const { error } = await supabase
            .from('content_blocks')
            .upsert(entry, { onConflict: 'id' });

        if (error) {
            console.log(`  ⚠️  Skipped ${entry.block_key}: ${error.message}`);
            totalSkipped++;
        } else {
            totalInserted++;
        }
    }

    console.log(`  ✅ Done with ${file}`);
}

console.log(`\n🎉 Import complete! Inserted/updated: ${totalInserted}, Skipped: ${totalSkipped}`);
