SET enable_indexscan = off;
SET enable_bitmapscan = off;  -- also disable this or Postgres may still use the index
EXPLAIN (ANALYZE, BUFFERS)
SELECT venue_id
FROM venue_availability
WHERE venue_id = 4
  AND status IN ('booked', 'maintenance')
  AND booking_time_range && tsrange('2026-07-04 20:00', '2026-07-05 04:00', '[)');

------------------------------------------------------------------ 
Seq Scan on venue_availability  (cost=0.00..29.78 rows=1 width=4) (actual time=0.018..0.026 rows=1.00 loops=1)
  Filter: ((status = ANY ('{booked,maintenance}'::availability_status[])) AND (booking_time_range && '[""2026-07-04 20:00:00"",""2026-07-05 04:00:00"")'::tsrange) AND (venue_id = 4))
  Rows Removed by Filter: 31
  Buffers: shared hit=1
Planning Time: 0.144 ms
Execution Time: 0.107 ms

------------------------------------------------------------------ 
SET enable_indexscan = on;
SET enable_bitmapscan = on;
EXPLAIN (ANALYZE, BUFFERS)
SELECT venue_id
FROM venue_availability
WHERE venue_id = 4
  AND status IN ('booked', 'maintenance')
  AND booking_time_range && tsrange('2026-07-04 20:00', '2026-07-05 04:00', '[)');

------------------------------------------------------------------ 
Index Scan using venue_availability_venue_id_booking_time_range_excl on venue_availability  (cost=0.14..8.17 rows=1 width=4) (actual time=0.028..0.029 rows=1.00 loops=1)
  Index Cond: ((venue_id = 4) AND (booking_time_range && '[""2026-07-04 20:00:00"",""2026-07-05 04:00:00"")'::tsrange))
  Filter: (status = ANY ('{booked,maintenance}'::availability_status[]))
  Index Searches: 1
  Buffers: shared hit=2
Planning Time: 0.289 ms
Execution Time: 0.045 ms
