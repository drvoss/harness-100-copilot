---
name: cicd-pipeline
description: "Use when designing, building, or optimizing a CI/CD pipeline — assembles a team of pipeline-designer, infra-engineer, monitoring-specialist, and security-scanner to deliver a complete pipeline design with YAML configs, monitoring setup, and security gates. Covers GitHub Actions, GitLab CI, Jenkins, CircleCI, and Azure DevOps. Does NOT cover Kubernetes operators, service meshes, or production infrastructure provisioning beyond pipeline scope. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: harness
  harness: 20-cicd-pipeline
  agent_type: general-purpose
---

# CI/CD Pipeline — Pipeline Engineering Team

An agent team collaborates to design, implement, and review CI/CD pipelines through requirements analysis, design, infrastructure setup, monitoring, and security integration.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| pipeline-designer | `agents/pipeline-designer.md` | Stages, triggers, branch strategy | general-purpose |
| infra-engineer | `agents/infra-engineer.md` | Runners, containers, secrets | general-purpose |
| monitoring-specialist | `agents/monitoring-specialist.md` | Metrics, alerts, dashboards, SLA | general-purpose |
| security-scanner | `agents/security-scanner.md` | SAST, SCA, container scan, secrets | general-purpose |
| pipeline-reviewer | `agents/pipeline-reviewer.md` | Final review and recommendations | general-purpose |

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale
- [ ] All 5 agent files present in `agents/`
- [ ] Tech stack and target CI platform identified

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's CI/CD pipeline request. Create _workspace/ and _workspace/messages/ and _workspace/02_pipeline_config/ directories. Extract: tech stack, target CI platform (GitHub Actions/GitLab/Jenkins/etc.), deployment targets, environments (dev/staging/prod), compliance requirements, existing pipeline (if any). Write organized input to _workspace/00_input.md.")
```

## Phase 2: Pipeline Design

### Step 2.1 — Pipeline Designer
```
task(agent_type="general-purpose",
     description="You are the pipeline-designer agent. Read agents/pipeline-designer.md for your full instructions. Read _workspace/00_input.md. Design the complete CI/CD pipeline: stages, triggers, branch strategy, parallelization, and caching. Write pipeline design to _workspace/01_pipeline_design.md and YAML configurations to _workspace/02_pipeline_config/. Write message to _workspace/messages/pipeline-designer-to-pipeline-reviewer.md.")
```

## Phase 3: Sequential Specialist Work (file-bus port of original parallel step)

### Step 3.1 — Infrastructure Engineer
```
task(agent_type="general-purpose",
     description="You are the infra-engineer agent. Read agents/infra-engineer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_design.md, and _workspace/messages/pipeline-designer-to-pipeline-reviewer.md (INFRA_REQUIREMENTS section). Configure runners, containers, environment variables, and secrets. Write infra setup guide to _workspace/02_pipeline_config/infra-setup.md and write message to _workspace/messages/infra-engineer-to-pipeline-reviewer.md.")
```

### Step 3.2 — Monitoring Specialist
```
task(agent_type="general-purpose",
     description="You are the monitoring-specialist agent. Read agents/monitoring-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_design.md, and _workspace/messages/pipeline-designer-to-pipeline-reviewer.md (MONITORING_HOOKS section). Design DORA metrics tracking, alerting rules, and dashboards. Write monitoring design to _workspace/03_monitoring.md and write message to _workspace/messages/monitoring-specialist-to-pipeline-reviewer.md.")
```

### Step 3.3 — Security Scanner
```
task(agent_type="general-purpose",
     description="You are the security-scanner agent. Read agents/security-scanner.md for your full instructions. Read _workspace/00_input.md, _workspace/01_pipeline_design.md, and _workspace/messages/pipeline-designer-to-pipeline-reviewer.md (SECURITY_SCAN_STAGES section). Configure SAST, SCA, container scanning, and secret detection for the pipeline. Write security scan configuration to _workspace/04_security_scan.md and YAML to _workspace/02_pipeline_config/security-scan.yml. Write message to _workspace/messages/security-scanner-to-pipeline-reviewer.md.")
```

## Phase 4: Review

### Step 4.1 — Pipeline Reviewer
```
task(agent_type="general-purpose",
     description="You are the pipeline-reviewer agent. Read agents/pipeline-reviewer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_pipeline_design.md, _workspace/02_pipeline_config/ (all files), _workspace/03_monitoring.md, _workspace/04_security_scan.md, and all message files in _workspace/messages/. Review the complete pipeline for efficiency, reliability, security, and best practices. Write final review report to _workspace/05_review_report.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Create a full CI/CD pipeline" | Full Pipeline | All 5 |
| "Design the pipeline stages" | Design Only | pipeline-designer → pipeline-reviewer |
| "Add security scanning" | Security Mode | security-scanner → pipeline-reviewer |
| "Set up monitoring" | Monitoring Mode | monitoring-specialist → pipeline-reviewer |
| "Optimize build time" | Optimization | pipeline-designer + pipeline-reviewer |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Unknown CI platform | Default to GitHub Actions, note in 00_input.md |
| Missing tech stack info | Assume most common stack (Node.js/Docker), note assumptions |
| Agent output missing | Re-run once; pipeline-reviewer notes gap in final report |

## Test Scenarios
1. **Normal case:** Tech stack + target platform provided, full pipeline designed and reviewed
2. **Existing pipeline:** User provides existing YAML — analyze and improve rather than create from scratch
3. **Partial request:** "Add security scanning to our pipeline" — security-scanner + pipeline-reviewer only
