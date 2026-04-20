BEGIN;
SELECT ctid AS old_ctid FROM tickets WHERE ticket_id = 54;

UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE ticket_id = 54 AND status = 'available';

SELECT ctid AS new_ctid FROM tickets WHERE ticket_id = 54;

UPDATE tickets SET quantity_sold = 1, status = 'sold'
WHERE ticket_id = 54 AND status = 'available';

UPDATE tickets SET quantity_sold = 0, status = 'available'
WHERE ticket_id = 54 AND status = 'sold';

SELECT ctid AS new_ctid FROM tickets WHERE ticket_id = 54;

COMMIT;

-- Run this separately AFTER the commit

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
         AND t_xmax::text::bigint = t_xmin::text::bigint
            THEN 'LIVE — current version (same-tx write)'
        WHEN t_ctid != ('(1,' || lp || ')')::tid
            THEN 'DEAD — superseded, newer version at ' || t_ctid::text
        ELSE 'DEAD (pruned)'
    END AS mvcc_state
FROM heap_page_items(get_raw_page('tickets'::text, 1::bigint))
WHERE lp IN (80,81,82);