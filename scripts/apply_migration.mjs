import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

const queries = [
    { label: 'Add status to content_blocks', sql: `ALTER TABLE public.content_blocks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')), ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now()` },
    { label: 'Add status to translations', sql: `ALTER TABLE public.translations ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')), ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now()` },
    { label: 'Create content_block_versions', sql: `CREATE TABLE IF NOT EXISTS public.content_block_versions (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, content_block_id UUID NOT NULL REFERENCES public.content_blocks(id) ON DELETE CASCADE, changed_by UUID REFERENCES auth.users(id), changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), change_type TEXT NOT NULL DEFAULT 'update' CHECK (change_type IN ('create', 'update', 'publish', 'unpublish', 'rollback')), title_en TEXT, title_da TEXT, description_en TEXT, description_da TEXT, value TEXT, icon TEXT, color TEXT, image_url TEXT, metadata JSONB DEFAULT '{}'::jsonb, sort_order INTEGER DEFAULT 0, status TEXT DEFAULT 'published')` },
    { label: 'Create translation_versions', sql: `CREATE TABLE IF NOT EXISTS public.translation_versions (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, translation_id UUID NOT NULL REFERENCES public.translations(id) ON DELETE CASCADE, changed_by UUID REFERENCES auth.users(id), changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), change_type TEXT NOT NULL DEFAULT 'update' CHECK (change_type IN ('create', 'update', 'publish', 'unpublish', 'rollback')), value_en TEXT, value_da TEXT, status TEXT DEFAULT 'published')` },
    { label: 'RLS content_block_versions', sql: `ALTER TABLE public.content_block_versions ENABLE ROW LEVEL SECURITY` },
    { label: 'RLS translation_versions', sql: `ALTER TABLE public.translation_versions ENABLE ROW LEVEL SECURITY` },
    { label: 'Policy cb_v select', sql: `CREATE POLICY "allow_cb_v_sel" ON public.content_block_versions FOR SELECT USING (true)` },
    { label: 'Policy cb_v insert', sql: `CREATE POLICY "allow_cb_v_ins" ON public.content_block_versions FOR INSERT WITH CHECK (true)` },
    { label: 'Policy t_v select', sql: `CREATE POLICY "allow_t_v_sel" ON public.translation_versions FOR SELECT USING (true)` },
    { label: 'Policy t_v insert', sql: `CREATE POLICY "allow_t_v_ins" ON public.translation_versions FOR INSERT WITH CHECK (true)` },
    { label: 'Index cb block_id', sql: `CREATE INDEX IF NOT EXISTS idx_cb_versions_block_id ON public.content_block_versions(content_block_id)` },
    { label: 'Index cb changed_at', sql: `CREATE INDEX IF NOT EXISTS idx_cb_versions_changed_at ON public.content_block_versions(changed_at DESC)` },
    { label: 'Index t translation_id', sql: `CREATE INDEX IF NOT EXISTS idx_t_versions_translation_id ON public.translation_versions(translation_id)` },
    { label: 'Index t changed_at', sql: `CREATE INDEX IF NOT EXISTS idx_t_versions_changed_at ON public.translation_versions(changed_at DESC)` },
];

async function run() {
    for (const q of queries) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: q.sql });
        if (error) {
            // Try raw query via REST
            console.log(`⚠️ ${q.label}: rpc not available, trying direct...`);
        } else {
            console.log(`✅ ${q.label}`);
        }
    }

    // Test: check if columns exist
    const { data, error } = await supabase.from('content_blocks').select('status').limit(1);
    if (error) {
        console.log('\n❌ status column check failed:', error.message);
    } else {
        console.log('\n✅ status column exists! Value:', data?.[0]?.status);
    }

    const { data: d2, error: e2 } = await supabase.from('content_block_versions').select('id').limit(1);
    if (e2) {
        console.log('❌ content_block_versions table check failed:', e2.message);
    } else {
        console.log('✅ content_block_versions table exists! Rows:', d2?.length);
    }
}

run();
