SELECT section, count(*) as cnt FROM content_blocks WHERE section LIKE 'whyjute%' OR section LIKE 'cert%' OR section LIKE 'home_partners%' GROUP BY section ORDER BY section;
