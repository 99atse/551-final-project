import pg from 'pg'

const { Client } = pg

const con = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'root123',
  database: 'event_db'
})

await con.connect()
console.log('PostgreSQL DB connected!')

try {
  const res = await con.query('SELECT * FROM customers')
  console.log(res.rows)
} catch (err) {
  console.log(err.message)
} finally {
  await con.end()
}