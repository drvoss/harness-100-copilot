# 20 — CI/CD Pipeline

CI/CD pipeline harness: an agent team collaborates to design, build, monitor, and optimize CI/CD pipelines for any tech stack.

## Structure

```
harnesses/20-cicd-pipeline/
├── HARNESS.md                              (this file)
├── agents/
│   ├── pipeline-designer.md                Pipeline design: stages, triggers, branch strategies
│   ├── infra-engineer.md                   Infrastructure: runners, containers, env vars, secrets
│   ├── monitoring-specialist.md            Monitoring: metrics, alerts, dashboards, SLA
│   ├── security-scanner.md                 Security: SAST, DAST, dependencies, containers
│   └── pipeline-reviewer.md                Review: efficiency, reliability, security, alignment
└── skills/
    ├── cicd-pipeline/SKILL.md              Orchestrator — team coordination, workflow, error handling
    ├── pipeline-security-gates/SKILL.md    Security extension — SAST/SCA/secret detection, gate placement
    └── deployment-strategies/SKILL.md     Pipeline extension — Blue-Green/Canary/Rolling, DORA metrics
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| pipeline-designer | Pipeline design: stages, triggers, branch strategies | `01_pipeline_design.md` |
| infra-engineer | Infrastructure: runners, containers, env vars, secrets | `02_pipeline_config/` |
| monitoring-specialist | Monitoring: metrics, alerts, dashboards, SLA | `03_monitoring.md` |
| security-scanner | Security: SAST, DAST, dependencies, containers | `04_security_scan.md` |
| pipeline-reviewer | Review: efficiency, reliability, security, alignment | `05_review_report.md` |

## Quick Start

```bash
cp -r harnesses/20-cicd-pipeline/agents/ .github/agents/
cp -r harnesses/20-cicd-pipeline/skills/ .github/skills/
```
Then ask Copilot: `Create a CI/CD pipeline for my Node.js app`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full CI/CD pipeline build | Full Pipeline (all 5) | all |
| Pipeline design and infrastructure | Reduced (2 agents) | pipeline-designer → infra-engineer |
| Security scanning only | Single | security-scanner only |

## Usage

Trigger the `cicd-pipeline` skill or make a natural language request:
- "Create a CI/CD pipeline for my Node.js app"
- "Set up GitHub Actions for Python project"
- "Add security scanning to our pipeline"
- "Optimize our CI build time"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized pipeline requirements
- `01_pipeline_design.md` — Pipeline design document
- `02_pipeline_config/` — Pipeline configuration files (YAML + Markdown)
- `03_monitoring.md` — Monitoring design document
- `04_security_scan.md` — Security scan configuration and report
- `05_review_report.md` — Pipeline review report

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/20-cicd-pipeline/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/20-cicd-pipeline/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/20-cicd-pipeline)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
