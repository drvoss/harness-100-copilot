---
name: infra-as-code
description: "Use when designing and implementing cloud infrastructure as code — dispatches infra-architect, terraform-specialist, k8s-specialist, security-hardener, and infra-reviewer in sequence to produce a complete, hardened IaC stack. Covers multi-cloud architecture design through Terraform modules, Kubernetes manifests, security hardening, and cost-optimized review. Does NOT cover application code deployment, CI/CD pipeline setup (use 20-cicd-pipeline for that), or runtime application monitoring. Also triggers on: build cloud infra, provision kubernetes cluster, terraform multi-region setup, harden kubernetes security, cloud cost optimization review."
metadata:
  category: harness
  harness: 26-infra-as-code
  agent_type: general-purpose
---

# Infra as Code — Cloud Infrastructure Pipeline

A 5-agent team designs cloud architecture, generates Terraform and Kubernetes code, applies security hardening, and produces a reviewed, cost-optimized infrastructure blueprint.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| infra-architect | `agents/infra-architect.md` | Multi-region topology, VPC design, cost framework | general-purpose |
| terraform-specialist | `agents/terraform-specialist.md` | Terraform modules, remote state, workspace config | general-purpose |
| k8s-specialist | `agents/k8s-specialist.md` | Deployments, Services, Ingress, RBAC, HPA | general-purpose |
| security-hardener | `agents/security-hardener.md` | IAM, network policies, encryption, secrets | general-purpose |
| infra-reviewer | `agents/infra-reviewer.md` | Cost optimization, compliance, final verdict | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md              (cloud provider, environment: dev/staging/prod, services to deploy)
├── 01_infra_architecture.md (infra-architect output)
├── 02_terraform_modules.md  (terraform-specialist output)
├── 03_k8s_manifests.md      (k8s-specialist output)
├── 04_security_hardening.md (security-hardener output)
├── 05_review_report.md      (infra-reviewer output — TERMINAL)
└── messages/
    ├── infra-architect-to-terraform-specialist.md
    ├── terraform-specialist-to-k8s-specialist.md
    ├── k8s-specialist-to-security-hardener.md
    └── security-hardener-to-infra-reviewer.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All agent files present in `agents/`
- [ ] Cloud provider credentials/context confirmed available

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's infrastructure request. Create _workspace/ and _workspace/messages/ directories. Extract: cloud_provider (AWS/GCP/Azure), environment (dev/staging/prod), services_to_deploy (list), scaling_requirements, compliance_requirements. Write organized input to _workspace/00_input.md with sections: CLOUD_PROVIDER, ENVIRONMENT, SERVICES, SCALING, COMPLIANCE, ADDITIONAL_CONTEXT.")
```

## Phase 2: Architecture & Code Generation

### Step 2.1 — Infra Architect
```
task(agent_type="general-purpose",
     description="You are the infra-architect agent in the infra-as-code harness. Read agents/infra-architect.md for your full instructions. Read _workspace/00_input.md. Design the complete multi-region cloud infrastructure: VPC/subnet topology, security zones, service placement, CDN strategy, and cost estimation. Write full architecture to _workspace/01_infra_architecture.md. Write handoff to _workspace/messages/infra-architect-to-terraform-specialist.md with STATUS: COMPLETE, FINDINGS (key decisions), TERRAFORM_RESOURCES (resource list), K8S_REQUIREMENTS (cluster topology), SECURITY_ZONES.")
```

### Step 2.2 — Terraform Specialist (reads from 2.1)
```
task(agent_type="general-purpose",
     description="You are the terraform-specialist agent in the infra-as-code harness. Read agents/terraform-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_infra_architecture.md, and _workspace/messages/infra-architect-to-terraform-specialist.md. Generate complete Terraform module structure: module layout (main.tf/variables.tf/outputs.tf), resource definitions for all architecture components, remote state backend (S3+DynamoDB or GCS), workspace-per-environment configuration, tagging strategy, and security scan annotations. Write to _workspace/02_terraform_modules.md. Write handoff to _workspace/messages/terraform-specialist-to-k8s-specialist.md with STATUS: COMPLETE, FINDINGS, K8S_INFRASTRUCTURE (cluster details), SECURITY_GAPS.")
```

### Step 2.3 — K8s Specialist (reads from 2.2)
```
task(agent_type="general-purpose",
     description="You are the k8s-specialist agent in the infra-as-code harness. Read agents/k8s-specialist.md for your full instructions. Read _workspace/00_input.md, _workspace/01_infra_architecture.md, _workspace/02_terraform_modules.md, and _workspace/messages/terraform-specialist-to-k8s-specialist.md. Generate complete Kubernetes manifests: namespace strategy, RBAC (ServiceAccounts, Roles, RoleBindings), Deployment/StatefulSet/DaemonSet manifests with resource requests/limits and probes, Service and Ingress configurations, HPA for scalable services, ResourceQuota and LimitRange. Write to _workspace/03_k8s_manifests.md. Write handoff to _workspace/messages/k8s-specialist-to-security-hardener.md with STATUS: COMPLETE, FINDINGS, SECURITY_GAPS, SECRETS_MANAGEMENT.")
```

### Step 2.4 — Security Hardener (reads from 2.3)
```
task(agent_type="general-purpose",
     description="You are the security-hardener agent in the infra-as-code harness. Read agents/security-hardener.md for your full instructions. Read _workspace/00_input.md, _workspace/01_infra_architecture.md, _workspace/02_terraform_modules.md, _workspace/03_k8s_manifests.md, and _workspace/messages/k8s-specialist-to-security-hardener.md. Apply complete security hardening: IAM least-privilege policies, Kubernetes NetworkPolicy deny-all-default plus allow rules, KMS encryption configuration, External Secrets Operator setup, Pod securityContext hardening (runAsNonRoot, readOnlyRootFilesystem, drop ALL capabilities), and compliance checklist (CIS/NIST). Write to _workspace/04_security_hardening.md. Write handoff to _workspace/messages/security-hardener-to-infra-reviewer.md with STATUS: COMPLETE, FINDINGS, OPEN_RISKS, COST_IMPACT.")
```

## Phase 3: Review

### Step 3.1 — Infra Reviewer (Terminal)
```
task(agent_type="general-purpose",
     description="You are the infra-reviewer agent in the infra-as-code harness. Read agents/infra-reviewer.md for your full instructions. Read ALL workspace files: _workspace/00_input.md, _workspace/01_infra_architecture.md, _workspace/02_terraform_modules.md, _workspace/03_k8s_manifests.md, _workspace/04_security_hardening.md, and all 4 message files in _workspace/messages/. Produce a comprehensive infrastructure review: priority matrix of all issues, cost optimization recommendations (right-sizing, Reserved Instance analysis, waste detection), CIS Benchmark compliance assessment, production readiness checklist, and final verdict (APPROVED/CHANGES REQUIRED/BLOCKED). Write to _workspace/05_review_report.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full IaC design | Full Pipeline | All 5 |
| Architecture only | Architecture Mode | infra-architect → infra-reviewer |
| Terraform only | Terraform Mode | terraform-specialist → infra-reviewer |
| Security audit | Security Mode | security-hardener → infra-reviewer |
| Cost review only | Review Mode | infra-reviewer (direct analysis) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; infra-reviewer notes "unavailable" for that domain |
| Ambiguous cloud provider | Default to AWS; document assumption in `00_input.md` |
| Missing service list | Ask user to provide list of services before proceeding |
| Conflicting security vs cost findings | infra-reviewer resolves; escalate to user if truly unresolvable |
| Target not found | Ask user to clarify before proceeding |

## Test Scenarios
1. **Normal case:** "AWS production infra for 3 microservices" → full pipeline produces architecture + Terraform + K8s + security + review report
2. **Existing architecture:** `01_infra_architecture.md` already present → skip Phase 2.1, start at terraform-specialist
3. **Error case:** K8s specialist output missing → infra-reviewer notes partial data, produces review with caveat
