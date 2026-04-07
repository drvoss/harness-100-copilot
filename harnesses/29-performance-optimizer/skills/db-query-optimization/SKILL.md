---
name: db-query-optimization
description: "Use when optimizing database query performance -- provides EXPLAIN plan interpretation patterns, index tuning strategies, N+1 query detection and fixes, and query rewrite patterns for PostgreSQL, MySQL, and common ORMs. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: skill
  harness: 29-performance-optimizer
  agent_type: general-purpose
---

# DB Query Optimization -- EXPLAIN Plan, Index Tuning, N+1 Detection

Reference skill for database query optimization used by the backend-optimizer agent.

## EXPLAIN ANALYZE Interpretation (PostgreSQL)

Key cost indicators:
- **Seq Scan**: full table scan; check if index should be added
- **Index Scan**: good for selective queries (< 5% of rows)
- **Index Only Scan**: best; reads only from index
- **Hash Join**: for large join sets; use when tables lack sorted indexes
- **Nested Loop**: good for small result sets with indexed foreign keys
- **Sort**: check if sort can be eliminated with index (ORDER BY matches index)

Red flags in EXPLAIN output:
- `rows=X (estimated) vs actual rows=Y` where Y >> X: stale statistics; run `ANALYZE`
- `cost=0..999999`: extremely high cost; full table scan on large table
- `Filter: (condition after Seq Scan)`: condition not using index
- `Buffers: hit=0 read=10000`: all reads from disk, no cache (buffer pool cold)

## Index Tuning

### When to Add an Index
- Column appears in WHERE clause in high-frequency queries
- Column used in JOIN ON condition
- Column used in ORDER BY (avoids sort)
- Column used in GROUP BY (can enable index-only scan)

### Composite Index Column Order
Rule: most selective column first, then columns in WHERE clause order
```sql
-- Example: WHERE status = 'active' AND created_at > '2024-01-01'
-- Index: (status, created_at) -- status is more selective
CREATE INDEX idx_orders_status_created ON orders (status, created_at);
```

### Partial Index (PostgreSQL)
```sql
CREATE INDEX idx_orders_pending ON orders (created_at)
WHERE status = 'pending';
-- Only indexes pending orders, much smaller and faster
```

### Index-Only Scan (Covering Index)
```sql
CREATE INDEX idx_orders_covering ON orders (customer_id, status, amount);
-- Query: SELECT status, amount FROM orders WHERE customer_id = X
-- Reads only from index, never touches table
```

## N+1 Query Detection

Symptoms:
- Query log shows same query repeated with different IDs: `SELECT * FROM users WHERE id = 1`, `SELECT * FROM users WHERE id = 2`...
- ORM debug shows query count proportional to result set
- APM trace shows many short sequential DB spans

Detection commands:
```python
# Django
from django.db import connection
print(len(connection.queries))
```

```ruby
# Rails
Rails.logger.level = :debug  # logs all queries
```

```js
// Node.js (Prisma)
const prisma = new PrismaClient({ log: ['query'] })
```

## N+1 Fixes by ORM

**Rails:**
```ruby
# N+1: Order.all.each { |o| o.customer.name }
# Fix:
Order.includes(:customer).all
```

**Django:**
```python
# N+1: [o.customer.name for o in Order.objects.all()]
# Fix:
Order.objects.select_related('customer').all()
```

**Prisma (Node.js):**
```js
// N+1: orders.map(o => prisma.customer.findUnique({ where: { id: o.customerId } }))
// Fix:
prisma.order.findMany({ include: { customer: true } })
```

**GraphQL (DataLoader):**
```js
const loader = new DataLoader(ids => db.users.findMany({ where: { id: { in: ids } } }))
// resolver:
(order) => loader.load(order.customerId)
```

## Query Rewrite Patterns

### Replace correlated subquery with JOIN
```sql
-- Slow (correlated subquery, runs once per outer row):
SELECT o.id, (SELECT c.name FROM customers c WHERE c.id = o.customer_id)
FROM orders o

-- Fast (JOIN, executed once):
SELECT o.id, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
```

### Replace NOT IN with NOT EXISTS (NULL-safe)
```sql
-- Slow and NULL-unsafe:
SELECT * FROM orders
WHERE customer_id NOT IN (SELECT id FROM blocked_customers)

-- Fast and NULL-safe:
SELECT * FROM orders o
WHERE NOT EXISTS (
  SELECT 1 FROM blocked_customers bc WHERE bc.id = o.customer_id
)
```

### Pagination with keyset (instead of OFFSET)
```sql
-- Slow (scans all preceding rows):
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 10000

-- Fast (uses index directly):
SELECT * FROM orders
WHERE created_at < :last_seen_at
ORDER BY created_at DESC
LIMIT 20
```
