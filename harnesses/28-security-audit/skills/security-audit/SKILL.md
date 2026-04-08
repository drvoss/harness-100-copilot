---
name: security-audit
description: "Use when performing a comprehensive security audit of a codebase, application, or system — dispatches threat-modeler, code-security-analyst, dependency-auditor, and config-reviewer in a pipeline, then synthesizes findings into a prioritized security report with CVSS scoring and remediation roadmap. Covers threat modeling (STRIDE), static code analysis (SAST), software composition analysis (SCA), and configuration hardening review. Does NOT cover penetration testing, runtime DAST scanning, social engineering assessment, or physical security review. Also triggers on: run security review, check for vulnerabilities, audit for compliance, generate security report, assess security posture."
metadata:
  category: harness
  harness: 28-security-audit
  agent_type: general-purpose
---

# Security Audit — Automated Security Assessment Pipeline

A 5-agent team performs end-to-end security analysis: threat modeling, static code analysis, dependency auditing, configuration review, and final synthesis into a comprehensive security report.

## Execution Mode

**File-Bus Pipeline** — Agents execute sequentially; each writes results to `_workspace/` and a handoff message to `_workspace/messages/` for the next agent. Final reporter synthesizes all outputs.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| threat-modeler | `agents/threat-modeler.md` | STRIDE analysis, attack surface, trust boundaries | general-purpose |
| code-security-analyst | `agents/code-security-analyst.md` | SAST: injection, auth, crypto, OWASP Top 10 | general-purpose |
| dependency-auditor | `agents/dependency-auditor.md` | SCA: CVEs, license risks, supply chain | general-purpose |
| config-reviewer | `agents/config-reviewer.md` | Secrets, TLS, IAM, Docker/K8s hardening | general-purpose |
| security-reporter | `agents/security-reporter.md` | CVSS scoring, remediation priority, executive summary | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md              (codebase scope, tech stack, threat actors, compliance requirements)
├── 01_threat_model.md       (threat-modeler output)
├── 02_code_security.md      (code-security-analyst output)
├── 03_dependency_audit.md   (dependency-auditor output)
├── 04_config_review.md      (config-reviewer output)
├── 05_security_report.md    (security-reporter output — TERMINAL)
└── messages/
    ├── threat-modeler-to-code-security-analyst.md
    ├── code-security-analyst-to-dependency-auditor.md
    ├── dependency-auditor-to-config-reviewer.md
    └── config-reviewer-to-security-reporter.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Target codebase or repository path is accessible

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's security audit request. Create _workspace/ and _workspace/messages/ directories. Extract: codebase_scope (which directories/repos to audit), tech_stack (languages, frameworks, runtimes), threat_actors (external attacker / insider / nation-state), compliance_requirements (PCI-DSS, SOC 2, HIPAA, ISO 27001, OWASP, none). Write organized input to _workspace/00_input.md with sections: CODEBASE_SCOPE, TECH_STACK, THREAT_ACTORS, COMPLIANCE_REQUIREMENTS, AUDIT_CONTEXT.")
```

## Phase 2: Analysis Pipeline

### Step 2.1 — Threat Modeler
```
task(agent_type="general-purpose",
     description="You are the threat-modeler agent in the security-audit harness. Read agents/threat-modeler.md for your full instructions. Read _workspace/00_input.md for the audit scope. Perform a complete threat model: apply STRIDE to all major components, enumerate the full attack surface, map all trust boundaries, assign DREAD scores, build attack trees for top threats. Write full output to _workspace/01_threat_model.md. Write handoff to _workspace/messages/threat-modeler-to-code-security-analyst.md with: STATUS: COMPLETE, FINDINGS (critical/high counts), HIGH_RISK_COMPONENTS, TRUST_BOUNDARY_ISSUES, CROSS_DOMAIN_FOR_DEPENDENCY_AUDITOR, CROSS_DOMAIN_FOR_CONFIG_REVIEWER.")
```

### Step 2.2 — Code Security Analyst
```
task(agent_type="general-purpose",
     description="You are the code-security-analyst agent in the security-audit harness. Read agents/code-security-analyst.md for your full instructions. Read _workspace/00_input.md for the audit scope. Read _workspace/messages/threat-modeler-to-code-security-analyst.md for high-risk components and trust boundary issues. Perform complete static code security analysis: check all OWASP Top 10 (A01-A10) categories, assign CWE IDs, scan for hardcoded secrets, analyze injection patterns, authentication flaws, and cryptographic misuse. Write full output to _workspace/02_code_security.md. Write handoff to _workspace/messages/code-security-analyst-to-dependency-auditor.md with: STATUS: COMPLETE, FINDINGS (critical/high counts, KEY_ISSUES), CROSS_DOMAIN_FOR_DEPENDENCY_AUDITOR, CROSS_DOMAIN_FOR_CONFIG_REVIEWER.")
```

### Step 2.3 — Dependency Auditor
```
task(agent_type="general-purpose",
     description="You are the dependency-auditor agent in the security-audit harness. Read agents/dependency-auditor.md for your full instructions. Read _workspace/00_input.md for tech stack and package manager details. Read _workspace/messages/threat-modeler-to-code-security-analyst.md for third-party component concerns and _workspace/messages/code-security-analyst-to-dependency-auditor.md for libraries suspected vulnerable. Scan all dependency manifests (package.json, requirements.txt, pom.xml, go.sum, etc.) for CVEs; analyze transitive dependencies; assess supply chain risks and license compatibility. Write full output to _workspace/03_dependency_audit.md. Write handoff to _workspace/messages/dependency-auditor-to-config-reviewer.md with: STATUS: COMPLETE, FINDINGS (CRITICAL_CVES, HIGH_CVES, LICENSE_ISSUES, SUPPLY_CHAIN_RISKS), CROSS_DOMAIN_FOR_CONFIG_REVIEWER, CROSS_DOMAIN_FOR_SECURITY_REPORTER.")
```

### Step 2.4 — Config Reviewer
```
task(agent_type="general-purpose",
     description="You are the config-reviewer agent in the security-audit harness. Read agents/config-reviewer.md for your full instructions. Read _workspace/00_input.md for deployment environment and compliance requirements. Read all three message files: _workspace/messages/threat-modeler-to-code-security-analyst.md, _workspace/messages/code-security-analyst-to-dependency-auditor.md, and _workspace/messages/dependency-auditor-to-config-reviewer.md. Review all configuration files (.env*, Dockerfile*, docker-compose*, k8s/, terraform/, CI/CD workflows, nginx/apache configs) for secrets exposure, TLS settings, IAM least privilege, Docker security (non-root, no privileged, read-only FS), Kubernetes RBAC, and firewall rules. Write full output to _workspace/04_config_review.md. Write handoff to _workspace/messages/config-reviewer-to-security-reporter.md with: STATUS: COMPLETE, FINDINGS (CRITICAL/HIGH counts, SECRETS_EXPOSED, WORST_MISCONFIGS), CROSS_DOMAIN_FOR_SECURITY_REPORTER (compliance gaps, infrastructure risks, quick wins).")
```

## Phase 3: Synthesis

### Step 3.1 — Security Reporter
```
task(agent_type="general-purpose",
     description="You are the security-reporter agent in the security-audit harness. Read agents/security-reporter.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_threat_model.md, _workspace/02_code_security.md, _workspace/03_dependency_audit.md, _workspace/04_config_review.md, and all 4 message files in _workspace/messages/. Aggregate and de-duplicate findings across all domains. Apply CVSS v3 scores to all Critical and High findings (include vector string). Build a remediation priority matrix. Write a non-technical executive summary for leadership. Map findings to compliance frameworks specified in the audit scope. Write the comprehensive final report to _workspace/05_security_report.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Full security audit" / "comprehensive review" | Full Pipeline | All 5 |
| "Code security only" / "SAST scan" | Code Mode | code-security-analyst → security-reporter |
| "Dependency audit" / "SCA scan" | Dependency Mode | dependency-auditor → security-reporter |
| "Config review" / "hardening check" | Config Mode | config-reviewer → security-reporter |
| "Threat model only" | Threat Mode | threat-modeler → security-reporter |
| "Quick security check" | Minimal | code-security-analyst → security-reporter |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; security-reporter notes "domain unavailable" in report |
| Ambiguous scope | Apply audit to all accessible source files; document assumptions in `00_input.md` |
| Conflicting severity ratings | security-reporter takes the higher severity; documents both sources |
| Dependency manifest not found | dependency-auditor notes "no manifest found"; skips SCA section |
| Configuration files not found | config-reviewer notes "no config files found"; audits what is available |
| No compliance framework specified | Default to OWASP Top 10 mapping only |

## Test Scenarios
1. **Normal case:** Repository path provided, all 4 analysis phases complete, reporter produces full report with CVSS scores and compliance mapping
2. **Partial scope:** User asks "dependency audit only" — run only dependency-auditor → security-reporter
3. **Error case:** One agent fails to produce output — security-reporter produces partial report noting the missing domain with a note to re-run
4. **Compliance-focused:** User specifies PCI-DSS compliance — config-reviewer and security-reporter emphasize PCI-DSS gap analysis

## Security Standards

### Three-Tier Boundary System

Instruct security agents to classify all findings and recommendations using this framework:

**Always Do (No Exceptions)**
- Validate all external input at system boundaries (API routes, form handlers)
- Parameterize all database queries — never concatenate user input into SQL
- Use HTTPS for all external communication
- Hash passwords with bcrypt/scrypt/argon2 (never store plaintext)
- Set security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Use `httpOnly`, `secure`, `sameSite` cookies for sessions
- Run `npm audit` (or equivalent) before every release

**Ask First (Requires Human Approval)**
- Adding new authentication flows or changing auth logic
- Storing new categories of sensitive data (PII, payment info)
- Changing CORS configuration
- Adding file upload handlers
- Modifying rate limiting or throttling

**Never Do**
- Never commit secrets to version control (API keys, passwords, tokens)
- Never log sensitive data (passwords, tokens, full credit card numbers)
- Never trust client-side validation as a security boundary
- Never use `eval()` or `innerHTML` with user-provided data
- Never store sessions in localStorage for auth tokens
- Never expose stack traces or internal error details to users

### npm audit Triage Framework

Not all audit findings require immediate action. Instruct the dependency-auditor to apply this decision tree:

```
Critical or High severity:
  ├── Is the vulnerable code reachable in production?
  │   ├── YES → Fix immediately (update, patch, or replace dependency)
  │   └── NO (dev-only dep, unused code path) → Fix soon, document reason for deferral
  └── Is a fix available?
      ├── YES → Update to patched version
      └── NO → Check workarounds, consider replacing, or add to allowlist with review date

Moderate severity:
  ├── Reachable in production? → Fix in next release cycle
  └── Dev-only? → Fix when convenient, track in backlog

Low severity:
  └── Track and fix during regular dependency updates
```

### Rate Limiting Standards

Concrete rate limiting thresholds for the config-reviewer and code-security-analyst agents:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication endpoints (login, password reset) | 10 requests | 15 minutes |
| General API endpoints | 100 requests | 15 minutes |
| Registration / account creation | 5 requests | 1 hour |

### Pre-Commit Secret Detection

Instruct the config-reviewer to check for this common pattern in CI/CD configs:

```bash
# Check for accidentally staged secrets
git diff --cached | grep -i "password\|secret\|api_key\|token"
```

This command should appear in pre-commit hooks or CI pipelines for all projects reviewed.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "This is an internal tool, security doesn't matter" | Internal tools get compromised. Attackers target the weakest link. |
| "We'll add security later" | Security retrofitting is 10x harder than building it in. Add it now. |
| "No one would try to exploit this" | Automated scanners will find it. Security by obscurity is not security. |
| "The framework handles security" | Frameworks provide tools, not guarantees. You still need to use them correctly. |
| "It's just a prototype" | Prototypes become production. Security habits from day one. |

## Red Flags

- User input passed directly to database queries, shell commands, or HTML rendering
- Secrets in source code or commit history
- API endpoints without authentication or authorization checks
- Missing CORS configuration or wildcard (`*`) origins
- No rate limiting on authentication endpoints
- Stack traces or internal errors exposed to users
- Dependencies with known critical vulnerabilities in active code paths

## Verification

After the full security audit pipeline completes:

- [ ] `npm audit` (or equivalent) shows no critical or high vulnerabilities in production code paths
- [ ] No secrets in source code or git history
- [ ] All user input validated at system boundaries
- [ ] Authentication and authorization checked on every protected endpoint
- [ ] Rate limiting active on auth endpoints (≤10 attempts per 15 minutes)
- [ ] Error responses don't expose internal details
- [ ] `_workspace/05_security_report.md` exists with CVSS scores and remediation roadmap
