import pg from 'pg'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg
const app = express()
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'event_db'
})

pool.query('SELECT NOW()', (err) => {
  if (err) console.error('Database connection error:', err)
  else console.log('Database connected successfully')
})

// ── Events ────────────────────────────────────────────────

app.get('/api/events', async (req, res) => {
  const { type, status, search, dateFrom, dateTo, city, state, venueType, minCapacity, maxCapacity, minTicketPrice, maxTicketPrice, minEventRating, minRentalRate, maxRentalRate, minVenueRating } = req.query
  try {
    const params = []
    let query = `
      SELECT e.event_id, e.name, e.capacity, e.type, e.status, e.is_sold_out, e.description, e.rating,
        lower(e.event_time_range)::date AS date,
        lower(e.event_time_range)::time AS start_time,
        upper(e.event_time_range)::time AS end_time,
        e.event_time_range,
        v.venue_id, v.name AS venue_name, v.city, v.state, v.venue_type,
        v.base_rental_rate, v.contact_name, v.contact_phone, v.rating AS venue_rating,
        COALESCE(SUM(t.quantity), 0) AS total_tickets,
        COALESCE(SUM(t.quantity - t.quantity_sold), 0) AS tickets_available,
        COALESCE(SUM(t.quantity_sold), 0) AS tickets_sold,
        MIN(t.face_value_price) AS min_ticket_price,
        MAX(t.face_value_price) AS max_ticket_price
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE true`
    if (type)        { params.push(type);                  query += ` AND e.type = $${params.length}` }
    if (status)      { params.push(status);                query += ` AND e.status = $${params.length}::event_status` }
    if (search)      { params.push(`%${search}%`);         query += ` AND (e.name ILIKE $${params.length} OR e.description ILIKE $${params.length} OR v.name ILIKE $${params.length})` }
    if (dateFrom)    { params.push(dateFrom);              query += ` AND lower(e.event_time_range)::date >= $${params.length}::date` }
    if (dateTo)      { params.push(dateTo);                query += ` AND lower(e.event_time_range)::date <= $${params.length}::date` }
    if (city)        { params.push(`%${city}%`);           query += ` AND v.city ILIKE $${params.length}` }
    if (state)       { params.push(state);                 query += ` AND v.state = $${params.length}` }
    if (venueType)   { params.push(`%${venueType}%`);      query += ` AND v.venue_type ILIKE $${params.length}` }
    if (minCapacity)    { params.push(parseInt(minCapacity));      query += ` AND e.capacity >= $${params.length}` }
    if (maxCapacity)    { params.push(parseInt(maxCapacity));      query += ` AND e.capacity <= $${params.length}` }
    if (minEventRating) { params.push(parseFloat(minEventRating)); query += ` AND e.rating >= $${params.length}` }
    if (minRentalRate)  { params.push(parseFloat(minRentalRate));  query += ` AND v.base_rental_rate >= $${params.length}` }
    if (maxRentalRate)  { params.push(parseFloat(maxRentalRate));  query += ` AND v.base_rental_rate <= $${params.length}` }
    if (minVenueRating) { params.push(parseFloat(minVenueRating)); query += ` AND v.rating >= $${params.length}` }
    query += ` GROUP BY e.event_id, v.venue_id`
    const havingClauses = []
    if (minTicketPrice) { params.push(parseFloat(minTicketPrice)); havingClauses.push(`MIN(t.face_value_price) >= $${params.length}`) }
    if (maxTicketPrice) { params.push(parseFloat(maxTicketPrice)); havingClauses.push(`MAX(t.face_value_price) <= $${params.length}`) }
    if (havingClauses.length) query += ` HAVING ${havingClauses.join(' AND ')}`
    query += ` ORDER BY lower(e.event_time_range) ASC`
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Error fetching events:', err)
    res.status(500).json({ error: err.message })
  }
})

// Must come BEFORE /api/events/:id
app.get('/api/events/unbooked', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.event_id, e.name, lower(e.event_time_range)::date AS date
       FROM events e
       WHERE NOT EXISTS (
         SELECT 1 FROM venue_bookings vb
         WHERE vb.event_id = e.event_id AND vb.status IN ('pending', 'confirmed')
       )
       ORDER BY lower(e.event_time_range) ASC`
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching unbooked events:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.event_id, e.name, e.capacity, e.type, e.status, e.is_sold_out, e.description, e.rating,
        lower(e.event_time_range)::date AS date,
        lower(e.event_time_range)::time AS start_time,
        upper(e.event_time_range)::time AS end_time,
        e.event_time_range,
        v.venue_id, v.name AS venue_name, v.city, v.state, v.venue_type,
        v.base_rental_rate, v.contact_name, v.contact_phone, v.rating AS venue_rating,
        COALESCE(SUM(t.quantity - t.quantity_sold), 0) AS tickets_available
       FROM events e
       JOIN venues v ON e.venue_id = v.venue_id
       LEFT JOIN tickets t ON e.event_id = t.event_id
       WHERE e.event_id = $1
       GROUP BY e.event_id, v.venue_id`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching event:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/categories/counts', async (req, res) => {
  try {
    const result = await pool.query(`SELECT type, COUNT(*) AS count FROM events WHERE status = 'scheduled' GROUP BY type`)
    const counts = {}
    result.rows.forEach(row => { counts[row.type] = Number(row.count) })
    res.json(counts)
  } catch (err) {
    console.error('Error fetching category counts:', err)
    res.status(500).json({ error: 'Failed to fetch category counts' })
  }
})

// ── Tickets ───────────────────────────────────────────────

app.get('/api/events/:id/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ticket_id, type, face_value_price, seat_location, status, quantity, quantity_sold,
              (quantity - quantity_sold) AS quantity_available
       FROM tickets
       WHERE event_id = $1 AND status != 'sold' AND quantity_sold < quantity
       ORDER BY type, face_value_price`,
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching tickets:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Venues ────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════
// FIX 1: Replace your GET /api/venues route in main.js
// It now joins venue_availability so each available slot = 1 row,
// and supports the bookingTime filter using TSRANGE overlap (&&)
// ═══════════════════════════════════════════════════════════

app.get('/api/venues', async (req, res) => {
  const { search, city, state, venueType, minCapacity, maxCapacity, minRentalRate, maxRentalRate, minVenueRating, bookingTimeRange } = req.query
  try {
    const params = []
    // JOIN venue_availability so each available time slot produces a separate row.
    // This is what lets the same venue appear twice if it has two available slots.
    let query = `
      SELECT
        v.venue_id,
        v.name,
        v.city,
        v.state,
        v.venue_type,
        v.base_rental_rate,
        v.max_capacity,
        v.contact_name,
        v.contact_phone,
        v.contact_email,
        v.rating,
        COUNT(DISTINCT e.event_id) AS total_events,
        AVG(e.rating)              AS avg_event_rating,
        va.booking_time_range,
        va.status                  AS availability_status
      FROM venues v
      JOIN venue_availability va ON v.venue_id = va.venue_id
      LEFT JOIN events e ON v.venue_id = e.venue_id
      WHERE va.status = 'available'
    `

    if (search)        { params.push(`%${search}%`);           query += ` AND v.name ILIKE $${params.length}` }
    if (city)          { params.push(`%${city}%`);             query += ` AND v.city ILIKE $${params.length}` }
    if (state)         { params.push(state);                    query += ` AND v.state = $${params.length}` }
    if (venueType)     { params.push(`%${venueType}%`);        query += ` AND v.venue_type ILIKE $${params.length}` }
    if (minCapacity)   { params.push(parseInt(minCapacity));    query += ` AND v.max_capacity >= $${params.length}` }
    if (maxCapacity)   { params.push(parseInt(maxCapacity));    query += ` AND v.max_capacity <= $${params.length}` }
    if (minRentalRate) { params.push(parseFloat(minRentalRate)); query += ` AND v.base_rental_rate >= $${params.length}` }
    if (maxRentalRate) { params.push(parseFloat(maxRentalRate)); query += ` AND v.base_rental_rate <= $${params.length}` }
    if (minVenueRating){ params.push(parseFloat(minVenueRating)); query += ` AND v.rating >= $${params.length}` }

    // Time filter: user inputs a time like "16:00" and we find all slots
    // whose booking_time_range overlaps a 1-minute window at that time.
    // e.g. a venue available 15:00–17:00 will match a search for "16:00"
    // because [16:00, 16:01) && [15:00, 17:00) is true.
    if (bookingTimeRange) {
      // Parse the time input — accept HH:MM or HH:MM-HH:MM formats
      const timeStr = bookingTimeRange.trim()
      const rangeMatch = timeStr.match(/^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/)
      const singleMatch = timeStr.match(/^(\d{1,2}:\d{2})$/)

      if (rangeMatch) {
        // User typed a range like "14:00-18:00" — use it directly as a TSRANGE
        const today = new Date().toISOString().split('T')[0]
        const tsFrom = `${today} ${rangeMatch[1]}`
        const tsTo   = `${today} ${rangeMatch[2]}`
        params.push(`[${tsFrom}, ${tsTo})`)
        query += ` AND va.booking_time_range && $${params.length}::tsrange`
      } else if (singleMatch) {
        // User typed a single time like "16:00" — find any slot containing that moment
        const today = new Date().toISOString().split('T')[0]
        const tsPoint = `${today} ${singleMatch[1]}`
        params.push(`[${tsPoint}, ${tsPoint}]`)
        query += ` AND va.booking_time_range && $${params.length}::tsrange`
      }
    }

    // Group by both venue AND the specific availability slot so each slot is its own row
    query += `
      GROUP BY
        v.venue_id, v.name, v.city, v.state, v.venue_type,
        v.base_rental_rate, v.max_capacity, v.contact_name,
        v.contact_phone, v.contact_email, v.rating,
        va.booking_time_range, va.status
      ORDER BY v.rating DESC, lower(va.booking_time_range) ASC
    `

    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Error fetching venues:', err)
    res.status(500).json({ error: err.message })
  }
})

// Must come BEFORE /api/venues/:id
app.get('/api/venues/available', async (req, res) => {
  const { search, city, state, venueType, minCapacity, maxCapacity, minRentalRate, maxRentalRate, minVenueRating, dateFrom, dateTo } = req.query
  try {
    const params = []
    let query = `
      SELECT va.venue_id, va.booking_time_range,
        lower(va.booking_time_range)::date AS available_date,
        lower(va.booking_time_range)::time AS available_from,
        upper(va.booking_time_range)::time AS available_to,
        v.name AS venue_name, v.address, v.city, v.state, v.zipcode,
        v.venue_type, v.base_rental_rate, v.max_capacity,
        v.contact_name, v.contact_phone, v.contact_email, v.rating AS venue_rating
      FROM venue_availability va
      JOIN venues v ON va.venue_id = v.venue_id
      WHERE va.status = 'available'`
    if (dateFrom)      { params.push(dateFrom);                query += ` AND lower(va.booking_time_range)::date >= $${params.length}::date` }
    if (dateTo)        { params.push(dateTo);                  query += ` AND lower(va.booking_time_range)::date <= $${params.length}::date` }
    if (search)        { params.push(`%${search}%`);           query += ` AND v.name ILIKE $${params.length}` }
    if (city)          { params.push(`%${city}%`);             query += ` AND v.city ILIKE $${params.length}` }
    if (state)         { params.push(state);                   query += ` AND v.state = $${params.length}` }
    if (venueType)     { params.push(`%${venueType}%`);        query += ` AND v.venue_type ILIKE $${params.length}` }
    if (minCapacity)   { params.push(parseInt(minCapacity));   query += ` AND v.max_capacity >= $${params.length}` }
    if (maxCapacity)   { params.push(parseInt(maxCapacity));   query += ` AND v.max_capacity <= $${params.length}` }
    if (minRentalRate) { params.push(parseFloat(minRentalRate)); query += ` AND v.base_rental_rate >= $${params.length}` }
    if (maxRentalRate) { params.push(parseFloat(maxRentalRate)); query += ` AND v.base_rental_rate <= $${params.length}` }
    if (minVenueRating){ params.push(parseFloat(minVenueRating)); query += ` AND v.rating >= $${params.length}` }
    query += ` ORDER BY lower(va.booking_time_range) ASC`
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Error fetching available venues:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/venues/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM venues WHERE venue_id = $1`, [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Venue not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching venue:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/venues/:venueId/availability', async (req, res) => {
  const { eventId } = req.query
  try {
    const eventResult = await pool.query(`SELECT event_time_range FROM events WHERE event_id = $1`, [eventId])
    if (!eventResult.rows.length) return res.json({ available: true })
    const { event_time_range } = eventResult.rows[0]
    const alreadyBooked = await pool.query(`SELECT venue_booking_id FROM venue_bookings WHERE event_id = $1 AND status IN ('pending', 'confirmed')`, [eventId])
    if (alreadyBooked.rows.length > 0) return res.json({ available: false, reason: 'This event already has a venue booking' })
    const conflictResult = await pool.query(
      `SELECT venue_id FROM venue_availability WHERE venue_id = $1 AND status IN ('booked', 'maintenance') AND booking_time_range && $2::tsrange AND (event_id != $3)`,
      [req.params.venueId, event_time_range, eventId]
    )
    res.json({ available: conflictResult.rows.length === 0 })
  } catch (err) {
    console.error('Error checking venue availability:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Analyst ───────────────────────────────────────────────

app.get('/api/analytics/summary', async (req, res) => {
  const { type, status, city, state, venueType } = req.query

  try {
    const params = []
    let query = `SELECT * FROM event_analytics_summary WHERE true`

    // type must be first and exact match
    if (type)      { params.push(type);            query += ` AND type = $${params.length}` }
    if (status)    { params.push(status);           query += ` AND status = $${params.length}::event_status` }
    if (city)      { params.push(`%${city}%`);      query += ` AND city ILIKE $${params.length}` }
    if (state)     { params.push(state);            query += ` AND state = $${params.length}` }
    if (venueType) { params.push(`%${venueType}%`); query += ` AND venue_type ILIKE $${params.length}` }

    const { rows } = await pool.query(query, params)

    if (rows.length === 0) {
      return res.json({
        event_count: 0, total_tickets_sold: 0, total_capacity: 0,
        total_revenue: 0, avg_sell_through_pct: 0, avg_event_rating: null,
        avg_ticket_price: 0, avg_capacity: 0,
      })
    }

    const agg = rows.reduce((acc, row) => {
      acc.event_count        += parseInt(row.event_count || 0)
      acc.total_tickets_sold += parseInt(row.total_tickets_sold || 0)
      acc.total_capacity     += parseInt(row.total_capacity || 0)
      acc.total_revenue      += parseFloat(row.avg_ticket_price || 0) * parseInt(row.total_tickets_sold || 0)

      // Ignore null/invalid ratings so they do not skew the overall average.
      if (row.avg_event_rating !== null && row.avg_event_rating !== undefined) {
        const parsedRating = parseFloat(row.avg_event_rating)
        if (Number.isFinite(parsedRating)) acc.ratings.push(parsedRating)
      }

      acc.ticket_prices.push(parseFloat(row.avg_ticket_price || 0))
      return acc
    }, { event_count: 0, total_tickets_sold: 0, total_capacity: 0, total_revenue: 0, ratings: [], ticket_prices: [] })

    res.json({
      event_count:          agg.event_count,
      total_tickets_sold:   agg.total_tickets_sold,
      total_capacity:       agg.total_capacity,
      total_revenue:        parseFloat(agg.total_revenue.toFixed(2)),
      avg_sell_through_pct: agg.total_capacity > 0
                              ? parseFloat(((agg.total_tickets_sold / agg.total_capacity) * 100).toFixed(1))
                              : 0,
      avg_event_rating:     agg.ratings.length > 0
                              ? parseFloat((agg.ratings.reduce((a, b) => a + b, 0) / agg.ratings.length).toFixed(2))
                              : null,
      avg_ticket_price:     agg.ticket_prices.length > 0
                              ? parseFloat((agg.ticket_prices.reduce((a, b) => a + b, 0) / agg.ticket_prices.length).toFixed(2))
                              : 0,
      avg_capacity:         agg.event_count > 0
                              ? Math.round(agg.total_capacity / agg.event_count)
                              : 0,
    })
  } catch (err) {
    console.error('Error fetching analytics summary:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/analytics/events/:id/demographics', async (req, res) => {
  try {
    const [genderResult, ageResult, raceResult] = await Promise.all([
      pool.query(
        `SELECT c.gender, COUNT(*) as count
         FROM customers c
         JOIN transactions tx ON c.customer_id = tx.customer_id
         JOIN transaction_tickets tt ON tx.transaction_id = tt.transaction_id
         JOIN tickets t ON tt.ticket_id = t.ticket_id
         WHERE t.event_id = $1 AND c.gender IS NOT NULL
         GROUP BY c.gender ORDER BY count DESC`,
        [req.params.id]
      ),
      pool.query(
        `SELECT
           CASE
             WHEN c.age < 18 THEN 'Under 18'
             WHEN c.age BETWEEN 18 AND 24 THEN '18-24'
             WHEN c.age BETWEEN 25 AND 34 THEN '25-34'
             WHEN c.age BETWEEN 35 AND 44 THEN '35-44'
             WHEN c.age BETWEEN 45 AND 54 THEN '45-54'
             WHEN c.age >= 55 THEN '55+'
           END as age_group,
           COUNT(*) as count
         FROM customers c
         JOIN transactions tx ON c.customer_id = tx.customer_id
         JOIN transaction_tickets tt ON tx.transaction_id = tt.transaction_id
         JOIN tickets t ON tt.ticket_id = t.ticket_id
         WHERE t.event_id = $1 AND c.age IS NOT NULL
         GROUP BY age_group ORDER BY age_group`,
        [req.params.id]
      ),
      pool.query(
        `SELECT c.race, COUNT(*) as count
         FROM customers c
         JOIN transactions tx ON c.customer_id = tx.customer_id
         JOIN transaction_tickets tt ON tx.transaction_id = tt.transaction_id
         JOIN tickets t ON tt.ticket_id = t.ticket_id
         WHERE t.event_id = $1 AND c.race IS NOT NULL
         GROUP BY c.race ORDER BY count DESC`,
        [req.params.id]
      )
    ])
    res.json({
      gender: genderResult.rows,
      age:    ageResult.rows,
      race:   raceResult.rows,
    })
  } catch (err) {
    console.error('Error fetching demographics:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/analytics/events/:id/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        type,
        MIN(face_value_price)        AS min_price,
        MAX(face_value_price)        AS max_price,
        SUM(quantity)                AS total_quantity,
        SUM(quantity_sold)           AS total_sold,
        SUM(quantity - quantity_sold) AS total_available
       FROM tickets
       WHERE event_id = $1
       GROUP BY type
       ORDER BY min_price ASC`,
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching analytics tickets:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/analytics/events/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM event_analytics_detail WHERE event_id = $1`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json({ detail: rows[0] })
  } catch (err) {
    console.error('Error fetching event analytics:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/analytics/venues/summary', async (req, res) => {
  const { city, state, venueType, type, minTotalEvents, minSellThrough, minTotalRevenue } = req.query
  try {
    const params = []
    let query = `SELECT * FROM venue_analytics_summary WHERE true`

    if (city)      { params.push(`%${city}%`);      query += ` AND city ILIKE $${params.length}` }
    if (state)     { params.push(state);             query += ` AND state = $${params.length}` }
    if (venueType) { params.push(`%${venueType}%`);  query += ` AND venue_type ILIKE $${params.length}` }

    if (type) {
      params.push(type)
      query += ` AND venue_id IN (
        SELECT DISTINCT venue_id FROM events WHERE type = $${params.length}
      )`
    }

    if (minTotalEvents)  { params.push(parseInt(minTotalEvents));    query += ` AND total_events >= $${params.length}` }
    if (minSellThrough)  { params.push(parseFloat(minSellThrough));  query += ` AND avg_sell_through_pct >= $${params.length}` }
    if (minTotalRevenue) { params.push(parseFloat(minTotalRevenue)); query += ` AND total_revenue >= $${params.length}` }

    const { rows } = await pool.query(query, params)

    const agg = rows.reduce((acc, row) => {
      acc.total_venues       += 1
      acc.total_events       += parseInt(row.total_events || 0)
      acc.total_tickets_sold += parseInt(row.total_tickets_sold || 0)
      acc.total_capacity     += parseInt(row.total_capacity || 0)
      acc.total_revenue      += parseFloat(row.total_revenue || 0)

      // Ignore null/invalid ratings so they do not skew the overall average.
      if (row.venue_rating !== null && row.venue_rating !== undefined) {
        const parsedRating = parseFloat(row.venue_rating)
        if (Number.isFinite(parsedRating)) acc.ratings.push(parsedRating)
      }

      return acc
    }, { total_venues: 0, total_events: 0, total_tickets_sold: 0, total_capacity: 0, total_revenue: 0, ratings: [] })

    res.json({
      total_venues:         agg.total_venues,
      total_events:         agg.total_events,
      total_tickets_sold:   agg.total_tickets_sold,
      total_capacity:       agg.total_capacity,
      total_revenue:        parseFloat(agg.total_revenue.toFixed(2)),
      avg_venue_rating:     agg.ratings.length > 0
                              ? parseFloat((agg.ratings.reduce((a, b) => a + b, 0) / agg.ratings.length).toFixed(2))
                              : null,
      avg_sell_through_pct: agg.total_capacity > 0
                              ? parseFloat(((agg.total_tickets_sold / agg.total_capacity) * 100).toFixed(1))
                              : 0,
      breakdown: rows
    })
  } catch (err) {
    console.error('Error fetching venue analytics summary:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/analytics/venues/:id', async (req, res) => {
  try {
    const [detailResult, eventsResult] = await Promise.all([
      pool.query(
        `SELECT * FROM venue_analytics_detail WHERE venue_id = $1`,
        [req.params.id]
      ),
      pool.query(
        `SELECT
          e.event_id,
          e.name,
          e.status,
          e.capacity,
          e.rating,
          lower(e.event_time_range)::date AS date,
          COALESCE(SUM(t.quantity_sold), 0) AS tickets_sold,
          ROUND(
            COALESCE(SUM(t.quantity_sold), 0)::numeric / NULLIF(e.capacity, 0) * 100, 1
          ) AS sell_through_pct
         FROM events e
         LEFT JOIN tickets t ON e.event_id = t.event_id
         WHERE e.venue_id = $1
         GROUP BY e.event_id
         ORDER BY lower(e.event_time_range) DESC`,
        [req.params.id]
      )
    ])

    if (!detailResult.rows.length) return res.status(404).json({ error: 'Venue not found' })

    res.json({
      detail: detailResult.rows[0],
      events: eventsResult.rows
    })
  } catch (err) {
    console.error('Error fetching venue analytics:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Bookings ──────────────────────────────────────────────

// POST ticket booking
app.post('/api/bookings/ticket', async (req, res) => {
  const client = await pool.connect()
  try {
    const { event_id, selected_ticket_id, quantity, name, contact_email, contact_phone, address, age, gender, payment_type, card_number_last_4 } = req.body
    const qty = parseInt(quantity) || 1
    if (!event_id || !selected_ticket_id || !name || !contact_email || !contact_phone) return res.status(400).json({ error: 'Missing required fields' })
    if (qty < 1) return res.status(400).json({ error: 'Quantity must be at least 1' })
    await client.query('BEGIN')
    const ticketCheck = await client.query(
      `SELECT ticket_id, event_id, type, seat_location, face_value_price, quantity, quantity_sold
       FROM tickets
       WHERE ticket_id = $1
       FOR UPDATE`,
      [selected_ticket_id]
    )
    if (!ticketCheck.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Ticket not found' }) }
    const ticket = ticketCheck.rows[0]

    const ticketSelections = []

    // GA/pool inventory lives in one row; reserved seats usually use one row per seat.
    if (ticket.seat_location === 'GA' || Number(ticket.quantity) > 1) {
      const available = Number(ticket.quantity) - Number(ticket.quantity_sold)
      if (available < qty) {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: `Only ${available} ticket(s) available, but ${qty} requested` })
      }
      ticketSelections.push({
        ticket_id: ticket.ticket_id,
        quantity_to_book: qty,
        unit_price: Number(ticket.face_value_price),
      })
    } else {
      const sameTypeAvailable = await client.query(
        `SELECT ticket_id, quantity, quantity_sold, face_value_price
         FROM tickets
         WHERE event_id = $1
           AND type = $2
           AND (quantity - quantity_sold) > 0
         ORDER BY face_value_price ASC, ticket_id ASC
         FOR UPDATE`,
        [ticket.event_id, ticket.type]
      )

      let remaining = qty
      for (const row of sameTypeAvailable.rows) {
        if (remaining <= 0) break
        const rowAvailable = Number(row.quantity) - Number(row.quantity_sold)
        if (rowAvailable <= 0) continue

        const bookQty = Math.min(remaining, rowAvailable)
        ticketSelections.push({
          ticket_id: row.ticket_id,
          quantity_to_book: bookQty,
          unit_price: Number(row.face_value_price),
        })
        remaining -= bookQty
      }

      if (remaining > 0) {
        const totalAvailable = ticketSelections.reduce((sum, s) => sum + s.quantity_to_book, 0)
        await client.query('ROLLBACK')
        return res.status(400).json({ error: `Only ${totalAvailable} ticket(s) available, but ${qty} requested` })
      }
    }

    const finalTotal = ticketSelections.reduce((sum, s) => sum + (s.unit_price * s.quantity_to_book), 0)

    let customerId
    const existingCustomer = await client.query(`SELECT customer_id FROM customers WHERE contact_email = $1`, [contact_email])
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(`UPDATE customers SET name=$1, contact_phone=$2, address=$3, age=$4, gender=$5 WHERE customer_id=$6`, [name, contact_phone, address||null, age||null, gender||null, customerId])
    } else {
      const r = await client.query(`INSERT INTO customers (name,type,contact_email,contact_phone,address,age,gender) VALUES ($1,'customer',$2,$3,$4,$5,$6) RETURNING customer_id`, [name, contact_email, contact_phone, address||null, age||null, gender||null])
      customerId = r.rows[0].customer_id
    }
    const txResult = await client.query(`INSERT INTO transactions (customer_id,type,status) VALUES ($1,'customer','completed') RETURNING transaction_id`, [customerId])
    const transactionId = txResult.rows[0].transaction_id

    for (const selection of ticketSelections) {
      await client.query(
        `INSERT INTO transaction_tickets (transaction_id,ticket_id,price_paid) VALUES ($1,$2,$3)`,
        [transactionId, selection.ticket_id, selection.unit_price * selection.quantity_to_book]
      )
      await client.query(
        `UPDATE tickets
         SET quantity_sold = quantity_sold + $1,
             status = CASE
               WHEN seat_location <> 'GA' AND (quantity_sold + $1) > 0 THEN 'sold'::ticket_status
               WHEN (quantity_sold + $1) >= quantity THEN 'sold'::ticket_status
               WHEN (quantity_sold + $1) > 0 THEN
                 CASE
                   WHEN seat_location = 'GA' OR quantity > 1 THEN 'reserved'::ticket_status
                   ELSE status
                 END
               ELSE 'available'::ticket_status
             END
         WHERE ticket_id = $2`,
        [selection.quantity_to_book, selection.ticket_id]
      )
    }

    await client.query(`INSERT INTO payments (transaction_id,payment_type,payment_status,card_last_4,total_amount,billing_address) VALUES ($1,$2,'completed',$3,$4,$5)`, [transactionId, payment_type, card_number_last_4||null, finalTotal, address||null])
    await client.query('COMMIT')
    res.status(201).json({
      success: true,
      transaction_id: transactionId,
      total_amount: finalTotal,
      message: 'Ticket booking created successfully'
    })  
    } catch (err) {
    await client.query('ROLLBACK')
    console.error('Ticket booking error:', err)
    res.status(500).json({ error: 'Failed to create booking: ' + err.message })
  } finally { client.release() }
})

// POST venue booking
app.post('/api/bookings/venue', async (req, res) => {
  const client = await pool.connect()
  try {
    const { venue_id, event_name, event_description, event_start, event_end, event_type, name, contact_email, contact_phone, address, age, gender, affiliated_organization, negotiated_price, payment_type, card_last_4, billing_address } = req.body
    if (!venue_id || !event_name || !event_start || !event_end || !name || !contact_email || !contact_phone) return res.status(400).json({ error: 'Missing required fields' })

    const eventStartDate = new Date(event_start)
    const eventEndDate = new Date(event_end)
    if (Number.isNaN(eventStartDate.getTime()) || Number.isNaN(eventEndDate.getTime()) || eventEndDate <= eventStartDate) {
      return res.status(400).json({ error: 'Invalid event time range' })
    }

    await client.query('BEGIN')

    const event_time_range = `[${event_start}, ${event_end})`
    const venueResult = await client.query(`SELECT base_rental_rate, max_capacity FROM venues WHERE venue_id = $1`, [venue_id])
    if (!venueResult.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Venue not found' }) }
    const { base_rental_rate, max_capacity } = venueResult.rows[0]

    const conflictCheck = await client.query(`SELECT venue_id FROM venue_availability WHERE venue_id=$1 AND status IN ('booked','maintenance') AND booking_time_range && $2::tsrange`, [venue_id, event_time_range])
    if (conflictCheck.rows.length > 0) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Venue already booked for this time slot' }) }

    const EVENT_TYPE_MAP = {
      'concerts-festivals': 'Concerts/Festivals',
      'sporting-events': 'Sporting Events',
      'weddings': 'Weddings',
      'conventions': 'Conventions',
      'conferences': 'Conferences',
    }
    const rawEventType = (event_type || 'venue booking').toString().trim()
    const normalizedTypeKey = rawEventType
      .toLowerCase()
      .replace(/[\s/]+/g, '-')
      .replace(/-+/g, '-')
    const normalizedEventType = EVENT_TYPE_MAP[normalizedTypeKey] || rawEventType
    const eventInsert = await client.query(
      `INSERT INTO events (name, venue_id, event_time_range, capacity, type, status, is_sold_out, description)
       VALUES ($1, $2, $3::tsrange, $4, $5, 'scheduled', FALSE, $6)
       RETURNING event_id`,
      [event_name, venue_id, event_time_range, max_capacity, normalizedEventType, event_description || null]
    )
    const event_id = eventInsert.rows[0].event_id

    // Seed a GA ticket pool so tickets_available reflects venue capacity for new venue bookings.
    await client.query(
      `INSERT INTO tickets (event_id, type, status, seat_location, face_value_price, quantity, quantity_sold)
       VALUES ($1, 'General Admission', 'available', 'GA', 0, $2, 0)`,
      [event_id, max_capacity]
    )

    let customerId
    const existingCustomer = await client.query(`SELECT customer_id FROM customers WHERE contact_email = $1`, [contact_email])
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(`UPDATE customers SET name=$1,contact_phone=$2,address=$3,age=$4,gender=$5,affiliated_organization=$6 WHERE customer_id=$7`, [name, contact_phone, address||null, age||null, gender||null, affiliated_organization||null, customerId])
    } else {
      const r = await client.query(`INSERT INTO customers (name,type,contact_email,contact_phone,address,age,gender,affiliated_organization) VALUES ($1,'booker',$2,$3,$4,$5,$6,$7) RETURNING customer_id`, [name, contact_email, contact_phone, address||null, age||null, gender||null, affiliated_organization||null])
      customerId = r.rows[0].customer_id
    }
    const finalPrice = negotiated_price || base_rental_rate
    const txResult = await client.query(`INSERT INTO transactions (customer_id,type,status) VALUES ($1,'booker','confirmed') RETURNING transaction_id`, [customerId])
    const transactionId = txResult.rows[0].transaction_id
    const bookingResult = await client.query(`INSERT INTO venue_bookings (event_id,venue_id,customer_id,transaction_id,negotiated_price,status) VALUES ($1,$2,$3,$4,$5,'confirmed') RETURNING venue_booking_id`, [event_id, venue_id, customerId, transactionId, finalPrice])

    const availabilityUpdate = await client.query(
      `UPDATE venue_availability
       SET status='booked', event_id=$1
       WHERE venue_id=$2 AND booking_time_range=$3::tsrange AND status='available'
       RETURNING venue_id`,
      [event_id, venue_id, event_time_range]
    )
    if (!availabilityUpdate.rows.length) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Selected venue slot is no longer available' })
    }

    await client.query(`INSERT INTO payments (transaction_id,payment_type,payment_status,card_last_4,total_amount,billing_address) VALUES ($1,$2,'completed',$3,$4,$5)`, [transactionId, payment_type, card_last_4||null, finalPrice, billing_address||null])
    await client.query('COMMIT')
    res.status(201).json({ success: true, venue_booking_id: bookingResult.rows[0].venue_booking_id, transaction_id: transactionId, negotiated_price: finalPrice, event_name: event_name, message: 'Venue booking created successfully' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Venue booking error:', err)
    res.status(500).json({ error: 'Failed to create booking: ' + err.message })
  } finally { client.release() }
})

// PATCH cancel ticket — decrements by exact quantity purchased
app.patch('/api/bookings/ticket/:transactionId/cancel', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const txResult = await client.query(`SELECT transaction_id, status, transaction_time FROM transactions WHERE transaction_id=$1 AND type='customer' FOR UPDATE`, [req.params.transactionId])
    if (!txResult.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Booking not found' }) }
    const tx = txResult.rows[0]
    if (tx.status === 'cancelled') { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Booking is already cancelled' }) }
    const diffSeconds = (new Date().getTime() - new Date(tx.transaction_time).getTime()) / 1000
    if (diffSeconds > 120) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Cancellation window has expired (2 minutes)' }) }
    // Count exact quantity per ticket_id — this is the key fix
    const ticketRows = await client.query(
      `SELECT
         tt.ticket_id,
         GREATEST(
           COALESCE(
             SUM(
               CASE
                 WHEN t.face_value_price > 0 THEN ROUND(tt.price_paid / t.face_value_price)
                 ELSE 1
               END
             ),
             0
           )::int,
           1
         ) AS qty
       FROM transaction_tickets tt
       JOIN tickets t ON t.ticket_id = tt.ticket_id
       WHERE tt.transaction_id=$1
       GROUP BY tt.ticket_id`,
      [req.params.transactionId]
    )
    for (const row of ticketRows.rows) {
      await client.query(
        `UPDATE tickets
         SET quantity_sold = GREATEST(quantity_sold - $1, 0),
             status = CASE
               WHEN seat_location <> 'GA' AND GREATEST(quantity_sold - $1, 0) > 0 THEN 'sold'::ticket_status
               WHEN GREATEST(quantity_sold - $1, 0) >= quantity THEN 'sold'::ticket_status
               WHEN GREATEST(quantity_sold - $1, 0) > 0 THEN
                 CASE
                   WHEN seat_location = 'GA' OR quantity > 1 THEN 'reserved'::ticket_status
                   ELSE status
                 END
               ELSE 'available'::ticket_status
             END
         WHERE ticket_id = $2`,
        [parseInt(row.qty), row.ticket_id]
      )
    }

    // Mark refunded line items as negative to reflect reversal of original purchase amount.
    await client.query(
      `UPDATE transaction_tickets
       SET price_paid = -ABS(price_paid)
       WHERE transaction_id = $1`,
      [req.params.transactionId]
    )

    await client.query(`UPDATE transactions SET status='cancelled' WHERE transaction_id=$1`, [req.params.transactionId])
    await client.query(
      `UPDATE payments
       SET payment_status='refunded',
           total_amount = -ABS(total_amount)
       WHERE transaction_id=$1`,
      [req.params.transactionId]
    )
    await client.query('COMMIT')
    res.json({ success: true, message: 'Booking cancelled and tickets released' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Cancel ticket booking error:', err)
    res.status(500).json({ error: err.message })
  } finally { client.release() }
})

// PATCH cancel venue — also removes venue_availability booked slot
app.patch('/api/bookings/venue/:venueBookingId/cancel', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const bookingResult = await client.query(
      `SELECT vb.venue_booking_id, vb.status, vb.transaction_id, vb.venue_id, vb.event_id,
              e.event_time_range, t.transaction_time
       FROM venue_bookings vb
       JOIN transactions t ON vb.transaction_id=t.transaction_id
       JOIN events e ON vb.event_id=e.event_id
       WHERE vb.venue_booking_id=$1 FOR UPDATE`,
      [req.params.venueBookingId]
    )
    if (!bookingResult.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Venue booking not found' }) }
    const booking = bookingResult.rows[0]
    if (booking.status === 'cancelled') { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Booking is already cancelled' }) }
    const diffSeconds = (new Date().getTime() - new Date(booking.transaction_time).getTime()) / 1000
    if (diffSeconds > 120) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Cancellation window has expired (2 minutes)' }) }
    await client.query(`UPDATE venue_bookings SET status='cancelled' WHERE venue_booking_id=$1`, [req.params.venueBookingId])
    // Restore the exact slot so it appears again in available venue searches.
    // Fallback upsert handles legacy data where the booked row may not exist.
    const restoreAvailability = await client.query(
      `UPDATE venue_availability
       SET status='available', event_id=NULL
       WHERE venue_id=$1 AND event_id=$2
       RETURNING venue_id`,
      [booking.venue_id, booking.event_id]
    )
    if (!restoreAvailability.rows.length) {
      await client.query(
        `INSERT INTO venue_availability (venue_id, booking_time_range, status, event_id)
         VALUES ($1, $2::tsrange, 'available', NULL)
         ON CONFLICT (venue_id, booking_time_range)
         DO UPDATE SET status='available', event_id=NULL`,
        [booking.venue_id, booking.event_time_range]
      )
    }
    await client.query(`UPDATE transactions SET status='cancelled' WHERE transaction_id=$1`, [booking.transaction_id])
    await client.query(`UPDATE payments SET payment_status='refunded' WHERE transaction_id=$1`, [booking.transaction_id])
    await client.query('COMMIT')
    res.json({ success: true, message: 'Venue booking cancelled and slot released' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Cancel venue booking error:', err)
    res.status(500).json({ error: err.message })
  } finally { client.release() }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))