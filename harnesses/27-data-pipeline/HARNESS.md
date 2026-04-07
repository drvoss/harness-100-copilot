# 27 — Data Pipeline

Data pipeline engineering harness: an agent team designs batch/streaming architecture, implements ingestion and transformation layers, configures data quality monitoring, then produces a pipeline review covering performance, cost, and reliability.

## Structure

```
harnesses/27-data-pipeline/
├── HARNESS.md                               (this file)
├── agents/
│   ├── pipeline-architect.md                Data pipeline architecture: batch vs streaming, tech selection, SLA
│   ├── ingestion-specialist.md              Data ingestion: sources, connectors, schema registry, CDC
│   ├── transformation-engineer.md           ETL/ELT transformation: dbt models, Spark jobs, data quality rules
│   ├── quality-monitor.md                   Data quality monitoring: Great Expectations, contracts, lineage
│   └── pipeline-reviewer.md                 Pipeline review: performance, cost, reliability (TERMINAL)
└── skills/
    ├── data-pipeline/SKILL.md               Orchestrator — team coordination, workflow, error handling
    ├── etl-patterns/SKILL.md                Supporting — ELT vs ETL, dbt best practices, Spark optimization
    └── data-quality-checklist/SKILL.md      Supporting — data quality dimensions, Great Expectations patterns
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| pipeline-architect | Data pipeline architecture: batch vs streaming, tech selection, SLA | `01_pipeline_architecture.md` |
| ingestion-specialist | Data ingestion: sources, connectors, schema registry, CDC | `02_ingestion_design.md` |
| transformation-engineer | ETL/ELT transformation: dbt models, Spark jobs, data quality rules | `03_transformation_logic.md` |
| quality-monitor | Data quality monitoring: Great Expectations, contracts, lineage | `04_quality_monitoring.md` |
| pipeline-reviewer | Pipeline review: performance, cost, reliability | `05_pipeline_review.md` |

## Quick Start

```bash
cp -r harnesses/27-data-pipeline/agents/ .github/agents/
cp -r harnesses/27-data-pipeline/skills/ .github/skills/
```
Then ask Copilot: `Design a data pipeline for our event logs`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full pipeline design and review | Full Pipeline (all 5) | all |
| Ingestion and transformation only | Reduced (2 agents) | ingestion-specialist → transformation-engineer |
| Data quality only | Single | quality-monitor only |

## Usage

Trigger the `data-pipeline` skill or make a natural language request:
- "Design a data pipeline for our event logs"
- "Build ETL for Salesforce to data warehouse"
- "Streaming pipeline from Kafka to BigQuery"
- "Data quality monitoring for our dbt project"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Data sources, volume, latency requirements, destination systems
- `01_pipeline_architecture.md` — Pipeline architecture design
- `02_ingestion_design.md` — Ingestion layer design
- `03_transformation_logic.md` — Transformation models and jobs
- `04_quality_monitoring.md` — Data quality configuration
- `05_pipeline_review.md` — Final pipeline review

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/27-data-pipeline/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/27-data-pipeline/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/27-data-pipeline)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
