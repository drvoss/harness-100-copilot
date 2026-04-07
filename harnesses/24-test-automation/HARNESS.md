# 24 — Test Automation

Automated test generation harness: a 5-agent pipeline produces a complete test suite — strategy, unit tests, integration tests, E2E tests, and a final review report — from a description of the project's tech stack and coverage goals.

## Structure

```
harnesses/24-test-automation/
├── HARNESS.md                                  (this file)
├── agents/
│   ├── test-strategist.md                      Test strategy: pyramid, coverage targets, risk matrix
│   ├── unit-test-writer.md                     Unit tests: AAA pattern, mocking, isolation
│   ├── integration-test-writer.md              Integration tests: DB, API contracts, service boundaries
│   ├── e2e-test-writer.md                      E2E tests: Playwright/Cypress, page objects, journeys
│   └── test-reviewer.md                        Review: coverage gaps, flaky tests, quality assessment
└── skills/
    ├── test-automation/SKILL.md                Orchestrator — pipeline coordination, sequencing
    ├── test-coverage-strategy/SKILL.md         Coverage metrics, mutation testing, thresholds
    └── testing-patterns/SKILL.md               Testing patterns: given/when/then, test doubles
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| test-strategist | Test strategy: pyramid, coverage targets, risk matrix | `01_test_strategy.md` |
| unit-test-writer | Unit tests: AAA pattern, mocking, isolation | `02_unit_tests.md` |
| integration-test-writer | Integration tests: DB, API contracts, service boundaries | `03_integration_tests.md` |
| e2e-test-writer | E2E tests: Playwright/Cypress, page objects, journeys | `04_e2e_tests.md` |
| test-reviewer | Review: coverage gaps, flaky tests, quality assessment | `05_test_review_report.md` |

## Quick Start

```bash
cp -r harnesses/24-test-automation/agents/ .github/agents/
cp -r harnesses/24-test-automation/skills/ .github/skills/
```
Then ask Copilot: `Generate a full test suite for this service`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full test suite generation | Full Pipeline (all 5) | all |
| Unit tests only | Reduced (2 agents) | test-strategist → unit-test-writer |
| Coverage review only | Single | test-reviewer only |

## Usage

Trigger the `test-automation` skill or make a natural language request:
- "Write tests for my Express API"
- "Generate a full test suite for this service"
- "Add integration tests for the payment module"
- "Review our test coverage and find gaps"
- "Write E2E tests for the checkout flow"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Project tech stack, existing coverage, priority areas
- `01_test_strategy.md` — Test pyramid, coverage targets, risk matrix
- `02_unit_tests.md` — Unit test implementations (AAA, mocks, isolation)
- `03_integration_tests.md` — Integration test implementations (DB, API, containers)
- `04_e2e_tests.md` — E2E test implementations (Playwright/Cypress, page objects)
- `05_test_review_report.md` — Final review: gaps, quality, recommendations
- `messages/test-strategist-to-unit-test-writer.md`
- `messages/unit-test-writer-to-integration-test-writer.md`
- `messages/integration-test-writer-to-e2e-test-writer.md`
- `messages/e2e-test-writer-to-test-reviewer.md`

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/24-test-automation/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/24-test-automation/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/24-test-automation)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
