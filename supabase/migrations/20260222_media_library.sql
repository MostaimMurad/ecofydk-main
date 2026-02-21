-- ============================================================
-- Phase 3: Media Library — tables, storage, and RLS
-- ============================================================

-- 1. media_assets table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  width INTEGER,
  height INTEGER,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON public.media_assets(folder);
CREATE INDEX IF NOT EXISTS idx_media_assets_mime ON public.media_assets(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON public.media_assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_assets_tags ON public.media_assets USING GIN(tags);

-- 3. RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_select_all" ON public.media_assets
  FOR SELECT USING (true);

CREATE POLICY "media_insert_auth" ON public.media_assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "media_update_auth" ON public.media_assets
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "media_delete_auth" ON public.media_assets
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_media_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_updated_at();

-- 5. Storage bucket (Supabase storage)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies
CREATE POLICY "media_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "media_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "media_storage_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "media_storage_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);
