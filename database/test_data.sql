-- ------------------------------------------------------------
-- VENUES (12 venues across California)
-- ------------------------------------------------------------
INSERT INTO venues (name, address, city, state, zipcode, venue_type, base_rental_rate, max_capacity, contact_name, contact_phone, contact_email, rating) VALUES
('The Wiltern',              '3790 Wilshire Blvd',       'Los Angeles',   'CA', '90010', 'Concert Hall',      15000.00,  1850,  'Maria Gonzalez',  '(213) 555-0101', 'maria@wiltern.com',         4.80),
('Chase Center',             '1 Warriors Way',            'San Francisco', 'CA', '94158', 'Arena',            180000.00, 18064, 'David Park',       '(415) 555-0102', 'david@chasecenter.com',     4.90),
('San Jose Convention Ctr',  '150 W San Carlos St',       'San Jose',      'CA', '95113', 'Convention Center', 45000.00, 12000, 'Linda Tran',       '(408) 555-0103', 'linda@sjcc.com',            4.50),
('Hollywood Bowl',           '2301 N Highland Ave',       'Los Angeles',   'CA', '90068', 'Amphitheater',      50000.00, 17500, 'James Reyes',      '(323) 555-0104', 'james@hollywoodbowl.com',   4.95),
('The Vinery Estate',        '4500 Silverado Trail',      'Napa',          'CA', '94558', 'Winery/Estate',     12000.00,   300, 'Sophie Laurent',   '(707) 555-0105', 'sophie@vineryestate.com',   4.70),
('Del Mar Fairgrounds',      '2260 Jimmy Durante Blvd',   'Del Mar',       'CA', '92014', 'Fairgrounds',       35000.00, 22000, 'Carlos Mendez',    '(858) 555-0106', 'carlos@delmarfair.com',     4.30),
('Crypto.com Arena',         '1111 S Figueroa St',        'Los Angeles',   'CA', '90015', 'Arena',            200000.00, 20000, 'Angela Kim',       '(213) 555-0107', 'angela@cryptoarena.com',    4.85),
('Balboa Park Club',         '2150 Pan American Rd W',    'San Diego',     'CA', '92101', 'Banquet Hall',       8500.00,   500, 'Thomas Wright',    '(619) 555-0108', 'thomas@balboaparkclub.com', 4.60),
('Moscone Center',           '747 Howard St',             'San Francisco', 'CA', '94103', 'Convention Center', 60000.00, 30000, 'Rachel Nguyen',    '(415) 555-0109', 'rachel@moscone.com',        4.75),
('The Greek Theatre',        '2700 N Vermont Ave',        'Los Angeles',   'CA', '90027', 'Amphitheater',      40000.00,  5800, 'Kevin Brooks',     '(323) 555-0110', 'kevin@greektheatre.com',    4.88),
('Santa Barbara Bowl',       '1122 N Milpas St',          'Santa Barbara', 'CA', '93103', 'Amphitheater',      20000.00,  4562, 'Olivia Castillo',  '(805) 555-0111', 'olivia@sbbowl.com',         4.65),
('Oakland Arena',            '7000 Coliseum Way',         'Oakland',       'CA', '94621', 'Arena',            120000.00, 19596, 'Marcus Johnson',   '(510) 555-0112', 'marcus@oaklandarena.com',   4.40);


-- ------------------------------------------------------------
-- CUSTOMERS (25 customers: mix of customer / booker / both)
-- ------------------------------------------------------------
INSERT INTO customers (name, type, age, race, gender, address, affiliated_organization, contact_phone, contact_email, rating) VALUES
('Alex Rivera',       'customer', 28, 'Hispanic',          'Male',           '123 Sunset Blvd, Los Angeles, CA 90028',      NULL,                        '(213) 555-1001', 'alex.rivera@email.com',      NULL),
('Priya Patel',       'customer', 34, 'South Asian',       'Female',         '456 Oak St, San Francisco, CA 94102',         NULL,                        '(415) 555-1002', 'priya.patel@email.com',      4.50),
('Jordan Lee',        'customer', 22, 'East Asian',        'Non-binary',     '789 Palm Ave, San Diego, CA 92101',           NULL,                        '(619) 555-1003', 'jordan.lee@email.com',       NULL),
('Samantha Cruz',     'customer', 45, 'Hispanic',          'Female',         '321 Vine St, Hollywood, CA 90028',            NULL,                        '(323) 555-1004', 'sam.cruz@email.com',         3.80),
('Daniel Okafor',     'customer', 31, 'Black',             'Male',           '654 Bay Rd, Oakland, CA 94612',               NULL,                        '(510) 555-1005', 'daniel.okafor@email.com',    NULL),
('Emily Chen',        'customer', 27, 'East Asian',        'Female',         '987 Mission St, San Francisco, CA 94103',     NULL,                        '(415) 555-1006', 'emily.chen@email.com',       4.20),
('Marcus Thompson',   'customer', 38, 'Black',             'Male',           '111 Wilshire Blvd, Los Angeles, CA 90010',    NULL,                        '(213) 555-1007', 'marcus.t@email.com',         NULL),
('Aisha Williams',    'customer', 25, 'Black',             'Female',         '222 Figueroa St, Los Angeles, CA 90015',      NULL,                        '(213) 555-1008', 'aisha.w@email.com',          4.90),
('Ryan Nakamura',     'customer', 30, 'East Asian',        'Male',           '333 Market St, San Francisco, CA 94105',      NULL,                        '(415) 555-1009', 'ryan.n@email.com',           NULL),
('Sofia Martinez',    'customer', 42, 'Hispanic',          'Female',         '444 Broadway, San Diego, CA 92101',           NULL,                        '(619) 555-1010', 'sofia.m@email.com',          3.50),
('Lena Fischer',      'booker',   36, 'White',             'Female',         '555 State St, Santa Barbara, CA 93101',       'SoCal Events Co.',          '(805) 555-1011', 'lena@socalevents.com',       4.70),
('Brandon Yee',       'booker',   44, 'East Asian',        'Male',           '666 Grand Ave, Los Angeles, CA 90012',        'Yee Productions',           '(213) 555-1012', 'brandon@yeeproductions.com', 4.85),
('Natalie Gomez',     'booker',   39, 'Hispanic',          'Female',         '777 Castro St, San Francisco, CA 94114',      'Bay Area Live',             '(415) 555-1013', 'natalie@bayarealive.com',    4.60),
('Chris Okonkwo',     'booker',   51, 'Black',             'Male',           '888 University Ave, San Diego, CA 92103',     'Pacific Event Group',       '(619) 555-1014', 'chris@pacificevent.com',     4.40),
('Ashley Park',       'booker',   33, 'East Asian',        'Female',         '999 Ventura Blvd, Sherman Oaks, CA 91423',    'Park Events LLC',           '(818) 555-1015', 'ashley@parkevents.com',      4.95),
('David Hernandez',   'both',     47, 'Hispanic',          'Male',           '100 Napa Valley Dr, Napa, CA 94558',          'Hernandez Weddings & More', '(707) 555-1016', 'david@hernandezweddings.com',4.80),
('Tiffany Moore',     'both',     29, 'Black',             'Female',         '200 Ventura Blvd, Los Angeles, CA 90046',     'Moore Entertainment',       '(323) 555-1017', 'tiffany@mooreent.com',       4.55),
('Jason Wu',          'both',     41, 'East Asian',        'Male',           '300 Financial St, San Francisco, CA 94104',   'Wu Tech Events',            '(415) 555-1018', 'jason@wutechevents.com',     4.75),
('Carmen Delgado',    'both',     35, 'Hispanic',          'Female',         '400 Sports Arena Blvd, San Diego, CA 92101',  'Delgado Sports & Events',   '(619) 555-1019', 'carmen@delgadoevents.com',   4.30),
('Patrick Sullivan',  'both',     52, 'White',             'Male',           '500 Convention Way, San Jose, CA 95110',      'Sullivan Conference Mgmt',  '(408) 555-1020', 'patrick@sullivanconf.com',   4.65),
('Nina Rossi',        'customer', 26, 'White',             'Female',         '12 Rose Ave, Santa Barbara, CA 93101',        NULL,                        '(805) 555-1021', 'nina.rossi@email.com',       NULL),
('Omar Khalid',       'customer', 33, 'Middle Eastern',    'Male',           '77 Lemon Grove, San Diego, CA 92104',         NULL,                        '(619) 555-1022', 'omar.k@email.com',           NULL),
('Grace Kim',         'customer', 23, 'East Asian',        'Female',         '45 Hillside Dr, Oakland, CA 94618',           NULL,                        '(510) 555-1023', 'grace.kim@email.com',        4.10),
('Luis Vargas',       'customer', 37, 'Hispanic',          'Male',           '88 Sunset Strip, West Hollywood, CA 90069',   NULL,                        '(323) 555-1024', 'luis.v@email.com',           NULL),
('Hannah Johansson',  'customer', 31, 'White',             'Female',         '200 Golden Gate Ave, San Francisco, CA 94102',NULL,                        '(415) 555-1025', 'hannah.j@email.com',         3.90);


-- ------------------------------------------------------------
-- EVENTS (40 events - 8 per category, spread across statuses)
-- ------------------------------------------------------------
INSERT INTO events (name, venue_id, date, start_time, end_time, capacity, type, status, description, rating) VALUES
----------------------
-- Concerts (8)
----------------------
('SoCal Summer Fest',         4,  '2026-07-04', '14:00', '23:00', 15000, 'Concerts/Festivals', 'scheduled',  'Annual Fourth of July music festival at the Hollywood Bowl featuring top indie and pop artists.',          NULL),
('Bay Beats Music Festival',  2,  '2026-08-15', '12:00', '22:00', 16000, 'Concerts/Festivals', 'scheduled',  'Multi-stage festival at Chase Center featuring hip-hop, R&B, and electronic artists.',                   NULL),
('LA Jazz Nights',            1,  '2026-09-20', '19:00', '23:00',  1500, 'Concerts/Festivals', 'scheduled',  'Intimate jazz evening at The Wiltern with celebrated local and national jazz performers.',               4.70),
('Greek Theatre Open Air',   10,  '2026-06-28', '18:00', '22:30',  5500, 'Concerts/Festivals', 'scheduled',  'Outdoor rock concert series at the iconic Greek Theatre in Griffith Park.',                             NULL),
('Santa Barbara Wine & Music',11,  '2026-10-11', '15:00', '21:00',  4000, 'Concerts/Festivals', 'scheduled',  'Wine-paired music event featuring California acoustic and folk artists.',                               NULL),
('Oakland Hip Hop Summit',   12,  '2025-11-02', '16:00', '23:00', 18000, 'Concerts/Festivals', 'complete',   'Sold-out Bay Area hip-hop showcase celebrating West Coast artists.',                                    4.85),
('Desert Sound Festival',     6,  '2026-04-19', '13:00', '23:59', 20000, 'Concerts/Festivals', 'postponed',  'Originally planned multi-day festival postponed to later in the year.',                                NULL),
('New Year Countdown LA',     7,  '2025-12-31', '20:00', '01:00', 18000, 'Concerts/Festivals', 'complete',   'Star-studded New Year''s Eve concert and countdown at Crypto.com Arena.',                               4.90),
----------------------
-- Sporting Events (8)
----------------------
('Lakers vs Warriors',        7,  '2026-05-10', '19:30', '22:30', 18000, 'Sporting Events',    'scheduled',  'Western Conference playoff matchup between the LA Lakers and Golden State Warriors.',                   NULL),
('Golden State Warriors Home Opener', 2, '2026-10-20', '19:00', '21:30', 17500, 'Sporting Events', 'scheduled', 'Chase Center season opener with fan appreciation night and giveaways.',                            NULL),
('SoCal Marathon',            4,  '2026-03-08', '06:00', '14:00',  5000, 'Sporting Events',    'complete',   'Annual Los Angeles area marathon starting and finishing at the Hollywood Bowl grounds.',                4.60),
('San Diego Sports Expo',     6,  '2026-09-05', '09:00', '18:00', 10000, 'Sporting Events',    'scheduled',  'All-sports fan expo at Del Mar Fairgrounds with athlete meet-and-greets.',                             NULL),
('Bay Area Boxing Night',    12,  '2026-07-22', '18:00', '23:00', 15000, 'Sporting Events',    'scheduled',  'Championship boxing card featuring top lightweight and welterweight contenders.',                      NULL),
('LA Esports Championship',   7,  '2026-08-30', '10:00', '20:00', 16000, 'Sporting Events',    'scheduled',  'Major esports tournament featuring teams competing in multiple titles.',                               NULL),
('Clippers Playoff Watch',    7,  '2025-05-15', '19:00', '22:30', 18500, 'Sporting Events',    'complete',   'Playoff game watch party and live broadcast event.',                                                   4.40),
('Norcal Volleyball Open',    3,  '2026-06-14', '08:00', '18:00',  8000, 'Sporting Events',    'cancelled',  'Cancelled due to venue scheduling conflict with a previously booked conference.',                      NULL),
----------------------
-- Weddings (8)
----------------------
('Rivera-Patel Wedding',      5,  '2026-06-07', '16:00', '23:00',   200, 'Weddings',           'scheduled',  'Romantic vineyard wedding ceremony and reception in the heart of Napa Valley.',                        NULL),
('Chen-Nakamura Wedding',     8,  '2026-09-13', '15:00', '22:00',   350, 'Weddings',           'scheduled',  'Elegant garden wedding reception at the historic Balboa Park Club.',                                   NULL),
('The Martinez Celebration',  5,  '2026-07-19', '17:00', '23:00',   250, 'Weddings',           'scheduled',  'Intimate Napa Valley vineyard wedding with a wine-paired dinner reception.',                           NULL),
('Williams-Thompson Wedding', 8,  '2026-10-03', '14:00', '21:00',   400, 'Weddings',           'scheduled',  'Classic San Diego ballroom wedding with live orchestra.',                                              NULL),
('Gomez-Fischer Wedding',     5,  '2025-10-18', '16:00', '23:00',   180, 'Weddings',           'complete',   'Autumn harvest vineyard wedding with farm-to-table reception dinner.',                                 4.95),
('Park-Sullivan Wedding',    11,  '2026-05-23', '15:30', '22:30',   300, 'Weddings',           'scheduled',  'Scenic outdoor wedding ceremony and reception at the Santa Barbara Bowl.',                             NULL),
('Kim-Vargas Wedding',        8,  '2026-08-08', '17:00', '23:30',   280, 'Weddings',           'scheduled',  'Vibrant multicultural wedding celebration at Balboa Park Club.',                                       NULL),
('Johansson-Moore Wedding',   5,  '2026-11-14', '16:00', '22:00',   220, 'Weddings',           'scheduled',  'Fall Napa Valley wedding with a focus on sustainable local sourcing.',                                 NULL),
----------------------
-- Conventions (8)
----------------------
('LA Comic & Pop Culture Con',7,  '2026-07-11', '09:00', '19:00', 18000, 'Conventions',        'scheduled',  'Massive pop culture convention with celebrity panels, cosplay contests, and exhibitors.',              NULL),
('NorCal Anime Expo',         9,  '2026-08-22', '09:00', '20:00', 25000, 'Conventions',        'scheduled',  'Premier Northern California anime and manga convention at Moscone Center.',                            NULL),
('San Jose Gaming Con',       3,  '2026-06-06', '10:00', '18:00', 10000, 'Conventions',        'scheduled',  'Annual video game and tabletop gaming convention with tournaments and demos.',                         NULL),
('SoCal Horror Con',         10,  '2026-10-25', '11:00', '21:00',  5000, 'Conventions',        'scheduled',  'Horror film and pop culture convention at the Greek Theatre amphitheater grounds.',                    NULL),
('Oakland Fan Fest',         12,  '2025-09-14', '10:00', '18:00', 12000, 'Conventions',        'complete',   'Bay Area fan festival celebrating comics, sci-fi, and fantasy genres.',                               4.50),
('San Diego Fan Expo',        6,  '2026-05-02', '09:00', '19:00', 18000, 'Conventions',        'scheduled',  'Southern California''s largest fan and pop culture expo.',                                            NULL),
('SF Retro Gaming Fest',      9,  '2026-09-27', '10:00', '20:00', 20000, 'Conventions',        'scheduled',  'Celebration of classic and retro video games with rare hardware displays.',                           NULL),
('Anime & Cosplay Weekend',   7,  '2026-04-04', '09:00', '21:00', 16000, 'Conventions',        'postponed',  'Postponed from earlier date due to scheduling conflict.',                                             NULL),
----------------------
-- Conferences (8)
----------------------
('TechWave Summit',           9,  '2026-09-08', '08:00', '18:00', 22000, 'Conferences',        'scheduled',  'Leading technology conference covering AI, cloud computing, and startup innovation.',                  NULL),
('SF Startup Pitch Day',      9,  '2026-06-17', '09:00', '17:00', 15000, 'Conferences',        'scheduled',  'Annual startup showcase with investor panels and live pitch competitions.',                            NULL),
('SoCal Marketing Summit',    3,  '2026-08-04', '08:30', '17:00', 10000, 'Conferences',        'scheduled',  'Full-day marketing and growth conference featuring brand strategy leaders.',                           NULL),
('LA Healthcare Innovation',  7,  '2026-11-03', '08:00', '17:30', 14000, 'Conferences',        'scheduled',  'Healthcare technology and policy conference at Crypto.com Arena.',                                    NULL),
('San Diego BioTech Forum',   6,  '2026-07-29', '09:00', '17:00',  8000, 'Conferences',        'scheduled',  'Annual biotechnology and life sciences industry conference.',                                          NULL),
('NorCal HR Summit',          3,  '2025-10-07', '08:30', '16:30',  6000, 'Conferences',        'complete',   'Human resources and people operations conference held at San Jose Convention Center.',                4.55),
('LA Sustainability Forum',  10,  '2026-10-14', '09:00', '17:00',  4000, 'Conferences',        'scheduled',  'Environmental sustainability and green business practices conference.',                                NULL),
('Bay Area Finance Expo',     9,  '2026-05-20', '08:00', '17:00', 18000, 'Conferences',        'scheduled',  'Financial services and fintech conference featuring keynotes from industry leaders.',                  NULL);


-- ------------------------------------------------------------
-- TRANSACTIONS (booker transactions first: IDs 1–12; customer: 13–50)
-- ------------------------------------------------------------
INSERT INTO transactions (customer_id, type, status, transaction_time) VALUES
-- Booker transactions (venue bookings)
(12, 'booker', 'completed', '2026-01-10 10:00:00'),  -- 1  Brandon Yee - SoCal Summer Fest
(13, 'booker', 'completed', '2026-01-12 11:00:00'),  -- 2  Natalie Gomez - Bay Beats
(15, 'booker', 'completed', '2026-01-15 09:30:00'),  -- 3  Ashley Park - LA Jazz Nights
(12, 'booker', 'completed', '2026-01-18 14:00:00'),  -- 4  Brandon Yee - Greek Theatre
(11, 'booker', 'completed', '2026-01-20 10:00:00'),  -- 5  Lena Fischer - Santa Barbara Wine
(13, 'booker', 'completed', '2025-09-01 09:00:00'),  -- 6  Natalie Gomez - Oakland Hip Hop (complete)
(15, 'booker', 'completed', '2025-11-01 10:00:00'),  -- 7  Ashley Park - New Year Countdown (complete)
(14, 'booker', 'completed', '2026-01-25 11:00:00'),  -- 8  Chris Okonkwo - Lakers vs Warriors
(13, 'booker', 'completed', '2026-02-01 09:00:00'),  -- 9  Natalie Gomez - Warriors Home Opener
(19, 'booker', 'completed', '2026-01-05 10:00:00'),  -- 10 Carmen Delgado - San Diego Sports Expo
(16, 'booker', 'completed', '2025-11-15 09:00:00'),  -- 11 David Hernandez - Gomez-Fischer Wedding (complete)
(17, 'booker', 'completed', '2026-02-10 10:00:00'),  -- 12 Tiffany Moore - Rivera-Patel Wedding
--------------------------------
-- Customer ticket transactions
--------------------------------
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
(8,  'customer', 'completed', '2026-04-04 16:45:00'); -- 50


-- ------------------------------------------------------------
-- TICKETS (~180 tickets across all events)
-- ------------------------------------------------------------
INSERT INTO tickets (event_id, type, status, seat_location, face_value_price) VALUES
-- Event 1: SoCal Summer Fest (Concerts/Festivals - scheduled)
(1, 'General Admission', 'sold',      'GA Floor',    85.00),
(1, 'General Admission', 'sold',      'GA Floor',    85.00),
(1, 'General Admission', 'available', 'GA Floor',    85.00),
(1, 'VIP',               'sold',      'VIP Section', 250.00),
(1, 'VIP',               'reserved',  'VIP Section', 250.00),
-- Event 2: Bay Beats Music Festival (scheduled)
(2, 'General Admission', 'sold',      'GA Floor',    75.00),
(2, 'General Admission', 'available', 'GA Floor',    75.00),
(2, 'VIP',               'sold',      'Mezzanine',  200.00),
(2, 'VIP',               'available', 'Mezzanine',  200.00),
(2, 'Premium',           'reserved',  'Floor Front', 350.00),
-- Event 3: LA Jazz Nights (scheduled)
(3, 'General Admission', 'sold',      'Orchestra',   65.00),
(3, 'General Admission', 'sold',      'Orchestra',   65.00),
(3, 'VIP',               'sold',      'Front Row',  150.00),
(3, 'VIP',               'available', 'Front Row',  150.00),
(3, 'General Admission', 'available', 'Balcony',     45.00),
-- Event 4: Greek Theatre Open Air (scheduled)
(4, 'General Admission', 'available', 'Lawn',        55.00),
(4, 'General Admission', 'sold',      'Lawn',        55.00),
(4, 'VIP',               'available', 'Orchestra',  175.00),
(4, 'VIP',               'reserved',  'Orchestra',  175.00),
(4, 'Premium',           'sold',      'Pit',        300.00),
-- Event 5: Santa Barbara Wine & Music (scheduled)
(5, 'General Admission', 'available', 'General',     95.00),
(5, 'General Admission', 'sold',      'General',     95.00),
(5, 'VIP',               'sold',      'VIP Terrace', 225.00),
(5, 'VIP',               'available', 'VIP Terrace', 225.00),
-- Event 6: Oakland Hip Hop Summit (complete)
(6, 'General Admission', 'sold',      'Floor',       70.00),
(6, 'General Admission', 'sold',      'Floor',       70.00),
(6, 'VIP',               'sold',      'VIP Lounge', 180.00),
(6, 'VIP',               'sold',      'VIP Lounge', 180.00),
(6, 'General Admission', 'sold',      'Balcony',     50.00),
-- Event 7: Desert Sound Festival (postponed) — mostly available
(7, 'General Admission', 'available', 'GA',          90.00),
(7, 'General Admission', 'reserved',  'GA',          90.00),
(7, 'VIP',               'available', 'VIP',        275.00),
-- Event 8: New Year Countdown LA (complete)
(8, 'General Admission', 'sold',      'Floor',      120.00),
(8, 'General Admission', 'sold',      'Floor',      120.00),
(8, 'VIP',               'sold',      'VIP Suite',  500.00),
(8, 'Premium',           'sold',      'Pit',        750.00),
-- Event 9: Lakers vs Warriors (Sporting Events - scheduled)
(9, 'General Admission', 'sold',      'Upper Bowl',  95.00),
(9, 'General Admission', 'available', 'Upper Bowl',  95.00),
(9, 'VIP',               'sold',      'Club Level', 350.00),
(9, 'VIP',               'reserved',  'Club Level', 350.00),
(9, 'Premium',           'available', 'Courtside', 1500.00),
-- Event 10: Warriors Home Opener (scheduled)
(10, 'General Admission', 'sold',     'Upper Bowl',  80.00),
(10, 'General Admission', 'available','Upper Bowl',  80.00),
(10, 'VIP',               'sold',     'Club Level', 300.00),
(10, 'VIP',               'available','Club Level',  300.00),
-- Event 11: SoCal Marathon (complete)
(11, 'General Admission', 'sold',     'Participant', 45.00),
(11, 'General Admission', 'sold',     'Participant', 45.00),
(11, 'VIP',               'sold',     'Spectator VIP',120.00),
-- Event 12: San Diego Sports Expo (scheduled)
(12, 'General Admission', 'available','General',     30.00),
(12, 'General Admission', 'sold',     'General',     30.00),
(12, 'VIP',               'available','VIP Access',  85.00),
(12, 'VIP',               'sold',     'VIP Access',  85.00),
-- Event 13: Bay Area Boxing Night (scheduled)
(13, 'General Admission', 'available','Upper',       80.00),
(13, 'General Admission', 'sold',     'Upper',       80.00),
(13, 'VIP',               'sold',     'Ringside',   450.00),
(13, 'VIP',               'reserved', 'Ringside',   450.00),
-- Event 14: LA Esports Championship (scheduled)
(14, 'General Admission', 'available','General',     55.00),
(14, 'General Admission', 'sold',     'General',     55.00),
(14, 'VIP',               'available','VIP Lounge', 150.00),
(14, 'Premium',           'sold',     'Front Row',  250.00),
-- Event 15: Clippers Playoff Watch (complete)
(15, 'General Admission', 'sold',     'Floor',       90.00),
(15, 'General Admission', 'sold',     'Floor',       90.00),
(15, 'VIP',               'sold',     'Suite',      400.00),
-- Event 16: Norcal Volleyball Open (cancelled) — all available
(16, 'General Admission', 'available','General',     25.00),
(16, 'VIP',               'available','Courtside',   75.00),
-- Event 17: Rivera-Patel Wedding (Weddings - scheduled)
(17, 'General Admission', 'sold',     'Ceremony',     0.00),
(17, 'General Admission', 'sold',     'Reception',    0.00),
(17, 'VIP',               'reserved', 'Bridal Party', 0.00),
-- Event 18: Chen-Nakamura Wedding (scheduled)
(18, 'General Admission', 'sold',     'Main Hall',    0.00),
(18, 'General Admission', 'available','Main Hall',    0.00),
(18, 'VIP',               'reserved', 'Head Table',   0.00),
-- Event 19: The Martinez Celebration (scheduled)
(19, 'General Admission', 'sold',     'Vineyard',     0.00),
(19, 'General Admission', 'available','Vineyard',     0.00),
(19, 'VIP',               'sold',     'VIP Table',    0.00),
-- Event 20: Williams-Thompson Wedding (scheduled)
(20, 'General Admission', 'available','Ballroom',     0.00),
(20, 'General Admission', 'sold',     'Ballroom',     0.00),
(20, 'VIP',               'available','Bridal Suite',  0.00),
-- Event 21: Gomez-Fischer Wedding (complete)
(21, 'General Admission', 'sold',     'Vineyard',     0.00),
(21, 'General Admission', 'sold',     'Vineyard',     0.00),
(21, 'VIP',               'sold',     'VIP Pavilion',  0.00),
-- Event 22: Park-Sullivan Wedding (scheduled)
(22, 'General Admission', 'available','Amphitheater',  0.00),
(22, 'General Admission', 'sold',     'Amphitheater',  0.00),
(22, 'VIP',               'reserved', 'Stage View',    0.00),
-- Event 23: Kim-Vargas Wedding (scheduled)
(23, 'General Admission', 'sold',     'Main Hall',    0.00),
(23, 'General Admission', 'available','Main Hall',    0.00),
(23, 'VIP',               'sold',     'Sweetheart',   0.00),
-- Event 24: Johansson-Moore Wedding (scheduled)
(24, 'General Admission', 'available','Garden',       0.00),
(24, 'General Admission', 'available','Garden',       0.00),
(24, 'VIP',               'reserved', 'VIP Lounge',   0.00),
-- Event 25: LA Comic & Pop Culture Con (Conventions - scheduled)
(25, 'General Admission', 'sold',     'Main Floor',   45.00),
(25, 'General Admission', 'available','Main Floor',   45.00),
(25, 'VIP',               'sold',     'VIP Lounge',  120.00),
(25, 'Premium',           'reserved', 'All Access',  250.00),
-- Event 26: NorCal Anime Expo (scheduled)
(26, 'General Admission', 'sold',     'Main Hall',    40.00),
(26, 'General Admission', 'available','Main Hall',    40.00),
(26, 'VIP',               'sold',     'VIP Badge',   100.00),
(26, 'VIP',               'available','VIP Badge',   100.00),
-- Event 27: San Jose Gaming Con (scheduled)
(27, 'General Admission', 'available','Main Floor',   35.00),
(27, 'General Admission', 'sold',     'Main Floor',   35.00),
(27, 'VIP',               'sold',     'Pro Pass',     90.00),
(27, 'VIP',               'reserved', 'Pro Pass',     90.00),
-- Event 28: SoCal Horror Con (scheduled)
(28, 'General Admission', 'available','Main Hall',    50.00),
(28, 'General Admission', 'sold',     'Main Hall',    50.00),
(28, 'VIP',               'available','VIP Dungeon', 130.00),
-- Event 29: Oakland Fan Fest (complete)
(29, 'General Admission', 'sold',     'Main Floor',   38.00),
(29, 'General Admission', 'sold',     'Main Floor',   38.00),
(29, 'VIP',               'sold',     'VIP Lounge',   95.00),
-- Event 30: San Diego Fan Expo (scheduled)
(30, 'General Admission', 'available','Main Floor',   42.00),
(30, 'General Admission', 'sold',     'Main Floor',   42.00),
(30, 'VIP',               'sold',     'VIP Access',  110.00),
(30, 'VIP',               'reserved', 'VIP Access',  110.00),
-- Event 31: SF Retro Gaming Fest (scheduled)
(31, 'General Admission', 'available','Main Hall',    30.00),
(31, 'General Admission', 'sold',     'Main Hall',    30.00),
(31, 'VIP',               'available','Collector VIP',80.00),
-- Event 32: Anime & Cosplay Weekend (postponed)
(32, 'General Admission', 'available','General',      48.00),
(32, 'VIP',               'reserved', 'VIP',         125.00),
-- Event 33: TechWave Summit (Conferences - scheduled)
(33, 'General Admission', 'sold',     'Main Hall',   299.00),
(33, 'General Admission', 'available','Main Hall',   299.00),
(33, 'VIP',               'sold',     'VIP Pass',    799.00),
(33, 'Premium',           'reserved', 'All Access', 1499.00),
-- Event 34: SF Startup Pitch Day (scheduled)
(34, 'General Admission', 'sold',     'Main Floor',  199.00),
(34, 'General Admission', 'available','Main Floor',  199.00),
(34, 'VIP',               'sold',     'Investor Pass',499.00),
(34, 'VIP',               'available','Investor Pass',499.00),
-- Event 35: SoCal Marketing Summit (scheduled)
(35, 'General Admission', 'available','Main Hall',   175.00),
(35, 'General Admission', 'sold',     'Main Hall',   175.00),
(35, 'VIP',               'sold',     'VIP Access',  425.00),
-- Event 36: LA Healthcare Innovation (scheduled)
(36, 'General Admission', 'available','Main Floor',  249.00),
(36, 'General Admission', 'sold',     'Main Floor',  249.00),
(36, 'VIP',               'sold',     'VIP Suite',   599.00),
(36, 'VIP',               'reserved', 'VIP Suite',   599.00),
-- Event 37: San Diego BioTech Forum (scheduled)
(37, 'General Admission', 'available','Main Hall',   225.00),
(37, 'General Admission', 'sold',     'Main Hall',   225.00),
(37, 'VIP',               'available','VIP Pass',    550.00),
-- Event 38: NorCal HR Summit (complete)
(38, 'General Admission', 'sold',     'Main Hall',   150.00),
(38, 'General Admission', 'sold',     'Main Hall',   150.00),
(38, 'VIP',               'sold',     'VIP Pass',    375.00),
-- Event 39: LA Sustainability Forum (scheduled)
(39, 'General Admission', 'available','Main Hall',   125.00),
(39, 'General Admission', 'sold',     'Main Hall',   125.00),
(39, 'VIP',               'reserved', 'VIP Access',  300.00),
-- Event 40: Bay Area Finance Expo (scheduled)
(40, 'General Admission', 'available','Main Floor',  275.00),
(40, 'General Admission', 'sold',     'Main Floor',  275.00),
(40, 'VIP',               'sold',     'VIP Pass',    650.00),
(40, 'Premium',           'reserved', 'Executive',  1200.00);


-- ------------------------------------------------------------
-- TRANSACTION_TICKETS (linking customer transactions to tickets)
-- Ticket IDs map to the order inserted above
-- ------------------------------------------------------------
INSERT INTO transaction_tickets (transaction_id, ticket_id, price_paid) VALUES
(13, 1,  85.00),   -- Alex Rivera → SoCal Summer Fest GA
(14, 6,  75.00),   -- Priya Patel → Bay Beats GA
(15, 11, 65.00),   -- Jordan Lee → LA Jazz Nights GA
(16, 20, 300.00),  -- Samantha Cruz → Greek Theatre Premium
(17, 25, 95.00),   -- Daniel Okafor → Santa Barbara Wine GA
(18, 34, 120.00),  -- Emily Chen → New Year Countdown GA
(19, 38, 95.00),   -- Marcus Thompson → Lakers GA
(20, 40, 350.00),  -- Aisha Williams → Lakers VIP
(21, 44, 80.00),   -- Ryan Nakamura → Warriors Home GA
(22, 48, 45.00),   -- Sofia Martinez → Marathon GA
(23, 51, 30.00),   -- Nina Rossi → SD Sports Expo GA
(24, 55, 80.00),   -- Omar Khalid → Boxing Night GA
(25, 59, 55.00),   -- Grace Kim → Esports GA
(26, 64, 90.00),   -- Luis Vargas → Clippers Watch GA
(27, 68, 45.00),   -- Hannah Johansson → Comic Con GA
(28, 72, 40.00),   -- Alex Rivera → NorCal Anime GA
(29, 76, 35.00),   -- Priya Patel → Gaming Con GA
(30, 80, 50.00),   -- Jordan Lee → Horror Con GA
(31, 84, 42.00),   -- Samantha Cruz → SD Fan Expo GA
(32, 88, 30.00),   -- Daniel Okafor → SF Retro Gaming GA
(33, 92, 299.00),  -- Emily Chen → TechWave GA
(34, 94, 799.00),  -- Marcus Thompson → TechWave VIP
(35, 96, 199.00),  -- Aisha Williams → Startup Pitch GA
(36, 98, 499.00),  -- Ryan Nakamura → Startup Pitch Investor
(37, 101, 175.00), -- Sofia Martinez → Marketing Summit GA
(38, 104, 249.00), -- Nina Rossi → Healthcare GA
(39, 107, 225.00), -- Omar Khalid → BioTech GA
(40, 111, 125.00), -- Grace Kim → Sustainability GA
(41, 113, 275.00), -- Luis Vargas → Finance Expo GA
(42, 115, 650.00), -- Hannah Johansson → Finance Expo VIP
(43, 3,  85.00),   -- Alex Rivera → SoCal Summer Fest GA (2nd ticket)
(44, 8, 200.00),   -- Priya Patel → Bay Beats VIP
(45, 13, 150.00),  -- Jordan Lee → Jazz VIP
(46, 19, 175.00),  -- Samantha Cruz → Greek Theatre VIP
(47, 23, 225.00),  -- Daniel Okafor → Santa Barbara VIP
(48, 45, 300.00),  -- Emily Chen → Warriors VIP
(49, 57, 450.00),  -- Marcus Thompson → Boxing Ringside VIP
(50, 93, 799.00);  -- Aisha Williams → TechWave VIP (2nd)


-- ------------------------------------------------------------
-- VENUE_BOOKINGS (one per scheduled/complete event)
-- ------------------------------------------------------------
INSERT INTO venue_bookings (event_id, venue_id, customer_id, transaction_id, status, negotiated_price) VALUES
(1,  4,  12, 1,  'confirmed', 48000.00),
(2,  2,  13, 2,  'confirmed', 170000.00),
(3,  1,  15, 3,  'confirmed', 13500.00),
(4,  10, 12, 4,  'confirmed', 37500.00),
(5,  11, 11, 5,  'confirmed', 18500.00),
(6,  12, 13, 6,  'confirmed', 115000.00),
(8,  7,  15, 7,  'confirmed', 190000.00),
(9,  7,  14, 8,  'confirmed', 195000.00),
(10, 2,  13, 9,  'confirmed', 165000.00),
(12, 6,  19, 10, 'confirmed', 32000.00),
(21, 5,  16, 11, 'confirmed', 11500.00),
(17, 5,  17, 12, 'confirmed', 11000.00);


-- ------------------------------------------------------------
-- PAYMENTS
-- ------------------------------------------------------------
INSERT INTO payments (transaction_id, payment_type, payment_status, card_last_4, total_amount, billing_address, tokenized_reference) VALUES
-- Booker payments
(1,  'credit_card', 'completed', '4821', 48000.00, '666 Grand Ave, Los Angeles, CA 90012',        'tok_bk_0001'),
(2,  'credit_card', 'completed', '3390', 170000.00,'777 Castro St, San Francisco, CA 94114',       'tok_bk_0002'),
(3,  'credit_card', 'completed', '7712', 13500.00, '999 Ventura Blvd, Sherman Oaks, CA 91423',     'tok_bk_0003'),
(4,  'credit_card', 'completed', '4821', 37500.00, '666 Grand Ave, Los Angeles, CA 90012',         'tok_bk_0004'),
(5,  'credit_card', 'completed', '5503', 18500.00, '555 State St, Santa Barbara, CA 93101',        'tok_bk_0005'),
(6,  'credit_card', 'completed', '3390', 115000.00,'777 Castro St, San Francisco, CA 94114',       'tok_bk_0006'),
(7,  'credit_card', 'completed', '7712', 190000.00,'999 Ventura Blvd, Sherman Oaks, CA 91423',     'tok_bk_0007'),
(8,  'credit_card', 'completed', '2241', 195000.00,'888 University Ave, San Diego, CA 92103',      'tok_bk_0008'),
(9,  'credit_card', 'completed', '3390', 165000.00,'777 Castro St, San Francisco, CA 94114',       'tok_bk_0009'),
(10, 'credit_card', 'completed', '6678', 32000.00, '400 Sports Arena Blvd, San Diego, CA 92101',   'tok_bk_0010'),
(11, 'credit_card', 'completed', '9934', 11500.00, '100 Napa Valley Dr, Napa, CA 94558',           'tok_bk_0011'),
(12, 'credit_card', 'completed', '1147', 11000.00, '200 Ventura Blvd, Los Angeles, CA 90046',      'tok_bk_0012'),
-- Customer payments
(13, 'credit_card', 'completed', '3312', 85.00,    '123 Sunset Blvd, Los Angeles, CA 90028',       'tok_cx_0013'),
(14, 'debit_card',  'completed', '8821', 75.00,    '456 Oak St, San Francisco, CA 94102',           'tok_cx_0014'),
(15, 'credit_card', 'completed', '4490', 65.00,    '789 Palm Ave, San Diego, CA 92101',             'tok_cx_0015'),
(16, 'credit_card', 'completed', '6623', 300.00,   '321 Vine St, Hollywood, CA 90028',              'tok_cx_0016'),
(17, 'debit_card',  'completed', '1198', 95.00,    '654 Bay Rd, Oakland, CA 94612',                 'tok_cx_0017'),
(18, 'credit_card', 'completed', '5571', 120.00,   '987 Mission St, San Francisco, CA 94103',       'tok_cx_0018'),
(19, 'credit_card', 'completed', '2234', 95.00,    '111 Wilshire Blvd, Los Angeles, CA 90010',      'tok_cx_0019'),
(20, 'apple_pay',   'completed', NULL,   350.00,   '222 Figueroa St, Los Angeles, CA 90015',        'tok_cx_0020'),
(21, 'credit_card', 'completed', '9900', 80.00,    '333 Market St, San Francisco, CA 94105',        'tok_cx_0021'),
(22, 'debit_card',  'completed', '3344', 45.00,    '444 Broadway, San Diego, CA 92101',             'tok_cx_0022'),
(23, 'credit_card', 'completed', '7788', 30.00,    '12 Rose Ave, Santa Barbara, CA 93101',          'tok_cx_0023'),
(24, 'credit_card', 'completed', '5522', 80.00,    '77 Lemon Grove, San Diego, CA 92104',           'tok_cx_0024'),
(25, 'apple_pay',   'completed', NULL,   55.00,    '45 Hillside Dr, Oakland, CA 94618',             'tok_cx_0025'),
(26, 'credit_card', 'completed', '6611', 90.00,    '88 Sunset Strip, West Hollywood, CA 90069',     'tok_cx_0026'),
(27, 'debit_card',  'completed', '2299', 45.00,    '200 Golden Gate Ave, San Francisco, CA 94102',  'tok_cx_0027'),
(28, 'credit_card', 'completed', '3312', 85.00,    '123 Sunset Blvd, Los Angeles, CA 90028',        'tok_cx_0028'),
(29, 'credit_card', 'completed', '8821', 200.00,   '456 Oak St, San Francisco, CA 94102',           'tok_cx_0029'),
(30, 'debit_card',  'completed', '4490', 65.00,    '789 Palm Ave, San Diego, CA 92101',             'tok_cx_0030'),
(31, 'credit_card', 'completed', '6623', 175.00,   '321 Vine St, Hollywood, CA 90028',              'tok_cx_0031'),
(32, 'credit_card', 'completed', '1198', 225.00,   '654 Bay Rd, Oakland, CA 94612',                 'tok_cx_0032'),
(33, 'credit_card', 'completed', '5571', 299.00,   '987 Mission St, San Francisco, CA 94103',       'tok_cx_0033'),
(34, 'apple_pay',   'completed', NULL,   799.00,   '111 Wilshire Blvd, Los Angeles, CA 90010',      'tok_cx_0034'),
(35, 'credit_card', 'completed', '2234', 199.00,   '222 Figueroa St, Los Angeles, CA 90015',        'tok_cx_0035'),
(36, 'credit_card', 'completed', '9900', 499.00,   '333 Market St, San Francisco, CA 94105',        'tok_cx_0036'),
(37, 'debit_card',  'completed', '3344', 175.00,   '444 Broadway, San Diego, CA 92101',             'tok_cx_0037'),
(38, 'credit_card', 'completed', '7788', 249.00,   '12 Rose Ave, Santa Barbara, CA 93101',          'tok_cx_0038'),
(39, 'credit_card', 'completed', '5522', 225.00,   '77 Lemon Grove, San Diego, CA 92104',           'tok_cx_0039'),
(40, 'apple_pay',   'completed', NULL,   125.00,   '45 Hillside Dr, Oakland, CA 94618',             'tok_cx_0040'),
(41, 'credit_card', 'completed', '6611', 275.00,   '88 Sunset Strip, West Hollywood, CA 90069',     'tok_cx_0041'),
(42, 'credit_card', 'completed', '2299', 650.00,   '200 Golden Gate Ave, San Francisco, CA 94102',  'tok_cx_0042'),
(43, 'credit_card', 'completed', '3312', 85.00,    '123 Sunset Blvd, Los Angeles, CA 90028',        'tok_cx_0043'),
(44, 'debit_card',  'completed', '8821', 200.00,   '456 Oak St, San Francisco, CA 94102',           'tok_cx_0044'),
(45, 'credit_card', 'completed', '4490', 150.00,   '789 Palm Ave, San Diego, CA 92101',             'tok_cx_0045'),
(46, 'credit_card', 'completed', '6623', 175.00,   '321 Vine St, Hollywood, CA 90028',              'tok_cx_0046'),
(47, 'apple_pay',   'completed', NULL,   225.00,   '654 Bay Rd, Oakland, CA 94612',                 'tok_cx_0047'),
(48, 'credit_card', 'completed', '5571', 300.00,   '987 Mission St, San Francisco, CA 94103',       'tok_cx_0048'),
(49, 'credit_card', 'completed', '2234', 450.00,   '111 Wilshire Blvd, Los Angeles, CA 90010',      'tok_cx_0049'),
(50, 'apple_pay',   'completed', NULL,   799.00,   '222 Figueroa St, Los Angeles, CA 90015',        'tok_cx_0050');


-- ------------------------------------------------------------
-- VENUE_AVAILABILITY
-- ------------------------------------------------------------
INSERT INTO venue_availability (venue_id, event_id, date_time, status) VALUES
(4,  1,  '2026-07-04 14:00:00', 'booked'),
(4,  NULL,'2026-07-05 09:00:00', 'available'),
(2,  2,  '2026-08-15 12:00:00', 'booked'),
(2,  NULL,'2026-08-16 09:00:00', 'available'),
(1,  3,  '2026-09-20 19:00:00', 'booked'),
(1,  NULL,'2026-09-21 09:00:00', 'available'),
(10, 4,  '2026-06-28 18:00:00', 'booked'),
(10, NULL,'2026-06-29 09:00:00', 'available'),
(11, 5,  '2026-10-11 15:00:00', 'booked'),
(11, NULL,'2026-10-12 09:00:00', 'available'),
(12, 6,  '2025-11-02 16:00:00', 'booked'),
(7,  8,  '2025-12-31 20:00:00', 'booked'),
(7,  9,  '2026-05-10 19:30:00', 'booked'),
(7,  NULL,'2026-05-11 09:00:00', 'available'),
(2,  10, '2026-10-20 19:00:00', 'booked'),
(6,  12, '2026-09-05 09:00:00', 'booked'),
(6,  NULL,'2026-09-06 09:00:00', 'available'),
(5,  17, '2026-06-07 16:00:00', 'booked'),
(5,  NULL,'2026-06-08 09:00:00', 'available'),
(8,  18, '2026-09-13 15:00:00', 'booked'),
(8,  NULL,'2026-09-14 09:00:00', 'available'),
(5,  19, '2026-07-19 17:00:00', 'booked'),
(8,  20, '2026-10-03 14:00:00', 'booked'),
(5,  21, '2025-10-18 16:00:00', 'booked'),
(9,  26, '2026-08-22 09:00:00', 'booked'),
(9,  NULL,'2026-08-23 09:00:00', 'available'),
(3,  27, '2026-06-06 10:00:00', 'booked'),
(3,  33, '2026-09-08 08:00:00', 'booked'),
(3,  NULL,'2026-09-09 09:00:00', 'available'),
(9,  33, '2026-09-08 08:00:00', 'booked'),
(6,  NULL,'2026-10-01 09:00:00', 'maintenance'),
(1,  NULL,'2026-11-01 09:00:00', 'maintenance');


-- ------------------------------------------------------------
-- PREFERENCES
-- ------------------------------------------------------------
INSERT INTO preferences (customer_id, preference_type, value) VALUES
(1,  'event_type',       'Concerts/Festivals'),
(1,  'notification',     'email'),
(2,  'event_type',       'Conferences'),
(2,  'seat_preference',  'VIP'),
(3,  'event_type',       'Conventions'),
(3,  'notification',     'sms'),
(4,  'event_type',       'Concerts/Festivals'),
(4,  'seat_preference',  'General Admission'),
(5,  'event_type',       'Sporting Events'),
(5,  'notification',     'email'),
(6,  'event_type',       'Conferences'),
(6,  'seat_preference',  'VIP'),
(7,  'event_type',       'Sporting Events'),
(8,  'event_type',       'Concerts/Festivals'),
(8,  'seat_preference',  'VIP'),
(9,  'event_type',       'Conferences'),
(9,  'notification',     'email'),
(10, 'event_type',       'Weddings'),
(11, 'venue_type',       'Winery/Estate'),
(11, 'notification',     'email'),
(12, 'venue_type',       'Arena'),
(12, 'preferred_city',   'Los Angeles'),
(13, 'venue_type',       'Arena'),
(13, 'preferred_city',   'San Francisco'),
(14, 'venue_type',       'Fairgrounds'),
(14, 'preferred_city',   'San Diego'),
(15, 'venue_type',       'Concert Hall'),
(15, 'notification',     'email'),
(16, 'venue_type',       'Winery/Estate'),
(16, 'preferred_city',   'Napa'),
(17, 'event_type',       'Concerts/Festivals'),
(17, 'preferred_city',   'Los Angeles'),
(18, 'event_type',       'Conferences'),
(18, 'venue_type',       'Convention Center'),
(19, 'event_type',       'Sporting Events'),
(19, 'preferred_city',   'San Diego'),
(20, 'event_type',       'Conferences'),
(20, 'venue_type',       'Convention Center'),
(21, 'event_type',       'Concerts/Festivals'),
(22, 'event_type',       'Sporting Events'),
(23, 'event_type',       'Conventions'),
(23, 'notification',     'sms'),
(24, 'event_type',       'Concerts/Festivals'),
(25, 'event_type',       'Conferences'),
(25, 'seat_preference',  'General Admission');
