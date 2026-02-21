-- ==============================================
-- Phase 2: Content Version History & Draft/Publish
-- ==============================================

-- 1. Add status column to content_blocks
ALTER TABLE public.content_blocks
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 2. Add status column to translations
ALTER TABLE public.translations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 3. Content block version history table
CREATE TABLE public.content_block_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_block_id UUID NOT NULL REFERENCES public.content_blocks(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_type TEXT NOT NULL DEFAULT 'update' CHECK (change_type IN ('create', 'update', 'publish', 'unpublish', 'rollback')),
  -- Snapshot of the block at this version
  title_en TEXT,
  title_da TEXT,
  description_en TEXT,
  description_da TEXT,
  value TEXT,
  icon TEXT,
  color TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- 4. Translation version history table
CREATE TABLE public.translation_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID NOT NULL REFERENCES public.translations(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_type TEXT NOT NULL DEFAULT 'update' CHECK (change_type IN ('create', 'update', 'publish', 'unpublish', 'rollback')),
  value_en TEXT,
  value_da TEXT,
  status TEXT DEFAULT 'published'
);

-- 5. RLS for version tables
ALTER TABLE public.content_block_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view content block versions"
  ON public.content_block_versions FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert content block versions"
  ON public.content_block_versions FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view translation versions"
  ON public.translation_versions FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert translation versions"
  ON public.translation_versions FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- 6. Indexes for fast lookups
CREATE INDEX idx_cb_versions_block_id ON public.content_block_versions(content_block_id);
CREATE INDEX idx_cb_versions_changed_at ON public.content_block_versions(changed_at DESC);
CREATE INDEX idx_t_versions_translation_id ON public.translation_versions(translation_id);
CREATE INDEX idx_t_versions_changed_at ON public.translation_versions(changed_at DESC);

-- 7. Auto-save version trigger for content_blocks
CREATE OR REPLACE FUNCTION public.save_content_block_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_block_versions (
    content_block_id, changed_by, change_type,
    title_en, title_da, description_en, description_da,
    value, icon, color, image_url, metadata, sort_order, status
  ) VALUES (
    OLD.id, auth.uid(), 'update',
    OLD.title_en, OLD.title_da, OLD.description_en, OLD.description_da,
    OLD.value, OLD.icon, OLD.color, OLD.image_url, OLD.metadata, OLD.sort_order,
    OLD.status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_save_content_block_version
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.save_content_block_version();

-- 8. Auto-save version trigger for translations
CREATE OR REPLACE FUNCTION public.save_translation_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.translation_versions (
    translation_id, changed_by, change_type,
    value_en, value_da, status
  ) VALUES (
    OLD.id, auth.uid(), 'update',
    OLD.value_en, OLD.value_da, OLD.status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_save_translation_version
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.save_translation_version();
