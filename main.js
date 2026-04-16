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
        -- Ticket aggregates using quantity fields
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

    // Date filters using lower() of TSRANGE
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

    // Check venue_availability for overlapping booked slots
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

// ── Bookings ──────────────────────────────────────────────

// POST ticket booking (attendee)
// Uses FOR UPDATE row locking — demonstrates PostgreSQL MVCC preventing
// two users from purchasing the last ticket simultaneously

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

    // 1. Lock ticket row and check enough quantity is available
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

    // 2. Look up existing customer or create new
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

    // 3. Create transaction
    const txResult = await client.query(
      `INSERT INTO transactions (customer_id, type, status)
       VALUES ($1, 'customer', 'completed')
       RETURNING transaction_id`,
      [customerId]
    )
    const transactionId = txResult.rows[0].transaction_id

    // 4. Link ticket to transaction
    await client.query(
      `INSERT INTO transaction_tickets (transaction_id, ticket_id, price_paid)
       VALUES ($1, $2, $3)`,
      [transactionId, selected_ticket_id, finalTotal]
    )

    // 5. Increment quantity_sold by the requested quantity
    //    Triggers auto-update status and is_sold_out on the event
    await client.query(
      `UPDATE tickets SET quantity_sold = quantity_sold + $1 WHERE ticket_id = $2`,
      [qty, selected_ticket_id]
    )

    // 6. Record payment
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

// POST venue booking (organizer)
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

    // 1. Get event time range
    const eventResult = await client.query(
      `SELECT e.event_time_range, v.base_rental_rate
       FROM events e
       JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_id = $1 AND e.venue_id = $2`,
      [event_id, venue_id]
    )
    if (!eventResult.rows.length) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Event or venue not found' })
    }
    const { event_time_range, base_rental_rate } = eventResult.rows[0]

    // 2. Check venue_availability for conflicts using TSRANGE overlap
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

    // 3. Look up existing customer or create new
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

    // 4. Create transaction
    const txResult = await client.query(
      `INSERT INTO transactions (customer_id, type, status)
       VALUES ($1, 'booker', 'pending')
       RETURNING transaction_id`,
      [customerId]
    )
    const transactionId = txResult.rows[0].transaction_id

    // 5. Create venue booking
    const bookingResult = await client.query(
      `INSERT INTO venue_bookings (event_id, venue_id, customer_id, transaction_id, negotiated_price, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING venue_booking_id`,
      [event_id, venue_id, customerId, transactionId, finalPrice]
    )

    // 6. Record payment
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))