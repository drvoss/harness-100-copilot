---
name: api-designer
description: "Use when designing a new API, redesigning an existing API, or adding major new capabilities to an API surface. Dispatches api-architect, rest-specialist, graphql-specialist, security-designer, and docs-generator in a fan-out/fan-in pipeline to produce a complete API strategy, endpoint catalogue, security design, and OpenAPI 3.0 specification. Covers REST and GraphQL design, OAuth 2.0 and JWT security, rate limiting, CORS, OWASP API Security Top 10 mitigations, and Swagger documentation. Does NOT cover backend implementation, database schema design, infrastructure provisioning, or mobile app development (use a separate harness for those). Also triggers on: re-run api design, update api spec, revise security design, regenerate openapi, add graphql schema, redesign endpoints."
metadata:
  category: harness
  harness: 18-api-designer
  agent_type: general-purpose
---

# API Designer — API Design Pipeline

A 5-agent team covers API strategy, RESTful endpoint design, GraphQL schema design, security hardening, and documentation generation using a fan-out/fan-in pattern.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`. api-architect fans out to REST and GraphQL specialists independently; security-designer fans in from both; docs-generator is terminal.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| api-architect | `agents/api-architect.md` | Strategy, versioning, auth scheme, gateway patterns | general-purpose |
| rest-specialist | `agents/rest-specialist.md` | RESTful endpoints, HTTP semantics, pagination | general-purpose |
| graphql-specialist | `agents/graphql-specialist.md` | GraphQL schema, DataLoader, subscriptions | general-purpose |
| security-designer | `agents/security-designer.md` | OAuth 2.0, JWT, rate limiting, CORS, OWASP | general-purpose |
| docs-generator | `agents/docs-generator.md` | OpenAPI 3.0 spec, Swagger UI, SDK hints | general-purpose |

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Service name, domain, and client types are available
- [ ] Auth requirements are specified (or will be derived from domain context)

## Workspace Layout

```
_workspace/
├── 00_input.md              (service name, domain, tech stack, auth requirements)
├── 01_api_strategy.md       (api-architect output)
├── 02_rest_endpoints.md     (rest-specialist output)
├── 02_graphql_schema.md     (graphql-specialist output — parallel with REST)
├── 03_security_design.md    (security-designer output)
├── 04_api_documentation.md  (docs-generator output — terminal agent)
└── messages/
    ├── api-architect-to-rest-specialist.md
    ├── api-architect-to-graphql-specialist.md
    ├── rest-specialist-to-security-designer.md
    ├── graphql-specialist-to-security-designer.md
    └── security-designer-to-docs-generator.md
```

## Phase 1: Setup (Orchestrator)

Write all output files to the current project directory, not a temp directory.

```
task(agent_type="general-purpose",
     description="Read the user's API design request. Create _workspace/ and _workspace/messages/ directories in the current project. Extract: SERVICE_NAME (what service is being designed), DOMAIN (business domain — e-commerce, fintech, etc.), TECH_STACK (backend language/framework if specified), AUTH_REQUIREMENTS (auth model — OAuth 2.0, API keys, etc.), CLIENT_TYPES (web, mobile, third-party, internal service), CONSTRAINTS (existing APIs to remain compatible with, regulatory requirements). Write organized input to _workspace/00_input.md with those sections. If any required information is missing, make reasonable assumptions and document them in an ASSUMPTIONS section.")
```

## Phase 2: API Architecture

### Step 2.1 — API Architect
```
task(agent_type="general-purpose",
     description="You are the api-architect agent in the api-designer harness. Read agents/api-architect.md for your full instructions. Read _workspace/00_input.md for the service requirements. Apply the REST vs GraphQL vs gRPC decision matrix from your domain knowledge. Select and justify: technology choice, versioning scheme, authentication flow, and gateway requirements. Write your full strategy to _workspace/01_api_strategy.md. Write two handoff messages: _workspace/messages/api-architect-to-rest-specialist.md and _workspace/messages/api-architect-to-graphql-specialist.md following the formats in your agent instructions.")
```

## Phase 3: Specialist Design (Fan-Out)

Both specialists read from api-architect output and work independently.

### Step 3.1 — REST Specialist
```
task(agent_type="general-purpose",
     description="You are the rest-specialist agent in the api-designer harness. Read agents/rest-specialist.md for your full instructions. Read _workspace/00_input.md and _workspace/01_api_strategy.md. Read _workspace/messages/api-architect-to-rest-specialist.md for specific REST guidance. Design the complete REST endpoint catalogue: resource models, HTTP methods, status codes (use 201 vs 200, 422 vs 400 as documented in your domain knowledge), pagination strategy (cursor vs offset), error envelope (RFC 7807), and HATEOAS link patterns. Write your full endpoint catalogue to _workspace/02_rest_endpoints.md. Write handoff to _workspace/messages/rest-specialist-to-security-designer.md with STATUS: COMPLETE, list of PII endpoints, list of sensitive operations, and pagination approach chosen.")
```

### Step 3.2 — GraphQL Specialist
```
task(agent_type="general-purpose",
     description="You are the graphql-specialist agent in the api-designer harness. Read agents/graphql-specialist.md for your full instructions. Read _workspace/00_input.md and _workspace/01_api_strategy.md. Read _workspace/messages/api-architect-to-graphql-specialist.md for specific GraphQL guidance. Design the complete GraphQL schema: full SDL type definitions, queries, mutations (with input types and result unions), subscriptions, DataLoader patterns for every 1-to-N relationship, and schema evolution/deprecation strategy. Write your full schema design to _workspace/02_graphql_schema.md. Write handoff to _workspace/messages/graphql-specialist-to-security-designer.md with STATUS: COMPLETE, auth model chosen, introspection policy, query complexity limits, and any PII-handling mutations.")
```

## Phase 4: Security Design (Fan-In)

### Step 4.1 — Security Designer
```
task(agent_type="general-purpose",
     description="You are the security-designer agent in the api-designer harness. Read agents/security-designer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_api_strategy.md, _workspace/02_rest_endpoints.md, _workspace/02_graphql_schema.md. Read _workspace/messages/rest-specialist-to-security-designer.md for REST security touchpoints. Read _workspace/messages/graphql-specialist-to-security-designer.md for GraphQL security requirements. Apply the OWASP API Security Top 10 (all 10 risks) to the designed endpoints. Specify: OAuth 2.0 flows per client type with scopes and token lifetimes, JWT algorithm (RS256) and validation rules, rate limiting algorithm and tiers with specific numbers, CORS policy with explicit allowed origins (not wildcard), required security headers. Write your full security design to _workspace/03_security_design.md. Write handoff to _workspace/messages/security-designer-to-docs-generator.md with STATUS: COMPLETE, OpenAPI securitySchemes to generate, scope definitions, rate limit headers to document, and list of OWASP risks addressed.")
```

## Phase 5: Documentation Generation (Terminal)

### Step 5.1 — Docs Generator
```
task(agent_type="general-purpose",
     description="You are the docs-generator agent in the api-designer harness. Read agents/docs-generator.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_api_strategy.md, _workspace/02_rest_endpoints.md, _workspace/02_graphql_schema.md, _workspace/03_security_design.md. Read _workspace/messages/security-designer-to-docs-generator.md for the list of securitySchemes and scope definitions to include. Generate: (1) complete OpenAPI 3.0 YAML spec with all paths, components/schemas, components/responses, components/securitySchemes — every protected endpoint must have a security declaration; (2) Swagger UI hosting configuration with OAuth 2.0 try-it-out setup; (3) GraphQL SDL snapshot if GraphQL is in scope; (4) SDK generation commands for primary target languages; (5) v1.0.0 changelog entry; (6) developer quickstart with auth flow walkthrough. Write the complete documentation package to _workspace/04_api_documentation.md. This is the final artifact — do not write any message file.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Design a full API" / complete request | Full Pipeline | All 5 agents |
| "Design REST API only" | REST-Only Mode | api-architect → rest-specialist → security-designer → docs-generator |
| "Design GraphQL API only" | GraphQL-Only Mode | api-architect → graphql-specialist → security-designer → docs-generator |
| "Add security to existing design" | Security-Only Mode | security-designer → docs-generator (read existing workspace files) |
| "Generate OpenAPI spec" | Docs-Only Mode | docs-generator (read existing workspace files) |
| "Quick API sketch" | Minimal Mode | api-architect → rest-specialist (no security or docs phase) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run that agent once; if still missing, downstream agent notes "design unavailable for this domain" and proceeds with partial information |
| Ambiguous technology choice | api-architect selects REST as default; documents assumption in `00_input.md` and `01_api_strategy.md` |
| Conflicting auth requirements | security-designer resolves; documents conflict and chosen resolution in `03_security_design.md` |
| REST and GraphQL scope overlap | Both specialists document their own scope; security-designer and docs-generator cover both |
| `_workspace/` already has files | Confirm with user if safe to overwrite; if no response, append `-prev` suffix to existing files |
| Service has no clear domain | Apply generic CRUD resource patterns; flag as assumption in `00_input.md` |

## Test Scenarios
1. **Normal case:** User provides service name, domain, client types, and auth requirements → all 5 agents run in sequence → `04_api_documentation.md` contains complete OpenAPI 3.0 spec
2. **REST-only request:** User specifies "no GraphQL needed" → graphql-specialist is skipped → security-designer reads only REST message
3. **Minimal input:** Only service name provided → api-architect makes reasonable assumptions, documents them → pipeline continues
4. **Existing workspace:** `_workspace/` contains previous run files → orchestrator confirms overwrite before proceeding
