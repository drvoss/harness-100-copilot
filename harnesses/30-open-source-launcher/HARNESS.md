# 30 — Open Source Launcher

Open source project launch harness: 4 specialist agents collaborate to define OSS strategy, write community documentation, configure CI/CD pipelines, and build a community launch plan using a file-based sequential pipeline.

## Structure

```
harnesses/30-open-source-launcher/
├── HARNESS.md                              (this file)
├── agents/
│   ├── oss-strategist.md                  License selection, governance, positioning
│   ├── readme-writer.md                   README, CONTRIBUTING, CoC, SECURITY docs
│   ├── ci-setup-specialist.md             GitHub Actions, release automation, semver
│   └── community-planner.md               Launch plan, issue templates, roadmap
└── skills/
    ├── open-source-launcher/SKILL.md      Orchestrator — pipeline coordination
    └── oss-checklist/SKILL.md             Supporting — launch checklist, license matrix
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| oss-strategist | License selection, governance, competitive positioning | `01_oss_strategy.md` |
| readme-writer | README, CONTRIBUTING, CoC, SECURITY docs | `02_documentation.md` |
| ci-setup-specialist | GitHub Actions, release automation, semantic versioning | `03_ci_setup.md` |
| community-planner | Launch plan, issue templates, roadmap | `04_community_plan.md` |

## Quick Start

```bash
cp -r harnesses/30-open-source-launcher/agents/ .github/agents/
cp -r harnesses/30-open-source-launcher/skills/ .github/skills/
```
Then ask Copilot: `Help me open source my project`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full OSS launch | Full Pipeline (all 4) | all |
| Strategy and documentation only | Reduced (2 agents) | oss-strategist → readme-writer |
| CI setup only | Single | ci-setup-specialist only |

## Usage

Trigger the `open-source-launcher` skill or make a natural language request:
- "Help me open source my project"
- "Launch my library as OSS"
- "Set up open source governance for my repo"
- "Create OSS community files for my project"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized project details and launch goals
- `01_oss_strategy.md` — License choice, governance model, competitive positioning
- `02_documentation.md` — README template, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- `03_ci_setup.md` — GitHub Actions workflows, release process, semantic versioning config
- `04_community_plan.md` — Launch checklist, issue/PR templates, roadmap, first-good-issue labels

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

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/30-open-source-launcher/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/30-open-source-launcher/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/30-open-source-launcher)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
