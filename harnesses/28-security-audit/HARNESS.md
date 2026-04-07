# 28 — Security Audit

Automated security audit harness: 5 specialist agents analyze threats, source code, dependencies, and configuration, then synthesize a comprehensive security report with CVSS scoring and remediation priorities.

## Structure

```
harnesses/28-security-audit/
├── HARNESS.md                          (this file)
├── agents/
│   ├── threat-modeler.md               Threat modeling: STRIDE, attack surface, trust boundaries
│   ├── code-security-analyst.md        SAST: injection, auth, crypto, OWASP Top 10, CWE
│   ├── dependency-auditor.md           SCA: CVEs, license risks, supply chain threats
│   ├── config-reviewer.md              Config: secrets, TLS, IAM, Docker/K8s security
│   └── security-reporter.md            Synthesis: CVSS scoring, remediation priority, executive summary
└── skills/
    ├── security-audit/SKILL.md         Orchestrator — pipeline coordination, workflow, error handling
    ├── owasp-top10/SKILL.md            Supporting — OWASP Top 10 2021 with examples and mitigations
    └── vulnerability-triage/SKILL.md  Supporting — CVSS scoring guide, severity classification
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| threat-modeler | Threat modeling: STRIDE, attack surface, trust boundaries | `01_threat_model.md` |
| code-security-analyst | SAST: injection, auth, crypto, OWASP Top 10, CWE | `02_code_security.md` |
| dependency-auditor | SCA: CVEs, license risks, supply chain threats | `03_dependency_audit.md` |
| config-reviewer | Config: secrets, TLS, IAM, Docker/K8s security | `04_config_review.md` |
| security-reporter | Synthesis: CVSS scoring, remediation priority, executive summary | `05_security_report.md` |

## Quick Start

```bash
cp -r harnesses/28-security-audit/agents/ .github/agents/
cp -r harnesses/28-security-audit/skills/ .github/skills/
```
Then ask Copilot: `Security audit this codebase`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full security audit | Full Pipeline (all 5) | all |
| Code-only review | Reduced (2 agents) | threat-modeler → code-security-analyst |
| Dependency check only | Single | dependency-auditor only |
| Config review only | Single | config-reviewer only |

## Usage

Trigger the `security-audit` skill or make a natural language request:
- "Security audit this codebase"
- "Run a full security review of src/"
- "Check for vulnerabilities and generate a security report"
- "Compliance security assessment for PCI-DSS"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Codebase scope, tech stack, threat actors, compliance requirements
- `01_threat_model.md` — STRIDE threat modeling output
- `02_code_security.md` — Static code security analysis (SAST) output
- `03_dependency_audit.md` — Dependency vulnerability analysis (SCA) output
- `04_config_review.md` — Security configuration review output
- `05_security_report.md` — Comprehensive security report with CVSS scoring

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/28-security-audit/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/28-security-audit/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/28-security-audit)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
