---
name: database-architect
description: "Use when designing a database from scratch, reviewing an existing schema, planning a migration, or architecting a high-availability database topology. Dispatches schema-designer, query-optimizer, migration-planner, and replication-specialist in sequence, then synthesizes findings into a final consistency and risk report via data-reviewer. Covers relational schema design (PostgreSQL/MySQL), indexing strategy, zero-downtime migrations, HA replication, and referential integrity review. Does NOT cover NoSQL document databases, time-series databases, data warehousing (use a dedicated OLAP harness), or application-layer ORM configuration. Also triggers on: redesign database schema, add read replicas, plan schema migration, review database architecture, optimize slow queries."
metadata:
  category: harness
  harness: 19-database-architect
  agent_type: general-purpose
---

# Database Architect — Database Design Pipeline

A five-specialist pipeline models the schema, optimizes queries, plans migrations, designs high-availability replication, and delivers a final consistency and risk report.

## Execution Mode

**File-Bus Pipeline** — Agents run sequentially; each specialist writes output and a handoff message that the next specialist reads. All artifacts land in `_workspace/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| schema-designer | `agents/schema-designer.md` | Data modeling, normalization, DDL | general-purpose |
| query-optimizer | `agents/query-optimizer.md` | Index strategy, query templates, EXPLAIN guidance | general-purpose |
| migration-planner | `agents/migration-planner.md` | Migration scripts, zero-downtime, rollback | general-purpose |
| replication-specialist | `agents/replication-specialist.md` | HA topology, failover, connection pooling | general-purpose |
| data-reviewer | `agents/data-reviewer.md` | Final review: integrity, consistency, risk report | general-purpose |

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Domain description, scale requirements, and technology stack available from user

## Workspace Layout

Write output to `_workspace/` so downstream agents can read findings without additional tool calls — the file bus is the only shared state in this harness.

```
_workspace/
├── 00_input.md              (domain description, scale requirements, tech stack)
├── 01_schema_design.md      (schema-designer output)
├── 02_query_patterns.md     (query-optimizer output)
├── 03_migration_plan.md     (migration-planner output)
├── 04_replication_design.md (replication-specialist output)
├── 05_review_report.md      (data-reviewer output — terminal)
└── messages/
    ├── schema-designer-to-query-optimizer.md
    ├── query-optimizer-to-migration-planner.md
    ├── migration-planner-to-replication-specialist.md
    └── replication-specialist-to-data-reviewer.md
```

## Phase 1: Setup (Orchestrator)

The synthesis phase resolves conflicts between specialist findings. Individual analysts may surface the same constraint issue at different severity levels; the data-reviewer applies a consistent severity framework and eliminates duplicates.

```
task(agent_type="general-purpose",
     description="Read the user's database design request. Create _workspace/ and _workspace/messages/ directories. Extract: DOMAIN (what the database supports), SCALE (row volumes, concurrent users, read/write ratio), TECH_STACK (PostgreSQL/MySQL version, cloud provider), EXISTING_SCHEMA (any existing DDL or ER description), QUERY_PATTERNS (known access patterns), HA_REQUIREMENTS (uptime SLA, RTO/RPO). Write organized input to _workspace/00_input.md with those section headers. If any field is missing, apply the most common pattern and document the assumption.")
```

## Phase 2: Sequential Pipeline

### Step 2.1 — Schema Designer
```
task(agent_type="general-purpose",
     description="You are the schema-designer agent in the database-architect harness. Read agents/schema-designer.md for your full instructions. Read _workspace/00_input.md. Design the complete relational schema: identify entities, apply normalization (1NF through BCNF), generate CREATE TABLE DDL with correct data types and constraints, choose PK strategy (serial vs UUID), apply audit columns and soft delete where appropriate. Write output to _workspace/01_schema_design.md. Write handoff to _workspace/messages/schema-designer-to-query-optimizer.md with: STATUS: COMPLETE, FINDINGS: [list of tables created, notable decisions], CROSS_DOMAIN_FOR_QUERY_OPTIMIZER: [high-cardinality columns, join-heavy relationships, expected WHERE/ORDER BY columns], CROSS_DOMAIN_FOR_MIGRATION_PLANNER: [large tables, columns needing NOT NULL backfill].")
```

### Step 2.2 — Query Optimizer (reads handoff from 2.1)
```
task(agent_type="general-purpose",
     description="You are the query-optimizer agent in the database-architect harness. Read agents/query-optimizer.md for your full instructions. Read _workspace/00_input.md and _workspace/01_schema_design.md. Read _workspace/messages/schema-designer-to-query-optimizer.md for the CROSS_DOMAIN_FOR_QUERY_OPTIMIZER section. Design the complete index strategy: classify index types (B-tree/Hash/GiST/GIN/BRIN), write CREATE INDEX DDL with CONCURRENTLY noted, produce query templates for primary access patterns, flag slow query anti-patterns. Write output to _workspace/02_query_patterns.md. Write handoff to _workspace/messages/query-optimizer-to-migration-planner.md with: STATUS: COMPLETE, FINDINGS: [indexes recommended, query templates defined, performance concerns], CROSS_DOMAIN_FOR_MIGRATION_PLANNER: [indexes requiring CONCURRENTLY, large tables with slow index creation, backfill column notes], CROSS_DOMAIN_FOR_DATA_REVIEWER: [missing FK indexes, low-selectivity columns].")
```

### Step 2.3 — Migration Planner (reads handoff from 2.2)
```
task(agent_type="general-purpose",
     description="You are the migration-planner agent in the database-architect harness. Read agents/migration-planner.md for your full instructions. Read _workspace/00_input.md, _workspace/01_schema_design.md, and _workspace/02_query_patterns.md. Read _workspace/messages/query-optimizer-to-migration-planner.md for the CROSS_DOMAIN_FOR_MIGRATION_PLANNER section. Classify all schema changes as additive/destructive/structural. Produce numbered migration script outlines (Flyway convention), apply expand-contract for zero-downtime changes, design batched backfill for large tables, write rollback procedures. Write output to _workspace/03_migration_plan.md. Write handoff to _workspace/messages/migration-planner-to-replication-specialist.md with: STATUS: COMPLETE, FINDINGS: [migration count, highest-risk migration, irreversible steps], CROSS_DOMAIN_FOR_REPLICATION_SPECIALIST: [DDL affecting replication, high-WAL operations, connection pool sizing during migration], CROSS_DOMAIN_FOR_DATA_REVIEWER: [columns added without NOT NULL, tables in temporary inconsistent state].")
```

### Step 2.4 — Replication Specialist (reads handoff from 2.3)
```
task(agent_type="general-purpose",
     description="You are the replication-specialist agent in the database-architect harness. Read agents/replication-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_schema_design.md, _workspace/02_query_patterns.md, and _workspace/03_migration_plan.md. Read _workspace/messages/migration-planner-to-replication-specialist.md for the CROSS_DOMAIN_FOR_REPLICATION_SPECIALIST section. Design the HA topology (primary/standby/replica count), choose replication mode (sync/async with justification), specify failover mechanism (Patroni or pg_auto_failover) with fencing strategy, configure PgBouncer pool sizes from first principles, define read routing rules per query class, document WAL archiving and PITR. Write output to _workspace/04_replication_design.md. Write handoff to _workspace/messages/replication-specialist-to-data-reviewer.md with: STATUS: COMPLETE, FINDINGS: [topology, failover mechanism, pool config summary], CROSS_DOMAIN_FOR_DATA_REVIEWER: [async replication consistency windows, tables with eventual-consistency risk, connection pool constraint surfacing risks, remaining single points of failure].")
```

## Phase 3: Final Review

### Step 3.1 — Data Reviewer (terminal agent)
```
task(agent_type="general-purpose",
     description="You are the data-reviewer agent in the database-architect harness. Read agents/data-reviewer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_schema_design.md, _workspace/02_query_patterns.md, _workspace/03_migration_plan.md, _workspace/04_replication_design.md, and all 4 message files in _workspace/messages/. Perform the final review: audit every FK for an index on the referencing column, trace all ON DELETE CASCADE chains, check NOT NULL coverage and UNIQUE constraints, verify FK/PK type matches, flag replication consistency risks from the replication-specialist message. De-duplicate findings across all specialist outputs. Assign severity (Critical/Recommended/Informational). Write final prioritized report to _workspace/05_review_report.md with Executive Summary (overall risk rating, verdict), full findings, referential integrity table, constraint coverage table, cascade risk map, and recommended remediation order.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full database design request | Full Pipeline | All 5 agents |
| "Schema design only" | Schema Mode | schema-designer → data-reviewer |
| "Review existing schema" | Review Mode | data-reviewer (reads schema from input) |
| "Migration plan only" | Migration Mode | migration-planner → data-reviewer |
| "Index optimization" | Performance Mode | query-optimizer → data-reviewer |
| "HA / replication setup" | HA Mode | replication-specialist → data-reviewer |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; data-reviewer notes "unavailable" for that domain |
| Ambiguous input (domain unclear) | Apply most common e-commerce/SaaS pattern; document assumptions in `00_input.md` |
| Conflicting findings (e.g., schema vs performance trade-off) | data-reviewer resolves with business-impact priority; escalate only if truly unresolvable |
| No existing schema provided | schema-designer generates from scratch based on domain description |
| Technology stack not specified | Default to PostgreSQL 15; document assumption |
| `_workspace/` already contains files | Confirm with user or append `-2` suffix; document in final report |

## Test Scenarios
1. **Normal case:** Full domain description with scale requirements and tech stack → all 5 agents produce output → final report with prioritized findings
2. **Review only:** Existing DDL provided, no migration needed → schema-designer + data-reviewer
3. **Error case:** query-optimizer output missing → data-reviewer notes "index strategy unavailable; FK index review based on schema only"
