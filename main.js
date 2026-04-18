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
  const {
    type, status, search,
    dateFrom, dateTo,
    city, state, venueType,
    minCapacity, maxCapacity,
    minTicketPrice, maxTicketPrice,
    minEventRating, minRentalRate, maxRentalRate, minVenueRating,
  } = req.query

  try {
    const params = []
    let query = `
      SELECT
        e.event_id,
        e.name,
        e.capacity,
        e.type,
        e.status,
        e.is_sold_out,
        e.description,
        e.rating,
        lower(e.event_time_range)::date                    AS date,
        lower(e.event_time_range)::time                    AS start_time,
        upper(e.event_time_range)::time                    AS end_time,
        e.event_time_range,
        v.venue_id,
        v.name        AS venue_name,
        v.city,
        v.state,
        v.venue_type,
        v.base_rental_rate,
        v.contact_name,
        v.contact_phone,
        v.rating      AS venue_rating,
        COALESCE(SUM(t.quantity), 0)                       AS total_tickets,
        COALESCE(SUM(t.quantity - t.quantity_sold), 0)     AS tickets_available,
        COALESCE(SUM(t.quantity_sold), 0)                  AS tickets_sold,
        MIN(t.face_value_price)                            AS min_ticket_price,
        MAX(t.face_value_price)                            AS max_ticket_price
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE true
    `

    if (type)   { params.push(type);   query += ` AND e.type = $${params.length}` }
    if (status) { params.push(status); query += ` AND e.status = $${params.length}::event_status` }

    if (search) {
      params.push(`%${search}%`)
      query += ` AND (e.name ILIKE $${params.length} OR e.description ILIKE $${params.length} OR v.name ILIKE $${params.length})`
    }

    if (dateFrom) { params.push(dateFrom); query += ` AND lower(e.event_time_range)::date >= $${params.length}::date` }
    if (dateTo)   { params.push(dateTo);   query += ` AND lower(e.event_time_range)::date <= $${params.length}::date` }

    if (city)      { params.push(`%${city}%`);     query += ` AND v.city ILIKE $${params.length}` }
    if (state)     { params.push(state);            query += ` AND v.state = $${params.length}` }
    if (venueType) { params.push(`%${venueType}%`); query += ` AND v.venue_type ILIKE $${params.length}` }

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

// Returns events that don't yet have a pending/confirmed venue booking
app.get('/api/events/unbooked', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.event_id, e.name, lower(e.event_time_range)::date AS date
       FROM events e
       WHERE NOT EXISTS (
         SELECT 1 FROM venue_bookings vb
         WHERE vb.event_id = e.event_id
           AND vb.status IN ('pending', 'confirmed')
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
      `SELECT
        e.event_id,
        e.name,
        e.capacity,
        e.type,
        e.status,
        e.is_sold_out,
        e.description,
        e.rating,
        lower(e.event_time_range)::date  AS date,
        lower(e.event_time_range)::time  AS start_time,
        upper(e.event_time_range)::time  AS end_time,
        e.event_time_range,
        v.venue_id,
        v.name        AS venue_name,
        v.city, v.state,
        v.venue_type,
        v.base_rental_rate,
        v.contact_name, v.contact_phone,
        v.rating      AS venue_rating,
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

// Category counts
app.get("/api/categories/counts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT type, COUNT(*) AS count
      FROM events
      WHERE status = 'scheduled'
      GROUP BY type;
    `);
    const counts = {};
    result.rows.forEach(row => { counts[row.type] = Number(row.count); });
    res.json(counts);
  } catch (err) {
    console.error("Error fetching category counts:", err);
    res.status(500).json({ error: "Failed to fetch category counts" });
  }
});

// ── Tickets ───────────────────────────────────────────────

app.get('/api/events/:id/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        ticket_id,
        type,
        face_value_price,
        seat_location,
        status,
        quantity,
        quantity_sold,
        (quantity - quantity_sold) AS quantity_available
       FROM tickets
       WHERE event_id = $1
         AND status != 'sold'
         AND quantity_sold < quantity
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

app.get('/api/venues', async (req, res) => {
  const { city, type } = req.query
  try {
    let query = 'SELECT * FROM venues WHERE true'
    const params = []
    if (city) { params.push(`%${city}%`); query += ` AND city ILIKE $${params.length}` }
    if (type) { params.push(`%${type}%`); query += ` AND venue_type ILIKE $${params.length}` }
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Error fetching venues:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/venues/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM venues WHERE venue_id = $1`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Venue not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching venue:', err)
    res.status(500).json({ error: err.message })
  }
})

// Check venue availability using venue_availability table and TSRANGE overlap
app.get('/api/venues/:venueId/availability', async (req, res) => {
  const { eventId } = req.query
  try {
    const eventResult = await pool.query(
      `SELECT event_time_range FROM events WHERE event_id = $1`,
      [eventId]
    )
    if (!eventResult.rows.length) return res.json({ available: true })

    const { event_time_range } = eventResult.rows[0]

    const alreadyBooked = await pool.query(
      `SELECT venue_booking_id FROM venue_bookings
       WHERE event_id = $1 AND status IN ('pending', 'confirmed')`,
      [eventId]
    )
    if (alreadyBooked.rows.length > 0) {
      return res.json({ available: false, reason: 'This event already has a venue booking' })
    }

    const conflictResult = await pool.query(
      `SELECT venue_id FROM venue_availability
       WHERE venue_id = $1
         AND status IN ('booked', 'maintenance')
         AND booking_time_range && $2::tsrange
         AND (event_id IS NULL OR event_id != $3)`,
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
        total_revenue: 0, avg_sell_through_pct: 0, avg_event_rating: 0,
        avg_ticket_price: 0, avg_capacity: 0,
      })
    }

    const agg = rows.reduce((acc, row) => {
      acc.event_count        += parseInt(row.event_count || 0)
      acc.total_tickets_sold += parseInt(row.total_tickets_sold || 0)
      acc.total_capacity     += parseInt(row.total_capacity || 0)
      acc.total_revenue      += parseFloat(row.avg_ticket_price || 0) * parseInt(row.total_tickets_sold || 0)
      acc.ratings.push(parseFloat(row.avg_event_rating || 0))
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
                              : 0,
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
  const { city, state, venueType, type } = req.query
  try {
    const params = []
    let query = `SELECT * FROM venue_analytics_summary WHERE true`

    if (city)      { params.push(`%${city}%`);      query += ` AND city ILIKE $${params.length}` }
    if (state)     { params.push(state);             query += ` AND state = $${params.length}` }
    if (venueType) { params.push(`%${venueType}%`);  query += ` AND venue_type ILIKE $${params.length}` }

    // scope to venues that have hosted this event category
    if (type) {
      params.push(type)
      query += ` AND venue_id IN (
        SELECT DISTINCT venue_id FROM events WHERE type = $${params.length}
      )`
    }

    const { rows } = await pool.query(query, params)

    const agg = rows.reduce((acc, row) => {
      acc.total_venues       += 1
      acc.total_events       += parseInt(row.total_events || 0)
      acc.total_tickets_sold += parseInt(row.total_tickets_sold || 0)
      acc.total_capacity     += parseInt(row.total_capacity || 0)
      acc.total_revenue      += parseFloat(row.total_revenue || 0)
      acc.ratings.push(parseFloat(row.venue_rating || 0))
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
                              : 0,
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

app.post('/api/bookings/ticket', async (req, res) => {
  const client = await pool.connect()
  try {
    const {
      event_id, selected_ticket_id, quantity,
      name, contact_email, contact_phone, address, age, gender,
      payment_type, card_number_last_4, total_amount
    } = req.body

    const qty = parseInt(quantity) || 1

    if (!event_id || !selected_ticket_id || !name || !contact_email || !contact_phone) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    await client.query('BEGIN')

    const ticketCheck = await client.query(
      `SELECT ticket_id, status, face_value_price, quantity, quantity_sold
       FROM tickets WHERE ticket_id = $1 FOR UPDATE`,
      [selected_ticket_id]
    )

    if (!ticketCheck.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Ticket not found' })
    }

    const ticket = ticketCheck.rows[0]
    const available = ticket.quantity - ticket.quantity_sold

    if (available < qty) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        error: `Only ${available} ticket(s) available, but ${qty} requested`
      })
    }

    const ticketPrice = ticket.face_value_price
    const finalTotal = total_amount || (Number(ticketPrice) * qty)

    let customerId
    const existingCustomer = await client.query(
      `SELECT customer_id FROM customers WHERE contact_email = $1`,
      [contact_email]
    )
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(
        `UPDATE customers
         SET name = $1, contact_phone = $2, address = $3, age = $4, gender = $5
         WHERE customer_id = $6`,
        [name, contact_phone, address || null, age || null, gender || null, customerId]
      )
    } else {
      const newCustomer = await client.query(
        `INSERT INTO customers (name, type, contact_email, contact_phone, address, age, gender)
         VALUES ($1, 'customer', $2, $3, $4, $5, $6)
         RETURNING customer_id`,
        [name, contact_email, contact_phone, address || null, age || null, gender || null]
      )
      customerId = newCustomer.rows[0].customer_id
    }

    const txResult = await client.query(
      `INSERT INTO transactions (customer_id, type, status)
       VALUES ($1, 'customer', 'completed')
       RETURNING transaction_id`,
      [customerId]
    )
    const transactionId = txResult.rows[0].transaction_id

    await client.query(
      `INSERT INTO transaction_tickets (transaction_id, ticket_id, price_paid)
       VALUES ($1, $2, $3)`,
      [transactionId, selected_ticket_id, finalTotal]
    )

    await client.query(
      `UPDATE tickets SET quantity_sold = quantity_sold + $1 WHERE ticket_id = $2`,
      [qty, selected_ticket_id]
    )

    await client.query(
      `INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address)
       VALUES ($1, $2, 'completed', $3, $4, $5)`,
      [transactionId, payment_type, card_number_last_4 || null, finalTotal, address || null]
    )

    await client.query('COMMIT')
    res.status(201).json({
      success: true,
      booking_id: transactionId,
      transaction_id: transactionId,
      quantity: qty,
      total_amount: finalTotal,
      message: 'Ticket booked successfully'
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Ticket booking error:', err)
    res.status(500).json({ error: 'Failed to create booking: ' + err.message })
  } finally {
    client.release()
  }
})

app.post('/api/bookings/venue', async (req, res) => {
  const client = await pool.connect()
  try {
    const {
      event_id, venue_id,
      name, contact_email, contact_phone, address, age, gender, affiliated_organization,
      negotiated_price, payment_type, card_last_4, billing_address
    } = req.body

    if (!event_id || !venue_id || !name || !contact_email || !contact_phone) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    await client.query('BEGIN')

    const eventResult = await client.query(
      'SELECT event_time_range FROM events WHERE event_id = $1',
      [event_id]
    )
    const venueResult = await client.query(
      'SELECT base_rental_rate FROM venues WHERE venue_id = $1',
      [venue_id]
    )
    if (!eventResult.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Event not found' })
    }
    if (!venueResult.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Venue not found' })
    }
    const { event_time_range } = eventResult.rows[0]
    const { base_rental_rate } = venueResult.rows[0]

    const conflictCheck = await client.query(
      `SELECT venue_id FROM venue_availability
       WHERE venue_id = $1
         AND status IN ('booked', 'maintenance')
         AND booking_time_range && $2::tsrange
         AND (event_id IS NULL OR event_id != $3)`,
      [venue_id, event_time_range, event_id]
    )
    if (conflictCheck.rows.length > 0) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Venue already booked for this time slot' })
    }

    let customerId
    const existingCustomer = await client.query(
      `SELECT customer_id FROM customers WHERE contact_email = $1`,
      [contact_email]
    )
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(
        `UPDATE customers
         SET name = $1, contact_phone = $2, address = $3, age = $4,
             gender = $5, affiliated_organization = $6
         WHERE customer_id = $7`,
        [name, contact_phone, address || null, age || null, gender || null, affiliated_organization || null, customerId]
      )
    } else {
      const newCustomer = await client.query(
        `INSERT INTO customers (name, type, contact_email, contact_phone, address, age, gender, affiliated_organization)
         VALUES ($1, 'booker', $2, $3, $4, $5, $6, $7)
         RETURNING customer_id`,
        [name, contact_email, contact_phone, address || null, age || null, gender || null, affiliated_organization || null]
      )
      customerId = newCustomer.rows[0].customer_id
    }

    const finalPrice = negotiated_price || base_rental_rate

    const txResult = await client.query(
      `INSERT INTO transactions (customer_id, type, status)
       VALUES ($1, 'booker', 'pending')
       RETURNING transaction_id`,
      [customerId]
    )
    const transactionId = txResult.rows[0].transaction_id

    const bookingResult = await client.query(
      `INSERT INTO venue_bookings (event_id, venue_id, customer_id, transaction_id, negotiated_price, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING venue_booking_id`,
      [event_id, venue_id, customerId, transactionId, finalPrice]
    )

    await client.query(
      `INSERT INTO venue_availability (venue_id, booking_time_range, status, event_id)
      VALUES ($1, $2, 'booked', $3)`,
      [venue_id, event_time_range, event_id]
    );

    await client.query(
      `INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address)
       VALUES ($1, $2, 'pending', $3, $4, $5)`,
      [transactionId, payment_type, card_last_4 || null, finalPrice, billing_address || null]
    )

    await client.query('COMMIT')
    res.status(201).json({
      success: true,
      venue_booking_id: bookingResult.rows[0].venue_booking_id,
      transaction_id: transactionId,
      negotiated_price: finalPrice,
      message: 'Venue booking created successfully'
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Venue booking error:', err)
    res.status(500).json({ error: 'Failed to create booking: ' + err.message })
  } finally {
    client.release()
  }
})

app.patch('/api/bookings/ticket/:transactionId/cancel', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const txResult = await client.query(
      `SELECT transaction_id, status, transaction_time
       FROM transactions
       WHERE transaction_id = $1 AND type = 'customer'
       FOR UPDATE`,
      [req.params.transactionId]
    )

    if (!txResult.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Booking not found' })
    }

    const tx = txResult.rows[0]

    if (tx.status === 'cancelled') {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'Booking is already cancelled' })
    }

    const createdAt = new Date(tx.transaction_time)
    const now = new Date()
    const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000

    if (diffSeconds > 120) {
      await client.query('ROLLBACK')
      return res.status(403).json({ error: 'Cancellation window has expired (2 minutes)' })
    }

    const ticketRows = await client.query(
      `SELECT tt.ticket_id, tt.price_paid
       FROM transaction_tickets tt
       WHERE tt.transaction_id = $1`,
      [req.params.transactionId]
    )

    for (const row of ticketRows.rows) {
      await client.query(
        `UPDATE tickets
         SET quantity_sold = GREATEST(quantity_sold - 1, 0)
         WHERE ticket_id = $1`,
        [row.ticket_id]
      )
    }

    await client.query(
      `UPDATE transactions SET status = 'cancelled' WHERE transaction_id = $1`,
      [req.params.transactionId]
    )

    await client.query(
      `UPDATE payments SET payment_status = 'refunded' WHERE transaction_id = $1`,
      [req.params.transactionId]
    )

    await client.query('COMMIT')
    res.json({ success: true, message: 'Booking cancelled and tickets released' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Cancel booking error:', err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

app.patch('/api/bookings/venue/:venueBookingId/cancel', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const bookingResult = await client.query(
      `SELECT vb.venue_booking_id, vb.status, vb.transaction_id, t.transaction_time
       FROM venue_bookings vb
       JOIN transactions t ON vb.transaction_id = t.transaction_id
       WHERE vb.venue_booking_id = $1
       FOR UPDATE`,
      [req.params.venueBookingId]
    )

    if (!bookingResult.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Venue booking not found' })
    }

    const booking = bookingResult.rows[0]

    if (booking.status === 'cancelled') {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'Booking is already cancelled' })
    }

    const createdAt = new Date(booking.transaction_time)
    const now = new Date()
    const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000

    if (diffSeconds > 120) {
      await client.query('ROLLBACK')
      return res.status(403).json({ error: 'Cancellation window has expired (2 minutes)' })
    }

    await client.query(
      `UPDATE venue_bookings SET status = 'cancelled' WHERE venue_booking_id = $1`,
      [req.params.venueBookingId]
    )

    await client.query(
      `UPDATE transactions SET status = 'cancelled' WHERE transaction_id = $1`,
      [booking.transaction_id]
    )

    await client.query(
      `UPDATE payments SET payment_status = 'refunded' WHERE transaction_id = $1`,
      [booking.transaction_id]
    )

    await client.query('COMMIT')
    res.json({ success: true, message: 'Venue booking cancelled' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Cancel venue booking error:', err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))