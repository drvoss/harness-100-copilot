---
name: fullstack-webapp
description: "Use when building a full-stack web application from scratch or adding major features — assembles architect, frontend-dev, backend-dev, qa-engineer, and devops-engineer to deliver complete code, tests, and deployment setup. Covers React/Next.js + Node.js/Python backends, PostgreSQL/MongoDB databases, and Vercel/AWS/Railway deployment. Does NOT cover mobile apps (React Native/Flutter), desktop apps, game development, or ML/AI model training."
metadata:
  category: harness
  harness: 16-fullstack-webapp
  agent_type: general-purpose
---

# Fullstack Web App — Full-Stack Development Pipeline

An agent team collaborates to develop web apps through requirements → design → frontend → backend → testing → deployment.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| architect | `agents/architect.md` | Requirements, architecture, DB, API design | general-purpose |
| frontend-dev | `agents/frontend-dev.md` | React/Next.js frontend implementation | general-purpose |
| backend-dev | `agents/backend-dev.md` | API, DB, auth, business logic | general-purpose |
| qa-engineer | `agents/qa-engineer.md` | Test strategy and automation | general-purpose |
| devops-engineer | `agents/devops-engineer.md` | CI/CD, deployment, monitoring | general-purpose |

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale
- [ ] All 5 agent files present in `agents/`
- [ ] User has provided app description with at least core features

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's web app request. Create _workspace/ and _workspace/messages/ directories. Extract: app description/purpose, core features, tech stack preferences, scale (MVP/small/medium/large), existing code (if any), deployment platform. Write organized input to _workspace/00_input.md with sections: APP_DESCRIPTION, CORE_FEATURES, TECH_PREFERENCES, SCALE, EXISTING_CODE, DEPLOYMENT_TARGET.")
```

## Phase 2: Architecture Design

### Step 2.1 — Architect
```
task(agent_type="general-purpose",
     description="You are the architect agent. Read agents/architect.md for your full instructions. Read _workspace/00_input.md. Design the system architecture: component diagram, technology stack selection, database schema, and API specification. Write to _workspace/01_architecture.md, _workspace/02_api_spec.md, _workspace/03_db_schema.md. Write handoff message to _workspace/messages/architect-to-all.md.")
```

## Phase 3: Parallel Development (after architecture)

### Step 3.1 — Frontend Developer
```
task(agent_type="general-purpose",
     description="You are the frontend-dev agent. Read agents/frontend-dev.md for your full instructions. Read _workspace/00_input.md, _workspace/01_architecture.md, _workspace/02_api_spec.md, and _workspace/messages/architect-to-all.md. Implement the complete frontend application. Write source code to src/ (frontend). Write handoff message to _workspace/messages/frontend-dev-to-qa.md.")
```

### Step 3.2 — Backend Developer
```
task(agent_type="general-purpose",
     description="You are the backend-dev agent. Read agents/backend-dev.md for your full instructions. Read _workspace/00_input.md, _workspace/01_architecture.md, _workspace/02_api_spec.md, _workspace/03_db_schema.md, and _workspace/messages/architect-to-all.md. Implement the complete backend API and database layer. Write source code to src/ (backend/api). Write handoff message to _workspace/messages/backend-dev-to-qa.md.")
```

### Step 3.3 — DevOps Engineer (deployment setup)
```
task(agent_type="general-purpose",
     description="You are the devops-engineer agent working on deployment setup. Read agents/devops-engineer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_architecture.md, and _workspace/messages/architect-to-all.md. Create Dockerfile, docker-compose.yml, and .github/workflows/ CI/CD pipeline. Write _workspace/05_deploy_guide.md. (QA test commands will be updated after QA phase.)")
```

## Phase 4: QA & Review

### Step 4.1 — QA Engineer
```
task(agent_type="general-purpose",
     description="You are the qa-engineer agent. Read agents/qa-engineer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_architecture.md, _workspace/02_api_spec.md, _workspace/messages/frontend-dev-to-qa.md, and _workspace/messages/backend-dev-to-qa.md. Write test strategy to _workspace/04_test_plan.md, write test code to src/. Review the frontend and backend code for bugs. Write message to _workspace/messages/qa-engineer-to-devops.md including all MUST_FIX items.")
```

### Step 4.2 — DevOps Final Review
```
task(agent_type="general-purpose",
     description="You are the devops-engineer agent doing final review. Read agents/devops-engineer.md for your full instructions. Read _workspace/messages/qa-engineer-to-devops.md. Update CI/CD pipeline with test commands from QA. Address any MUST_FIX items that affect deployment. Write final review report to _workspace/06_review_report.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Build me a web app" / "full stack" | Full Pipeline | All 5 |
| "Just build the API" | Backend Mode | architect + backend-dev + qa-engineer |
| "Build the frontend" (API exists) | Frontend Mode | architect + frontend-dev + qa-engineer |
| "Set up deployment" | DevOps Mode | devops-engineer |
| "Refactor this codebase" | Refactor Mode | architect + relevant-dev + qa-engineer |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Unclear requirements | Orchestrator extracts what it can, marks assumptions in 00_input.md |
| Frontend/backend API mismatch | QA engineer catches this; flag in messages/qa-engineer-to-devops.md |
| Test failures | QA marks MUST_FIX items; DevOps addresses in final review |

## Test Scenarios
1. **Normal case:** Complete app requirements provided → full pipeline produces working code + tests + deployment
2. **Existing code:** User provides existing codebase → architect analyzes, only needed agents run
3. **Partial request:** "Add auth to my app" → architect + backend-dev (auth focus) + qa-engineer
