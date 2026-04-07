---
name: test-coverage-strategy
description: "Use when you need to define or improve test coverage metrics, set mutation testing targets, or analyze coverage reports — provides coverage threshold recommendations, mutation testing setup, and gap analysis patterns."
metadata:
  category: skill
  harness: 24-test-automation
  agent_type: general-purpose
---

# Test Coverage Strategy — Coverage Metrics & Mutation Testing

A supporting skill that provides deep expertise in test coverage measurement, threshold setting, mutation testing configuration, and coverage gap analysis.

## When to Use

- Setting coverage thresholds for a new project or CI pipeline
- Interpreting an existing coverage report and identifying meaningful gaps
- Configuring mutation testing tools (Stryker, PIT, mutmut)
- Evaluating whether current coverage levels are adequate for the risk profile
- Augmenting the `test-automation` orchestrator with detailed coverage guidance

## Core Concepts

### Coverage Metric Hierarchy

From weakest to strongest signal:

| Metric | What It Measures | Blind Spot |
|--------|-----------------|------------|
| Line coverage | Lines executed | Branch outcomes |
| Statement coverage | Statements executed | Near-identical to line coverage |
| Branch coverage | All if/else paths executed | Complex boolean combinations |
| Path coverage | All unique execution paths | Exponential for large functions |
| Mutation score | Tests that detect real code changes | Slow to compute |

**Recommendation:** Use branch coverage as the standard metric; use mutation score for critical modules.

### Coverage Targets by Risk Level

| Risk Level | Examples | Line | Branch | Mutation |
|-----------|---------|------|--------|----------|
| Critical | Payment, auth, data migration | 95% | 90% | 75% |
| High | Core business logic, APIs | 85% | 80% | 65% |
| Standard | CRUD services, utilities | 75% | 70% | 55% |
| Low | Config, logging, DTOs | 60% | 50% | N/A |

### Mutation Testing

Mutation testing introduces small code changes (mutants) and verifies that at least one test fails. If tests pass despite the mutation, the tests are ineffective for that path.

#### Common Mutation Operators
| Operator | Example | Catches |
|---------|---------|---------|
| Arithmetic replacement | `+` → `-` | Missing operator tests |
| Conditional boundary | `>` → `>=` | Off-by-one errors |
| Negation | `if (x)` → `if (!x)` | Inverted logic |
| Return value | `return true` → `return false` | Unchecked return values |
| Void method removal | Removes entire method call | Side-effect verification |

#### Tool Configuration

**Stryker (JavaScript/TypeScript):**
```json
{
  "mutate": ["src/**/*.ts", "!src/**/*.spec.ts"],
  "thresholds": { "high": 80, "low": 60, "break": 50 },
  "reporters": ["html", "clear-text", "progress"],
  "testRunner": "jest"
}
```

**PIT (Java):**
```xml
<plugin>
  <groupId>org.pitest</groupId>
  <artifactId>pitest-maven</artifactId>
  <configuration>
    <targetClasses>com.example.core.*</targetClasses>
    <mutationThreshold>65</mutationThreshold>
    <coverageThreshold>80</coverageThreshold>
  </configuration>
</plugin>
```

**mutmut (Python):**
```bash
mutmut run --paths-to-mutate=src/ --runner="pytest -x"
mutmut results
```

### Interpreting Coverage Reports

**High line coverage, low mutation score:**
- Tests execute the code but do not assert outcomes
- Fix: Add assertion-focused tests; use `verify()` on mocks
- Example smell: `assert result is not None` (too weak)

**Low branch coverage despite high line coverage:**
- `if/else` branches have only the happy path covered
- Fix: Add tests for every condition outcome, including `else` and exception paths

**Coverage cliff (module suddenly drops):**
- Often signals a new module added without tests
- Fix: Enforce per-file coverage thresholds in CI

### CI Coverage Enforcement

**Jest (coverage threshold in `package.json`):**
```json
{
  "jest": {
    "coverageThreshold": {
      "global": { "branches": 75, "lines": 80, "functions": 80 },
      "./src/payments/": { "branches": 90, "lines": 95 }
    }
  }
}
```

**JaCoCo (Java, fail build below threshold):**
```xml
<rule>
  <element>BUNDLE</element>
  <limits>
    <limit><counter>BRANCH</counter><value>COVEREDRATIO</value><minimum>0.75</minimum></limit>
    <limit><counter>LINE</counter><value>COVEREDRATIO</value><minimum>0.80</minimum></limit>
  </limits>
</rule>
```

**Coverage.py (Python):**
```ini
[coverage:report]
fail_under = 80
show_missing = true
```

## Usage in Pipeline

This skill is invoked by the `test-automation` orchestrator's `test-strategist` agent for detailed coverage target guidance, and by `test-reviewer` for final coverage gap analysis.

It can also be invoked standalone:
```
task(agent_type="general-purpose",
     description="You are using the test-coverage-strategy skill. Read skills/test-coverage-strategy/SKILL.md. Analyze the existing coverage report at [path]. Identify gaps by risk level. Recommend thresholds and mutation testing setup for this project. Write findings to _workspace/coverage-analysis.md.")
```
