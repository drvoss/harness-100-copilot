---
name: pipeline-security-gates
description: "Use when configuring security gates in a CI/CD pipeline — provides tool selection guides, threshold configuration, SAST/SCA/secret detection placement, and fail-fast strategies. Extends the security-scanner agent. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: harness
  harness: 20-cicd-pipeline
  agent_type: general-purpose
---

# Pipeline Security Gates — Security Scanning Reference

Reference for configuring security gates in CI/CD pipelines: tool selection, threshold configuration, and placement strategy.

## Security Gate Placement Strategy

```
Pre-commit:   secret-detection (fast, blocks locally)
PR/Push:      SAST + SCA (code scan + dependency audit)
Build:        container-scan (if building Docker images)
Pre-deploy:   DAST (against staging environment)
Post-deploy:  compliance-scan (scheduled)
```

## Tool Selection Matrix

| Scan Type | Tool | Free/OSS | Language Support | Speed |
|-----------|------|----------|-----------------|-------|
| SAST | Semgrep | ✅ | 30+ | Fast |
| SAST | CodeQL | ✅ (GitHub) | 10+ | Medium |
| SAST | SonarQube | ⚠️ CE free | 30+ | Slow |
| SCA | Snyk | ⚠️ Free tier | All | Fast |
| SCA | OWASP Dep-Check | ✅ | Java/JS/Python | Medium |
| Secrets | Gitleaks | ✅ | All | Fast |
| Secrets | TruffleHog | ✅ | All | Medium |
| Container | Trivy | ✅ | All | Fast |
| Container | Grype | ✅ | All | Fast |

## GitHub Actions — Security Gate Examples

```yaml
# Secret detection (runs on every push/PR)
- name: Gitleaks Secret Scan
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# SAST with Semgrep
- name: Semgrep SAST
  uses: semgrep/semgrep-action@v1
  with:
    config: >-
      p/security-audit
      p/owasp-top-ten
    auditOn: push

# Container scanning with Trivy
- name: Trivy Container Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.IMAGE_TAG }}
    format: sarif
    exit-code: 1
    severity: CRITICAL,HIGH
```

## Gate Threshold Configuration

| Environment | CRITICAL | HIGH | MEDIUM | LOW |
|-------------|----------|------|--------|-----|
| Development | Warn | Warn | Info | Info |
| Staging | Block | Warn | Warn | Info |
| Production | Block | Block | Warn | Info |

## False Positive Management

```yaml
# .semgrep-ignore or inline suppression
# nosemgrep: rule-id  ← inline suppression with justification comment

# Trivy .trivyignore
CVE-2023-XXXXX  # False positive: not using affected code path
```
