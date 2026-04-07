---
name: domain-driven-design
description: "Use when applying Domain-Driven Design patterns to a business problem — provides DDD tactical and strategic pattern guidance, context mapping templates, and ubiquitous language modeling support. Does NOT cover microservice deployment or infrastructure concerns. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting-skill
  harness: 23-microservice-designer
  agent_type: general-purpose
---

# Domain-Driven Design — DDD Pattern Reference

Supporting skill providing DDD tactical and strategic pattern guidance for the microservice-designer harness.

## Tactical Patterns Reference

### Entity
An object defined by its identity that persists over time.
- **Characteristics**: Has unique identifier; mutable state; equality by ID not value
- **Examples**: `Order`, `Customer`, `Product`, `Invoice`
- **Implementation**: Generate stable ID at creation (UUID); never expose internal state directly; protect invariants via methods

### Value Object
An object defined by its attributes with no conceptual identity.
- **Characteristics**: Immutable; equality by value; side-effect-free; replaceable
- **Examples**: `Money(amount, currency)`, `Address`, `EmailAddress`, `DateRange`
- **Implementation**: Validate all fields in constructor; return new instance on transformation; share freely (no identity)

### Aggregate
A cluster of entities and value objects with a single aggregate root that enforces consistency.
- **Characteristics**: Transactional boundary; external access only via root; internal consistency enforced by root
- **Root selection**: Choose the entity that controls the lifecycle of the cluster and enforces all invariants
- **Size guidance**: Keep aggregates small (1-3 entities); large aggregates create concurrency bottlenecks
- **Invariant rule**: All invariants within an aggregate must be consistent after each command

### Domain Event
An immutable record of something significant that happened in the domain.
- **Naming**: Past-tense noun phrases — `OrderPlaced`, `PaymentFailed`, `InventoryReserved`, `CustomerRegistered`
- **Structure**: event_id (UUID), occurred_at (timestamp), aggregate_id, event_type, payload, correlation_id, causation_id
- **Versioning**: Use event upcasters to transform old schemas to current version; never mutate stored events
- **Immutability**: Events are facts; once stored they cannot be changed or deleted (except for compliance erasure)

### Repository
An abstraction for retrieving and persisting aggregates that hides storage details.
- **Rule**: One repository per aggregate root; never create a repository per entity
- **Interface**: `findById(id): Aggregate`, `save(aggregate): void`, `findBy{Criteria}(criteria): List<Aggregate>`
- **Anti-pattern**: Do not expose query methods that return partial aggregates or entities directly

### Domain Service
Stateless domain logic that does not naturally belong to any single aggregate.
- **When to use**: Operation spans multiple aggregates; domain expert names it as a distinct process
- **Examples**: `FundsTransferService`, `PricingCalculationService`, `FraudDetectionService`
- **Anti-pattern**: Anemic domain model — business logic in services when it belongs in aggregates

## Strategic Patterns Reference

### Bounded Context
An explicit boundary within which a domain model is consistent, unified, and linguistically precise.
- **Identification signals**: Different teams use the same word differently; organizational boundaries; separate deployment units; separate database schemas
- **Naming**: Use domain expert language; avoid technical names like `UserService` or `OrderManager`
- **Size guidance**: A bounded context should be ownable by one team; align with Conway's Law

### Context Map Relationship Types

| Type | Description | Integration Approach |
|------|-------------|---------------------|
| Partnership | Two teams cooperate symmetrically on shared goals | Tight coordination; joint planning; mutual API evolution |
| Shared Kernel | Common model shared between two contexts | Joint ownership; changes require agreement from both teams |
| Customer-Supplier | Downstream (customer) depends on upstream (supplier) | Upstream publishes planned API changes; downstream adapts |
| Conformist | Downstream adopts upstream model completely | No translation; downstream simply uses upstream's language |
| Anti-Corruption Layer (ACL) | Downstream translates upstream model internally | Translation layer in downstream; protects domain integrity |
| Open Host Service | Provider defines stable published protocol | Standard interface; multiple consumers adapt to it |
| Published Language | Shared, well-documented formal interchange format | Schema registry (JSON Schema, Protobuf, Avro) |

## Event Storming Facilitation Guide

### Step 1: Domain Events (Orange stickies)
- Ask: "What events can happen in this domain?"
- Time-box: 30 minutes of individual work with no discussion
- Rule: Past-tense verb phrases only; one event per sticky
- Output: A chaotic wall of events

### Step 2: Timeline Ordering
- Ask participants to arrange events chronologically left to right
- Identify conflicting orderings — these reveal unclear domain understanding
- Output: A rough temporal narrative

### Step 3: Commands (Blue stickies)
- Ask: "What triggers each event?" — user action, system trigger, or time-based
- Place commands to the left of the events they trigger
- Output: Command → Event pairs on the timeline

### Step 4: Aggregates (Yellow stickies)
- Ask: "Who handles this command and enforces the rules?"
- Cluster commands and events around aggregate names
- Output: Aggregate-grouped command/event clusters

### Step 5: Bounded Contexts (Pink areas)
- Ask: "Where do language or team boundaries exist?"
- Draw pink boundary lines around aggregate clusters using the same language
- Output: Named bounded contexts with clear linguistic boundaries

### Step 6: Context Map (Lines between pink areas)
- Connect bounded contexts with typed relationship arrows
- Output: Formal context map with relationship types

## Ubiquitous Language Template

```markdown
# Ubiquitous Language: {Context Name}

## Core Terms
| Term | Definition in This Context | Related Terms | Anti-definition (NOT) |
|------|--------------------------|--------------|----------------------|

## Domain Processes
| Process | Trigger | Steps | Outcome | Domain Events Emitted |
|---------|---------|-------|---------|----------------------|

## Invariants
| Rule | Aggregate | Enforcement |
|------|-----------|-------------|
```

## Common DDD Anti-Patterns

| Anti-Pattern | Symptom | Remedy |
|-------------|---------|--------|
| Anemic Domain Model | Aggregates are data bags; all logic in services | Move business rules into aggregate methods |
| God Aggregate | One aggregate has 20+ entities | Decompose using single-responsibility; find sub-aggregates |
| Missing Bounded Context | "User" means different things in Billing and Shipping | Draw explicit bounded context around each distinct meaning |
| Leaking Internals | Services expose entities, not aggregates | Route all external access through the aggregate root |
| Database as Integration | Two contexts share a schema | Introduce event publishing and ACL translation layer |
