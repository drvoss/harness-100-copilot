---
name: legacy-modernizer
description: "Use when modernizing a legacy codebase — analyzes legacy code, assesses migration risks, creates a modernization roadmap, produces refactoring guidance, and issues a go/no-go review. Covers legacy analysis, risk assessment, strangler fig planning, incremental refactoring, and final plan validation. Does NOT cover runtime testing execution, CI/CD pipeline setup, or post-migration monitoring configuration. Also triggers on: modernize this codebase, migrate legacy system, plan tech debt payoff, strangle this monolith, refactor legacy service."
metadata:
  category: harness
  harness: 22-legacy-modernizer
  agent_type: general-purpose
---

# Legacy Modernizer — Legacy System Modernization Pipeline

A five-agent team analyzes legacy code, assesses migration risk, plans a modernization roadmap, produces incremental refactoring guidance, and issues a final go/no-go review.

## Execution Mode

**Pipeline with Shared State** — Agents execute in sequence. `01_legacy_analysis.md` is written by `code-archaeologist` and read by all subsequent agents. Point-to-point handoffs use `_workspace/messages/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| code-archaeologist | `agents/code-archaeologist.md` | Legacy code analysis, anti-patterns, dependency graph | general-purpose |
| risk-assessor | `agents/risk-assessor.md` | Migration risk matrix, breaking changes, testing gaps | general-purpose |
| modernization-planner | `agents/modernization-planner.md` | Roadmap, technology selection, strangler fig phases | general-purpose |
| refactor-specialist | `agents/refactor-specialist.md` | Before/after examples, DI introduction, interfaces | general-purpose |
| migration-reviewer | `agents/migration-reviewer.md` | Final go/no-go, completeness check, Phase 1 criteria | general-purpose |

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Legacy system description, current tech stack, and goals are available
- [ ] Access to legacy codebase (file paths or repository) confirmed

## Workspace Layout

```
_workspace/
├── 00_input.md              (legacy system description, tech stack, goals, constraints)
├── 01_legacy_analysis.md    (code-archaeologist output — SHARED by all subsequent agents)
├── 02_risk_assessment.md    (risk-assessor output)
├── 03_modernization_plan.md (modernization-planner output)
├── 04_refactoring_guide.md  (refactor-specialist output)
├── 05_migration_review.md   (migration-reviewer output — TERMINAL)
└── messages/
    ├── code-archaeologist-to-risk-assessor.md
    ├── risk-assessor-to-modernization-planner.md
    ├── modernization-planner-to-refactor-specialist.md
    └── refactor-specialist-to-migration-reviewer.md
```

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's legacy modernization request. Create _workspace/ and _workspace/messages/ directories. Extract: legacy system name and description, current tech stack (language/framework/database), modernization goals, constraints (timeline/budget/team size), any existing architectural documentation. Write organized input to _workspace/00_input.md with sections: SYSTEM_NAME, TECH_STACK, GOALS, CONSTRAINTS, EXISTING_DOCS.")
```

## Phase 2: Pipeline Execution

### Step 2.1 — Code Archaeologist
```
task(agent_type="general-purpose",
     description="You are the code-archaeologist agent in the legacy-modernizer harness. Read agents/code-archaeologist.md for your full instructions. Read _workspace/00_input.md for the legacy system description and code paths. Analyze the legacy codebase: document anti-patterns (God Object, Big Ball of Mud, Feature Envy), measure cyclomatic complexity (flag >10 as high risk, >20 as critical), build the Efferent/Afferent coupling map, identify circular dependencies, rank tech debt hotspots, and catalog undocumented components. Write your full findings to _workspace/01_legacy_analysis.md. Write handoff to _workspace/messages/code-archaeologist-to-risk-assessor.md with: STATUS: COMPLETE, FINDINGS: [top anti-patterns, top 3 hotspots, critical circular dependencies], COMPLEXITY_HOTSPOTS: [function/class: complexity=score, file=path], HIGH_COUPLING_MODULES: [module: Ce=n, Ca=n, instability=I], UNDOCUMENTED_CRITICAL_PATHS: [component: why it matters].")
```

### Step 2.2 — Risk Assessor (reads from 2.1)
```
task(agent_type="general-purpose",
     description="You are the risk-assessor agent in the legacy-modernizer harness. Read agents/risk-assessor.md for your full instructions. Read _workspace/00_input.md, _workspace/01_legacy_analysis.md (shared legacy analysis), and _workspace/messages/code-archaeologist-to-risk-assessor.md. Build the migration risk register: score all risks on likelihood (1-5) × impact (1-5), catalog all breaking changes to APIs/schemas, map testing coverage gaps, estimate DORA change failure rate, score regression risk per module using (Complexity×0.3 + Coupling×0.3 + (100-Coverage%)×0.4), and define pre-migration gates. Write full findings to _workspace/02_risk_assessment.md. Write handoff to _workspace/messages/risk-assessor-to-modernization-planner.md with: STATUS: COMPLETE, FINDINGS: [top 3 critical risks with scores, DORA estimate], CRITICAL_RISKS: [name: score=n, mitigation=action], TESTING_GAPS: [module: coverage=current%, required=target%], BREAKING_CHANGES: [component: type, consumers=n], PRE_MIGRATION_GATES: [gate: criterion].")
```

### Step 2.3 — Modernization Planner (reads from 2.2)
```
task(agent_type="general-purpose",
     description="You are the modernization-planner agent in the legacy-modernizer harness. Read agents/modernization-planner.md for your full instructions. Read _workspace/00_input.md, _workspace/01_legacy_analysis.md (shared legacy analysis), _workspace/02_risk_assessment.md, and _workspace/messages/risk-assessor-to-modernization-planner.md. Create the modernization roadmap: select and justify migration strategy (Strangler Fig vs Big Bang vs Branch-by-Abstraction), evaluate technology options with TCO and team ramp-up estimates, define Strangler Fig phases with measurable exit criteria and rollback plans, design the anti-corruption layer interfaces, and map every critical risk to a specific phase mitigation. Write the complete roadmap to _workspace/03_modernization_plan.md. Write handoff to _workspace/messages/modernization-planner-to-refactor-specialist.md with: STATUS: COMPLETE, FINDINGS: [strategy, phase count, duration], PHASE_SEQUENCE: [phase: goal — exit criterion], HIGH_PRIORITY_MODULES: [module: reason], TECHNOLOGY_DECISIONS: [component: technology, reason], ANTI_CORRUPTION_LAYER: [legacy concept: maps to new concept].")
```

### Step 2.4 — Refactor Specialist (reads from 2.3)
```
task(agent_type="general-purpose",
     description="You are the refactor-specialist agent in the legacy-modernizer harness. Read agents/refactor-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_legacy_analysis.md (shared legacy analysis), _workspace/03_modernization_plan.md, and _workspace/messages/modernization-planner-to-refactor-specialist.md. Produce the incremental refactoring guide: map every anti-pattern to a Fowler refactoring technique, provide concrete before/after code examples for every Phase 0 and Phase 1 hotspot, write characterization test (Golden Master) setup instructions for all untested modules, provide DI extraction steps for hardwired dependencies, and define minimal interfaces for the anti-corruption layer. Write the full guide to _workspace/04_refactoring_guide.md. Write handoff to _workspace/messages/refactor-specialist-to-migration-reviewer.md with: STATUS: COMPLETE, FINDINGS: [total steps, estimated effort, key sequencing risks], PHASE0_REFACTORINGS: [step: technique, risk, checkpoint], PHASE1_REFACTORINGS: [step: technique, risk, checkpoint], TEST_HARNESS_REQUIRED: [module: setup provided], INTERFACES_EXTRACTED: [interface: purpose], OPEN_QUESTIONS: [any ambiguity].")
```

## Phase 3: Final Review (Terminal)

### Step 3.1 — Migration Reviewer
```
task(agent_type="general-purpose",
     description="You are the migration-reviewer agent in the legacy-modernizer harness. Read agents/migration-reviewer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_legacy_analysis.md (shared legacy analysis), _workspace/02_risk_assessment.md, _workspace/03_modernization_plan.md, _workspace/04_refactoring_guide.md, and _workspace/messages/refactor-specialist-to-migration-reviewer.md. Perform cross-file validation: build component coverage table (every component from 01 addressed in 03 and 04?), verify rollback plan for every production-touching phase, trace every critical/high risk from 02 to mitigation in 03 or 04, verify every testing gap from 02 resolved in 04. Issue APPROVED / APPROVED_WITH_CONDITIONS / REJECTED with explicit conditions traceable to specific findings. List Phase 1 approval criteria. Write final report to _workspace/05_migration_review.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full modernization request | Full Pipeline | All 5 agents |
| "Analyze legacy code only" | Analysis Mode | code-archaeologist only |
| "Risk assessment only" | Risk Mode | code-archaeologist → risk-assessor |
| "Create migration plan" | Planning Mode | code-archaeologist → risk-assessor → modernization-planner |
| "Review existing plan" | Review Mode | migration-reviewer (reads existing workspace) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; migration-reviewer notes "unavailable" and issues REJECTED if critical file missing |
| Ambiguous system description | Apply most common pattern (monolith modernization); document assumptions in `00_input.md` |
| No access to legacy codebase | Code-archaeologist works from description in `00_input.md`; flags all findings as "estimated" |
| Conflicting risk/plan findings | Migration-reviewer resolves; escalate to user only if genuinely unresolvable |
| `_workspace/` conflict | Append `-2` suffix to output directory; document in `05_migration_review.md` |

## Test Scenarios
1. **Normal case:** Legacy Java monolith description + file paths → full pipeline → APPROVED_WITH_CONDITIONS with 3 phases and 8 refactoring steps
2. **Analysis only:** "Just tell me what's wrong with this code" → code-archaeologist only → `01_legacy_analysis.md` with hotspot ranking
3. **Error case:** No codebase access → code-archaeologist estimates from description, flags all findings as unverified → migration-reviewer issues APPROVED_WITH_CONDITIONS with verification as a blocking condition
