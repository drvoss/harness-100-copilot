# 23 — Microservice Designer

Pipeline-based microservice architecture design harness: five specialist agents analyze domain structure, design services, configure API gateways, architect data stores, and produce Kubernetes deployment plans through a sequential DDD-to-deployment workflow.

## Structure

```
harnesses/23-microservice-designer/
├── HARNESS.md                                   (this file)
├── agents/
│   ├── domain-modeler.md                        DDD: bounded contexts, aggregate roots, domain events, context map
│   ├── service-designer.md                      Services: single responsibility, API contracts, data ownership
│   ├── api-gateway-specialist.md                Gateway: routing, load balancing, circuit breakers, observability
│   ├── data-architect.md                        Data: per-service DBs, CQRS/Event Sourcing, sagas, consistency
│   └── deployment-planner.md                    Kubernetes: manifests, Helm charts, HPA, GitOps workflow
└── skills/
    ├── microservice-designer/SKILL.md            Orchestrator — pipeline coordination, workspace layout
    ├── domain-driven-design/SKILL.md             DDD patterns, context mapping, ubiquitous language
    └── service-mesh-patterns/SKILL.md            Istio/Linkerd patterns, traffic management, mTLS
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| domain-modeler | DDD: bounded contexts, aggregate roots, domain events, context map | `01_domain_model.md` |
| service-designer | Services: single responsibility, API contracts, data ownership | `02_service_design.md` |
| api-gateway-specialist | Gateway: routing, load balancing, circuit breakers, observability | `03_gateway_design.md` |
| data-architect | Data: per-service DBs, CQRS/Event Sourcing, sagas, consistency | `04_data_architecture.md` |
| deployment-planner | Kubernetes: manifests, Helm charts, HPA, GitOps workflow | `05_deployment_plan.md` |

## Quick Start

```bash
cp -r harnesses/23-microservice-designer/agents/ .github/agents/
cp -r harnesses/23-microservice-designer/skills/ .github/skills/
```
Then ask Copilot: `Design microservices for this monolith`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full microservice design | Full Pipeline (all 5) | all |
| Service design only | Reduced (2 agents) | domain-modeler → service-designer |
| Deployment config only | Single | deployment-planner only |

## Usage

Trigger the `microservice-designer` skill or make a natural language request:
- "Design microservices for this monolith"
- "Create a microservice architecture for an e-commerce platform"
- "Break down this system into services"
- "Design a microservice system for team-size 10"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized system description, team size, constraints
- `01_domain_model.md` — Bounded contexts, context map, domain events
- `02_service_design.md` — Service catalog, API contracts, data ownership
- `03_gateway_design.md` — Routing rules, resilience patterns, observability
- `04_data_architecture.md` — Database topology, event sourcing decisions
- `05_deployment_plan.md` — Kubernetes manifests, Helm charts, GitOps workflow

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/23-microservice-designer/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/23-microservice-designer/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/23-microservice-designer) under Apache 2.0 License. Key adaptation: SendMessage peer communication replaced with file-based message bus (`_workspace/messages/`).
