UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE  ticket_id = 54 AND status = 'available';

UPDATE tickets SET quantity_sold = 1, status = 'available'
WHERE  ticket_id = 54 AND status = 'sold';
------ 
BEGIN;

SELECT ctid AS before_ctid FROM tickets WHERE ticket_id = 54;

------ 68
UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE  ticket_id = 54 AND status = 'available';

SELECT ctid AS after_update FROM tickets WHERE ticket_id = 54;

-- inspect immediately after update, before anything else touches the page
-- plug in the lp from before_ctid and the new lp from the update
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

COMMIT;