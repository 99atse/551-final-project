-- SET enable_indexscan = off;
-- SET enable_bitmapscan = off;  -- also disable this or Postgres may still use the index
-- EXPLAIN (ANALYZE, BUFFERS)
-- SELECT venue_id
-- FROM venue_availability
-- WHERE venue_id = 4
--   AND status IN ('booked', 'maintenance')
--   AND booking_time_range && tsrange('2026-07-04 20:00', '2026-07-05 04:00', '[)');

SET enable_indexscan = on;
SET enable_bitmapscan = on;
EXPLAIN (ANALYZE, BUFFERS)
SELECT venue_id
FROM venue_availability
WHERE venue_id = 4
  AND status IN ('booked', 'maintenance')
  AND booking_time_range && tsrange('2026-07-04 20:00', '2026-07-05 04:00', '[)');
