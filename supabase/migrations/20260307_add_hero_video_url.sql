-- Migration: Add hero_video_url column to site_settings
-- Date: 2026-03-07

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;
