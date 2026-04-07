---
name: open-source-launcher
description: "Use when launching a new open source project or formalizing an existing private repo as OSS — dispatches oss-strategist, readme-writer, ci-setup-specialist, and community-planner in sequence to produce a complete OSS launch kit. Covers license selection, governance, all community health files, GitHub Actions CI/CD, semantic versioning, issue templates, and a community launch plan. Does NOT cover backend API design, application feature development, or post-launch maintenance automation. Also triggers on: open source my project, set up OSS governance, create community files, launch my library."
metadata:
  category: harness
  harness: 30-open-source-launcher
  agent_type: general-purpose
---

# Open Source Launcher — OSS Project Launch Pipeline

A 4-agent sequential pipeline that transforms a project description into a complete open source launch kit: license, governance, documentation, CI/CD, and community plan.

## Execution Mode

**File-Bus Pipeline** — Agents execute in sequence; each writes output to `_workspace/` and passes a handoff message to the next agent via `_workspace/messages/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| oss-strategist | `agents/oss-strategist.md` | License selection, governance, positioning | general-purpose |
| readme-writer | `agents/readme-writer.md` | README, CONTRIBUTING, CoC, SECURITY docs | general-purpose |
| ci-setup-specialist | `agents/ci-setup-specialist.md` | GitHub Actions workflows, release automation | general-purpose |
| community-planner | `agents/community-planner.md` | Issue templates, roadmap, launch campaign | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md              (project name, language, goals, target community)
├── 01_oss_strategy.md       (oss-strategist output: license, governance, positioning)
├── 02_documentation.md      (readme-writer output: all doc templates)
├── 03_ci_setup.md           (ci-setup-specialist output: workflow files, release process)
├── 04_community_plan.md     (community-planner output: launch plan, templates)
└── messages/
    ├── oss-strategist-to-readme-writer.md
    ├── readme-writer-to-ci-setup-specialist.md
    └── ci-setup-specialist-to-community-planner.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 4 agent files present in `agents/`
- [ ] Project name, primary language, and launch goals available

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's open source launch request. Create _workspace/ and _workspace/messages/ directories. Extract: project name, primary language/ecosystem, project description, target community (enterprise/hobbyist/both), known dependencies and their licenses, any existing license preferences, launch timeline. Write organized input to _workspace/00_input.md with sections: PROJECT_NAME, LANGUAGE, DESCRIPTION, TARGET_COMMUNITY, KNOWN_DEPENDENCIES, LICENSE_PREFERENCES, LAUNCH_TIMELINE, GOALS.")
```

## Phase 2: Sequential Pipeline

### Step 2.1 — OSS Strategist

```
task(agent_type="general-purpose",
     description="You are the oss-strategist agent in the open-source-launcher harness. Read agents/oss-strategist.md for your full instructions. Read _workspace/00_input.md for the project details. Analyze the project's dependency licenses, evaluate MIT vs Apache 2.0 vs GPL trade-offs for the stated goals and target community, select a governance model appropriate for the current team size, and produce competitive positioning. Write your full strategy to _workspace/01_oss_strategy.md. Write handoff to _workspace/messages/oss-strategist-to-readme-writer.md with: STATUS: COMPLETE, FINDINGS: (license recommendation, governance model, CLA/DCO decision), LICENSE_FOR_CI: (SPDX identifier), GOVERNANCE_DOCS_NEEDED: (list of files), COMPATIBILITY_WARNINGS: (any dependency conflicts).")
```

### Step 2.2 — README Writer (reads message from 2.1)

```
task(agent_type="general-purpose",
     description="You are the readme-writer agent in the open-source-launcher harness. Read agents/readme-writer.md for your full instructions. Read _workspace/00_input.md and _workspace/01_oss_strategy.md. Read _workspace/messages/oss-strategist-to-readme-writer.md for LICENSE_FOR_CI, GOVERNANCE_DOCS_NEEDED, and COMPATIBILITY_WARNINGS. Write complete documentation templates (README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, and GOVERNANCE.md if needed) to _workspace/02_documentation.md. Write handoff to _workspace/messages/readme-writer-to-ci-setup-specialist.md with: STATUS: COMPLETE, FINDINGS: (sections completed), BADGE_PLACEHOLDERS: (workflow file names referenced in README badges), CI_WORKFLOW_NAMES_NEEDED: (exact filenames), RELEASE_TAG_FORMAT: (tag pattern).")
```

### Step 2.3 — CI Setup Specialist (reads message from 2.2)

```
task(agent_type="general-purpose",
     description="You are the ci-setup-specialist agent in the open-source-launcher harness. Read agents/ci-setup-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_oss_strategy.md, and _workspace/02_documentation.md. Read _workspace/messages/readme-writer-to-ci-setup-specialist.md for CI_WORKFLOW_NAMES_NEEDED, BADGE_PLACEHOLDERS, and RELEASE_TAG_FORMAT. Author GitHub Actions workflows (ci.yml, release.yml, dependabot.yml), configure semantic-release or changesets matching the project ecosystem, and document required secrets and branch protection rules. Write all workflow YAML and configuration to _workspace/03_ci_setup.md. Write handoff to _workspace/messages/ci-setup-specialist-to-community-planner.md with: STATUS: COMPLETE, FINDINGS: (workflow summary), AUTOMATION_HIGHLIGHTS: (key automations for onboarding docs), LABELS_FOR_COMMUNITY: (label names from CI), REQUIRED_SECRETS: (secrets needed before launch).")
```

### Step 2.4 — Community Planner (reads message from 2.3)

```
task(agent_type="general-purpose",
     description="You are the community-planner agent in the open-source-launcher harness. Read agents/community-planner.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_oss_strategy.md, _workspace/02_documentation.md, _workspace/03_ci_setup.md. Read _workspace/messages/ci-setup-specialist-to-community-planner.md for AUTOMATION_HIGHLIGHTS, LABELS_FOR_COMMUNITY, and REQUIRED_SECRETS. Create issue templates (bug, feature, question), PR template, GitHub Discussions category structure, full label taxonomy, roadmap with first-good-issue candidates, and a sequenced pre-launch and post-launch campaign plan. Write everything to _workspace/04_community_plan.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Launch my OSS project" / full launch | Full Pipeline | All 4 |
| "Which license should I use?" | License Mode | oss-strategist only |
| "Write my README" | Docs Mode | oss-strategist → readme-writer |
| "Set up CI for my OSS project" | CI Mode | oss-strategist → readme-writer → ci-setup-specialist |
| "Create community templates" | Community Mode | community-planner (with manual input) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; next agent notes "unavailable" for that input and uses defaults |
| Ambiguous license preference | Default to Apache 2.0 for libraries, MIT for scripts/tools; document assumption in `00_input.md` |
| No dependency information | Assume all dependencies are permissive; flag assumption in `01_oss_strategy.md` |
| Unknown ecosystem | Use Node.js/npm patterns as baseline; note alternative tooling in `03_ci_setup.md` |
| `_workspace/` already populated | Append `-2` suffix to output files; document in `04_community_plan.md` |

## Test Scenarios
1. **Normal case:** User provides project name, language (Node.js), and target community (open source developers) → all 4 agents produce outputs; `04_community_plan.md` includes complete pre-launch checklist referencing CI secrets from `03_ci_setup.md`
2. **Existing license:** User specifies "we must use MIT" → oss-strategist skips comparative analysis, confirms compatibility, passes MIT to downstream agents
3. **Error case:** ci-setup-specialist output missing → community-planner notes "CI details unavailable" in launch checklist but still produces all community templates
