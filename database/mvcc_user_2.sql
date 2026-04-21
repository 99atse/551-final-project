------------------------------------------------------------------ 
SELECT ctid AS before_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- original location of tuple version TICKET AVAILABLE
before_ctid
(1,70)

------------------------------------------------------------------ 
SELECT ctid AS after_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- new location of tuple version TICKET SOLD
after_ctid
(1,70)