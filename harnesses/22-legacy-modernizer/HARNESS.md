# 22 — Legacy Modernizer

Legacy system modernization harness: five specialist agents analyze legacy code, assess migration risks, plan modernization phases, provide refactoring guidance, and produce a final go/no-go review.

## Structure

```
harnesses/22-legacy-modernizer/
├── HARNESS.md                                   (this file)
├── agents/
│   ├── code-archaeologist.md                    Legacy code analysis: patterns, dependencies, tech debt hotspots
│   ├── risk-assessor.md                         Migration risk matrix: breaking changes, business continuity, testing gaps
│   ├── modernization-planner.md                 Modernization roadmap: phases, technology selection, strangler fig strategy
│   ├── refactor-specialist.md                   Incremental refactoring: before/after examples, pattern catalog
│   └── migration-reviewer.md                    Final review: completeness checklist, go/no-go with conditions
└── skills/
    ├── legacy-modernizer/SKILL.md               Orchestrator — team coordination, workflow, error handling
    ├── strangler-fig-pattern/SKILL.md           Strangler Fig implementation guide, anti-corruption layer
    └── technical-debt-assessment/SKILL.md       Tech debt quantification, SQALE model
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| code-archaeologist | Analyzes legacy code: patterns, dependencies, tech debt hotspots | `01_legacy_analysis.md` |
| risk-assessor | Migration risk matrix: breaking changes, business continuity | `02_risk_assessment.md` |
| modernization-planner | Modernization roadmap: phases, technology selection | `03_modernization_plan.md` |
| refactor-specialist | Incremental refactoring: before/after examples, pattern catalog | `04_refactoring_guide.md` |
| migration-reviewer | Final review: completeness checklist, go/no-go decision | `05_migration_review.md` |

## Quick Start

```bash
cp -r harnesses/22-legacy-modernizer/agents/ .github/agents/
cp -r harnesses/22-legacy-modernizer/skills/ .github/skills/
```
Then ask Copilot: `Help me modernize this legacy Java monolith`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full modernization roadmap | Full Pipeline (all 5) | all |
| Risk assessment only | Reduced (2 agents) | code-archaeologist → risk-assessor |
| Quick refactoring tips | Single | refactor-specialist only |

## Usage

Trigger the `legacy-modernizer` skill or make a natural language request:
- "Help me modernize this legacy Java monolith"
- "Assess migration risk for our PHP 5 application"
- "Create a modernization roadmap for our codebase"
- "Plan a strangler fig migration for our legacy system"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Legacy system description, current tech stack, goals, constraints
- `01_legacy_analysis.md` — Code archaeology findings (**SHARED** by all subsequent agents)
- `02_risk_assessment.md` — Migration risk assessment
- `03_modernization_plan.md` — Modernization roadmap and phase plan
- `04_refactoring_guide.md` — Incremental refactoring recommendations
- `05_migration_review.md` — Final go/no-go decision with conditions

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/22-legacy-modernizer/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/22-legacy-modernizer/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/22-legacy-modernizer) under Apache 2.0 License. Key adaptation: SendMessage broadcast replaced with shared workspace file (`01_legacy_analysis.md`) read by all subsequent agents.
