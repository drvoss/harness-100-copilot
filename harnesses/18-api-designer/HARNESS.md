# 18 — API Designer

Automated API design harness: a 5-agent team covers overall strategy, RESTful endpoint design, GraphQL schema design, security hardening, and documentation generation, producing a production-ready OpenAPI 3.0 specification.

## Structure

```
harnesses/18-api-designer/
├── HARNESS.md                              (this file)
├── agents/
│   ├── api-architect.md                   Overall strategy, versioning, auth scheme, gateway patterns
│   ├── rest-specialist.md                 RESTful endpoints, resource modeling, HTTP semantics
│   ├── graphql-specialist.md              GraphQL schema, queries/mutations/subscriptions, N+1 prevention
│   ├── security-designer.md               OAuth 2.0, JWT, rate limiting, CORS, OWASP API Top 10
│   └── docs-generator.md                  OpenAPI 3.0 spec, Swagger docs, SDK examples
└── skills/
    ├── api-designer/SKILL.md              Orchestrator — workflow, phase sequencing, error handling
    ├── openapi-spec/SKILL.md              Supporting — OpenAPI 3.0 patterns, common schema components
    └── api-security-patterns/SKILL.md     Supporting — OWASP API Security Top 10, security controls
```

## Usage

Trigger the `api-designer` skill or make a natural language request:
- "Design a REST API for a user management service"
- "Create a GraphQL schema for an e-commerce platform"
- "Design a secure API for my fintech app"
- "Build an API with OAuth 2.0 and rate limiting"

## Pipeline Pattern

**Fan-Out / Fan-In** — api-architect sets strategy, REST and GraphQL specialists work independently in parallel (fan-out), security-designer synthesizes both designs (fan-in), docs-generator produces the final specification.

```
api-architect
    ├──→ rest-specialist ──→ security-designer ──→ docs-generator
    └──→ graphql-specialist ──↗
```

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:

```
_workspace/
├── 00_input.md              (service name, domain, tech stack, auth requirements)
├── 01_api_strategy.md       (api-architect output)
├── 02_rest_endpoints.md     (rest-specialist output)
├── 02_graphql_schema.md     (graphql-specialist output — parallel with REST)
├── 03_security_design.md    (security-designer output)
├── 04_api_documentation.md  (docs-generator output — final artifact)
└── messages/
    ├── api-architect-to-rest-specialist.md
    ├── api-architect-to-graphql-specialist.md
    ├── rest-specialist-to-security-designer.md
    ├── graphql-specialist-to-security-designer.md
    └── security-designer-to-docs-generator.md
```

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/18-api-designer/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/18-api-designer/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/18-api-designer)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
