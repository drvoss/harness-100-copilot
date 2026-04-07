# 19 — Database Architect

Database design and architecture harness: a five-specialist pipeline models the schema, optimizes queries, plans migrations, designs high-availability replication, and delivers a final consistency and risk report.

## Structure

```
harnesses/19-database-architect/
├── HARNESS.md                               (this file)
├── agents/
│   ├── schema-designer.md                   Data modeling, normalization, ER design
│   ├── query-optimizer.md                   Index strategy, execution plans, slow queries
│   ├── migration-planner.md                 Schema migrations, zero-downtime, rollback
│   ├── replication-specialist.md            HA topology, read replicas, failover, pooling
│   └── data-reviewer.md                     Consistency, referential integrity, risk report
└── skills/
    ├── database-architect/SKILL.md          Orchestrator — pipeline coordination
    ├── schema-design-patterns/SKILL.md      Supporting — normalization, common patterns
    └── db-performance-checklist/SKILL.md    Supporting — index types, EXPLAIN analysis
```

## Usage

Trigger the `database-architect` skill or make a natural language request:
- "Design a database for an e-commerce platform"
- "Review our PostgreSQL schema"
- "Plan a zero-downtime migration for the users table"
- "Set up read replica routing for our MySQL cluster"
- "Database architecture for a SaaS application"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized domain description, scale requirements, tech stack
- `01_schema_design.md` — Tables, columns, types, constraints, ER relationships
- `02_query_patterns.md` — Index recommendations, query templates, execution notes
- `03_migration_plan.md` — Migration scripts outline, deployment order, rollback plan
- `04_replication_design.md` — HA topology, failover procedure, connection pooling config
- `05_review_report.md` — Final consistency, referential integrity, and risk report

Message files (agent handoffs):
- `_workspace/messages/schema-designer-to-query-optimizer.md`
- `_workspace/messages/query-optimizer-to-migration-planner.md`
- `_workspace/messages/migration-planner-to-replication-specialist.md`
- `_workspace/messages/replication-specialist-to-data-reviewer.md`

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/19-database-architect/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/19-database-architect/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/19-database-architect)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
