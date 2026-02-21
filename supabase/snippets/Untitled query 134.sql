ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS map_embed_url text DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS map_latitude text DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS map_longitude text DEFAULT '';