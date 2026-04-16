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

app.get('/api/events', async (req, res) => {
  const { type, status, search, dateFrom, dateTo, city, state, venueType, minCapacity, maxCapacity, minTicketPrice, maxTicketPrice, minEventRating, minRentalRate, maxRentalRate, minVenueRating } = req.query
  try {
    const params = []
    let query = `SELECT e.*, v.name AS venue_name, v.city, v.state, v.venue_type, v.base_rental_rate, v.contact_name, v.contact_phone, v.rating AS venue_rating, COUNT(t.ticket_id) AS total_tickets, MIN(t.face_value_price) AS min_ticket_price, MAX(t.face_value_price) AS max_ticket_price, SUM(CASE WHEN t.status = 'available' THEN 1 ELSE 0 END) AS tickets_available, SUM(CASE WHEN t.status = 'sold' THEN 1 ELSE 0 END) AS tickets_sold, SUM(CASE WHEN t.status = 'reserved' THEN 1 ELSE 0 END) AS tickets_reserved FROM events e JOIN venues v ON e.venue_id = v.venue_id LEFT JOIN tickets t ON e.event_id = t.event_id WHERE true`
    if (type)        { params.push(type);                query += ` AND e.type = $${params.length}` }
    if (status)      { params.push(status);              query += ` AND e.status = $${params.length}` }
    if (search)      { params.push(`%${search}%`);       query += ` AND (e.name ILIKE $${params.length} OR e.description ILIKE $${params.length} OR v.name ILIKE $${params.length})` }
    if (dateFrom)    { params.push(dateFrom);             query += ` AND e.date >= $${params.length}` }
    if (dateTo)      { params.push(dateTo);               query += ` AND e.date <= $${params.length}` }
    if (city)        { params.push(`%${city}%`);         query += ` AND v.city ILIKE $${params.length}` }
    if (state)       { params.push(state);                query += ` AND v.state = $${params.length}` }
    if (venueType)   { params.push(`%${venueType}%`);    query += ` AND v.venue_type ILIKE $${params.length}` }
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
    query += ` ORDER BY e.date ASC`
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
      `SELECT e.*, v.name as venue_name, v.city, v.state, v.venue_type, v.base_rental_rate, v.contact_name, v.contact_phone, v.rating as venue_rating, v.venue_id, COUNT(t.ticket_id) FILTER (WHERE t.status = 'available') as tickets_available FROM events e JOIN venues v ON e.venue_id = v.venue_id LEFT JOIN tickets t ON e.event_id = t.event_id WHERE e.event_id = $1 GROUP BY e.event_id, v.venue_id`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching event:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/events/:id/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ticket_id, type, face_value_price, seat_location, status FROM tickets WHERE event_id = $1 AND status = 'available' ORDER BY type, face_value_price`,
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching tickets:', err)
    res.status(500).json({ error: err.message })
  }
})

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

app.get('/api/venues/:venueId/availability', async (req, res) => {
  const { eventId } = req.query
  try {
    const eventResult = await pool.query(`SELECT date, start_time, end_time FROM events WHERE event_id = $1`, [eventId])
    if (!eventResult.rows.length) return res.json({ available: true })
    const { date, start_time, end_time } = eventResult.rows[0]
    const conflictResult = await pool.query(
      `SELECT vb.venue_booking_id FROM venue_bookings vb JOIN events e ON vb.event_id = e.event_id WHERE vb.venue_id = $1 AND vb.status IN ('pending', 'confirmed') AND e.date = $2 AND e.event_id != $3 AND (e.start_time, e.end_time) OVERLAPS ($4::time, $5::time)`,
      [req.params.venueId, date, eventId, start_time, end_time]
    )
    res.json({ available: conflictResult.rows.length === 0 })
  } catch (err) {
    console.error('Error checking venue availability:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/bookings/ticket', async (req, res) => {
  const client = await pool.connect()
  try {
    const { event_id, selected_ticket_id, name, contact_email, contact_phone, address, age, gender, payment_type, card_last_4, billing_address } = req.body
    if (!event_id || !selected_ticket_id || !name || !contact_email || !contact_phone) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    await client.query('BEGIN')
    const ticketCheck = await client.query(`SELECT ticket_id, status, face_value_price FROM tickets WHERE ticket_id = $1 FOR UPDATE`, [selected_ticket_id])
    if (!ticketCheck.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Ticket not found' }) }
    if (ticketCheck.rows[0].status !== 'available') { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Ticket is no longer available' }) }
    const ticketPrice = ticketCheck.rows[0].face_value_price
    let customerId
    const existingCustomer = await client.query(`SELECT customer_id FROM customers WHERE contact_email = $1`, [contact_email])
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(`UPDATE customers SET name = $1, contact_phone = $2, address = $3, age = $4, gender = $5 WHERE customer_id = $6`, [name, contact_phone, address || null, age || null, gender || null, customerId])
    } else {
      const newCustomer = await client.query(`INSERT INTO customers (name, type, contact_email, contact_phone, address, age, gender) VALUES ($1, 'customer', $2, $3, $4, $5, $6) RETURNING customer_id`, [name, contact_email, contact_phone, address || null, age || null, gender || null])
      customerId = newCustomer.rows[0].customer_id
    }
    const txResult = await client.query(`INSERT INTO transactions (customer_id, type, status) VALUES ($1, 'customer', 'completed') RETURNING transaction_id`, [customerId])
    const transactionId = txResult.rows[0].transaction_id
    await client.query(`INSERT INTO transaction_tickets (transaction_id, ticket_id, price_paid) VALUES ($1, $2, $3)`, [transactionId, selected_ticket_id, ticketPrice])
    await client.query(`UPDATE tickets SET status = 'sold' WHERE ticket_id = $1`, [selected_ticket_id])
    await client.query(`INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address) VALUES ($1, $2, 'completed', $3, $4, $5)`, [transactionId, payment_type, card_last_4 || null, ticketPrice, billing_address || null])
    await client.query('COMMIT')
    res.status(201).json({ success: true, transaction_id: transactionId, total_amount: ticketPrice, message: 'Ticket booked successfully' })
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
    const { event_id, venue_id, name, contact_email, contact_phone, address, age, gender, affiliated_organization, negotiated_price, payment_type, card_last_4, billing_address } = req.body
    if (!event_id || !venue_id || !name || !contact_email || !contact_phone) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    await client.query('BEGIN')
    const eventResult = await client.query(`SELECT e.date, e.start_time, e.end_time, v.base_rental_rate FROM events e JOIN venues v ON e.venue_id = v.venue_id WHERE e.event_id = $1 AND e.venue_id = $2`, [event_id, venue_id])
    if (!eventResult.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Event or venue not found' }) }
    const { date, start_time, end_time, base_rental_rate } = eventResult.rows[0]
    const conflictCheck = await client.query(`SELECT vb.venue_booking_id FROM venue_bookings vb JOIN events e ON vb.event_id = e.event_id WHERE vb.venue_id = $1 AND vb.status IN ('pending', 'confirmed') AND e.date = $2 AND e.event_id != $3 AND (e.start_time, e.end_time) OVERLAPS ($4::time, $5::time)`, [venue_id, date, event_id, start_time, end_time])
    if (conflictCheck.rows.length > 0) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Venue already booked for this time slot' }) }
    let customerId
    const existingCustomer = await client.query(`SELECT customer_id FROM customers WHERE contact_email = $1`, [contact_email])
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].customer_id
      await client.query(`UPDATE customers SET name = $1, contact_phone = $2, address = $3, age = $4, gender = $5, affiliated_organization = $6 WHERE customer_id = $7`, [name, contact_phone, address || null, age || null, gender || null, affiliated_organization || null, customerId])
    } else {
      const newCustomer = await client.query(`INSERT INTO customers (name, type, contact_email, contact_phone, address, age, gender, affiliated_organization) VALUES ($1, 'booker', $2, $3, $4, $5, $6, $7) RETURNING customer_id`, [name, contact_email, contact_phone, address || null, age || null, gender || null, affiliated_organization || null])
      customerId = newCustomer.rows[0].customer_id
    }
    const finalPrice = negotiated_price || base_rental_rate
    const txResult = await client.query(`INSERT INTO transactions (customer_id, type, status) VALUES ($1, 'booker', 'pending') RETURNING transaction_id`, [customerId])
    const transactionId = txResult.rows[0].transaction_id
    const bookingResult = await client.query(`INSERT INTO venue_bookings (event_id, venue_id, customer_id, transaction_id, negotiated_price, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING venue_booking_id`, [event_id, venue_id, customerId, transactionId, finalPrice])
    await client.query(`INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address) VALUES ($1, $2, 'pending', $3, $4, $5)`, [transactionId, payment_type, card_last_4 || null, finalPrice, billing_address || null])
    await client.query('COMMIT')
    res.status(201).json({ success: true, venue_booking_id: bookingResult.rows[0].venue_booking_id, transaction_id: transactionId, negotiated_price: finalPrice, message: 'Venue booking created successfully' })
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