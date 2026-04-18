DROP MATERIALIZED VIEW IF EXISTS event_analytics_summary CASCADE;
DROP VIEW IF EXISTS event_analytics_detail CASCADE;

DROP MATERIALIZED VIEW IF EXISTS venue_analytics_summary CASCADE;
DROP VIEW IF EXISTS venue_analytics_detail CASCADE;

CREATE MATERIALIZED VIEW event_analytics_summary AS
SELECT
  e.type,
  e.status,
  v.city,
  v.state,
  v.venue_type,
  COUNT(DISTINCT e.event_id)                                                        AS event_count,
  ROUND(AVG(e.capacity), 0)::INT                                                    AS avg_capacity,
  ROUND(AVG(e.rating), 2)                                                           AS avg_event_rating,
  ROUND(AVG(t_agg.avg_price), 2)                                                    AS avg_ticket_price,
  COALESCE(SUM(t_agg.total_sold), 0)                                                AS total_tickets_sold,
  SUM(e.capacity)                                                                   AS total_capacity,
  ROUND(
    COALESCE(SUM(t_agg.total_sold), 0)::numeric / NULLIF(SUM(e.capacity), 0) * 100, 1
  )                                                                                 AS avg_sell_through_pct
FROM events e
JOIN venues v ON e.venue_id = v.venue_id
LEFT JOIN (
  SELECT event_id,
         AVG(face_value_price) AS avg_price,
         SUM(quantity_sold)    AS total_sold
  FROM tickets
  GROUP BY event_id
) t_agg ON t_agg.event_id = e.event_id
GROUP BY e.type, e.status, v.city, v.state, v.venue_type;

CREATE VIEW event_analytics_detail AS
SELECT
  e.event_id,
  e.name,
  e.capacity,
  e.type,
  e.status,
  e.is_sold_out,
  e.description,
  e.rating,
  lower(e.event_time_range)::date    AS date,
  lower(e.event_time_range)::time    AS start_time,
  upper(e.event_time_range)::time    AS end_time,
  v.venue_id,
  v.name                             AS venue_name,
  v.city,
  v.state,
  v.venue_type,
  v.base_rental_rate,
  v.max_capacity,
  v.rating                           AS venue_rating,
  COALESCE(SUM(t.quantity), 0)                        AS total_tickets,
  COALESCE(SUM(t.quantity_sold), 0)                   AS tickets_sold,
  COALESCE(SUM(t.quantity - t.quantity_sold), 0)      AS tickets_available,
  ROUND(MIN(t.face_value_price),2)                    AS min_ticket_price,
  ROUND(MAX(t.face_value_price),2)                    AS max_ticket_price,
  ROUND(AVG(t.face_value_price),2)                    AS avg_ticket_price,
  ROUND(SUM(t.quantity_sold * t.face_value_price),2)  AS total_revenue,
  ROUND(
    SUM(t.quantity_sold)::numeric / NULLIF(e.capacity, 0) * 100, 1
  )                                                   AS sell_through_pct
FROM events e
JOIN venues v ON e.venue_id = v.venue_id
LEFT JOIN tickets t ON e.event_id = t.event_id
GROUP BY e.event_id, v.venue_id;

-- Venue-level summary (materialized)
CREATE MATERIALIZED VIEW venue_analytics_summary AS
SELECT
  v.venue_id,
  v.name                                AS venue_name,
  v.city,
  v.state,
  v.venue_type,
  v.max_capacity,
  v.base_rental_rate,
  v.rating                              AS venue_rating,
  COUNT(e.event_id)                     AS total_events,
  ROUND(AVG(e.rating), 2)              AS avg_event_rating,
  ROUND(AVG(e.capacity), 0)::INT       AS avg_event_capacity,
  SUM(t.quantity_sold)                  AS total_tickets_sold,
  SUM(e.capacity)                       AS total_capacity,
  ROUND(
    SUM(t.quantity_sold)::numeric / NULLIF(SUM(e.capacity), 0) * 100, 1
  )                                     AS avg_sell_through_pct,
  ROUND(AVG(t.face_value_price), 2)    AS avg_ticket_price,
  ROUND(SUM(t.quantity_sold * t.face_value_price), 2) AS total_revenue
FROM venues v
LEFT JOIN events e ON v.venue_id = e.venue_id
LEFT JOIN tickets t ON e.event_id = t.event_id
GROUP BY v.venue_id;

-- Venue detail view (regular view)
CREATE VIEW venue_analytics_detail AS
SELECT
  v.venue_id,
  v.name                                AS venue_name,
  v.city,
  v.state,
  v.venue_type,
  v.address,
  v.zipcode,
  v.max_capacity,
  v.base_rental_rate,
  v.rating                              AS venue_rating,
  v.contact_name,
  v.contact_phone,
  v.contact_email,
  COUNT(DISTINCT e.event_id)            AS total_events,
  ROUND(AVG(e.rating), 2)              AS avg_event_rating,
  SUM(t.quantity_sold)                  AS total_tickets_sold,
  SUM(e.capacity)                       AS total_capacity,
  ROUND(
    SUM(t.quantity_sold)::numeric / NULLIF(SUM(e.capacity), 0) * 100, 1
  )                                     AS avg_sell_through_pct,
  ROUND(AVG(t.face_value_price), 2)    AS avg_ticket_price,
  ROUND(MIN(t.face_value_price), 2)    AS min_ticket_price,
  ROUND(MAX(t.face_value_price), 2)    AS max_ticket_price,
  ROUND(SUM(t.quantity_sold * t.face_value_price), 2) AS total_revenue
FROM venues v
LEFT JOIN events e ON v.venue_id = e.venue_id
LEFT JOIN tickets t ON e.event_id = t.event_id
GROUP BY v.venue_id;
