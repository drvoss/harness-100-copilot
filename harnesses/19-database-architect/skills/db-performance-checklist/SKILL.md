---
name: db-performance-checklist
description: "Use when analyzing database query performance, selecting index types, or interpreting EXPLAIN ANALYZE output — provides a structured checklist for index selection, query optimization, and execution plan reading. Supports the query-optimizer agent in the database-architect harness. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting
  harness: 19-database-architect
  agent_type: general-purpose
---

# DB Performance Checklist — Index Types, Query Optimization & EXPLAIN Guide

Supporting skill for the `query-optimizer` agent. Provides a structured checklist and reference for index type selection, query optimization decisions, and EXPLAIN ANALYZE output interpretation.

## Index Type Selection Checklist

### Step 1: Identify the Query Pattern
| Query Pattern | Candidate Index Type |
|--------------|---------------------|
| `WHERE col = $1` (equality) | B-tree or Hash |
| `WHERE col > $1` or `col BETWEEN $a AND $b` | B-tree |
| `ORDER BY col` | B-tree |
| `LIKE 'prefix%'` | B-tree |
| `LIKE '%substring%'` or `ILIKE` | GIN with `pg_trgm` |
| `WHERE jsonb_col @> '{"key": "val"}'` | GIN |
| `WHERE array_col @> ARRAY[$1]` | GIN |
| `WHERE tsvector_col @@ to_tsquery($1)` | GIN |
| `WHERE geometry_col && $bbox` | GiST (PostGIS) |
| `WHERE range_col @> $value` | GiST |
| `WHERE col = $1` on small table, equality only | Hash (smaller than B-tree) |
| Append-only time-series `WHERE created_at > $1` | BRIN |

### Step 2: Check Selectivity
- **High selectivity** (> 95% rows eliminated): B-tree index is effective → add it
- **Medium selectivity** (50–95% rows eliminated): composite index may help; profile first
- **Low selectivity** (< 50% rows eliminated): index often slower than seq scan; skip or use partial index

Estimate selectivity: `SELECT COUNT(DISTINCT col)::FLOAT / COUNT(*) FROM table;`
- Result > 0.95 → high selectivity
- Result 0.1–0.95 → medium
- Result < 0.1 → low (e.g., boolean, status with few values)

### Step 3: Decide Composite vs Single-Column Index
- **Single column**: use when the column alone is selective enough
- **Composite**: use when queries consistently filter on multiple columns together
  - Column order rule: `(equality_cols..., range_col, sort_col)`
  - The index supports any left-prefix of the column list: `(a, b, c)` supports `(a)`, `(a, b)`, `(a, b, c)` — not `(b)` alone
- **Covering index**: add `INCLUDE (col)` for columns in SELECT but not WHERE to enable index-only scans

### Step 4: Evaluate Write Cost
For every index added, consider:
- INSERT: must maintain all indexes → O(log n) per index per row
- UPDATE on indexed column: delete + insert in index
- DELETE: must remove from all indexes
- Rule of thumb: > 5 indexes on a single table with high write rate → profile carefully

### Step 5: Partial Index Check
Ask: "Does this query always include a low-cardinality filter?"
```sql
-- If queries are always WHERE status = 'active', use a partial index:
CREATE INDEX idx_orders_created_active ON orders (created_at) WHERE status = 'active';
-- Smaller index, faster lookup, less write overhead
```

---

## Query Optimization Checklist

### Before Writing Index DDL

- [ ] **Confirm query frequency**: Is this a hot path (> 100/s) or a cold path (< 1/min)?
- [ ] **Check existing indexes**: `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'table';`
- [ ] **Check table size**: `SELECT pg_size_pretty(pg_total_relation_size('table'));`
- [ ] **Check row count estimate accuracy**: Compare `reltuples` in `pg_class` vs `SELECT COUNT(*)`; if off by > 20%, run `ANALYZE table;`
- [ ] **Identify seq scans on large tables**: `SELECT * FROM pg_stat_user_tables WHERE seq_scan > 100 AND n_live_tup > 10000 ORDER BY seq_scan DESC;`

### Common Query Rewrites

**Avoid function calls on indexed columns:**
```sql
-- ✗ Function prevents index use
WHERE LOWER(email) = $1
WHERE DATE(created_at) = $1
WHERE EXTRACT(YEAR FROM created_at) = 2024

-- ✓ Rewrites that allow index use
WHERE email = LOWER($1)  -- or use citext type
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'
```

**Replace OFFSET with keyset pagination:**
```sql
-- ✗ OFFSET scans all preceding rows
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 10000;

-- ✓ Keyset pagination: O(log n) with index
SELECT * FROM orders WHERE id > $last_seen_id ORDER BY id LIMIT 20;
```

**Replace correlated subqueries with JOINs:**
```sql
-- ✗ Runs subquery for every row in orders
SELECT o.*, (SELECT name FROM users WHERE id = o.user_id) AS user_name FROM orders o;

-- ✓ Single join pass
SELECT o.*, u.name AS user_name FROM orders o JOIN users u ON u.id = o.user_id;
```

**Use EXISTS instead of COUNT for existence checks:**
```sql
-- ✗ Counts all matching rows
WHERE (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) > 0

-- ✓ Stops at first match
WHERE EXISTS (SELECT 1 FROM order_items WHERE order_id = o.id)
```

**Full-text search with pg_trgm (trigram) for LIKE '%pattern%':**
```sql
-- Requires: CREATE EXTENSION pg_trgm;
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
-- Now this uses the index:
WHERE name ILIKE '%widget%'
```

---

## EXPLAIN ANALYZE Reading Guide

### How to Run
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;
-- ANALYZE: actually executes the query and shows real timings
-- BUFFERS: shows cache hits/misses
-- FORMAT TEXT: human-readable (use JSON for programmatic parsing)
```

### Node Types Glossary
| Node | Description | When Concerning |
|------|-------------|----------------|
| `Seq Scan` | Full table scan | Table > 10k rows + selective query |
| `Index Scan` | Index lookup + heap fetch per row | `rows=` should be << table size |
| `Index Only Scan` | Index lookup, no heap fetch | ✅ Ideal (covering index working) |
| `Bitmap Index Scan` | Build bitmap of matching blocks | Normal for medium selectivity |
| `Bitmap Heap Scan` | Fetch only blocks in bitmap | Pairs with Bitmap Index Scan |
| `Hash Join` | Build hash table from inner, probe with outer | Watch `Batches > 1` → memory spill |
| `Merge Join` | Join presorted inputs | Requires sorted inputs; usually fast |
| `Nested Loop` | For each outer row, scan inner | Fast for small outer; bad for large |
| `Sort` | In-memory or disk sort | `Sort Method: external merge` → add index or `work_mem` |
| `Gather` | Collect rows from parallel workers | Normal for parallel queries |
| `Gather Merge` | Merge sorted output from workers | Normal for parallel sort/agg |
| `Materialize` | Cache inner relation for repeated access | Expected for repeated subqueries |
| `Aggregate` | Group-by or aggregate computation | Watch for large intermediate sets |

### Key Metrics to Inspect
```
Seq Scan on orders  (cost=0.00..18543.00 rows=1000000 width=64)
                     (actual time=0.056..215.234 rows=1000000 loops=1)
  Buffers: shared hit=2138 read=5923
```

| Field | What It Means | Red Flag |
|-------|--------------|----------|
| `cost=startup..total` | Planner estimate (not wall time) | High startup cost on nested inner |
| `rows=N` | Planner estimate of output rows | Differs from `actual rows` by > 10× |
| `actual time=start..end` | Real elapsed time (ms) per loop | End time > 100ms on hot path |
| `loops=N` | Times this node executed | High loops on Nested Loop inner → missing index |
| `shared hit=N` | Blocks read from shared_buffers (cache) | `read >> hit` → cold cache or undersized |
| `shared read=N` | Blocks fetched from disk | High → add `shared_buffers` or cache warming |
| `Sort Method: external merge` | Sort spilled to disk | Add `work_mem` or index for ORDER BY |
| `Batches: N` | Hash join spilled to disk | Add `work_mem`; N > 1 is a problem |

### Diagnosis Workflow
```
1. Find the slowest node: look for largest "actual time" difference between child and parent
2. Check rows estimate accuracy: actual rows vs rows= — ratio > 10x → stale stats (ANALYZE)
3. Check for Seq Scans on large tables: add appropriate index
4. Check Buffer hit ratio: shared hit / (shared hit + shared read) < 90% → cache pressure
5. Check Sort Method: "external merge" → add work_mem = '64MB' (session-level test first)
6. Check Hash Join Batches: > 1 → increase work_mem
7. Check Nested Loop with high loops × time → inner side needs index
```

### EXPLAIN Output Example (Annotated)
```
Hash Join  (cost=4850.00..9500.00 rows=50000 width=72)
           (actual time=42.3..310.5 rows=48921 loops=1)     ← close estimate, good
  Hash Cond: (orders.user_id = users.id)
  Buffers: shared hit=1240 read=2180                        ← read > hit; cache miss
  ->  Seq Scan on orders                                     ← 🔴 seq scan on large table
        (actual time=0.1..180.2 rows=1000000 loops=1)
        Buffers: shared hit=800 read=2000
  ->  Hash  (cost=2500.00..2500.00 rows=100000 width=16)
        Buckets: 131072  Batches: 1                          ← Batches=1, good
        ->  Index Scan using users_pkey on users             ← ✅ index scan
              (actual time=0.05..25.3 rows=100000 loops=1)

-- Fix: add index on orders.user_id
-- CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);
```

---

## Performance Tuning Parameters Reference

| Parameter | Default | Recommendation | Effect |
|-----------|---------|---------------|--------|
| `shared_buffers` | 128MB | 25% of RAM | PostgreSQL buffer cache size |
| `effective_cache_size` | 4GB | 75% of RAM | Planner's estimate of OS cache |
| `work_mem` | 4MB | 16–64MB | Per-sort / per-hash operation memory |
| `maintenance_work_mem` | 64MB | 256MB–1GB | VACUUM, CREATE INDEX memory |
| `random_page_cost` | 4.0 | 1.1 (SSD) | Planner cost for non-sequential I/O |
| `effective_io_concurrency` | 1 | 200 (SSD) | Parallel I/O for bitmap heap scans |
| `max_parallel_workers_per_gather` | 2 | 4 (8-core) | Parallel query workers |
| `enable_seqscan` | on | off (testing) | Force planner to prefer index scans |

> **Note:** `enable_seqscan = off` is for testing only — never disable in production.

---

## FK Index Coverage Check (SQL)

Run this query against your PostgreSQL database to find FK columns missing an index:
```sql
SELECT
    c.conname AS constraint_name,
    t.relname AS table_name,
    a.attname AS column_name,
    ft.relname AS referenced_table
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
JOIN pg_class ft ON ft.oid = c.confrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = t.oid
        AND a.attnum = ANY(i.indkey)
  )
ORDER BY t.relname, a.attname;
```
Every row returned is a missing FK index — a must-fix for the query-optimizer agent.
