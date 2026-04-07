---
name: owasp-top10
description: "Use when you need OWASP Top 10 2021 reference data — provides detailed descriptions, code examples, and mitigations for all 10 categories (A01–A10). Supporting skill for the security-audit harness. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: skill
  harness: 28-security-audit
  agent_type: general-purpose
---

# OWASP Top 10 2021 — Security Vulnerability Reference

Comprehensive reference for the OWASP Top 10 2021, including descriptions, attack examples, detection patterns, and mitigations. Use as a checklist and knowledge base during security analysis.

---

## A01 — Broken Access Control

**Description:** Access control enforces policy such that users cannot act outside their intended permissions. Failures lead to unauthorized access, data modification, or destruction.

**Common Vulnerabilities:**
- Insecure Direct Object Reference (IDOR): accessing `/api/user/123` when authenticated as user 456
- Missing function-level authorization: admin API endpoints accessible by regular users
- Path traversal: `../../../etc/passwd` in file path parameters
- CORS misconfiguration: `Access-Control-Allow-Origin: *` on authenticated endpoints
- Privilege escalation: modifying a role field in a JWT or request body

**Detection Patterns:**
```
# Check for missing authorization in route handlers
grep -rn "app\.(get|post|put|delete)" --include="*.js" | grep -v "auth\|middleware\|protect"

# Check for direct DB ID exposure
grep -rn "req\.params\.id\|request\.GET\['id'\]" --include="*.py" --include="*.js"
```

**Mitigations:**
- Enforce access control server-side on every request; never trust client-side enforcement
- Implement deny-by-default: all resources denied unless explicitly permitted
- Use indirect object references (UUIDs, hash IDs) and validate ownership
- Log access control failures; alert on repeated failures (brute force)

---

## A02 — Cryptographic Failures

**Description:** Failure to protect sensitive data in transit or at rest through absent or weak cryptography.

**Common Vulnerabilities:**
- Data transmitted in cleartext (HTTP instead of HTTPS)
- Weak hash algorithms for passwords: MD5, SHA-1, unsalted SHA-256
- Hardcoded encryption keys in source code
- ECB mode encryption (deterministic, leaks patterns)
- Insufficient key length: RSA < 2048-bit, AES-128 (prefer 256)
- Missing certificate validation (`verify=False`)

**Detection Patterns:**
```python
# Weak password hashing
import hashlib; hashlib.md5(password)          # ❌ MD5
import hashlib; hashlib.sha1(password)         # ❌ SHA-1 without salt
# Safe alternatives
import bcrypt; bcrypt.hashpw(password, salt)   # ✅ bcrypt
from argon2 import PasswordHasher             # ✅ Argon2id
```

**Mitigations:**
- Classify data; apply encryption to all sensitive data at rest and in transit
- Use bcrypt (cost ≥ 12), Argon2id, or scrypt for password storage
- Enforce TLS 1.2+ with strong cipher suites; use HSTS
- Store secrets in vaults (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager)
- Disable caching for responses containing sensitive data

---

## A03 — Injection

**Description:** User-supplied data is sent to an interpreter as part of a command or query, allowing attackers to execute unintended commands or access unauthorized data.

**SQL Injection:**
```python
# ❌ Vulnerable
query = "SELECT * FROM users WHERE username = '" + username + "'"

# ✅ Safe — parameterized query
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

**XSS (Reflected):**
```html
<!-- ❌ Vulnerable -->
<div>Hello, <%= req.query.name %></div>

<!-- ✅ Safe — escaped output -->
<div>Hello, <%- escapeHtml(req.query.name) %></div>
```

**Command Injection:**
```python
# ❌ Vulnerable
import subprocess; subprocess.run(f"ping {user_input}", shell=True)

# ✅ Safe — no shell, argument list
subprocess.run(["ping", "-c", "1", user_input])
```

**Mitigations:**
- Use parameterized queries / prepared statements for all DB access
- Validate, filter, and escape all user input on the server side
- Use safe APIs that avoid the interpreter entirely where possible
- Apply input allowlisting (not just denylisting)
- Use a WAF as a defense-in-depth layer (not a primary defense)

---

## A04 — Insecure Design

**Description:** Missing or ineffective security controls due to flaws in the design phase, not implementation.

**Common Issues:**
- No rate limiting on authentication endpoints (credential stuffing)
- Business logic flaws: applying discount codes multiple times, negative cart values
- Missing multi-factor authentication for high-value operations
- Insecure password recovery flows (predictable reset tokens, security questions)
- No separation of duties in privileged workflows

**Mitigations:**
- Integrate threat modeling (STRIDE) before development
- Use security design patterns: fail-safe defaults, complete mediation, least privilege
- Apply rate limiting and account lockout on all authentication endpoints
- Require MFA for privileged and sensitive operations
- Test business logic flows with adversarial test cases

---

## A05 — Security Misconfiguration

**Description:** Insecure default configurations, incomplete configurations, or misconfigured cloud permissions.

**Common Issues:**
- Default credentials unchanged (`admin/admin`, `root/root`)
- Verbose error messages exposing stack traces, framework versions, DB schemas
- Open S3 buckets, publicly accessible cloud storage
- Missing security headers (`CSP`, `HSTS`, `X-Frame-Options`)
- Unnecessary features/services enabled (debug mode, default sample apps)
- Cloud storage with `ACL: public-read` or `public-read-write`

**Mitigations:**
- Implement a hardened configuration baseline; automate deployment with IaC
- Remove or disable all unused features, components, and ports
- Send generic error messages to users; log detailed errors server-side only
- Apply security headers on all HTTP responses
- Run automated configuration scanning in CI/CD (e.g., `trivy config`, `checkov`)

---

## A06 — Vulnerable and Outdated Components

**Description:** Using components with known vulnerabilities or that are no longer maintained.

**Common Issues:**
- Direct dependencies with known CVEs (check `npm audit`, `pip-audit`, `trivy`)
- Transitive dependencies with critical CVEs
- End-of-life OS, runtime, or framework versions
- No process for tracking and patching vulnerable dependencies

**Mitigations:**
- Maintain a Software Bill of Materials (SBOM)
- Continuously monitor CVE databases (NVD, OSV, GitHub Advisory)
- Set up automated dependency update PRs (Dependabot, Renovate)
- Apply CVE patch SLAs: Critical 24h, High 7d, Medium 30d, Low 90d
- Pin dependency versions in lockfiles; verify package integrity with checksums

---

## A07 — Identification and Authentication Failures

**Description:** Flaws in authentication and session management that allow attackers to assume other users' identities.

**Common Issues:**
- Weak or no brute-force protection on login endpoints
- Session tokens that don't expire or aren't invalidated on logout
- JWT with `alg: none` or weak HMAC secret
- Credentials stored in URL parameters (visible in logs)
- Password reset tokens that are long-lived, predictable, or reusable

**JWT Attack Patterns:**
```python
# ❌ Vulnerable — alg:none attack
jwt.decode(token, options={"verify_signature": False})

# ❌ Vulnerable — weak secret
jwt.encode(payload, "secret", algorithm="HS256")

# ✅ Safe — RS256 with public key verification
jwt.decode(token, public_key, algorithms=["RS256"])
```

**Mitigations:**
- Implement account lockout after N failed attempts (5–10 with exponential backoff)
- Use strong session IDs (≥128 bits, cryptographically random); invalidate on logout
- Enforce MFA for sensitive accounts
- Set JWT expiry (`exp`) to short values (15m–1h); use refresh token rotation
- Never send credentials in URLs; use POST body or Authorization header

---

## A08 — Software and Data Integrity Failures

**Description:** Code and infrastructure that does not protect against integrity violations through untrusted data, unsigned updates, or insecure CI/CD pipelines.

**Common Issues:**
- Deserializing untrusted data without validation (`pickle.loads()`, `yaml.load()`)
- Auto-update mechanisms without integrity verification
- CI/CD pipelines that pull dependencies from untrusted sources
- Unsigned or unverified software packages

**Detection Patterns:**
```python
# ❌ Vulnerable deserialization
import pickle; obj = pickle.loads(user_data)
import yaml; data = yaml.load(content)             # unsafe loader

# ✅ Safe
import yaml; data = yaml.safe_load(content)        # safe loader
import json; data = json.loads(user_data)           # JSON is safe
```

**Mitigations:**
- Use `yaml.safe_load()` instead of `yaml.load()`; avoid `pickle` for untrusted data
- Verify package integrity using checksums and signatures
- Use pinned dependency versions with lockfiles in CI/CD
- Implement code signing for deployable artifacts
- Restrict CI/CD pipeline permissions to least privilege

---

## A09 — Security Logging and Monitoring Failures

**Description:** Insufficient logging and monitoring, combined with missing or ineffective incident response.

**Common Issues:**
- No logging of authentication events (successes and failures)
- Logs contain PII, passwords, or tokens in plaintext
- No alerting on repeated failures or anomalous access patterns
- Log injection: user input written unescaped to logs (`\n` newlines)
- Logs stored on same server as application (destroyed in breach)

**Mitigations:**
- Log all authentication events, access control failures, and high-value transactions
- Use structured logging (JSON); never log passwords, tokens, or full PII
- Sanitize user input before writing to logs (escape newlines and special chars)
- Centralize logs in immutable, tamper-evident store (CloudWatch, Splunk, ELK)
- Set up alerting on N failed logins, impossible travel, and privilege escalation

---

## A10 — Server-Side Request Forgery (SSRF)

**Description:** A web application fetches a remote resource using a user-supplied URL without validating the destination, allowing access to internal services.

**Common Vulnerable Patterns:**
```python
# ❌ Vulnerable — user controls URL
url = request.args.get('webhook_url')
requests.get(url)  # can reach http://169.254.169.254/latest/meta-data/ on AWS

# ✅ Safe — allowlist of permitted hosts
ALLOWED_HOSTS = {"api.example.com", "cdn.example.com"}
parsed = urlparse(url)
if parsed.hostname not in ALLOWED_HOSTS:
    raise ValueError("URL not allowed")
```

**High-Value SSRF Targets:**
- AWS metadata: `http://169.254.169.254/latest/meta-data/iam/security-credentials/`
- GCP metadata: `http://metadata.google.internal/computeMetadata/v1/`
- Internal services: `http://localhost:8080`, `http://redis:6379`, `http://elasticsearch:9200`

**Mitigations:**
- Validate and allowlist all user-supplied URLs (scheme, host, port)
- Disable HTTP redirects to prevent redirect-based SSRF bypass
- Use a network-level egress firewall to block internal IP ranges
- On cloud: disable legacy metadata API or enforce IMDSv2 (AWS)
- Return generic error messages to prevent port scanning via SSRF
