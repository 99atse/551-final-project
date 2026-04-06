const {Client}=require('pg')

const con=new Client({
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "root123",
    database: "event_db"
})

con.connect().then(()=> console.log("PostgreSQL DB connected!"))

// Test query
con.query('SELECT * FROM customers', (err, res)=> {
    if(!err)
        {
            console.log(res.rows)
        } else {
            console.log(err.message)
        }
        con.end;
})