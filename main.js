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
        e.*,
        v.name AS venue_name,
        v.city, v.state,
        v.venue_type, v.base_rental_rate,
        v.contact_name, v.contact_phone,
        v.rating AS venue_rating,
        COUNT(t.ticket_id) AS total_tickets,
        MIN(t.face_value_price) AS min_ticket_price,
        MAX(t.face_value_price) AS max_ticket_price
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE e.date >= CURRENT_DATE
      `

    if (type)   { params.push(type);   query += ` AND e.type = $${params.length}` }
    if (status) { params.push(status); query += ` AND e.status = $${params.length}` }

    if (search) {
      params.push(`%${search}%`)
      query += ` AND (e.name ILIKE $${params.length} OR e.description ILIKE $${params.length} OR v.name ILIKE $${params.length})`
    }

    if (dateFrom) { params.push(dateFrom); query += ` AND e.date >= $${params.length}` }
    if (dateTo)   { params.push(dateTo);   query += ` AND e.date <= $${params.length}` }

    if (city)     { params.push(`%${city}%`);     query += ` AND v.city ILIKE $${params.length}` }
    if (state)    { params.push(state);            query += ` AND v.state = $${params.length}` }
    if (venueType){ params.push(`%${venueType}%`); query += ` AND v.venue_type ILIKE $${params.length}` }

    if (minCapacity) { params.push(parseInt(minCapacity)); query += ` AND e.capacity >= $${params.length}` }
    if (maxCapacity) { params.push(parseInt(maxCapacity)); query += ` AND e.capacity <= $${params.length}` }

    if (minEventRating)  { params.push(parseFloat(minEventRating));  query += ` AND e.rating >= $${params.length}` }
    if (minRentalRate)   { params.push(parseFloat(minRentalRate));   query += ` AND v.base_rental_rate >= $${params.length}` }
    if (maxRentalRate)   { params.push(parseFloat(maxRentalRate));   query += ` AND v.base_rental_rate <= $${params.length}` }
    if (minVenueRating)  { params.push(parseFloat(minVenueRating));  query += ` AND v.rating >= $${params.length}` }

    query += ` GROUP BY e.event_id, v.venue_id`

    // ticket price filters go in HAVING since they use aggregates
    const havingClauses = []
    if (minTicketPrice) { params.push(parseFloat(minTicketPrice)); havingClauses.push(`MIN(t.face_value_price) >= $${params.length}`) }
    if (maxTicketPrice) { params.push(parseFloat(maxTicketPrice)); havingClauses.push(`MAX(t.face_value_price) <= $${params.length}`) }
    if (havingClauses.length) query += ` HAVING ${havingClauses.join(' AND ')}`

    query += ` ORDER BY e.date ASC`

    const { rows } = await pool.query(query, params)
    res.json(rows)
    console.log("QUERY:", query)
    console.log("PARAMS:", params)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, v.name as venue_name, v.city, v.state,
              v.venue_type, v.base_rental_rate, v.contact_name, v.contact_phone,
              v.rating as venue_rating
       FROM events e
       JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_id = $1`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET venues
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
    res.status(500).json({ error: err.message })
  }
})

// GET available tickets for an event
app.get('/api/events/:id/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM tickets WHERE event_id = $1 AND status = 'available'`,
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))