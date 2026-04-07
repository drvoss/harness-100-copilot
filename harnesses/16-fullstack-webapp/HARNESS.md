# 16 — Fullstack Web App

Full-stack web application harness: an agent team collaborates through requirements analysis, architecture design, frontend development, backend development, testing, and deployment.

## Structure

```
harnesses/16-fullstack-webapp/
├── HARNESS.md                              (this file)
├── agents/
│   ├── architect.md                        System design: requirements, architecture, DB, API design
│   ├── frontend-dev.md                     Frontend: React/Next.js, UI components, state management
│   ├── backend-dev.md                      Backend: API, DB, auth, business logic
│   ├── qa-engineer.md                      QA: test strategy, unit/integration/E2E tests
│   └── devops-engineer.md                  DevOps: CI/CD, infrastructure, deployment, monitoring
└── skills/
    ├── fullstack-webapp/SKILL.md           Orchestrator — team coordination, workflow, error handling
    ├── component-patterns/SKILL.md         Frontend extension — React patterns, state management
    └── api-security-checklist/SKILL.md     Backend extension — OWASP Top 10, auth, security headers
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| architect | System design: requirements, architecture, DB, API design | `01_architecture.md` |
| frontend-dev | Frontend: React/Next.js, UI components, state management | `src/frontend/` |
| backend-dev | Backend: API, DB, auth, business logic | `02_api_spec.md` |
| qa-engineer | QA: test strategy, unit/integration/E2E tests | `04_test_plan.md` |
| devops-engineer | DevOps: CI/CD, infrastructure, deployment, monitoring | `05_deploy_guide.md` |

## Quick Start

```bash
cp -r harnesses/16-fullstack-webapp/agents/ .github/agents/
cp -r harnesses/16-fullstack-webapp/skills/ .github/skills/
```
Then ask Copilot: `Build me a web app that does X`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full web app build | Full Pipeline (all 5) | all |
| Design and API only | Reduced (2 agents) | architect → backend-dev |
| Frontend only | Single | frontend-dev only |

## Usage

Trigger the `fullstack-webapp` skill or make a natural language request:
- "Build me a web app that does X"
- "Create a SaaS dashboard for Y"
- "Add authentication to my Next.js app"
- "Build a REST API for Z"

## Workspace Artifacts

Workspace documents are saved in `_workspace/`; source code is written to the project root:
- `_workspace/00_input.md` — Organized requirements
- `_workspace/01_architecture.md` — Architecture design document
- `_workspace/02_api_spec.md` — API specification
- `_workspace/03_db_schema.md` — Database schema
- `_workspace/04_test_plan.md` — Test plan
- `_workspace/05_deploy_guide.md` — Deployment guide
- `_workspace/06_review_report.md` — Review report
- `src/` — Source code (frontend + backend), at project root

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/16-fullstack-webapp/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/16-fullstack-webapp/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/16-fullstack-webapp)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
