---
name: strangler-fig-pattern
description: "Use when implementing the Strangler Fig migration pattern — provides a step-by-step guide for facade installation, anti-corruption layer design, incremental traffic migration, and legacy retirement. Supporting skill for the legacy-modernizer harness. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting-skill
  harness: 22-legacy-modernizer
---

# Strangler Fig Pattern — Implementation Guide

The Strangler Fig pattern enables safe, incremental migration of a legacy system by building a new implementation alongside it, gradually routing traffic to the new system, and retiring the old one only when the new implementation is fully proven.

## Core Concept

Named after the strangler fig tree that grows around a host tree until it replaces it, this pattern allows:
- Zero-downtime migration
- Easy rollback at any point (flip the routing back to legacy)
- Incremental delivery of business value during migration
- Risk containment to individual bounded contexts

## Pattern Phases

### Phase 0: Preparation
Before installing the facade:
1. Achieve test coverage baseline on all modules that will be touched by the facade
2. Install characterization tests (Golden Master) for untested legacy endpoints
3. Document all traffic entry points (HTTP endpoints, message queue consumers, scheduled jobs)
4. Map all bounded contexts to identify migration unit order (start with lowest coupling)

### Phase 1: Intercept — Facade Installation
Install a routing facade that sits in front of the legacy system:

```
[Clients] → [Facade/Proxy] → [Legacy System]
```

The facade initially forwards 100% of traffic to legacy. No business logic changes yet.

**Implementation approaches:**
- **HTTP proxy**: Nginx/HAProxy routing rule, API Gateway, or a thin application-level facade
- **Event bus**: New consumer that delegates to legacy handler (for async systems)
- **Database facade**: Repository pattern wrapping legacy DAL (for DB-layer migration)

**Rollback**: Remove facade routing rule — zero code change required.

**Exit criterion**: All existing tests pass; latency within SLA; no traffic loss.

### Phase 2–N: Implement — Parallel New Implementation
For each bounded context (in migration order):

```
[Clients] → [Facade/Proxy] → [Legacy System] (still handles traffic)
                          ↘ [New Implementation] (under development)
```

1. Build new implementation behind the facade (not yet receiving live traffic)
2. Run both implementations in shadow mode: route real traffic to legacy, mirror to new, compare outputs
3. When outputs match and new implementation passes acceptance tests, proceed to Switch

**Anti-Corruption Layer (ACL) within the facade:**
```
[Facade] → [ACL Translator] → [New Implementation domain model]
                            ← [Legacy domain model]
```

The ACL translates legacy concepts to new domain concepts at the boundary:
- Legacy: `customer_account_id` (integer) → New: `UserId` (UUID value object)
- Legacy: `status_code` (1/2/3) → New: `OrderStatus` (enum)
- Legacy: `flat data structure` → New: `aggregate root`

### Phase Switch: Traffic Migration
Route live traffic from legacy to new implementation incrementally:

**Strategies:**
- **Percentage rollout**: 5% → 25% → 50% → 100% over days/weeks
- **Feature flag**: Toggle per user cohort, region, or account type
- **Header-based**: Route `X-Migration: v2` requests to new implementation

**Shadow mode validation** (before any live traffic switch):
```
Request → Facade → Legacy (returns response to client)
               ↘ New Implementation (runs in parallel, output logged but not returned)
Compare legacy vs. new outputs; fix divergences before switching traffic
```

### Final Phase: Legacy Retirement
Once 100% of traffic routes to the new implementation:
1. Monitor for 30 days with zero legacy invocations
2. Archive legacy code (tag in git, do not delete immediately)
3. Remove facade routing rule for this bounded context
4. Delete legacy code after 90-day archive period

## Anti-Corruption Layer Design

### ACL Structure
```
LegacyAdapter (ACL)
├── toLegacyRequest(NewDomainRequest) → LegacyRequest
├── fromLegacyResponse(LegacyResponse) → NewDomainResponse
└── translateErrorCodes(LegacyError) → DomainException
```

### Design Rules
- **Consumer-driven**: Define ACL interfaces from the new implementation's perspective, not the legacy system's
- **Thin by default**: ACL should only translate; no business logic
- **Explicit mapping**: Every field mapping documented; no implicit convention-based mapping
- **Versioned**: When legacy changes its contract, update the ACL without touching new domain code
- **Temporary**: Plan the ACL's retirement date alongside the bounded context it bridges

### Common Legacy Concept Translations
| Legacy Concept | New Concept | Notes |
|----------------|------------|-------|
| Integer IDs | UUID value objects | Map table required during transition |
| Status codes (int) | Enumerations | Guard against unmapped codes |
| Flat record structures | Aggregate roots | Decompose carefully — data may serve multiple new aggregates |
| Stored procedure calls | Repository + domain events | Capture side effects explicitly |
| Session state | Stateless + token | Client migration required |

## Migration Order Heuristics

Order bounded contexts for migration using this scoring:
- **Low efferent coupling** (Ce): fewer dependencies on other legacy modules → migrate first
- **High afferent coupling** (Ca): many modules depend on it → migrate last (or build adapter first)
- **High business value**: new features blocked by legacy constraint → elevate priority
- **Low complexity**: simple bounded context → build team confidence before tackling hard problems

## Rollback Decision Tree

```
Traffic on new implementation → Issue detected
├── Severity: cosmetic/minor → Log + fix forward; do not roll back
├── Severity: functional regression, contained → Roll back this context to legacy (flip facade)
└── Severity: data corruption / SLA breach → Emergency rollback + incident response
```

## Common Failure Modes

| Failure Mode | Cause | Prevention |
|-------------|-------|-----------|
| Facade becomes bottleneck | All traffic routes through single facade instance | Horizontally scale facade; use sidecar pattern |
| ACL grows business logic | Pressure to "just add it here" | Enforce ACL review in PR process; keep ACL in separate module |
| Shadow mode divergence ignored | Outputs differ but no one investigates | Automated divergence alerting; block traffic switch until divergence rate < 0.1% |
| Parallel run too long | Migration loses momentum | Time-box each bounded context; use a migration board |
| Legacy never fully retired | "We'll retire it eventually" | Set hard retirement date per bounded context; track legacy traffic metrics |
