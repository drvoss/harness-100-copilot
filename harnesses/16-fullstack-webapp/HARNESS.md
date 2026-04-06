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

## Usage

Trigger the `fullstack-webapp` skill or make a natural language request:
- "Build me a web app that does X"
- "Create a SaaS dashboard for Y"
- "Add authentication to my Next.js app"
- "Build a REST API for Z"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized requirements
- `01_architecture.md` — Architecture design document
- `02_api_spec.md` — API specification
- `03_db_schema.md` — Database schema
- `04_test_plan.md` — Test plan
- `05_deploy_guide.md` — Deployment guide
- `06_review_report.md` — Review report
- `src/` — Source code (frontend + backend)

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/16-fullstack-webapp/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/16-fullstack-webapp/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/16-fullstack-webapp)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
