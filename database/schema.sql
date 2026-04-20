-- PostgreSQL Database Setup Script for Event Management System
-- Note: Create the database first, then connect to it before running this script
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pageinspect;
CREATE EXTENSION IF NOT EXISTS pg_visibility;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS venue_availability CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS venue_bookings CASCADE;
DROP TABLE IF EXISTS transaction_tickets CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venues CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS availability_status CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

/* Define ENUMs for fixed status types */
CREATE TYPE event_status AS ENUM ('scheduled', 'complete', 'postponed', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('sold', 'available', 'reserved');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE availability_status AS ENUM('available', 'hold', 'booked', 'maintenance');
CREATE TYPE user_type AS ENUM ('customer', 'booker', 'both');

/* Create venues table */
CREATE TABLE venues (
	venue_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(2) NOT NULL,
	zipcode VARCHAR(10) NOT NULL,
	country VARCHAR(100) DEFAULT 'United States',
	venue_type VARCHAR(100) NOT NULL,
	base_rental_rate DECIMAL(10, 2) NOT NULL,
	max_capacity INT NOT NULL,
	contact_name VARCHAR(255) NOT NULL,
	contact_phone VARCHAR(20) NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5)
);

/* Create customers table*/
CREATE TABLE customers (
	customer_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	type user_type NOT NULL DEFAULT 'customer',
	age INT,
	race VARCHAR(100),
	gender VARCHAR(50),
	address VARCHAR(255),
	affiliated_organization VARCHAR(255),
	contact_phone VARCHAR(20) NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5)
);

/* Create events table (depends on venues) */
CREATE TABLE events (
	event_id SERIAL PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	venue_id INT NOT NULL,
	event_time_range TSRANGE NOT NULL,
	capacity INT NOT NULL,
	type VARCHAR(100) NOT NULL,
	status event_status NOT NULL DEFAULT 'scheduled',
	is_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
	description TEXT,
	rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
	FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
	CONSTRAINT capacity_positive CHECK (capacity >0)
);

/* Create transactions table */
CREATE TABLE transactions (
	transaction_id SERIAL PRIMARY KEY,
	customer_id INT NOT NULL,
	type VARCHAR(50) NOT NULL CHECK (type IN ('customer', 'booker')),
	status VARCHAR(50) NOT NULL,
	transaction_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

/* Create tickets table */
CREATE TABLE tickets (
	ticket_id SERIAL PRIMARY KEY,
	event_id INT NOT NULL,
	type VARCHAR(100) NOT NULL,
	status ticket_status NOT NULL DEFAULT 'available',
	seat_location VARCHAR(100) NOT NULL DEFAULT 'GA',
	face_value_price DECIMAL(10, 2) NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	quantity_sold INT NOT NULL DEFAULT 0,
	FOREIGN KEY (event_id) REFERENCES events(event_id),
	CONSTRAINT quantity_positive CHECK (quantity > 0),
	CONSTRAINT quantity_sold_not_negative CHECK (quantity_sold >= 0),
	CONSTRAINT ga_no_oversell CHECK (quantity_sold <= quantity),
	EXCLUDE USING gist(
		event_id WITH =,
		seat_location WITH =
	) WHERE (status = 'sold' AND seat_location <> 'GA')
);

/* Create transaction_tickets table */
CREATE TABLE transaction_tickets (
	transaction_id INT NOT NULL,
	ticket_id INT NOT NULL,
	price_paid DECIMAL(10, 2) NOT NULL,
	PRIMARY KEY (transaction_id, ticket_id),
	FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
	FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

/* Create venue_bookings table */
CREATE TABLE venue_bookings (
	venue_booking_id SERIAL PRIMARY KEY,
	event_id INT NOT NULL,
	venue_id INT NOT NULL,
	customer_id INT NOT NULL,
	transaction_id INT NOT NULL,
	status booking_status NOT NULL DEFAULT 'pending',
	negotiated_price DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (event_id) REFERENCES events(event_id),
	FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
	FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

/* Create payments table */
CREATE TABLE payments (
	payment_id SERIAL PRIMARY KEY,
	transaction_id INT NOT NULL,
	payment_type VARCHAR(50) NOT NULL,
	payment_status VARCHAR(50) NOT NULL,
	card_last_4 VARCHAR(4),
	total_amount DECIMAL(10, 2) NOT NULL,
	billing_address VARCHAR(255),
	tokenized_reference VARCHAR(255),
	FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

/* Create venue_availability table */
CREATE TABLE venue_availability (
	venue_id INT NOT NULL,
	event_id INT,
	booking_time_range TSRANGE NOT NULL,
	status availability_status NOT NULL DEFAULT 'available',
	PRIMARY KEY (venue_id, booking_time_range),
	FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
	FOREIGN KEY (event_id) REFERENCES events(event_id),
	EXCLUDE USING gist(
		venue_id WITH =,
		booking_time_range WITH &&
	)
);

/* Create preferences table */
CREATE TABLE preferences (
	preference_id SERIAL PRIMARY KEY,
	customer_id INT NOT NULL,
	preference_type VARCHAR(100) NOT NULL,
	value TEXT NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

/* ---------------------------------------------------------------
   TRIGGERS: GA availability, capacity enforcement, sold-out status
   All tables are defined above before any trigger logic.
   --------------------------------------------------------------- */
 
/* 1. Prevent event capacity from being exceeded.
      Uses (total - OLD.quantity_sold) + NEW.quantity_sold to compute
      the correct post-update total, since BEFORE triggers read
      pre-update values from the table. On INSERT, OLD is null so
      we coalesce OLD.quantity_sold to 0. */
CREATE OR REPLACE FUNCTION check_event_capacity()
RETURNS TRIGGER AS $$
DECLARE
    total_sold     INT;
    event_cap      INT;
    old_qty_sold   INT;
    new_total      INT;
BEGIN
    -- For INSERT, OLD does not exist so treat as 0
    old_qty_sold := COALESCE(OLD.quantity_sold, 0);
 
    -- Sum of quantity_sold across all existing rows for this event
    SELECT COALESCE(SUM(quantity_sold), 0)
    INTO total_sold
    FROM tickets
    WHERE event_id = NEW.event_id;
 
    -- Subtract the old value of this row and add the incoming new value
    -- to get the true post-update total
    new_total := (total_sold - old_qty_sold) + NEW.quantity_sold;
 
    SELECT capacity INTO event_cap
    FROM events
    WHERE event_id = NEW.event_id;
 
    IF new_total > event_cap THEN
        RAISE EXCEPTION 'Event capacity of % exceeded (% would be sold)',
            event_cap, new_total;
    END IF;
 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER enforce_event_capacity
BEFORE INSERT OR UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION check_event_capacity();
 
/* 2. Auto-sync GA ticket status based on quantity_sold.
      For reserved seating (quantity = 1), status is managed manually.
      For GA pools (quantity > 1), status is fully derived here. */
CREATE OR REPLACE FUNCTION sync_ga_ticket_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.seat_location = 'GA' THEN
        IF NEW.quantity_sold >= NEW.quantity THEN
            NEW.status := 'sold';
        ELSIF NEW.quantity_sold > 0 THEN
            NEW.status := 'reserved';
        ELSE
            NEW.status := 'available';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER sync_ga_ticket_status
BEFORE UPDATE ON tickets
FOR EACH ROW
WHEN (NEW.seat_location = 'GA')
EXECUTE FUNCTION sync_ga_ticket_status();
 
/* 3. Auto-flip is_sold_out on events when capacity is reached.
      Kept separate from event status (scheduled/cancelled/etc)
      so both can be true simultaneously without conflict. */
CREATE OR REPLACE FUNCTION update_event_sold_out()
RETURNS TRIGGER AS $$
DECLARE
    total_sold INT;
    event_cap  INT;
BEGIN
    SELECT COALESCE(SUM(quantity_sold), 0), e.capacity
    INTO total_sold, event_cap
    FROM tickets t
    JOIN events e ON e.event_id = t.event_id
    WHERE t.event_id = NEW.event_id
    GROUP BY e.capacity;
 
    UPDATE events
    SET is_sold_out = (total_sold >= event_cap)
    WHERE event_id = NEW.event_id;
 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER check_event_sold_out
AFTER INSERT OR UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION update_event_sold_out();