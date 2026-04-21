------------------------------------------------------------------ 
BEGIN;

SELECT ctid AS before_ctid FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------
-- original location of tuple version TICKET AVAILABLE
before_commit_ctid
(1,70)
------------------------------------------------------------------ 
UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE  ticket_id = 54 AND status = 'available';

SELECT ctid AS after_update FROM tickets WHERE ticket_id = 54;

------------------------------------------------------------------ 
-- new location of tuple version TICKET SOLD
after_update_ctid
(1,71)
------------------------------------------------------------------ 
SELECT
    lp,
    t_xmin::text::bigint  AS xmin,
    t_xmax::text::bigint  AS xmax,
    t_ctid                AS ctid,
    lp_flags,
    CASE
        WHEN t_ctid = ('(1,' || lp || ')')::tid 
         AND t_xmax::text::bigint = 0
            THEN 'LIVE — current version'
        WHEN t_ctid = ('(1,' || lp || ')')::tid 
         AND t_xmax::text::bigint != 0
            THEN 'LIVE in this tx — uncommitted or same-tx update'
        WHEN t_ctid != ('(1,' || lp || ')')::tid
            THEN 'DEAD — superseded, newer version at ' || t_ctid::text
        ELSE 'DEAD (pruned)'
    END AS mvcc_state
FROM heap_page_items(get_raw_page('tickets'::text, 1::bigint))
WHERE lp IN (69,70);

------------------------------------------------------------------ 
lp	xmin	xmax	ctid		lp_flag		mvcc_state
70	1253	1271	"(1,71)"	1			"DEAD — superseded, newer version at (1,71)"
71	1271	1271	"(1,71)"	1			"LIVE in this tx — uncommitted or same-tx update"


COMMIT;