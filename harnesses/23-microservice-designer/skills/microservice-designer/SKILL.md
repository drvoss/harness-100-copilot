---
name: microservice-designer
description: "Use when designing a microservice architecture from scratch, decomposing a monolith into services, or planning a migration from a monolithic system to microservices. Dispatches domain-modeler, service-designer, api-gateway-specialist, data-architect, and deployment-planner in a sequential DDD-to-deployment pipeline. Covers domain modeling, service boundary design, API gateway configuration, data architecture, and Kubernetes deployment planning. Does NOT cover runtime production monitoring, incident response, or code generation for individual services. Also triggers on: break down monolith, design service boundaries, microservice migration plan, create deployment manifests for services, design event-driven architecture."
metadata:
  category: harness
  harness: 23-microservice-designer
  agent_type: general-purpose
---

# Microservice Designer — Architecture Design Pipeline

Five specialist agents collaborate through a sequential DDD-to-deployment pipeline using file-based message routing.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| domain-modeler | `agents/domain-modeler.md` | DDD analysis: bounded contexts, aggregates, domain events | general-purpose |
| service-designer | `agents/service-designer.md` | Service decomposition, API contracts, data ownership | general-purpose |
| api-gateway-specialist | `agents/api-gateway-specialist.md` | Gateway routing, load balancing, circuit breakers | general-purpose |
| data-architect | `agents/data-architect.md` | Database topology, CQRS, Event Sourcing, sagas | general-purpose |
| deployment-planner | `agents/deployment-planner.md` | Kubernetes manifests, Helm charts, GitOps workflow | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md              (system description, team size, current monolith structure if any)
├── 01_domain_model.md       (domain-modeler output: bounded contexts, context map, events)
├── 02_service_design.md     (service-designer output: service catalog, API contracts)
├── 03_gateway_design.md     (api-gateway-specialist output: routing rules, resilience patterns)
├── 04_data_architecture.md  (data-architect output: database topology, event sourcing decisions)
├── 05_deployment_plan.md    (deployment-planner output — TERMINAL)
└── messages/
    ├── domain-modeler-to-service-designer.md
    ├── service-designer-to-api-gateway-specialist.md
    ├── api-gateway-specialist-to-data-architect.md
    └── data-architect-to-deployment-planner.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] System description or monolith structure available as input

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's microservice design request. Create _workspace/ and _workspace/messages/ directories. Extract: system description, team size, current architecture (monolith or existing services), non-functional requirements (scale targets, latency SLOs, compliance needs), infrastructure constraints (cloud provider, on-prem). Write organized input to _workspace/00_input.md with sections: SYSTEM_DESCRIPTION, TEAM_SIZE, CURRENT_ARCHITECTURE, SCALE_REQUIREMENTS, COMPLIANCE_REQUIREMENTS, INFRASTRUCTURE_CONSTRAINTS.")
```

## Phase 2: Sequential Design Pipeline

### Step 2.1 — Domain Modeler

```
task(agent_type="general-purpose",
     description="You are the domain-modeler agent in the microservice-designer harness. Read agents/domain-modeler.md for your full instructions. Read _workspace/00_input.md for the system description. Perform complete DDD analysis: identify all bounded contexts with linguistic boundaries and team ownership, model aggregate roots with entities and invariants per context, enumerate domain events using Event Storming (past-tense naming), map context relationships using typed patterns (Partnership/Shared Kernel/Customer-Supplier/Conformist/ACL), define ubiquitous language glossary per context, classify subdomains as Core/Supporting/Generic. Write full domain model to _workspace/01_domain_model.md. Write handoff to _workspace/messages/domain-modeler-to-service-designer.md with: STATUS: COMPLETE, FINDINGS: [bounded contexts list, event count, key relationships], CONTEXT_BOUNDARIES_FOR_SERVICE_DESIGNER: [recommended service candidates per context], DOMAIN_EVENTS_FOR_DATA_ARCHITECT: [event categories and volume estimates].")
```

### Step 2.2 — Service Designer (reads message from 2.1)

```
task(agent_type="general-purpose",
     description="You are the service-designer agent in the microservice-designer harness. Read agents/service-designer.md for your full instructions. Read _workspace/00_input.md and _workspace/01_domain_model.md. Read _workspace/messages/domain-modeler-to-service-designer.md for CONTEXT_BOUNDARIES_FOR_SERVICE_DESIGNER. Design individual microservices: decompose bounded contexts into services using granularity heuristics (two-pizza rule, single reason to change, avoid nano/mega services), define REST/gRPC/GraphQL API contracts with request/response schemas and status codes, assign data ownership to eliminate shared databases, define inter-service communication patterns (synchronous vs asynchronous with rationale), specify API versioning strategy and consumer-driven contract testing requirements, flag design smells (chatty APIs, distributed monolith, data coupling). Write full service catalog to _workspace/02_service_design.md. Write handoff to _workspace/messages/service-designer-to-api-gateway-specialist.md with: STATUS: COMPLETE, FINDINGS: [service count, patterns used], ROUTING_REQUIREMENTS_FOR_GATEWAY: [external APIs, auth requirements, rate limiting candidates], DATA_TOPOLOGY_FOR_DATA_ARCHITECT: [database technology recommendations, event-driven service list].")
```

### Step 2.3 — API Gateway Specialist (reads message from 2.2)

```
task(agent_type="general-purpose",
     description="You are the api-gateway-specialist agent in the microservice-designer harness. Read agents/api-gateway-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_domain_model.md, and _workspace/02_service_design.md. Read _workspace/messages/service-designer-to-api-gateway-specialist.md for ROUTING_REQUIREMENTS_FOR_GATEWAY. Design gateway topology (Single/BFF/Micro-gateway with technology choice), routing rules with auth and rate limits per endpoint, load balancing algorithms per service (round-robin/least-connections/consistent-hashing with rationale), circuit breaker thresholds and fallback strategies, rate limiting policies (token bucket/sliding window), service mesh mTLS configuration, service discovery mechanism, observability setup (distributed tracing with sampling rate, Prometheus metrics, access logging with correlation ID). Write full gateway design to _workspace/03_gateway_design.md. Write handoff to _workspace/messages/api-gateway-specialist-to-data-architect.md with: STATUS: COMPLETE, FINDINGS: [gateway topology, resilience patterns], EVENT_STREAMING_NEEDS_FOR_DATA_ARCHITECT: [async communication needs by service], DEPLOYMENT_NOTES_FOR_DEPLOYMENT_PLANNER: [infrastructure requirements, sidecar injection needs].")
```

### Step 2.4 — Data Architect (reads message from 2.3)

```
task(agent_type="general-purpose",
     description="You are the data-architect agent in the microservice-designer harness. Read agents/data-architect.md for your full instructions. Read _workspace/00_input.md, _workspace/01_domain_model.md, _workspace/02_service_design.md, and _workspace/03_gateway_design.md. Read _workspace/messages/api-gateway-specialist-to-data-architect.md for EVENT_STREAMING_NEEDS_FOR_DATA_ARCHITECT. Design: database topology with polyglot persistence justification per service (PostgreSQL/MongoDB/Redis/Cassandra/Elasticsearch), CQRS models where read/write patterns diverge significantly, Event Sourcing strategy with event store choice and snapshot/retention policies, Saga designs for all distributed transactions with choreography vs orchestration choice and compensating transactions per step, outbox pattern for event publishing with CDC or polling approach, consistency contracts with maximum staleness windows. Write full data architecture to _workspace/04_data_architecture.md. Write handoff to _workspace/messages/data-architect-to-deployment-planner.md with: STATUS: COMPLETE, FINDINGS: [databases selected, sagas designed], DATABASE_REQUIREMENTS_FOR_DEPLOYMENT_PLANNER: [StatefulSet needs, PV storage class and size estimates, event store infrastructure], SCALING_REQUIREMENTS_FOR_DEPLOYMENT_PLANNER: [read replica needs, Kafka cluster sizing].")
```

### Step 2.5 — Deployment Planner (reads message from 2.4)

```
task(agent_type="general-purpose",
     description="You are the deployment-planner agent in the microservice-designer harness. Read agents/deployment-planner.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_domain_model.md, _workspace/02_service_design.md, _workspace/03_gateway_design.md, _workspace/04_data_architecture.md, and _workspace/messages/data-architect-to-deployment-planner.md for DATABASE_REQUIREMENTS_FOR_DEPLOYMENT_PLANNER and SCALING_REQUIREMENTS_FOR_DEPLOYMENT_PLANNER. Produce complete Kubernetes deployment plan: namespace structure based on bounded contexts with ResourceQuotas, Deployment manifest specs with CPU/memory requests AND limits for every service, HPA configuration (minReplicas, maxReplicas, target utilization, scale-down stabilization), PodDisruptionBudgets for all production services, liveness/readiness/startup probes per service, Helm chart directory structure with dev/staging/prod values files, GitOps workflow (ArgoCD or Flux) with environment promotion strategy and approval gates, deployment strategy per service (rolling/blue-green/canary) with rollback trigger criteria, StatefulSet or managed service specs for all databases with storage class and backup strategy. Write complete deployment plan to _workspace/05_deployment_plan.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full architecture design | Full Pipeline | All 5 agents |
| "DDD analysis only" | Domain Mode | domain-modeler only |
| "Design services from existing domain model" | Service Mode | service-designer → api-gateway-specialist → data-architect → deployment-planner |
| "Just the deployment plan" | Deploy Mode | deployment-planner (reads existing workspace files) |
| "Data architecture only" | Data Mode | data-architect → deployment-planner |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; deployment-planner notes "unavailable" for that domain |
| Ambiguous system description | Apply standard decomposition patterns; document assumptions in `00_input.md` |
| Conflicting design decisions between agents | Deployment-planner consolidates; escalate to user if truly unresolvable |
| Monolith structure not provided | Proceed with system description only; domain-modeler infers structure from business capabilities |
| Too few services identified | Flag nano-service risk; recommend merging into fewer cohesive services |
| Too many services identified | Flag operational overhead; apply two-pizza rule to suggest consolidation |

## Test Scenarios
1. **Normal case:** System description with team size provided → 5-agent pipeline produces complete architecture with all workspace files
2. **Monolith decomposition:** Existing monolith described → domain-modeler identifies bounded contexts and seams → service-designer recommends strangler-fig migration pattern
3. **Existing domain model:** `01_domain_model.md` already present → skip domain-modeler, start from service-designer using Scale Mode
4. **Error case:** System description too vague → orchestrator documents reasonable assumptions in `00_input.md`, agents apply domain defaults
