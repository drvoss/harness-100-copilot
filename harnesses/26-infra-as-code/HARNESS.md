# 26 — Infra as Code

Cloud infrastructure-as-code harness: an agent team designs multi-region cloud architecture, generates Terraform modules and Kubernetes manifests, applies security hardening, then produces a review report with cost optimization and compliance checks.

## Structure

```
harnesses/26-infra-as-code/
├── HARNESS.md                              (this file)
├── agents/
│   ├── infra-architect.md                  Cloud infra architecture: multi-region, security zones, cost estimation
│   ├── terraform-specialist.md             Terraform modules: resource definitions, state management, workspaces
│   ├── k8s-specialist.md                   Kubernetes manifests: deployments, services, ingress, namespaces, RBAC
│   ├── security-hardener.md                Security hardening: IAM least privilege, network policies, encryption
│   └── infra-reviewer.md                   Review & cost optimization: resource sizing, waste, compliance (TERMINAL)
└── skills/
    ├── infra-as-code/SKILL.md              Orchestrator — team coordination, workflow, error handling
    ├── terraform-patterns/SKILL.md         Supporting — Terraform module structure, remote state, workspaces
    └── k8s-security-checklist/SKILL.md     Supporting — CIS Kubernetes Benchmark, Pod Security Standards
```

## Usage

Trigger the `infra-as-code` skill or make a natural language request:
- "Design cloud infra for my microservices app on AWS"
- "Create Terraform modules for multi-region production deployment"
- "Generate Kubernetes manifests for staging environment"
- "Security hardening review for our cloud infrastructure"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Cloud provider, environment, services to deploy
- `01_infra_architecture.md` — Multi-region infrastructure design
- `02_terraform_modules.md` — Terraform module definitions
- `03_k8s_manifests.md` — Kubernetes manifests
- `04_security_hardening.md` — Security controls and hardening policies
- `05_review_report.md` — Final review with cost optimization and compliance

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/26-infra-as-code/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/26-infra-as-code/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/26-infra-as-code)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
