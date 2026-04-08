---
name: test-automation
description: "Use when you need to generate a complete test suite for a project — dispatches test-strategist, unit-test-writer, integration-test-writer, e2e-test-writer, and test-reviewer in sequence to produce strategy, implementation, and review artifacts. Covers test pyramid design, unit/integration/E2E implementation, coverage analysis, and flaky-test detection. Does NOT cover runtime performance testing, load/stress testing, or security penetration testing (use dedicated harnesses for those). Also triggers on: add tests to existing project, improve test coverage, write tests for this module, review our test suite."
metadata:
  category: harness
  harness: 24-test-automation
  agent_type: general-purpose
---

# Test Automation — Full-Stack Test Generation Pipeline

A 5-agent pipeline produces a complete, layered test suite: strategy → unit tests → integration tests → E2E tests → quality review.

## Execution Mode

**File-Bus Pipeline** — Agents execute sequentially, each reading previous outputs and passing a handoff message to the next agent via `_workspace/messages/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| test-strategist | `agents/test-strategist.md` | Test pyramid, coverage targets, risk matrix | general-purpose |
| unit-test-writer | `agents/unit-test-writer.md` | AAA unit tests, mocking strategy, isolation | general-purpose |
| integration-test-writer | `agents/integration-test-writer.md` | DB tests, API contracts, Testcontainers | general-purpose |
| e2e-test-writer | `agents/e2e-test-writer.md` | Playwright/Cypress, Page Objects, user journeys | general-purpose |
| test-reviewer | `agents/test-reviewer.md` | Coverage gaps, flaky tests, final verdict | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md                             (project tech stack, existing coverage, priorities)
├── 01_test_strategy.md                     (test-strategist output)
├── 02_unit_tests.md                        (unit-test-writer output)
├── 03_integration_tests.md                 (integration-test-writer output)
├── 04_e2e_tests.md                         (e2e-test-writer output)
├── 05_test_review_report.md                (test-reviewer output — TERMINAL)
└── messages/
    ├── test-strategist-to-unit-test-writer.md
    ├── unit-test-writer-to-integration-test-writer.md
    ├── integration-test-writer-to-e2e-test-writer.md
    └── e2e-test-writer-to-test-reviewer.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Target codebase or module description is available

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's test automation request. Create _workspace/ and _workspace/messages/ directories. Extract: tech stack (language, frameworks, DB), existing test coverage if any, priority modules or user journeys, testing framework preferences or constraints. Write organized input to _workspace/00_input.md with sections: TECH_STACK, EXISTING_COVERAGE, PRIORITY_AREAS, FRAMEWORKS, CONSTRAINTS.")
```

## Phase 2: Strategy

### Step 2.1 — Test Strategist
```
task(agent_type="general-purpose",
     description="You are the test-strategist agent in the test-automation harness. Read agents/test-strategist.md for your full instructions. Read _workspace/00_input.md. Analyze the tech stack and existing coverage to define: test pyramid allocation (unit/integration/E2E percentages), coverage targets (line, branch, mutation), risk matrix for all major components, and framework recommendations. Write full strategy to _workspace/01_test_strategy.md. Write handoff to _workspace/messages/test-strategist-to-unit-test-writer.md with: STATUS: COMPLETE, FINDINGS: [pyramid allocation, coverage targets, critical risk areas], UNIT_TEST_PRIORITIES: [high-priority modules], TESTING_CONSTRAINTS: [framework choices, limitations].")
```

## Phase 3: Test Implementation

### Step 3.1 — Unit Test Writer
```
task(agent_type="general-purpose",
     description="You are the unit-test-writer agent in the test-automation harness. Read agents/unit-test-writer.md for your full instructions. Read _workspace/00_input.md and _workspace/01_test_strategy.md and _workspace/messages/test-strategist-to-unit-test-writer.md. Read relevant source files from the repository. Generate complete unit tests using AAA pattern for all priority modules identified in the strategy. Include mock strategy table and coverage projection. Write full unit test implementations to _workspace/02_unit_tests.md. Write handoff to _workspace/messages/unit-test-writer-to-integration-test-writer.md with: STATUS: COMPLETE, FINDINGS: [modules covered, estimated coverage], INTEGRATION_BOUNDARIES_IDENTIFIED: [services/DBs needing integration tests], UNTESTABLE_AT_UNIT_LEVEL: [paths needing integration/E2E coverage]. Also consult references/testing-patterns.md for Jest assertion examples and mocking patterns.")
```

### Step 3.2 — Integration Test Writer
```
task(agent_type="general-purpose",
     description="You are the integration-test-writer agent in the test-automation harness. Read agents/integration-test-writer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_test_strategy.md, _workspace/02_unit_tests.md, and _workspace/messages/unit-test-writer-to-integration-test-writer.md. Read relevant repository/DAO source files and API definitions. Generate complete integration tests using Testcontainers for DB/cache, Pact for API contracts, and transaction rollback patterns. Write full integration test implementations to _workspace/03_integration_tests.md. Write handoff to _workspace/messages/integration-test-writer-to-e2e-test-writer.md with: STATUS: COMPLETE, FINDINGS: [areas covered, container images used], E2E_USER_JOURNEYS_NEEDED: [flows needing E2E validation], INFRASTRUCTURE_DEPENDENCIES: [services needed for E2E environment].")
```

### Step 3.3 — E2E Test Writer
```
task(agent_type="general-purpose",
     description="You are the e2e-test-writer agent in the test-automation harness. Read agents/e2e-test-writer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_test_strategy.md, _workspace/03_integration_tests.md, and _workspace/messages/integration-test-writer-to-e2e-test-writer.md. Read relevant front-end source files and any existing E2E tests. Generate complete E2E tests using Playwright or Cypress with Page Object Model, data-testid selectors, fixture-based data setup, and CI parallelization config. Write full E2E test implementations to _workspace/04_e2e_tests.md. Write handoff to _workspace/messages/e2e-test-writer-to-test-reviewer.md with: STATUS: COMPLETE, FINDINGS: [journeys covered, framework used, estimated duration], POTENTIAL_FLAKINESS_RISKS: [timing-sensitive patterns], SELECTOR_GAPS: [UI elements needing data-testid attributes].")
```

## Phase 4: Review

### Step 4.1 — Test Reviewer (Terminal)
```
task(agent_type="general-purpose",
     description="You are the test-reviewer agent in the test-automation harness. Read agents/test-reviewer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_test_strategy.md, _workspace/02_unit_tests.md, _workspace/03_integration_tests.md, _workspace/04_e2e_tests.md, and all 4 message files in _workspace/messages/. Review the complete test suite for: coverage gaps (rank by risk), flaky test patterns, test code smells, mutation testing readiness, and pyramid conformance. Produce a final prioritized report with a APPROVED/NEEDS_REVISION/BLOCKED verdict. Write final report to _workspace/05_test_review_report.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Write a full test suite" / "test automation" | Full Pipeline | All 5 |
| "Write unit tests for X" | Unit Only | test-strategist → unit-test-writer → test-reviewer |
| "Add integration tests" | Integration Mode | test-strategist → integration-test-writer → test-reviewer |
| "Write E2E tests for the checkout flow" | E2E Mode | test-strategist → e2e-test-writer → test-reviewer |
| "Review our test suite" | Review Only | test-reviewer (reads existing `_workspace/` artifacts) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; test-reviewer notes the level as "unavailable" in the final report |
| Ambiguous tech stack | Apply most common stack for the project type; document assumptions in `00_input.md` |
| No existing source code | Generate test scaffolding with TODO placeholders; note in `00_input.md` |
| Conflicting framework preferences | Prefer the framework already in use; document the conflict in `01_test_strategy.md` |
| E2E environment unavailable | Skip E2E tests; test-reviewer flags as a critical gap |

## Test Scenarios
1. **Normal case:** Tech stack and target modules provided → full 5-agent pipeline → strategy + 3 test levels + review report
2. **Existing partial coverage:** Some tests already exist → agents build on existing coverage, avoid duplication
3. **Review only:** All `_workspace/` files present → skip to test-reviewer directly
4. **Error case:** One agent fails to produce output → remaining agents note the gap; test-reviewer flags it

## Testing Standards

### The Prove-It Pattern (Bug Fixes)

When a bug is reported, instruct the unit-test-writer to apply this mandatory workflow:

```
Bug report arrives
       │
       ▼
  Write a test that REPRODUCES the bug (it must FAIL first)
       │
       ▼
  Test FAILS → confirms the bug exists and documents expected behavior
       │
       ▼
  Commit the failing test → hands off to the developer or implementation harness
       │
       ▼
  (After fix is implemented) Test PASSES → proves the fix works
       │
       ▼
  Run full test suite → no regressions
```

"Seems fixed" is not done. The reproduction test is the proof. Note: the unit-test-writer's scope ends at producing the failing reproduction test — implementing the actual fix is outside this harness's scope.

### Test Pyramid Allocation

Instruct the test-strategist to target these ratios (aligned with agent contracts):

```
          ╱╲
         ╱  ╲         E2E Tests (~10%)
        ╱    ╲        Full user flows, real browser
       ╱──────╲
      ╱        ╲      Integration Tests (~20%)
     ╱          ╲     Component interactions, API boundaries
    ╱────────────╲
   ╱              ╲   Unit Tests (~70%)
  ╱                ╲  Pure logic, isolated, fast
 ╱──────────────────╲
```

Deviation from these ratios must be justified in `_workspace/01_test_strategy.md`.

### DAMP Over DRY in Tests

In production code, DRY (Don't Repeat Yourself) is usually right. In tests, **DAMP (Descriptive And Meaningful Phrases)** is better. Instruct all test writers to:

- Make each test self-contained and independently readable
- Prefer duplication in tests over shared helpers that obscure what each test verifies
- Each test should tell a complete story without the reader needing to trace through shared setup

### Test Double Priority Order

Instruct agents to use test doubles in this preference order:

```
1. Real implementation  → Highest confidence, catches real bugs
2. Fake                 → In-memory version of a dependency (e.g., fake database)
3. Stub                 → Returns canned data, no behavior
4. Mock (interaction)   → Verifies method calls — use sparingly
```

Use mocks only when the real implementation is too slow, non-deterministic, or has uncontrollable side effects (external APIs, email sending). Over-mocking creates tests that pass while production breaks.

### State-Based vs Interaction-Based Testing

Instruct agents to test **what code does** (state-based), not **how it does it** (interaction-based):

```typescript
// GOOD: Tests the outcome (state-based)
const result = await listTasks({ sortBy: 'createdAt', sortOrder: 'desc' });
expect(result[0].createdAt).toBeGreaterThan(result[1].createdAt);

// BAD: Tests implementation details (interaction-based)  
expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY'));
```

Interaction-based tests break on refactoring even when behavior is unchanged.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll write tests after the code works" | You won't. Tests written after the fact test implementation, not behavior. |
| "This is too simple to test" | Simple code gets complicated. The test documents the expected behavior. |
| "Tests slow me down" | Tests slow you down now. They speed you up every time you change the code later. |
| "I tested it manually" | Manual testing doesn't persist. Tomorrow's change might break it with no way to know. |
| "It's just a prototype" | Prototypes become production code. Tests from day one prevent "test debt" crisis. |

## Red Flags

- Implementing any logic without a corresponding test
- Tests that pass on the first run (they may not be testing what you think)
- Bug fixes without a reproduction test that first failed
- Tests that verify internal method calls rather than observable behavior
- Skipping tests to make the suite pass
- Unit:Integration:E2E ratio far outside 70:20:10 without documented justification

## Verification

After the full test generation pipeline completes:

- [ ] Every new behavior has a corresponding test
- [ ] All tests pass: run the project's test command
- [ ] Bug fixes include a reproduction test that failed before the fix
- [ ] Test pyramid ratios are within target (Unit ~70% / Integration ~20% / E2E ~10%)
- [ ] No tests were skipped or disabled without documented reason
- [ ] `_workspace/05_test_review_report.md` exists with APPROVED/NEEDS_REVISION/BLOCKED verdict
