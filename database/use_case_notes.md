# Use Case Notes — Event Management System

All four use cases are demonstrated through concert events so the
mechanics are easy to follow in one context. The relevant rows are
seeded in `test_data.sql`; the SQL to actually run each scenario is
below.

---

## Seat location conventions (concert venues)

| Venue | Non-GA format |
|---|---|
| The Wiltern (Concert Hall) | `Orchestra, Row A, Seat N` · `Row Pit, Seat N` |
| Hollywood Bowl (Amphitheater) | `Section 101, Row A, Seat N` · `Pit, Row 1, Seat N` |
| The Greek Theatre (Amphitheater) | `Orchestra, Row A, Seat N` · `Front Row, Seat N` · `Pit, Seat N` |

Every non-GA seat is a single row with `quantity = 1`. GA zones are
pooled rows with `quantity > 1` and `quantity_sold` tracking fills.

---

## UC1 — Last-ticket race (GIST)

**What it tests:** The `EXCLUDE USING gist(event_id WITH =, seat_location WITH =) WHERE (status = 'sold' AND seat_location <> 'GA')` constraint on `tickets` prevents two sessions from simultaneously marking the same reserved seat as sold.

**Seed anchor:** `ticket_id = 54` — Jazz Nights, `Row Pit, Seat 1`, `status = 'available'`, `quantity = 1`

**Session A (wins — commit first):**
```sql
BEGIN;
UPDATE tickets
SET    quantity_sold = 1,
       status        = 'sold'
WHERE  ticket_id = 54
AND    status    = 'available';
-- 1 row updated
COMMIT;
```

**Session B (loses — runs concurrently):**
```sql
BEGIN;
UPDATE tickets
SET    quantity_sold = 1,
       status        = 'sold'
WHERE  ticket_id = 54
AND    status    = 'available';
-- 0 rows updated: Session A already committed status = 'sold'
-- tx 52 stays 'pending'; no transaction_tickets row is inserted
ROLLBACK;
```

**Why GIST fires on a direct INSERT (alternative model):**
```sql
INSERT INTO tickets
  (event_id, type, status, seat_location, face_value_price, quantity, quantity_sold)
VALUES (2, 'VIP', 'sold', 'Row Pit, Seat 1', 350.00, 1, 1);
-- ERROR: conflicting key value violates exclusion constraint
-- "tickets_event_id_seat_location_excl"
```

---

## UC2 — Unbook & refresh (MVCC)

**What it tests:** PostgreSQL's MVCC means any transaction that opens *after* a cancellation commits will see the seat as available immediately — no cache invalidation needed, no special read mode.

**Seed anchor:** `ticket_id = 76` — Greek Theatre, `Front Row, Seat 1`, `status = 'sold'`, `quantity_sold = 1` (purchased by Marcus Thompson, `transaction_id = 53`)

**Step 1 — Cancellation (Session A):**
```sql
BEGIN;
UPDATE tickets
SET    quantity_sold = 0,
       status        = 'available'
WHERE  ticket_id = 76;

DELETE FROM transaction_tickets
WHERE  transaction_id = 53 AND ticket_id = 76;

UPDATE transactions
SET    status = 'refunded'
WHERE  transaction_id = 53;
COMMIT;
```

**Step 2 — Refreshed read (any new Session B):**
```sql
SELECT seat_location, status, quantity_sold
FROM   tickets
WHERE  ticket_id = 76;
-- Returns: 'Front Row, Seat 1' | 'available' | 0
-- Seat is now purchasable again.
```

---

## UC3 — Concurrent GA purchases (large pool, both succeed)

**What it tests:** A GA pool with large remaining capacity allows two buyers to each increment `quantity_sold` in separate concurrent transactions. PostgreSQL serialises the two row-level locks but both commits succeed because the `check_event_capacity` trigger finds enough headroom for both.

**Seed anchor:** `ticket_id = 1` — Summer Fest GA pool, `quantity = 14000`, `quantity_sold = 12500`

**Session A (Jordan Lee, tx 54):**
```sql
BEGIN;
UPDATE tickets SET quantity_sold = quantity_sold + 1
WHERE  ticket_id = 1;
COMMIT;
```

**Session B (Samantha Cruz, tx 55) — same moment:**
```sql
BEGIN;
UPDATE tickets SET quantity_sold = quantity_sold + 1
WHERE  ticket_id = 1;
COMMIT;
-- Both succeed. Pool absorbs both increments without hitting capacity.
```

**Verify:**
```sql
SELECT quantity_sold, status FROM tickets WHERE ticket_id = 1;
-- quantity_sold = 12502 (12500 seeded + 2 increments)
```

---

## UC4 — Venue multi-slot (TSRANGE + GIST)

**What it tests:** The `EXCLUDE USING gist(venue_id WITH =, booking_time_range WITH &&)` constraint on `venue_availability` blocks any INSERT whose time range overlaps an existing row for the same venue — while leaving non-overlapping slots completely open.

**Seed anchor:** `venue_id = 4` (Hollywood Bowl), four non-overlapping slots:

| Slot | booking_time_range | status |
|---|---|---|
| A | `[2026-07-04 12:00, 2026-07-05 02:00)` | booked (Summer Fest) |
| B | `[2026-07-11 09:00, 2026-07-11 23:00)` | available |
| C | `[2026-07-18 09:00, 2026-07-18 23:00)` | available |
| D | `[2026-07-25 08:00, 2026-07-27 18:00)` | maintenance |

**View all slots:**
```sql
SELECT booking_time_range, status
FROM   venue_availability
WHERE  venue_id = 4
ORDER BY booking_time_range;
```

**Book Slot B for a new event (succeeds — no overlap):**
```sql
UPDATE venue_availability
SET    status   = 'booked',
       event_id = <new_event_id>
WHERE  venue_id          = 4
AND    booking_time_range = '[2026-07-11 09:00, 2026-07-11 23:00)';
-- Slots A, C, D are untouched.
```

**Attempt an overlapping INSERT (rejected by GIST):**
```sql
INSERT INTO venue_availability
  (venue_id, event_id, booking_time_range, status)
VALUES (4, NULL, '[2026-07-04 20:00, 2026-07-05 04:00)', 'booked');
-- ERROR: conflicting key value violates exclusion constraint
-- "venue_availability_venue_id_booking_time_range_excl"
-- Reason: overlaps Slot A '[2026-07-04 12:00, 2026-07-05 02:00)'
```
