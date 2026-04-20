-- ------------------------------------------------------------
INSERT INTO venues (name, address, city, state, zipcode, venue_type, base_rental_rate, max_capacity, contact_name, contact_phone, contact_email, rating) VALUES
('The Wiltern',             '3790 Wilshire Blvd',      'Los Angeles',   'CA', '90010', 'Concert Hall',       15000.00,  1850, 'Maria Gonzalez',  '(213) 555-0101', 'maria@wiltern.com',          4.80),
('Chase Center',            '1 Warriors Way',           'San Francisco', 'CA', '94158', 'Arena',             180000.00, 18064, 'David Park',      '(415) 555-0102', 'david@chasecenter.com',      4.90),
('San Jose Convention Ctr', '150 W San Carlos St',      'San Jose',      'CA', '95113', 'Convention Center',  45000.00, 12000, 'Linda Tran',      '(408) 555-0103', 'linda@sjcc.com',             4.50),
('Hollywood Bowl',          '2301 N Highland Ave',      'Los Angeles',   'CA', '90068', 'Amphitheater',       50000.00, 17500, 'James Reyes',     '(323) 555-0104', 'james@hollywoodbowl.com',    4.95),
('The Vinery Estate',       '4500 Silverado Trail',     'Napa',          'CA', '94558', 'Winery/Estate',      12000.00,   300, 'Sophie Laurent',  '(707) 555-0105', 'sophie@vineryestate.com',    4.70),
('Del Mar Fairgrounds',     '2260 Jimmy Durante Blvd',  'Del Mar',       'CA', '92014', 'Fairgrounds',        35000.00, 22000, 'Carlos Mendez',   '(858) 555-0106', 'carlos@delmarfair.com',      4.30),
('Crypto.com Arena',        '1111 S Figueroa St',       'Los Angeles',   'CA', '90015', 'Arena',             200000.00, 20000, 'Angela Kim',      '(213) 555-0107', 'angela@cryptoarena.com',     4.85),
('Balboa Park Club',        '2150 Pan American Rd W',   'San Diego',     'CA', '92101', 'Banquet Hall',        8500.00,   500, 'Thomas Wright',   '(619) 555-0108', 'thomas@balboaparkclub.com',  4.60),
('Moscone Center',          '747 Howard St',            'San Francisco', 'CA', '94103', 'Convention Center',  60000.00, 30000, 'Rachel Nguyen',   '(415) 555-0109', 'rachel@moscone.com',         4.75),
('The Greek Theatre',       '2700 N Vermont Ave',       'Los Angeles',   'CA', '90027', 'Amphitheater',       40000.00,  5800, 'Kevin Brooks',    '(323) 555-0110', 'kevin@greektheatre.com',     4.88),
('Santa Barbara Bowl',      '1122 N Milpas St',         'Santa Barbara', 'CA', '93103', 'Amphitheater',       20000.00,  4562, 'Olivia Castillo', '(805) 555-0111', 'olivia@sbbowl.com',          4.65),
('Oakland Arena',           '7000 Coliseum Way',        'Oakland',       'CA', '94621', 'Arena',             120000.00, 19596, 'Marcus Johnson',  '(510) 555-0112', 'marcus@oaklandarena.com',    4.40);


-- ------------------------------------------------------------
-- CUSTOMERS
-- ------------------------------------------------------------
INSERT INTO customers (name, type, age, race, gender, address, affiliated_organization, contact_phone, contact_email, rating) VALUES
('Alex Rivera',      'customer', 28, 'Hispanic',       'Male',       '123 Sunset Blvd, Los Angeles, CA 90028',       NULL,                        '(213) 555-1001', 'alex.rivera@email.com',       NULL),
('Priya Patel',      'customer', 34, 'South Asian',    'Female',     '456 Oak St, San Francisco, CA 94102',          NULL,                        '(415) 555-1002', 'priya.patel@email.com',       4.50),
('Jordan Lee',       'customer', 22, 'East Asian',     'Non-binary', '789 Palm Ave, San Diego, CA 92101',            NULL,                        '(619) 555-1003', 'jordan.lee@email.com',        NULL),
('Samantha Cruz',    'customer', 45, 'Hispanic',       'Female',     '321 Vine St, Hollywood, CA 90028',             NULL,                        '(323) 555-1004', 'sam.cruz@email.com',          3.80),
('Daniel Okafor',    'customer', 31, 'Black',          'Male',       '654 Bay Rd, Oakland, CA 94612',                NULL,                        '(510) 555-1005', 'daniel.okafor@email.com',     NULL),
('Emily Chen',       'customer', 27, 'East Asian',     'Female',     '987 Mission St, San Francisco, CA 94103',      NULL,                        '(415) 555-1006', 'emily.chen@email.com',        4.20),
('Marcus Thompson',  'customer', 38, 'Black',          'Male',       '111 Wilshire Blvd, Los Angeles, CA 90010',     NULL,                        '(213) 555-1007', 'marcus.t@email.com',          NULL),
('Aisha Williams',   'customer', 25, 'Black',          'Female',     '222 Figueroa St, Los Angeles, CA 90015',       NULL,                        '(213) 555-1008', 'aisha.w@email.com',           4.90),
('Ryan Nakamura',    'customer', 30, 'East Asian',     'Male',       '333 Market St, San Francisco, CA 94105',       NULL,                        '(415) 555-1009', 'ryan.n@email.com',            NULL),
('Sofia Martinez',   'customer', 42, 'Hispanic',       'Female',     '444 Broadway, San Diego, CA 92101',            NULL,                        '(619) 555-1010', 'sofia.m@email.com',           3.50),
('Lena Fischer',     'booker',   36, 'White',          'Female',     '555 State St, Santa Barbara, CA 93101',        'SoCal Events Co.',          '(805) 555-1011', 'lena@socalevents.com',        4.70),
('Brandon Yee',      'booker',   44, 'East Asian',     'Male',       '666 Grand Ave, Los Angeles, CA 90012',         'Yee Productions',           '(213) 555-1012', 'brandon@yeeproductions.com',  4.85),
('Natalie Gomez',    'booker',   39, 'Hispanic',       'Female',     '777 Castro St, San Francisco, CA 94114',       'Bay Area Live',             '(415) 555-1013', 'natalie@bayarealive.com',     4.60),
('Chris Okonkwo',    'booker',   51, 'Black',          'Male',       '888 University Ave, San Diego, CA 92103',      'Pacific Event Group',       '(619) 555-1014', 'chris@pacificevent.com',      4.40),
('Ashley Park',      'booker',   33, 'East Asian',     'Female',     '999 Ventura Blvd, Sherman Oaks, CA 91423',     'Park Events LLC',           '(818) 555-1015', 'ashley@parkevents.com',       4.95),
('David Hernandez',  'both',     47, 'Hispanic',       'Male',       '100 Napa Valley Dr, Napa, CA 94558',           'Hernandez Weddings & More', '(707) 555-1016', 'david@hernandezweddings.com', 4.80),
('Tiffany Moore',    'both',     29, 'Black',          'Female',     '200 Ventura Blvd, Los Angeles, CA 90046',      'Moore Entertainment',       '(323) 555-1017', 'tiffany@mooreent.com',        4.55),
('Jason Wu',         'both',     41, 'East Asian',     'Male',       '300 Financial St, San Francisco, CA 94104',    'Wu Tech Events',            '(415) 555-1018', 'jason@wutechevents.com',      4.75),
('Carmen Delgado',   'both',     35, 'Hispanic',       'Female',     '400 Sports Arena Blvd, San Diego, CA 92101',   'Delgado Sports & Events',   '(619) 555-1019', 'carmen@delgadoevents.com',    4.30),
('Patrick Sullivan', 'both',     52, 'White',          'Male',       '500 Convention Way, San Jose, CA 95110',       'Sullivan Conference Mgmt',  '(408) 555-1020', 'patrick@sullivanconf.com',    4.65),
('Nina Rossi',       'customer', 26, 'White',          'Female',     '12 Rose Ave, Santa Barbara, CA 93101',         NULL,                        '(805) 555-1021', 'nina.rossi@email.com',        NULL),
('Omar Khalid',      'customer', 33, 'Middle Eastern', 'Male',       '77 Lemon Grove, San Diego, CA 92104',          NULL,                        '(619) 555-1022', 'omar.k@email.com',            NULL),
('Grace Kim',        'customer', 23, 'East Asian',     'Female',     '45 Hillside Dr, Oakland, CA 94618',            NULL,                        '(510) 555-1023', 'grace.kim@email.com',         4.10),
('Luis Vargas',      'customer', 37, 'Hispanic',       'Male',       '88 Sunset Strip, West Hollywood, CA 90069',    NULL,                        '(323) 555-1024', 'luis.v@email.com',            NULL),
('Hannah Johansson', 'customer', 31, 'White',          'Female',     '200 Golden Gate Ave, San Francisco, CA 94102', NULL,                        '(415) 555-1025', 'hannah.j@email.com',          3.90);


-- ------------------------------------------------------------
-- EVENTS
-- ------------------------------------------------------------
INSERT INTO events (name, venue_id, event_time_range, capacity, type, status, is_sold_out, description, rating) VALUES

-- Concerts/Festivals (events 1–8)
('SoCal Summer Fest',             4, '[2026-07-04 14:00, 2026-07-04 23:00)', 15000, 'Concerts/Festivals', 'scheduled', FALSE,
 'Annual Fourth of July festival at Hollywood Bowl. Large GA pool for UC3 concurrent purchase demo.', NULL),
('LA Jazz Nights', 1, '[2026-09-20 19:00, 2026-09-20 23:00)',  1850, 'Concerts/Festivals', 'scheduled', FALSE,
 'Intimate jazz evening at The Wiltern. Single VIP Pit seat drives UC1 last-ticket race.', 4.70),
('Greek Theatre Open Air',       10, '[2026-06-28 18:00, 2026-06-28 22:30)',  5500, 'Concerts/Festivals', 'scheduled', FALSE,
 'Outdoor rock series. One Front Row seat is unbooked in UC2 to demonstrate MVCC read consistency.', NULL),
('Bay Beats Music Festival',      2, '[2026-08-15 12:00, 2026-08-15 22:00)', 16000, 'Concerts/Festivals', 'scheduled', FALSE,
 'Multi-stage festival at Chase Center featuring hip-hop, R&B, and electronic artists.', NULL),
('Santa Barbara Wine & Music',   11, '[2026-10-11 15:00, 2026-10-11 21:00)',  4000, 'Concerts/Festivals', 'scheduled', FALSE,
 'Wine-paired acoustic and folk music event at Santa Barbara Bowl.', NULL),
('Oakland Hip Hop Summit',       12, '[2025-11-02 16:00, 2025-11-03 00:00)', 18000, 'Concerts/Festivals', 'complete',  FALSE,
 'Sold-out Bay Area hip-hop showcase celebrating West Coast artists.', 4.85),
('Desert Sound Festival',         6, '[2026-04-19 13:00, 2026-04-20 00:00)', 20000, 'Concerts/Festivals', 'postponed', FALSE,
 'Originally planned multi-day festival postponed to later in the year.', NULL),
('New Year Countdown LA',         7, '[2025-12-31 20:00, 2026-01-01 01:00)', 18000, 'Concerts/Festivals', 'complete',  FALSE,
 'Star-studded New Year''s Eve concert and countdown at Crypto.com Arena.', 4.90),

-- Sporting Events (events 9–16)
('Lakers vs Warriors',         7, '[2026-05-10 19:30, 2026-05-10 22:30)', 18000, 'Sporting Events', 'scheduled', FALSE, 'Western Conference playoff matchup.', NULL),
('Golden State Warriors Opener',2,'[2026-10-20 19:00, 2026-10-20 21:30)', 17500, 'Sporting Events', 'scheduled', FALSE, 'Chase Center season opener with fan appreciation night.', NULL),
('SoCal Marathon',             4, '[2026-03-08 06:00, 2026-03-08 14:00)',  5000, 'Sporting Events', 'complete',  FALSE, 'Annual LA-area marathon starting at Hollywood Bowl grounds.', 4.60),
('San Diego Sports Expo',      6, '[2026-09-05 09:00, 2026-09-05 18:00)', 10000, 'Sporting Events', 'scheduled', FALSE, 'All-sports fan expo at Del Mar Fairgrounds.', NULL),
('Bay Area Boxing Night',     12, '[2026-07-22 18:00, 2026-07-22 23:00)', 15000, 'Sporting Events', 'scheduled', FALSE, 'Championship boxing card featuring top contenders.', NULL),
('LA Esports Championship',    7, '[2026-08-30 10:00, 2026-08-30 20:00)', 16000, 'Sporting Events', 'scheduled', FALSE, 'Major esports tournament featuring multi-title competition.', NULL),
('Clippers Playoff Watch',     7, '[2025-05-15 19:00, 2025-05-15 22:30)', 18500, 'Sporting Events', 'complete',  FALSE, 'Playoff game watch party and live broadcast event.', 4.40),
('NorCal Volleyball Open',     3, '[2026-06-14 08:00, 2026-06-14 18:00)',  8000, 'Sporting Events', 'cancelled', FALSE, 'Cancelled due to venue scheduling conflict.', NULL),

-- Weddings (events 17–24)
('Rivera-Patel Wedding',       5, '[2026-06-07 16:00, 2026-06-07 23:00)',   200, 'Weddings', 'scheduled', FALSE, 'Romantic vineyard wedding in Napa Valley.', NULL),
('Chen-Nakamura Wedding',      8, '[2026-09-13 15:00, 2026-09-13 22:00)',   350, 'Weddings', 'scheduled', FALSE, 'Elegant garden wedding reception at Balboa Park Club.', NULL),
('The Martinez Celebration',   5, '[2026-07-19 17:00, 2026-07-19 23:00)',   250, 'Weddings', 'scheduled', FALSE, 'Intimate Napa Valley vineyard wedding with wine-paired dinner.', NULL),
('Williams-Thompson Wedding',  8, '[2026-10-03 14:00, 2026-10-03 21:00)',   400, 'Weddings', 'scheduled', FALSE, 'Classic San Diego ballroom wedding with live orchestra.', NULL),
('Gomez-Fischer Wedding',      5, '[2025-10-18 16:00, 2025-10-18 23:00)',   180, 'Weddings', 'complete',  FALSE, 'Autumn harvest vineyard wedding with farm-to-table dinner.', 4.95),
('Park-Sullivan Wedding',     11, '[2026-05-23 15:30, 2026-05-23 22:30)',   300, 'Weddings', 'scheduled', FALSE, 'Scenic outdoor ceremony and reception at Santa Barbara Bowl.', NULL),
('Kim-Vargas Wedding',         8, '[2026-08-08 17:00, 2026-08-08 23:30)',   280, 'Weddings', 'scheduled', FALSE, 'Vibrant multicultural wedding celebration at Balboa Park Club.', NULL),
('Johansson-Moore Wedding',    5, '[2026-11-14 16:00, 2026-11-14 22:00)',   220, 'Weddings', 'scheduled', FALSE, 'Fall Napa Valley wedding focused on sustainable local sourcing.', NULL),

-- Conventions (events 25–32)
('LA Comic & Pop Culture Con', 7, '[2026-07-11 09:00, 2026-07-11 19:00)', 18000, 'Conventions', 'scheduled', FALSE, 'Massive pop culture convention with celebrity panels and cosplay.', NULL),
('NorCal Anime Expo',          9, '[2026-08-22 09:00, 2026-08-22 20:00)', 25000, 'Conventions', 'scheduled', FALSE, 'Premier Northern California anime and manga convention at Moscone.', NULL),
('San Jose Gaming Con',        3, '[2026-06-06 10:00, 2026-06-06 18:00)', 10000, 'Conventions', 'scheduled', FALSE, 'Annual video game and tabletop gaming convention.', NULL),
('SoCal Horror Con',          10, '[2026-10-25 11:00, 2026-10-25 21:00)',  5000, 'Conventions', 'scheduled', FALSE, 'Horror film and pop culture convention at Greek Theatre grounds.', NULL),
('Oakland Fan Fest',          12, '[2025-09-14 10:00, 2025-09-14 18:00)', 12000, 'Conventions', 'complete',  FALSE, 'Bay Area fan festival celebrating comics, sci-fi, and fantasy.', 4.50),
('San Diego Fan Expo',         6, '[2026-05-02 09:00, 2026-05-02 19:00)', 18000, 'Conventions', 'scheduled', FALSE, 'Southern California''s largest fan and pop culture expo.', NULL),
('SF Retro Gaming Fest',       9, '[2026-09-27 10:00, 2026-09-27 20:00)', 20000, 'Conventions', 'scheduled', FALSE, 'Celebration of classic and retro video games.', NULL),
('Anime & Cosplay Weekend',    7, '[2026-04-04 09:00, 2026-04-04 21:00)', 16000, 'Conventions', 'postponed', FALSE, 'Postponed from earlier date due to scheduling conflict.', NULL),

-- Conferences (events 33–40)
('TechWave Summit',            9, '[2026-09-08 08:00, 2026-09-08 18:00)', 22000, 'Conferences', 'scheduled', FALSE, 'Leading technology conference covering AI, cloud, and startup innovation.', NULL),
('SF Startup Pitch Day',       9, '[2026-06-17 09:00, 2026-06-17 17:00)', 15000, 'Conferences', 'scheduled', FALSE, 'Annual startup showcase with investor panels and live pitches.', NULL),
('SoCal Marketing Summit',     3, '[2026-08-04 08:30, 2026-08-04 17:00)', 10000, 'Conferences', 'scheduled', FALSE, 'Full-day marketing and growth conference.', NULL),
('LA Healthcare Innovation',   7, '[2026-11-03 08:00, 2026-11-03 17:30)', 14000, 'Conferences', 'scheduled', FALSE, 'Healthcare technology and policy conference at Crypto.com Arena.', NULL),
('San Diego BioTech Forum',    6, '[2026-07-29 09:00, 2026-07-29 17:00)',  8000, 'Conferences', 'scheduled', FALSE, 'Annual biotechnology and life sciences industry conference.', NULL),
('NorCal HR Summit',           3, '[2025-10-07 08:30, 2025-10-07 16:30)',  6000, 'Conferences', 'complete',  FALSE, 'Human resources and people operations conference.', 4.55),
('LA Sustainability Forum',   10, '[2026-10-14 09:00, 2026-10-14 17:00)',  4000, 'Conferences', 'scheduled', FALSE, 'Environmental sustainability and green business practices conference.', NULL),
('Bay Area Finance Expo',      9, '[2026-05-20 08:00, 2026-05-20 17:00)', 18000, 'Conferences', 'scheduled', FALSE, 'Financial services and fintech conference.', NULL);


-- ------------------------------------------------------------
-- TRANSACTIONS
-- ------------------------------------------------------------
INSERT INTO transactions (customer_id, type, status, transaction_time) VALUES
(12, 'booker', 'completed', '2026-01-10 10:00:00'),  -- 1  Brandon Yee   → SoCal Summer Fest
(13, 'booker', 'completed', '2026-01-12 11:00:00'),  -- 2  Natalie Gomez → Bay Beats
(15, 'booker', 'completed', '2026-01-15 09:30:00'),  -- 3  Ashley Park   → LA Jazz Nights
(12, 'booker', 'completed', '2026-01-18 14:00:00'),  -- 4  Brandon Yee   → Greek Theatre
(11, 'booker', 'completed', '2026-01-20 10:00:00'),  -- 5  Lena Fischer  → Santa Barbara
(13, 'booker', 'completed', '2025-09-01 09:00:00'),  -- 6  Natalie Gomez → Oakland Hip Hop (complete)
(15, 'booker', 'completed', '2025-11-01 10:00:00'),  -- 7  Ashley Park   → New Year Countdown (complete)
(14, 'booker', 'completed', '2026-01-25 11:00:00'),  -- 8  Chris Okonkwo → Lakers vs Warriors
(13, 'booker', 'completed', '2026-02-01 09:00:00'),  -- 9  Natalie Gomez → Warriors Home Opener
(19, 'booker', 'completed', '2026-01-05 10:00:00'),  -- 10 Carmen Delgado → SD Sports Expo
(16, 'booker', 'completed', '2025-11-15 09:00:00'),  -- 11 David Hernandez → Gomez-Fischer Wedding
(17, 'booker', 'completed', '2026-02-10 10:00:00'),  -- 12 Tiffany Moore → Rivera-Patel Wedding
-- Customer purchases
(1,  'customer', 'completed', '2026-02-01 14:23:00'), -- 13
(2,  'customer', 'completed', '2026-02-03 09:45:00'), -- 14
(3,  'customer', 'completed', '2026-02-05 16:10:00'), -- 15
(4,  'customer', 'completed', '2026-02-07 11:30:00'), -- 16
(5,  'customer', 'completed', '2026-02-09 13:00:00'), -- 17
(6,  'customer', 'completed', '2026-02-10 18:00:00'), -- 18
(7,  'customer', 'completed', '2026-02-12 10:15:00'), -- 19
(8,  'customer', 'completed', '2026-02-14 20:00:00'), -- 20
(9,  'customer', 'completed', '2026-02-15 09:00:00'), -- 21
(10, 'customer', 'completed', '2026-02-16 12:45:00'), -- 22
(21, 'customer', 'completed', '2026-02-18 14:00:00'), -- 23
(22, 'customer', 'completed', '2026-02-20 10:30:00'), -- 24
(23, 'customer', 'completed', '2026-02-22 17:15:00'), -- 25
(24, 'customer', 'completed', '2026-02-24 09:00:00'), -- 26
(25, 'customer', 'completed', '2026-02-25 15:30:00'), -- 27
(1,  'customer', 'completed', '2026-02-26 11:00:00'), -- 28
(2,  'customer', 'completed', '2026-03-01 13:45:00'), -- 29
(3,  'customer', 'completed', '2026-03-03 16:00:00'), -- 30
(4,  'customer', 'completed', '2026-03-05 10:00:00'), -- 31
(5,  'customer', 'completed', '2026-03-06 09:30:00'), -- 32
(6,  'customer', 'completed', '2026-03-08 14:00:00'), -- 33
(7,  'customer', 'completed', '2026-03-10 11:15:00'), -- 34
(8,  'customer', 'completed', '2026-03-12 18:30:00'), -- 35
(9,  'customer', 'completed', '2026-03-14 09:00:00'), -- 36
(10, 'customer', 'completed', '2026-03-15 12:00:00'), -- 37
(21, 'customer', 'completed', '2026-03-16 15:00:00'), -- 38
(22, 'customer', 'completed', '2026-03-18 10:45:00'), -- 39
(23, 'customer', 'completed', '2026-03-20 14:00:00'), -- 40
(24, 'customer', 'completed', '2026-03-21 09:30:00'), -- 41
(25, 'customer', 'completed', '2026-03-22 16:00:00'), -- 42
(1,  'customer', 'completed', '2026-03-24 11:30:00'), -- 43
(2,  'customer', 'completed', '2026-03-26 13:00:00'), -- 44
(3,  'customer', 'completed', '2026-03-28 17:00:00'), -- 45
(4,  'customer', 'completed', '2026-03-30 10:00:00'), -- 46
(5,  'customer', 'completed', '2026-04-01 09:15:00'), -- 47
(6,  'customer', 'completed', '2026-04-02 14:30:00'), -- 48
(7,  'customer', 'completed', '2026-04-03 11:00:00'), -- 49
(8,  'customer', 'completed', '2026-04-04 16:45:00'), -- 50
-- UC transactions
(1,  'customer', 'completed', '2026-04-10 20:00:01'), -- 51  UC1 winner (Alex Rivera)
(2,  'customer', 'pending',   '2026-04-10 20:00:02'), -- 52  UC1 loser  (Priya Patel)
(7,  'customer', 'refunded',  '2026-04-11 18:00:00'), -- 53  UC2 unbook (Marcus Thompson)
(3,  'customer', 'completed', '2026-04-12 10:00:01'), -- 54  UC3 buyer A (Jordan Lee)
(4,  'customer', 'completed', '2026-04-12 10:00:02'); -- 55  UC3 buyer B (Samantha Cruz)


-- ============================================================
-- TICKETS
--
-- CONCERT EVENTS (1–3): non-GA seats are individual rows,
--   quantity=1, seat_location = human-readable string.
-- CONCERTS 4–8 + ALL OTHER EVENTS: pooled rows as before.
--
-- Ticket ID map (concerts):
--   Event 1 — SoCal Summer Fest @ Hollywood Bowl
--     1        : GA pool
--     2–21     : VIP — Section 101, Rows A–B (10 seats/row)
--     22–31    : Pit — Row 1 (10 seats)
--
--   Event 2 — LA Jazz Nights @ The Wiltern
--     32–33    : GA pools (Orchestra floor, Balcony)
--     34–53    : VIP Front Row — Row A, Seats 1–20
--     54       : *** UC1 LAST TICKET *** Row Pit, Seat 1
--                (quantity=1, status='available' → race to sell)
--
--   Event 3 — Greek Theatre Open Air
--     55       : GA pool (Lawn)
--     56–75    : Orchestra VIP — Row A, Seats 1–20
--     76       : *** UC2 UNBOOK SEAT *** Front Row, Seat 1
--                (starts status='sold', quantity_sold=1)
--     77–86    : Pit — Seats 1–10
--
--   Events 4–8 (background pools): 87–99
--
-- Sporting/Wedding/Convention/Conference pools: 100–143
-- ============================================================
INSERT INTO tickets (event_id, type, status, seat_location, face_value_price, quantity, quantity_sold) VALUES

-- ════════════════════════════════════════════════════════════
-- EVENT 1: SoCal Summer Fest  (Hollywood Bowl)
-- ════════════════════════════════════════════════════════════

-- GA lawn pool — UC3: two buyers increment this concurrently
(1, 'General Admission', 'available', 'GA',                      85.00, 14000, 12500), -- 1

-- VIP — Section 101, Row A  (seats 1–10, all sold)
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 1',  250.00, 1, 1),  -- 2
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 2',  250.00, 1, 1),  -- 3
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 3',  250.00, 1, 1),  -- 4
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 4',  250.00, 1, 1),  -- 5
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 5',  250.00, 1, 1),  -- 6
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 6',  250.00, 1, 1),  -- 7
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 7',  250.00, 1, 1),  -- 8
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 8',  250.00, 1, 1),  -- 9
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 9',  250.00, 1, 1),  -- 10
(1, 'VIP', 'sold',      'Section 101, Row A, Seat 10', 250.00, 1, 1),  -- 11

-- VIP — Section 101, Row B  (seats 1–10, mix of sold/available)
(1, 'VIP', 'sold',      'Section 101, Row B, Seat 1',  250.00, 1, 1),  -- 12
(1, 'VIP', 'sold',      'Section 101, Row B, Seat 2',  250.00, 1, 1),  -- 13
(1, 'VIP', 'sold',      'Section 101, Row B, Seat 3',  250.00, 1, 1),  -- 14
(1, 'VIP', 'sold',      'Section 101, Row B, Seat 4',  250.00, 1, 1),  -- 15
(1, 'VIP', 'sold',      'Section 101, Row B, Seat 5',  250.00, 1, 1),  -- 16
(1, 'VIP', 'available', 'Section 101, Row B, Seat 6',  250.00, 1, 0),  -- 17
(1, 'VIP', 'available', 'Section 101, Row B, Seat 7',  250.00, 1, 0),  -- 18
(1, 'VIP', 'available', 'Section 101, Row B, Seat 8',  250.00, 1, 0),  -- 19
(1, 'VIP', 'available', 'Section 101, Row B, Seat 9',  250.00, 1, 0),  -- 20
(1, 'VIP', 'available', 'Section 101, Row B, Seat 10', 250.00, 1, 0),  -- 21

-- Pit — Row 1  (seats 1–10, all sold)
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 1',  450.00, 1, 1),  -- 22
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 2',  450.00, 1, 1),  -- 23
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 3',  450.00, 1, 1),  -- 24
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 4',  450.00, 1, 1),  -- 25
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 5',  450.00, 1, 1),  -- 26
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 6',  450.00, 1, 1),  -- 27
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 7',  450.00, 1, 1),  -- 28
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 8',  450.00, 1, 1),  -- 29
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 9',  450.00, 1, 1),  -- 30
(1, 'Premium', 'sold', 'Pit, Row 1, Seat 10', 450.00, 1, 1),  -- 31

-- ════════════════════════════════════════════════════════════
-- EVENT 2: LA Jazz Nights — Last-Ticket Race  (The Wiltern)
-- ════════════════════════════════════════════════════════════

-- GA pools
(2, 'General Admission', 'available', 'Orchestra Floor', 65.00, 1200, 800),  -- 32
(2, 'General Admission', 'available', 'Balcony',         45.00,  500, 200),  -- 33

-- VIP — Front Row, Row A  (seats 1–20; seats 1–18 sold, 19–20 available)
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 1',  150.00, 1, 1),  -- 34
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 2',  150.00, 1, 1),  -- 35
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 3',  150.00, 1, 1),  -- 36
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 4',  150.00, 1, 1),  -- 37
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 5',  150.00, 1, 1),  -- 38
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 6',  150.00, 1, 1),  -- 39
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 7',  150.00, 1, 1),  -- 40
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 8',  150.00, 1, 1),  -- 41
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 9',  150.00, 1, 1),  -- 42
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 10', 150.00, 1, 1),  -- 43
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 11', 150.00, 1, 1),  -- 44
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 12', 150.00, 1, 1),  -- 45
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 13', 150.00, 1, 1),  -- 46
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 14', 150.00, 1, 1),  -- 47
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 15', 150.00, 1, 1),  -- 48
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 16', 150.00, 1, 1),  -- 49
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 17', 150.00, 1, 1),  -- 50
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 18', 150.00, 1, 1),  -- 51
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 19', 150.00, 1, 1),  -- 52
(2, 'VIP', 'sold',      'Orchestra, Row A, Seat 20', 150.00, 1, 1),  -- 53

-- *** UC1 LAST TICKET ***
-- The only remaining VIP Pit seat. Two sessions race to set
-- status='sold'. GIST EXCLUDE on (event_id, seat_location)
-- WHERE status='sold' AND seat_location <> 'GA' means only
-- one UPDATE can commit; the second sees 0 rows and rolls back.
(2, 'VIP', 'available', 'Row Pit, Seat 1', 350.00, 1, 0),  -- 54  ← UC1

-- ════════════════════════════════════════════════════════════
-- EVENT 3: Greek Theatre Open Air
-- ════════════════════════════════════════════════════════════

-- GA lawn pool
(3, 'General Admission', 'available', 'GA', 55.00, 4500, 2100),  -- 55

-- Orchestra VIP — Row A (seats 1–20; seats 1–18 sold, 19–20 available)
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 1',  175.00, 1, 1),  -- 56
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 2',  175.00, 1, 1),  -- 57
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 3',  175.00, 1, 1),  -- 58
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 4',  175.00, 1, 1),  -- 59
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 5',  175.00, 1, 1),  -- 60
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 6',  175.00, 1, 1),  -- 61
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 7',  175.00, 1, 1),  -- 62
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 8',  175.00, 1, 1),  -- 63
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 9',  175.00, 1, 1),  -- 64
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 10', 175.00, 1, 1),  -- 65
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 11', 175.00, 1, 1),  -- 66
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 12', 175.00, 1, 1),  -- 67
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 13', 175.00, 1, 1),  -- 68
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 14', 175.00, 1, 1),  -- 69
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 15', 175.00, 1, 1),  -- 70
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 16', 175.00, 1, 1),  -- 71
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 17', 175.00, 1, 1),  -- 72
(3, 'VIP', 'sold',      'Orchestra, Row A, Seat 18', 175.00, 1, 1),  -- 73
(3, 'VIP', 'available', 'Orchestra, Row A, Seat 19', 175.00, 1, 0),  -- 74
(3, 'VIP', 'available', 'Orchestra, Row A, Seat 20', 175.00, 1, 0),  -- 75

-- *** UC2 UNBOOK SEAT ***
-- Starts as sold (Marcus Thompson, tx 53). On cancellation:
--   UPDATE tickets SET quantity_sold=0, status='available'
--   WHERE ticket_id=76;
-- After COMMIT, any new reader sees status='available'.
(3, 'VIP', 'sold', 'Front Row, Seat 1', 300.00, 1, 1),  -- 76  ← UC2

-- Pit seats (1–10; seats 1–8 sold, 9–10 available)
(3, 'Premium', 'sold',      'Pit, Seat 1',  500.00, 1, 1),  -- 77
(3, 'Premium', 'sold',      'Pit, Seat 2',  500.00, 1, 1),  -- 78
(3, 'Premium', 'sold',      'Pit, Seat 3',  500.00, 1, 1),  -- 79
(3, 'Premium', 'sold',      'Pit, Seat 4',  500.00, 1, 1),  -- 80
(3, 'Premium', 'sold',      'Pit, Seat 5',  500.00, 1, 1),  -- 81
(3, 'Premium', 'sold',      'Pit, Seat 6',  500.00, 1, 1),  -- 82
(3, 'Premium', 'sold',      'Pit, Seat 7',  500.00, 1, 1),  -- 83
(3, 'Premium', 'sold',      'Pit, Seat 8',  500.00, 1, 1),  -- 84
(3, 'Premium', 'available', 'Pit, Seat 9',  500.00, 1, 0),  -- 85
(3, 'Premium', 'available', 'Pit, Seat 10', 500.00, 1, 0),  -- 86

-- ════════════════════════════════════════════════════════════
-- EVENTS 4–8: Background concert pools
-- ════════════════════════════════════════════════════════════
(4, 'General Admission', 'available', 'GA',          75.00, 14000, 9000),  -- 87
(4, 'VIP',               'available', 'Mezzanine',  200.00,  1500,  800),  -- 88
(4, 'Premium',           'reserved',  'Floor Front',350.00,   500,  300),  -- 89
(5, 'General Admission', 'available', 'GA',          95.00,  3500, 1200),  -- 90
(5, 'VIP',               'available', 'VIP Terrace',225.00,   500,  280),  -- 91
(6, 'General Admission', 'sold',      'GA',          70.00, 16000,16000),  -- 92
(6, 'VIP',               'sold',      'VIP Lounge', 180.00,  2000, 2000),  -- 93
(7, 'General Admission', 'available', 'GA',          90.00, 18000,  500),  -- 94
(7, 'VIP',               'available', 'VIP',        275.00,  2000,   50),  -- 95
(8, 'General Admission', 'sold',      'GA',         120.00, 16000,16000),  -- 96
(8, 'VIP',               'sold',      'VIP Suite',  500.00,  1500, 1500),  -- 97
(8, 'Premium',           'sold',      'Pit',        750.00,   500,  500),  -- 98

-- ════════════════════════════════════════════════════════════
-- SPORTING EVENTS (pools)
-- ════════════════════════════════════════════════════════════
(9,  'General Admission', 'available', 'Upper Bowl',    95.00, 15000, 12000),  -- 99
(9,  'VIP',               'reserved',  'Club Level',   350.00,  2000,  1800),  -- 100
(9,  'Premium',           'available', 'Courtside',   1500.00,   500,   200),  -- 101
(10, 'General Admission', 'available', 'Upper Bowl',    80.00, 15000, 11000),  -- 102
(10, 'VIP',               'available', 'Club Level',   300.00,  2000,  1500),  -- 103
(11, 'General Admission', 'sold',      'Participant',   45.00,  4500,  4500),  -- 104
(11, 'VIP',               'sold',      'Spectator VIP',120.00,   500,   500),  -- 105
(12, 'General Admission', 'available', 'General',       30.00,  8000,  3500),  -- 106
(12, 'VIP',               'available', 'VIP Access',    85.00,  2000,   900),  -- 107
(13, 'General Admission', 'available', 'Upper',         80.00, 13000,  7000),  -- 108
(13, 'VIP',               'reserved',  'Ringside',     450.00,  2000,  1900),  -- 109
(14, 'General Admission', 'available', 'General',       55.00, 14000,  9000),  -- 110
(14, 'VIP',               'available', 'VIP Lounge',   150.00,  1500,   600),  -- 111
(14, 'Premium',           'sold',      'Front Row',    250.00,   500,   500),  -- 112
(15, 'General Admission', 'sold',      'GA',            90.00, 17000, 17000),  -- 113
(15, 'VIP',               'sold',      'Suite',        400.00,  1500,  1500),  -- 114
(16, 'General Admission', 'available', 'General',       25.00,  6000,     0),  -- 115
(16, 'VIP',               'available', 'Courtside',     75.00,  2000,     0),  -- 116

-- ════════════════════════════════════════════════════════════
-- WEDDINGS (pools)
-- ════════════════════════════════════════════════════════════
(17, 'General Admission', 'sold',      'Ceremony',    0.00, 150, 150),  -- 117
(17, 'VIP',               'reserved',  'Bridal Party',0.00,  50,  45),  -- 118
(18, 'General Admission', 'available', 'Main Hall',   0.00, 300, 200),  -- 119
(18, 'VIP',               'reserved',  'Head Table',  0.00,  50,  45),  -- 120
(19, 'General Admission', 'available', 'Vineyard',    0.00, 200, 120),  -- 121
(19, 'VIP',               'available', 'VIP Table',   0.00,  50,  20),  -- 122
(20, 'General Admission', 'available', 'Ballroom',    0.00, 350, 180),  -- 123
(20, 'VIP',               'available', 'Bridal Suite',0.00,  50,  10),  -- 124
(21, 'General Admission', 'sold',      'Vineyard',    0.00, 150, 150),  -- 125
(21, 'VIP',               'sold',      'VIP Pavilion',0.00,  30,  30),  -- 126
(22, 'General Admission', 'available', 'Amphitheater',0.00, 250, 130),  -- 127
(22, 'VIP',               'reserved',  'Stage View',  0.00,  50,  40),  -- 128
(23, 'General Admission', 'available', 'Main Hall',   0.00, 250, 160),  -- 129
(23, 'VIP',               'sold',      'Sweetheart',  0.00,  30,  30),  -- 130
(24, 'General Admission', 'available', 'Garden',      0.00, 200,  40),  -- 131
(24, 'VIP',               'reserved',  'VIP Lounge',  0.00,  20,  15),  -- 132

-- ════════════════════════════════════════════════════════════
-- CONVENTIONS (pools)
-- ════════════════════════════════════════════════════════════
(25, 'General Admission', 'available', 'Main Floor',   45.00, 16000, 11000),  -- 133
(25, 'VIP',               'available', 'VIP Lounge',  120.00,  1500,   900),  -- 134
(25, 'Premium',           'reserved',  'All Access',  250.00,   500,   450),  -- 135
(26, 'General Admission', 'available', 'Main Hall',    40.00, 22000, 15000),  -- 136
(26, 'VIP',               'available', 'VIP Badge',   100.00,  2000,  1200),  -- 137
(27, 'General Admission', 'available', 'Main Floor',   35.00,  8000,  5000),  -- 138
(27, 'VIP',               'reserved',  'Pro Pass',     90.00,  2000,  1800),  -- 139
(28, 'General Admission', 'available', 'Main Hall',    50.00,  4000,  2000),  -- 140
(28, 'VIP',               'available', 'VIP Dungeon', 130.00,  1000,   400),  -- 141
(29, 'General Admission', 'sold',      'Main Floor',   38.00, 10000, 10000),  -- 142
(29, 'VIP',               'sold',      'VIP Lounge',   95.00,  2000,  2000),  -- 143
(30, 'General Admission', 'available', 'Main Floor',   42.00, 16000, 10000),  -- 144
(30, 'VIP',               'reserved',  'VIP Access',  110.00,  2000,  1900),  -- 145
(31, 'General Admission', 'available', 'Main Hall',    30.00, 18000, 11000),  -- 146
(31, 'VIP',               'available', 'Collector VIP',80.00,  2000,   800),  -- 147
(32, 'General Admission', 'available', 'General',      48.00, 14000,   300),  -- 148
(32, 'VIP',               'reserved',  'VIP',         125.00,  2000,   800),  -- 149

-- ════════════════════════════════════════════════════════════
-- CONFERENCES (pools)
-- ════════════════════════════════════════════════════════════
(33, 'General Admission', 'available', 'Main Hall',   299.00, 20000, 14000),  -- 150
(33, 'VIP',               'reserved',  'VIP Pass',    799.00,  1500,  1400),  -- 151
(33, 'Premium',           'reserved',  'All Access', 1499.00,   500,   490),  -- 152
(34, 'General Admission', 'available', 'Main Floor',  199.00, 13000,  8000),  -- 153
(34, 'VIP',               'available', 'Investor Pass',499.00, 1500,   900),  -- 154
(35, 'General Admission', 'available', 'Main Hall',   175.00,  9000,  5500),  -- 155
(35, 'VIP',               'reserved',  'VIP Access',  425.00,  1000,   950),  -- 156
(36, 'General Admission', 'available', 'Main Floor',  249.00, 12000,  7000),  -- 157
(36, 'VIP',               'reserved',  'VIP Suite',   599.00,  2000,  1900),  -- 158
(37, 'General Admission', 'available', 'Main Hall',   225.00,  7000,  4000),  -- 159
(37, 'VIP',               'available', 'VIP Pass',    550.00,  1000,   500),  -- 160
(38, 'General Admission', 'sold',      'Main Hall',   150.00,  5000,  5000),  -- 161
(38, 'VIP',               'sold',      'VIP Pass',    375.00,  1000,  1000),  -- 162
(39, 'General Admission', 'available', 'Main Hall',   125.00,  3500,  2000),  -- 163
(39, 'VIP',               'reserved',  'VIP Access',  300.00,   500,   480),  -- 164
(40, 'General Admission', 'available', 'Main Floor',  275.00, 16000, 10000),  -- 165
(40, 'VIP',               'reserved',  'VIP Pass',    650.00,  1500,  1400),  -- 166
(40, 'Premium',           'reserved',  'Executive',  1200.00,   500,   490);  -- 167


-- ============================================================
-- TRANSACTION_TICKETS
-- ============================================================
INSERT INTO transaction_tickets (transaction_id, ticket_id, price_paid) VALUES
-- Background purchases
(13,   1,   85.00),  -- Alex Rivera       → Summer Fest GA
(14,  87,   75.00),  -- Priya Patel       → Bay Beats GA
(15,  32,   65.00),  -- Jordan Lee        → Jazz Nights Orchestra GA
(16,  87,   75.00),  -- Samantha Cruz     → Bay Beats GA (same pool)
(17,  90,   95.00),  -- Daniel Okafor     → Santa Barbara GA
(18,  96,  120.00),  -- Emily Chen        → New Year Countdown GA
(19,  99,   95.00),  -- Marcus Thompson   → Lakers GA
(20, 100,  350.00),  -- Aisha Williams    → Lakers VIP (Club Level pool)
(21, 102,   80.00),  -- Ryan Nakamura     → Warriors GA
(22, 104,   45.00),  -- Sofia Martinez    → SoCal Marathon GA
(23, 106,   30.00),  -- Nina Rossi        → SD Sports Expo GA
(24, 108,   80.00),  -- Omar Khalid       → Boxing Night GA
(25, 110,   55.00),  -- Grace Kim         → Esports GA
(26, 113,   90.00),  -- Luis Vargas       → Clippers Watch GA
(27, 133,   45.00),  -- Hannah Johansson  → Comic Con GA
(28, 136,   40.00),  -- Alex Rivera       → NorCal Anime GA
(29, 138,   35.00),  -- Priya Patel       → Gaming Con GA
(30, 140,   50.00),  -- Jordan Lee        → Horror Con GA
(31, 144,   42.00),  -- Samantha Cruz     → SD Fan Expo GA
(32, 146,   30.00),  -- Daniel Okafor     → SF Retro Gaming GA
(33, 150,  299.00),  -- Emily Chen        → TechWave GA
(34, 151,  799.00),  -- Marcus Thompson   → TechWave VIP Pass
(35, 153,  199.00),  -- Aisha Williams    → Startup Pitch GA
(36, 154,  499.00),  -- Ryan Nakamura     → Startup Pitch Investor Pass
(37, 155,  175.00),  -- Sofia Martinez    → Marketing Summit GA
(38, 157,  249.00),  -- Nina Rossi        → Healthcare GA
(39, 159,  225.00),  -- Omar Khalid       → BioTech GA
(40, 163,  125.00),  -- Grace Kim         → Sustainability GA
(41, 165,  275.00),  -- Luis Vargas       → Finance Expo GA
(42, 166,  650.00),  -- Hannah Johansson  → Finance Expo VIP Pass
(43,   1,   85.00),  -- Alex Rivera       → Summer Fest GA (2nd ticket, same pool)
(44,  88,  200.00),  -- Priya Patel       → Bay Beats Mezzanine VIP (pool)
(45,  34,  150.00),  -- Jordan Lee        → Jazz Nights Orchestra Row A, Seat 1 (already sold in seed — represents original purchase)
(46,   2,  250.00),  -- Samantha Cruz     → Summer Fest Section 101, Row A, Seat 1
(47,  91,  225.00),  -- Daniel Okafor     → Santa Barbara VIP Terrace (pool)
(48, 103,  300.00),  -- Emily Chen        → Warriors VIP Club Level (pool)
(49, 109,  450.00),  -- Marcus Thompson   → Boxing Ringside VIP (pool)
(50, 152, 1499.00),  -- Aisha Williams    → TechWave All Access Premium

-- UC1: Alex Rivera wins Row Pit, Seat 1 (ticket_id=54).
--      Priya Patel's tx 52 is NOT linked — her concurrent UPDATE
--      finds 0 rows (Alex's commit already set status='sold')
--      and rolls back. tx 52 remains 'pending'.
(51,  54,  350.00),  -- Alex Rivera → Jazz Nights Row Pit, Seat 1 (UC1 winner)

-- UC2: Marcus Thompson bought Front Row, Seat 1 (ticket_id=76).
--      Cancellation sets quantity_sold=0, status='available'.
--      This row is deleted as part of the cancel flow.
(53,  76,  300.00),  -- Marcus Thompson → Greek Theatre Front Row, Seat 1 (UC2, unbooked)

-- UC3: Both buyers increment the same GA pool (ticket_id=1).
(54,   1,   85.00),  -- Jordan Lee    → Summer Fest GA (UC3 buyer A)
(55,   1,   85.00);  -- Samantha Cruz → Summer Fest GA (UC3 buyer B)


-- ============================================================
-- VENUE_BOOKINGS
-- ============================================================
INSERT INTO venue_bookings (event_id, venue_id, customer_id, transaction_id, status, negotiated_price) VALUES
(1,   4,  12,  1, 'confirmed',  48000.00),
(4,   2,  13,  2, 'confirmed', 170000.00),
(2,   1,  15,  3, 'confirmed',  13500.00),
(3,  10,  12,  4, 'confirmed',  37500.00),
(5,  11,  11,  5, 'confirmed',  18500.00),
(6,  12,  13,  6, 'confirmed', 115000.00),
(8,   7,  15,  7, 'confirmed', 190000.00),
(9,   7,  14,  8, 'confirmed', 195000.00),
(10,  2,  13,  9, 'confirmed', 165000.00),
(12,  6,  19, 10, 'confirmed',  32000.00),
(21,  5,  16, 11, 'confirmed',  11500.00),
(17,  5,  17, 12, 'confirmed',  11000.00);


-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address, tokenized_reference) VALUES
(1,  'credit_card', 'completed', '4821',  48000.00, '666 Grand Ave, Los Angeles, CA 90012',        'tok_bk_0001'),
(2,  'credit_card', 'completed', '3390', 170000.00, '777 Castro St, San Francisco, CA 94114',      'tok_bk_0002'),
(3,  'credit_card', 'completed', '7712',  13500.00, '999 Ventura Blvd, Sherman Oaks, CA 91423',    'tok_bk_0003'),
(4,  'credit_card', 'completed', '4821',  37500.00, '666 Grand Ave, Los Angeles, CA 90012',        'tok_bk_0004'),
(5,  'credit_card', 'completed', '5503',  18500.00, '555 State St, Santa Barbara, CA 93101',       'tok_bk_0005'),
(6,  'credit_card', 'completed', '3390', 115000.00, '777 Castro St, San Francisco, CA 94114',      'tok_bk_0006'),
(7,  'credit_card', 'completed', '7712', 190000.00, '999 Ventura Blvd, Sherman Oaks, CA 91423',    'tok_bk_0007'),
(8,  'credit_card', 'completed', '2241', 195000.00, '888 University Ave, San Diego, CA 92103',     'tok_bk_0008'),
(9,  'credit_card', 'completed', '3390', 165000.00, '777 Castro St, San Francisco, CA 94114',      'tok_bk_0009'),
(10, 'credit_card', 'completed', '6678',  32000.00, '400 Sports Arena Blvd, San Diego, CA 92101',  'tok_bk_0010'),
(11, 'credit_card', 'completed', '9934',  11500.00, '100 Napa Valley Dr, Napa, CA 94558',          'tok_bk_0011'),
(12, 'credit_card', 'completed', '1147',  11000.00, '200 Ventura Blvd, Los Angeles, CA 90046',     'tok_bk_0012'),
(13, 'credit_card', 'completed', '3312',     85.00, '123 Sunset Blvd, Los Angeles, CA 90028',     'tok_cx_0013'),
(14, 'debit_card',  'completed', '8821',     75.00, '456 Oak St, San Francisco, CA 94102',         'tok_cx_0014'),
(15, 'credit_card', 'completed', '4490',     65.00, '789 Palm Ave, San Diego, CA 92101',           'tok_cx_0015'),
(16, 'credit_card', 'completed', '6623',     75.00, '321 Vine St, Hollywood, CA 90028',            'tok_cx_0016'),
(17, 'debit_card',  'completed', '1198',     95.00, '654 Bay Rd, Oakland, CA 94612',               'tok_cx_0017'),
(18, 'credit_card', 'completed', '5571',    120.00, '987 Mission St, San Francisco, CA 94103',     'tok_cx_0018'),
(19, 'credit_card', 'completed', '2234',     95.00, '111 Wilshire Blvd, Los Angeles, CA 90010',    'tok_cx_0019'),
(20, 'apple_pay',   'completed',  NULL,      350.00, '222 Figueroa St, Los Angeles, CA 90015',     'tok_cx_0020'),
(21, 'credit_card', 'completed', '9900',     80.00, '333 Market St, San Francisco, CA 94105',      'tok_cx_0021'),
(22, 'debit_card',  'completed', '3344',     45.00, '444 Broadway, San Diego, CA 92101',           'tok_cx_0022'),
(23, 'credit_card', 'completed', '7788',     30.00, '12 Rose Ave, Santa Barbara, CA 93101',        'tok_cx_0023'),
(24, 'credit_card', 'completed', '5522',     80.00, '77 Lemon Grove, San Diego, CA 92104',         'tok_cx_0024'),
(25, 'apple_pay',   'completed',  NULL,       55.00, '45 Hillside Dr, Oakland, CA 94618',          'tok_cx_0025'),
(26, 'credit_card', 'completed', '6611',     90.00, '88 Sunset Strip, West Hollywood, CA 90069',   'tok_cx_0026'),
(27, 'debit_card',  'completed', '2299',     45.00, '200 Golden Gate Ave, San Francisco, CA 94102','tok_cx_0027'),
(28, 'credit_card', 'completed', '3312',     85.00, '123 Sunset Blvd, Los Angeles, CA 90028',     'tok_cx_0028'),
(29, 'credit_card', 'completed', '8821',    200.00, '456 Oak St, San Francisco, CA 94102',         'tok_cx_0029'),
(30, 'debit_card',  'completed', '4490',     65.00, '789 Palm Ave, San Diego, CA 92101',           'tok_cx_0030'),
(31, 'credit_card', 'completed', '6623',     42.00, '321 Vine St, Hollywood, CA 90028',            'tok_cx_0031'),
(32, 'credit_card', 'completed', '1198',     30.00, '654 Bay Rd, Oakland, CA 94612',               'tok_cx_0032'),
(33, 'credit_card', 'completed', '5571',    299.00, '987 Mission St, San Francisco, CA 94103',     'tok_cx_0033'),
(34, 'apple_pay',   'completed',  NULL,      799.00, '111 Wilshire Blvd, Los Angeles, CA 90010',   'tok_cx_0034'),
(35, 'credit_card', 'completed', '2234',    199.00, '222 Figueroa St, Los Angeles, CA 90015',      'tok_cx_0035'),
(36, 'credit_card', 'completed', '9900',    499.00, '333 Market St, San Francisco, CA 94105',      'tok_cx_0036'),
(37, 'debit_card',  'completed', '3344',    175.00, '444 Broadway, San Diego, CA 92101',           'tok_cx_0037'),
(38, 'credit_card', 'completed', '7788',    249.00, '12 Rose Ave, Santa Barbara, CA 93101',        'tok_cx_0038'),
(39, 'credit_card', 'completed', '5522',    225.00, '77 Lemon Grove, San Diego, CA 92104',         'tok_cx_0039'),
(40, 'apple_pay',   'completed',  NULL,      125.00, '45 Hillside Dr, Oakland, CA 94618',          'tok_cx_0040'),
(41, 'credit_card', 'completed', '6611',    275.00, '88 Sunset Strip, West Hollywood, CA 90069',   'tok_cx_0041'),
(42, 'credit_card', 'completed', '2299',    650.00, '200 Golden Gate Ave, San Francisco, CA 94102','tok_cx_0042'),
(43, 'credit_card', 'completed', '3312',     85.00, '123 Sunset Blvd, Los Angeles, CA 90028',     'tok_cx_0043'),
(44, 'debit_card',  'completed', '8821',    200.00, '456 Oak St, San Francisco, CA 94102',         'tok_cx_0044'),
(45, 'credit_card', 'completed', '4490',    150.00, '789 Palm Ave, San Diego, CA 92101',           'tok_cx_0045'),
(46, 'credit_card', 'completed', '6623',    250.00, '321 Vine St, Hollywood, CA 90028',            'tok_cx_0046'),
(47, 'apple_pay',   'completed',  NULL,      225.00, '654 Bay Rd, Oakland, CA 94612',              'tok_cx_0047'),
(48, 'credit_card', 'completed', '5571',    300.00, '987 Mission St, San Francisco, CA 94103',     'tok_cx_0048'),
(49, 'credit_card', 'completed', '2234',    450.00, '111 Wilshire Blvd, Los Angeles, CA 90010',    'tok_cx_0049'),
(50, 'apple_pay',   'completed',  NULL,     1499.00, '222 Figueroa St, Los Angeles, CA 90015',     'tok_cx_0050'),
(51, 'credit_card', 'completed', '3312',    350.00, '123 Sunset Blvd, Los Angeles, CA 90028',     'tok_uc1_win'),
(52, 'credit_card', 'pending',   '8821',    350.00, '456 Oak St, San Francisco, CA 94102',         'tok_uc1_lose'),
(53, 'credit_card', 'refunded',  '2234',    300.00, '111 Wilshire Blvd, Los Angeles, CA 90010',    'tok_uc2_unbook'),
(54, 'credit_card', 'completed', '4490',     85.00, '789 Palm Ave, San Diego, CA 92101',           'tok_uc3_a'),
(55, 'credit_card', 'completed', '6623',     85.00, '321 Vine St, Hollywood, CA 90028',            'tok_uc3_b');


-- ============================================================
-- VENUE_AVAILABILITY  (TSRANGE + GIST exclusion)
-- ============================================================
INSERT INTO venue_availability (venue_id, event_id, booking_time_range, status) VALUES
-- Hollywood Bowl (venue_id=4) — UC4 multi-slot demo
(4,  1, '[2026-07-04 12:00, 2026-07-05 02:00)', 'booked'),    -- Slot A: booked for Summer Fest
(4, NULL,'[2026-07-11 09:00, 2026-07-11 23:00)', 'available'), -- Slot B: open next weekend
(4, NULL,'[2026-07-18 09:00, 2026-07-18 23:00)', 'available'), -- Slot C: open two weeks out
(4, NULL,'[2026-07-25 08:00, 2026-07-27 18:00)', 'maintenance'),-- Slot D: maintenance (non-overlapping)

(1,  2, '[2026-09-20 17:00, 2026-09-21 01:00)', 'booked'),
(1, NULL,'[2026-09-21 09:00, 2026-12-31 00:00)', 'available'),
(2,  4, '[2026-08-15 10:00, 2026-08-16 02:00)', 'booked'),
(2, 10, '[2026-10-20 17:00, 2026-10-20 23:30)', 'booked'),
(2, NULL,'[2026-11-01 09:00, 2026-12-31 00:00)', 'available'),
(10,  3, '[2026-06-28 16:00, 2026-06-28 23:30)', 'booked'),
(10, NULL,'[2026-06-29 09:00, 2026-12-31 00:00)', 'available'),
(11,  5, '[2026-10-11 13:00, 2026-10-11 23:00)', 'booked'),
(11, NULL,'[2026-10-12 09:00, 2026-12-31 00:00)', 'available'),
(12,  6, '[2025-11-02 14:00, 2025-11-03 02:00)', 'booked'),
(12, NULL,'[2026-06-01 09:00, 2026-12-31 00:00)', 'available'),
(7,  8, '[2025-12-31 18:00, 2026-01-01 03:00)', 'booked'),
(7,  9, '[2026-05-10 17:30, 2026-05-10 23:30)', 'booked'),
(7, NULL,'[2026-05-11 09:00, 2026-12-31 00:00)', 'available'),
(6, 12, '[2026-09-05 07:00, 2026-09-05 20:00)', 'booked'),
(6, NULL,'[2026-09-06 09:00, 2026-12-31 00:00)', 'available'),
(5, 17, '[2026-06-07 14:00, 2026-06-08 01:00)', 'booked'),
(5, 19, '[2026-07-19 15:00, 2026-07-19 23:59)', 'booked'),
(5, 21, '[2025-10-18 14:00, 2025-10-18 23:59)', 'booked'),
(5, NULL,'[2026-11-01 09:00, 2026-12-31 00:00)', 'available'),
(8, 18, '[2026-09-13 13:00, 2026-09-13 23:30)', 'booked'),
(8, 20, '[2026-10-03 12:00, 2026-10-03 22:30)', 'booked'),
(8, NULL,'[2026-10-04 09:00, 2026-12-31 00:00)', 'available'),
(9, 26, '[2026-08-22 07:00, 2026-08-22 22:00)', 'booked'),
(9, 33, '[2026-09-08 06:00, 2026-09-08 20:00)', 'booked'),
(9, NULL,'[2026-09-09 09:00, 2026-12-31 00:00)', 'available'),
(3, 27, '[2026-06-06 08:00, 2026-06-06 20:00)', 'booked'),
(3, NULL,'[2026-06-07 09:00, 2026-12-31 00:00)', 'available');


-- ============================================================
-- PREFERENCES
-- ============================================================
INSERT INTO preferences (customer_id, preference_type, value) VALUES
(1,  'event_type',      'Concerts/Festivals'),
(1,  'notification',    'email'),
(2,  'event_type',      'Conferences'),
(2,  'seat_preference', 'VIP'),
(3,  'event_type',      'Conventions'),
(3,  'notification',    'sms'),
(4,  'event_type',      'Concerts/Festivals'),
(4,  'seat_preference', 'General Admission'),
(5,  'event_type',      'Sporting Events'),
(5,  'notification',    'email'),
(6,  'event_type',      'Conferences'),
(6,  'seat_preference', 'VIP'),
(7,  'event_type',      'Sporting Events'),
(8,  'event_type',      'Concerts/Festivals'),
(8,  'seat_preference', 'VIP'),
(9,  'event_type',      'Conferences'),
(9,  'notification',    'email'),
(10, 'event_type',      'Weddings'),
(11, 'venue_type',      'Winery/Estate'),
(11, 'notification',    'email'),
(12, 'venue_type',      'Arena'),
(12, 'preferred_city',  'Los Angeles'),
(13, 'venue_type',      'Arena'),
(13, 'preferred_city',  'San Francisco'),
(14, 'venue_type',      'Fairgrounds'),
(14, 'preferred_city',  'San Diego'),
(15, 'venue_type',      'Concert Hall'),
(15, 'notification',    'email'),
(16, 'venue_type',      'Winery/Estate'),
(16, 'preferred_city',  'Napa'),
(17, 'event_type',      'Concerts/Festivals'),
(17, 'preferred_city',  'Los Angeles'),
(18, 'event_type',      'Conferences'),
(18, 'venue_type',      'Convention Center'),
(19, 'event_type',      'Sporting Events'),
(19, 'preferred_city',  'San Diego'),
(20, 'event_type',      'Conferences'),
(20, 'venue_type',      'Convention Center'),
(21, 'event_type',      'Concerts/Festivals'),
(22, 'event_type',      'Sporting Events'),
(23, 'event_type',      'Conventions'),
(23, 'notification',    'sms'),
(24, 'event_type',      'Concerts/Festivals'),
(25, 'event_type',      'Conferences'),
(25, 'seat_preference', 'General Admission');