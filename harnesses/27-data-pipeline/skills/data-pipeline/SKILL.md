---
name: data-pipeline
description: "Use when designing or building a data pipeline — dispatches pipeline-architect, ingestion-specialist, transformation-engineer, quality-monitor, and pipeline-reviewer in sequence to deliver a complete, production-ready data pipeline design. Covers batch and streaming architectures, ETL/ELT transformation with dbt and Spark, Great Expectations quality monitoring, and cost/SLA review. Does NOT cover data warehouse modeling (use a dedicated data modeling harness), real-time ML inference pipelines, or BI dashboard creation. Also triggers on: build data pipeline, design ETL, set up CDC pipeline, configure dbt project, implement data quality monitoring, streaming pipeline design."
metadata:
  category: harness
  harness: 27-data-pipeline
  agent_type: general-purpose
---

# Data Pipeline — End-to-End Pipeline Engineering Pipeline

A 5-agent team designs data pipeline architecture, implements ingestion and transformation layers, configures quality monitoring, and produces a reviewed, production-ready pipeline blueprint.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| pipeline-architect | `agents/pipeline-architect.md` | Architecture pattern, tech stack, SLA tiers | general-purpose |
| ingestion-specialist | `agents/ingestion-specialist.md` | Connectors, schema registry, CDC, watermarking | general-purpose |
| transformation-engineer | `agents/transformation-engineer.md` | dbt models, Spark jobs, incremental processing | general-purpose |
| quality-monitor | `agents/quality-monitor.md` | Great Expectations, data contracts, lineage, alerts | general-purpose |
| pipeline-reviewer | `agents/pipeline-reviewer.md` | SLA validation, cost analysis, reliability verdict | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md              (data sources, volume, latency requirements, destination systems)
├── 01_pipeline_architecture.md (pipeline-architect output)
├── 02_ingestion_design.md   (ingestion-specialist output)
├── 03_transformation_logic.md (transformation-engineer output)
├── 04_quality_monitoring.md (quality-monitor output)
├── 05_pipeline_review.md    (pipeline-reviewer output — TERMINAL)
└── messages/
    ├── pipeline-architect-to-ingestion-specialist.md
    ├── ingestion-specialist-to-transformation-engineer.md
    ├── transformation-engineer-to-quality-monitor.md
    └── quality-monitor-to-pipeline-reviewer.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All agent files present in `agents/`
- [ ] Source system access and schema information available

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's data pipeline request. Create _workspace/ and _workspace/messages/ directories. Extract: data_sources (list with type: OLTP/API/files/streaming), daily_volume_gb, latency_requirements (real-time/near-real-time/hourly/daily), destination_systems, compliance_requirements. Write organized input to _workspace/00_input.md with sections: DATA_SOURCES, VOLUME, LATENCY_REQUIREMENTS, DESTINATION, COMPLIANCE, ADDITIONAL_CONTEXT.")
```

## Phase 2: Design & Implementation

### Step 2.1 — Pipeline Architect
```
task(agent_type="general-purpose",
     description="You are the pipeline-architect agent in the data-pipeline harness. Read agents/pipeline-architect.md for your full instructions. Read _workspace/00_input.md. Design the complete pipeline architecture: batch vs streaming decision, technology stack selection (message broker, processing engine, orchestration, storage), SLA tier definitions (Bronze/Silver/Gold), data flow diagram, and partitioning strategy. Write full architecture to _workspace/01_pipeline_architecture.md. Write handoff to _workspace/messages/pipeline-architect-to-ingestion-specialist.md with STATUS: COMPLETE, FINDINGS, INGESTION_REQUIREMENTS, PROCESSING_REQUIREMENTS.")
```

### Step 2.2 — Ingestion Specialist (reads from 2.1)
```
task(agent_type="general-purpose",
     description="You are the ingestion-specialist agent in the data-pipeline harness. Read agents/ingestion-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_architecture.md, and _workspace/messages/pipeline-architect-to-ingestion-specialist.md. Design the complete ingestion layer: Kafka Connect or direct connectors for all sources, schema registry configuration with Avro/Protobuf schemas, Debezium CDC setup for OLTP sources, watermarking strategy for event-time processing, exactly-once semantics configuration, and DLQ setup. Write to _workspace/02_ingestion_design.md. Write handoff to _workspace/messages/ingestion-specialist-to-transformation-engineer.md with STATUS: COMPLETE, FINDINGS, TOPIC_SCHEMAS, CDC_EVENTS, LATE_DATA_POLICY, DATA_QUALITY_NOTES.")
```

### Step 2.3 — Transformation Engineer (reads from 2.2)
```
task(agent_type="general-purpose",
     description="You are the transformation-engineer agent in the data-pipeline harness. Read agents/transformation-engineer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_architecture.md, _workspace/02_ingestion_design.md, and _workspace/messages/ingestion-specialist-to-transformation-engineer.md. Implement transformation logic: dbt project structure (staging/intermediate/mart), staging models for each source, intermediate models for business logic, mart models for aggregations, dbt tests (not_null, unique, relationships, accepted_values), incremental model configuration for fact tables, and Spark jobs if needed. Write to _workspace/03_transformation_logic.md. Write handoff to _workspace/messages/transformation-engineer-to-quality-monitor.md with STATUS: COMPLETE, FINDINGS, DATA_QUALITY_REQUIREMENTS, LINEAGE_NOTES, KNOWN_DATA_ISSUES.")
```

### Step 2.4 — Quality Monitor (reads from 2.3)
```
task(agent_type="general-purpose",
     description="You are the quality-monitor agent in the data-pipeline harness. Read agents/quality-monitor.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_architecture.md, _workspace/02_ingestion_design.md, _workspace/03_transformation_logic.md, and _workspace/messages/transformation-engineer-to-quality-monitor.md. Configure complete data quality monitoring: Great Expectations suites for each critical dataset (covering all 5 quality dimensions: completeness, consistency, timeliness, validity, uniqueness), data contracts for Gold-tier products, column-level lineage in dbt meta, freshness monitoring per SLA tier, and alert routing. Write to _workspace/04_quality_monitoring.md. Write handoff to _workspace/messages/quality-monitor-to-pipeline-reviewer.md with STATUS: COMPLETE, FINDINGS, QUALITY_RISKS, FRESHNESS_SLAS, OPEN_QUALITY_ISSUES.")
```

## Phase 3: Review

### Step 3.1 — Pipeline Reviewer (Terminal)
```
task(agent_type="general-purpose",
     description="You are the pipeline-reviewer agent in the data-pipeline harness. Read agents/pipeline-reviewer.md for your full instructions. Read ALL workspace files: _workspace/00_input.md, _workspace/01_pipeline_architecture.md, _workspace/02_ingestion_design.md, _workspace/03_transformation_logic.md, _workspace/04_quality_monitoring.md, and all 4 message files in _workspace/messages/. Produce a comprehensive pipeline review: SLA compliance analysis (verify each tier's freshness is achievable), cost breakdown (streaming/processing/storage/orchestration), reliability assessment (SPOFs, retry strategies, DLQ coverage), performance bottleneck identification, and final verdict (APPROVED/CHANGES REQUIRED/BLOCKED) with prioritized recommendations. Write to _workspace/05_pipeline_review.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full pipeline design | Full Pipeline | All 5 |
| Architecture decision only | Architecture Mode | pipeline-architect → pipeline-reviewer |
| dbt project only | Transformation Mode | transformation-engineer → pipeline-reviewer |
| Quality monitoring only | Quality Mode | quality-monitor → pipeline-reviewer |
| Pipeline audit | Review Mode | pipeline-reviewer (direct analysis) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; pipeline-reviewer notes "unavailable" for that domain |
| Ambiguous latency requirement | Default to hourly batch; document assumption in `00_input.md` |
| Source schema not provided | Ingestion specialist infers from source type; flags as assumption |
| Conflicting SLA vs cost findings | pipeline-reviewer resolves; escalate to user if truly unresolvable |
| Target not found | Ask user to clarify before proceeding |

## Test Scenarios
1. **Normal case:** "Kafka → Spark → BigQuery pipeline for 100GB/day order events" → full pipeline produces architecture + ingestion + transformations + quality + review
2. **Existing dbt project:** `03_transformation_logic.md` present → skip Phases 2.1-2.3, run quality-monitor and pipeline-reviewer only
3. **Error case:** Ingestion specialist output missing → transformation engineer uses `00_input.md` schemas, flags assumptions
