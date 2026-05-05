------------------------------------------------------------------ 
-- User 1 starts transaction
BEGIN;

SELECT ctid AS before_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------
-- original location of tuple version TICKET AVAILABLE
ticket_id   status          quantity_sold   seat_location
54	        "available"	    1	            "Row Pit, Seat 1"

before_commit_ctid
(1,70)
------------------------------------------------------------------ 
-- User 1 purchases ticket (uncommitted)
UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE  ticket_id = 54 AND status = 'available';

SELECT ctid AS after_update FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- new location of tuple version TICKET SOLD
ticket_id   status          quantity_sold   seat_location
54	        "sold"	        1	            "Row Pit, Seat 1"

after_update_ctid
(1,71)
------------------------------------------------------------------ 
-- after update, there are TWO versions of the tuple
lp	xmin	xmax	ctid		lp_flag		mvcc_state
70	1253	1271	"(1,71)"	1			"DEAD — superseded, newer version at (1,71)"
71	1271	1271	"(1,71)"	1			"LIVE in this tx — uncommitted or same-tx update"


COMMIT;

after_update_ctid
(1,71)