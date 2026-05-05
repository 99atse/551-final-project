------------------------------------------------------------------ 
SELECT ticket_id, status, quantity_sold, seat_location
FROM   tickets
WHERE  ticket_id = 54;

SELECT ctid AS before_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- Snapshot before user 1 commits change
ticket_id   status          quantity_sold   seat_location
54	        "available"	    1	            "Row Pit, Seat 1"

before_ctid
(1,70)

------------------------------------------------------------------ 
SELECT ticket_id, status, quantity_sold, seat_location
FROM   tickets
WHERE  ticket_id = 54;

SELECT ctid AS after_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- Snapshot after user 1 commits change
ticket_id   status          quantity_sold   seat_location
54	        "sold"	        1	            "Row Pit, Seat 1"

after_ctid
(1,71)