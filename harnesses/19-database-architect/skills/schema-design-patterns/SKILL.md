---
name: schema-design-patterns
description: "Use when you need reference material on database normalization forms, common relational patterns (junction tables, audit columns, soft delete, hierarchies), or data type selection guidance. Supports the schema-designer agent in the database-architect harness."
metadata:
  category: supporting
  harness: 19-database-architect
  agent_type: general-purpose
---

# Schema Design Patterns — Normalization & Common Patterns Reference

Supporting skill for the `schema-designer` agent. Provides embedded reference material on normal forms, frequently used table patterns, and data type selection that the schema-designer incorporates when producing `_workspace/01_schema_design.md`.

## Normal Forms Quick Reference

### 1NF — First Normal Form
**Rule:** Every column is atomic; every row is unique.

✗ Violation:
```sql
-- Multiple phone numbers in one column
CREATE TABLE contacts (id INT, name TEXT, phones TEXT); -- phones = '555-1234,555-5678'
```
✓ Fix:
```sql
CREATE TABLE contacts (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE contact_phones (
    contact_id BIGINT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    phone      TEXT NOT NULL,
    PRIMARY KEY (contact_id, phone)
);
```

### 2NF — Second Normal Form
**Rule:** 1NF + every non-key attribute depends on the whole primary key (no partial dependencies).
Applies only to tables with composite keys.

✗ Violation:
```sql
CREATE TABLE order_items (
    order_id    BIGINT,
    product_id  BIGINT,
    product_name TEXT,   -- depends only on product_id, not on (order_id, product_id)
    quantity    INT,
    PRIMARY KEY (order_id, product_id)
);
```
✓ Fix: Move `product_name` to a `products` table; reference via FK.

### 3NF — Third Normal Form
**Rule:** 2NF + no transitive dependencies (non-key attributes depend only on the key, not on other non-key attributes).

✗ Violation:
```sql
CREATE TABLE employees (
    id              BIGSERIAL PRIMARY KEY,
    department_id   BIGINT,
    department_name TEXT  -- transitively depends on department_id
);
```
✓ Fix: Create `departments(id, name)`; reference via `department_id`.

### BCNF — Boyce-Codd Normal Form
**Rule:** For every functional dependency X → Y, X must be a superkey.
More restrictive than 3NF; catches anomalies when multiple overlapping candidate keys exist.

✗ Violation (classic example):
```sql
-- A course can be taught by one teacher; each teacher teaches one subject
-- teacher_id → subject, but teacher_id is not a superkey here
CREATE TABLE course_assignments (
    student_id  BIGINT,
    subject     TEXT,
    teacher_id  BIGINT,
    PRIMARY KEY (student_id, subject)
);
```
✓ Fix: Split into `teacher_subjects(teacher_id PK, subject)` + `student_enrollments(student_id, teacher_id)`.

### When to Denormalize (Deliberately)
| Reason | Pattern | Example |
|--------|---------|---------|
| Avoid expensive JOIN on hot read path | Embed read-only snapshot | Store `product_name` in `order_items` at order time |
| Aggregate caching | Materialized counter | `posts.comment_count` maintained by trigger |
| Full-text search column | Concatenated tsvector | `search_vector` column updated via trigger |

Always document deliberate denormalization with the reason in the schema design file.

## Common Table Patterns

### Junction Table (Many-to-Many)
```sql
CREATE TABLE user_roles (
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id    BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by BIGINT REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);
-- No surrogate PK needed; composite PK enforces uniqueness
-- Always index both columns (composite PK covers user_id lookup; add separate idx for role_id)
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
```

### Audit Columns
```sql
-- Add to every entity table
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
created_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,
updated_by  BIGINT REFERENCES users(id) ON DELETE SET NULL
```
Keep `updated_at` current with a trigger:
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Soft Delete
```sql
-- deleted_at IS NULL  → active record
-- deleted_at IS NOT NULL → deleted record (timestamp of deletion)
deleted_at TIMESTAMPTZ

-- Always filter in queries:
SELECT * FROM users WHERE deleted_at IS NULL;

-- Partial index for performance on active records:
CREATE INDEX idx_users_email_active ON users (email) WHERE deleted_at IS NULL;

-- Unique constraint on active records only:
CREATE UNIQUE INDEX uq_users_email_active ON users (email) WHERE deleted_at IS NULL;
```

### Self-Referential Hierarchy
```sql
CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    parent_id   BIGINT REFERENCES categories(id) ON DELETE RESTRICT,
    depth       SMALLINT NOT NULL DEFAULT 0,
    path        TEXT,  -- optional materialized path: '1/5/12'
    UNIQUE (slug)
);
CREATE INDEX idx_categories_parent_id ON categories (parent_id);
```
For deep tree queries, consider the `ltree` extension or a closure table.

### Closure Table (for Deep Hierarchies)
```sql
CREATE TABLE category_ancestors (
    ancestor_id   BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    descendant_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    depth         INT NOT NULL,  -- 0 = self, 1 = direct parent, n = n levels up
    PRIMARY KEY (ancestor_id, descendant_id)
);
-- Query all ancestors of a category:
SELECT c.* FROM categories c
JOIN category_ancestors ca ON ca.ancestor_id = c.id
WHERE ca.descendant_id = $1 AND ca.depth > 0
ORDER BY ca.depth;
```

### Status State Machine
```sql
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
-- Or use TEXT + CHECK for easier migration:
status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'))
-- ENUM types require ALTER TYPE for new values; TEXT + CHECK is easier to migrate
```

### Polymorphic Association (use sparingly)
Prefer explicit per-type FK columns over generic `entity_type + entity_id` unless the set of types is truly open-ended.

```sql
-- Avoid when you can:
CREATE TABLE comments (
    id          BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,  -- 'post' | 'product' | 'review'
    entity_id   BIGINT NOT NULL
    -- No FK constraint possible → referential integrity broken
);

-- Prefer explicit FKs when types are enumerable:
CREATE TABLE comments (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT REFERENCES posts(id),
    product_id BIGINT REFERENCES products(id),
    review_id  BIGINT REFERENCES reviews(id),
    CHECK (
        (post_id IS NOT NULL)::INT +
        (product_id IS NOT NULL)::INT +
        (review_id IS NOT NULL)::INT = 1
    )
);
```

## Data Type Quick Reference

| Domain Concept | PostgreSQL Type | Notes |
|---------------|----------------|-------|
| Surrogate PK (< 2B rows) | `SERIAL` / `INTEGER` | 4 bytes |
| Surrogate PK (large table) | `BIGSERIAL` / `BIGINT` | 8 bytes |
| Distributed PK | `UUID` (gen_random_uuid()) | Use UUIDv7 for sequential inserts |
| Short bounded string | `VARCHAR(n)` | n = max meaningful length |
| Unbounded text | `TEXT` | No length limit |
| Money / financials | `NUMERIC(19, 4)` | Never FLOAT |
| Fractional metric | `NUMERIC(p, s)` or `DOUBLE PRECISION` | DOUBLE for non-financial |
| User-facing timestamp | `TIMESTAMPTZ` | Stores with UTC offset |
| Date only | `DATE` | No time component |
| Duration | `INTERVAL` | e.g., `INTERVAL '30 days'` |
| Boolean | `BOOLEAN` | true / false / NULL |
| IP address | `INET` | Supports subnet queries |
| MAC address | `MACADDR` | — |
| JSON with indexing | `JSONB` | Binary, indexable |
| JSON read-only | `JSON` | Text, no index |
| Arrays | `TEXT[]`, `INT[]` | Avoid for relational data |
| Full-text vector | `TSVECTOR` | For GIN full-text indexes |
| Geospatial (PostGIS) | `GEOMETRY`, `GEOGRAPHY` | Requires PostGIS extension |
| Currency code | `CHAR(3)` | ISO 4217 |
| Country code | `CHAR(2)` | ISO 3166-1 alpha-2 |
