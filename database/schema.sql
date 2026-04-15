-- PostgreSQL Database Setup Script for Event Management System
-- Note: Create the database first, then connect to it before running this script
CREATE EXTENSION IF NOT EXISTS btree_gist;

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
	FOREIGN KEY (event_id) REFERENCES events(event_id),
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