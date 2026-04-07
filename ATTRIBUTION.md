# Attribution

This project is adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100),
licensed under Apache License 2.0.

## Original Work

| Attribute | Value |
|-----------|-------|
| **Repository** | https://github.com/revfactory/harness-100 |
| **Author** | revfactory |
| **License** | Apache License 2.0 |
| **Description** | 100 production-grade agent team harnesses for Claude Code |

## Adapted Content

| This Project | Source | Key Changes |
|-------------|--------|-------------|
| `harnesses/16-fullstack-webapp/` | `en/16-fullstack-webapp/.claude/` | SendMessage → file bus |
| `harnesses/17-mobile-app-builder/` | `en/17-mobile-app-builder/.claude/` | SendMessage → file bus |
| `harnesses/18-api-designer/` | `en/18-api-designer/.claude/` | SendMessage → file bus |
| `harnesses/19-database-architect/` | `en/19-database-architect/.claude/` | SendMessage → file bus |
| `harnesses/20-cicd-pipeline/` | `en/20-cicd-pipeline/.claude/` | SendMessage → file bus |
| `harnesses/21-code-reviewer/` | `en/21-code-reviewer/.claude/` | SendMessage → file bus |
| `harnesses/22-legacy-modernizer/` | `en/22-legacy-modernizer/.claude/` | SendMessage → file bus |
| `harnesses/23-microservice-designer/` | `en/23-microservice-designer/.claude/` | SendMessage → file bus |
| `harnesses/24-test-automation/` | `en/24-test-automation/.claude/` | SendMessage → file bus |
| `harnesses/25-incident-postmortem/` | `en/25-incident-postmortem/.claude/` | SendMessage → file bus |
| `harnesses/26-infra-as-code/` | `en/26-infra-as-code/.claude/` | SendMessage → file bus |
| `harnesses/27-data-pipeline/` | `en/27-data-pipeline/.claude/` | SendMessage → file bus |
| `harnesses/28-security-audit/` | `en/28-security-audit/.claude/` | SendMessage → file bus |
| `harnesses/29-performance-optimizer/` | `en/29-performance-optimizer/.claude/` | SendMessage → file bus |
| `harnesses/30-open-source-launcher/` | `en/30-open-source-launcher/.claude/` | SendMessage → file bus |
| Agent definitions (`*.md`) | `.claude/agents/*.md` | Added Input/Output sections and Message Protocol sections for handoff-producing agents |
| Orchestrator skills (`SKILL.md`) | `.claude/skills/*/skill.md` | Replaced SendMessage with task() + file bus |

## Key Adaptation: SendMessage → File-Based Message Bus

The original harness-100 relies on Claude Code's `SendMessage(agent, content)` primitive,
which enables real-time cross-agent communication. GitHub Copilot CLI does not have this
primitive.

**Replacement strategy:**
1. Each agent writes output to `_workspace/{nn}_{name}.md` (same as original)
2. Each handoff-producing agent also writes a structured summary to `_workspace/messages/{from}-to-{to}.md`
3. The next agent reads the relevant message files before starting
4. The orchestrator sequences execution to respect dependencies

This achieves approximately **90% of the communication richness** at zero additional
infrastructure cost. See [PORTING-NOTES.md](PORTING-NOTES.md) for the full technical
explanation.

## What Was Not Changed

- Agent domain expertise (OWASP, DORA metrics, SOLID principles, etc.)
- Output artifact formats and templates
- Error handling strategies (retry/skip/fallback)
- Scale modes (Full / Reduced / Single-agent)
- Trigger boundaries (should-trigger / should-NOT-trigger)
- Quality gates per agent

## Attribution in Individual Harnesses

Each `HARNESS.md` file contains an Attribution section pointing to the specific
source harness in the original repository.
