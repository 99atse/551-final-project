-- PostgreSQL Database Setup Script for Event Management System
-- Note: Create the database first, then connect to it before running this script

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
	rating DECIMAL(3, 2),
);

/* Create customers table*/
CREATE TABLE customers (
	customer_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	type VARCHAR(50) NOT NULL CHECK (type IN ('customer', 'booker', 'both')),
	age INT,
	race VARCHAR(100),
	gender VARCHAR(50),
	address VARCHAR(255),
	affiliated_organization VARCHAR(255),
	contact_phone VARCHAR(20) NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	rating DECIMAL(3, 2),
);

/* Create events table (depends on venues) */
CREATE TABLE events (
	event_id SERIAL PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	venue_id INT NOT NULL,
	date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	capacity INT NOT NULL,
	type VARCHAR(100) NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'complete', 'postponed', 'cancelled')),
	description TEXT,
	rating DECIMAL(3, 2),
	FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
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
	status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('sold', 'available', 'reserved')),
	seat_location VARCHAR(100),
	face_value_price DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (event_id) REFERENCES events(event_id)
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
	status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
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
	date_time TIMESTAMP NOT NULL,
	status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'hold', 'booked', 'maintenance')),
	PRIMARY KEY (venue_id, date_time),
	FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
	FOREIGN KEY (event_id) REFERENCES events(event_id)
);

/* Create preferences table */
CREATE TABLE preferences (
	preference_id SERIAL PRIMARY KEY,
	customer_id INT NOT NULL,
	preference_type VARCHAR(100) NOT NULL,
	value TEXT NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);