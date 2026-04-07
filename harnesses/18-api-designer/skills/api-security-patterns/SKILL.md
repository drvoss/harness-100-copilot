---
name: api-security-patterns
description: "Use when reviewing or designing API security controls — provides OWASP API Security Top 10 (2023 edition) mitigations, OAuth 2.0 implementation patterns, JWT hardening checklist, and rate limiting configurations. Supporting skill for the api-designer harness."
metadata:
  category: supporting-skill
  harness: 18-api-designer
---

# API Security Patterns — OWASP API Security Reference

Supporting reference skill for the security-designer agent. Provides the OWASP API Security Top 10 (2023 edition) with concrete mitigations, OAuth 2.0 implementation patterns, and JWT hardening guidance.

## OWASP API Security Top 10 (2023)

### API1:2023 — Broken Object Level Authorization (BOLA)

**Risk:** API endpoints accept object IDs in requests but don't verify the caller owns or has access to the object. An attacker substitutes another user's ID to access their data.

**Attack example:**
```
GET /v1/orders/order-9999   ← attacker owns order-1234, not order-9999
Authorization: Bearer <attacker-token>
→ 200 OK with victim's order data
```

**Mitigations:**
- Implement object ownership check in every endpoint that accepts an ID parameter
- Use authorisation middleware that injects the user's ID from the JWT and verifies ownership before the handler runs
- Never trust client-supplied IDs as proof of ownership
- Write integration tests that verify cross-user access returns 403

```python
# Example middleware pattern
def require_owner(resource_type):
    def decorator(handler):
        def wrapper(request, resource_id):
            resource = db.get(resource_type, resource_id)
            if resource.owner_id != request.user.id:
                raise ForbiddenError("Access denied")
            return handler(request, resource_id)
        return wrapper
    return decorator
```

---

### API2:2023 — Broken Authentication

**Risk:** Authentication mechanisms are weak, exposed, or bypassable. Includes weak passwords, missing brute-force protection, token leakage, and insecure token storage.

**Attack vectors:**
- Credential stuffing against login endpoints
- JWT with `alg: none` accepted
- Refresh tokens not rotated on use

**Mitigations:**
- Require strong passwords (min 12 chars, complexity) or MFA
- Implement exponential backoff on failed auth attempts (e.g., 5 failures → 30s lockout, doubles each attempt)
- Validate JWT `alg` header — reject `none` and `HS256` on public APIs; only accept `RS256`
- Rotate refresh tokens on every use (refresh token rotation)
- Revoke all tokens on password change or suspicious activity detection
- Store tokens in HttpOnly cookies or secure in-memory; never localStorage

---

### API3:2023 — Broken Object Property Level Authorization

**Risk:** API returns more fields than the caller is authorised to see (mass assignment or over-exposure), or allows mass assignment of fields the caller should not set.

**Attack example:**
```json
PATCH /v1/users/me
{ "email": "new@example.com", "role": "ADMIN" }   ← role should not be settable
```

**Mitigations:**
- Use an explicit allowlist of readable/writable fields per role — never pass the request body directly to the ORM
- Implement response serialisation that filters by role (e.g., admin sees `internal_notes`, user does not)
- Do not use `SELECT *` or ORM's `.toJSON()` directly in API responses

```typescript
// Safe: explicit field projection per role
const publicFields = ['id', 'email', 'displayName', 'createdAt'];
const adminFields = [...publicFields, 'internalNotes', 'flags'];
const fields = request.user.isAdmin ? adminFields : publicFields;
return pick(user, fields);
```

---

### API4:2023 — Unrestricted Resource Consumption

**Risk:** APIs do not enforce limits on request size, query complexity, or frequency. Attackers exhaust resources, causing denial of service or excessive cost.

**Mitigations:**
- Rate limit by user, IP, and API key at the gateway layer
- Set maximum request body size (e.g., 1MB for JSON, 10MB for file uploads)
- Cap all list endpoints with a maximum `page_size` (e.g., 100)
- For GraphQL: set query depth limit (10), query complexity limit (1000), and field-level cost annotations
- Implement circuit breakers for downstream services

**Rate limit configuration template:**
```yaml
# Nginx / Kong / API Gateway rate limiting
rate_limit:
  by: [user_id, ip_address]
  tiers:
    free:    { requests_per_minute: 60,   burst: 10  }
    basic:   { requests_per_minute: 300,  burst: 50  }
    pro:     { requests_per_minute: 1000, burst: 100 }
  headers:
    - X-RateLimit-Limit
    - X-RateLimit-Remaining
    - X-RateLimit-Reset
    - Retry-After
```

---

### API5:2023 — Broken Function Level Authorization

**Risk:** API endpoints enforce object-level access but not function-level. A regular user can call admin-only endpoints.

**Attack example:**
```
DELETE /v1/admin/users/user-123
Authorization: Bearer <regular-user-token>
→ 200 OK  ← should be 403
```

**Mitigations:**
- Group admin endpoints under a separate path prefix (`/v1/admin/`) with stricter middleware
- Enforce role-based access control (RBAC) at the function/route level, not just the object level
- Return 404 for admin endpoints when called by non-admins (don't reveal endpoint existence)
- Audit all endpoints for their minimum required role; document in OpenAPI `security` declarations

---

### API6:2023 — Unrestricted Access to Sensitive Business Flows

**Risk:** Automated abuse of legitimate business flows — account creation, discount code redemption, inventory purchase — causes financial or reputational harm.

**Mitigations:**
- Identify high-value business flows (checkout, registration, reward redemption)
- Add CAPTCHA or device fingerprinting to these flows
- Implement velocity checks (e.g., max 3 accounts per IP per hour)
- Monitor for anomalous patterns (bulk orders, rapid re-registration) and trigger alerts

---

### API7:2023 — Server Side Request Forgery (SSRF)

**Risk:** APIs accept URLs in request bodies (webhooks, metadata fetchers, import-from-URL) and fetch those URLs from the server — allowing attackers to probe internal services.

**Attack example:**
```json
POST /v1/webhooks
{ "callback_url": "http://169.254.169.254/latest/meta-data/" }
```

**Mitigations:**
- Validate and allowlist webhook/callback URL schemes (only `https://`) and domains
- Block internal IP ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `127.0.0.0/8`
- Use a dedicated outbound proxy that enforces allowlists for server-to-external requests
- Never return raw responses from fetched URLs to the caller

---

### API8:2023 — Security Misconfiguration

**Risk:** APIs expose debug information, use default credentials, allow excessive HTTP methods, or lack proper TLS configuration.

**Mitigations:**
- Disable GraphQL introspection in production (or scope it to authenticated admins only)
- Remove stack traces from error responses — log internally, return only a reference ID to the client
- Enforce TLS 1.2+ with strong cipher suites; reject TLS 1.0/1.1
- Remove default credentials from all API gateways, datastores, and admin panels
- Set required security headers on every response

**Required security headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Cache-Control: no-store
Content-Security-Policy: default-src 'none'
```

---

### API9:2023 — Improper Inventory Management

**Risk:** Old API versions remain accessible after deprecation. Shadow APIs (internal endpoints accidentally exposed) are not tracked or secured.

**Mitigations:**
- Maintain an API inventory (OpenAPI spec is the source of truth)
- Implement a documented deprecation policy with sunset dates (`Sunset` response header)
- Retire old API versions after the deprecation window closes
- Use API gateway routing to detect and log access to deprecated endpoints
- Conduct periodic API surface audits comparing gateway routes to the OpenAPI spec

**Sunset header example:**
```
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Deprecation: true
Link: <https://api.example.com/v2/users>; rel="successor-version"
```

---

### API10:2023 — Unsafe Consumption of APIs

**Risk:** APIs consume third-party data without validation, assuming it is trustworthy. A compromised upstream API can inject malicious data.

**Mitigations:**
- Validate and sanitise all data received from third-party APIs before storing or processing
- Define explicit schemas for third-party API responses; reject responses that don't conform
- Apply the same input validation rules to third-party data as to user-supplied data
- Monitor third-party API responses for anomalous changes in structure or content

---

## OAuth 2.0 Implementation Checklist

### Authorization Code + PKCE Flow

```
Step 1: Client generates code_verifier (random 43-128 char string)
Step 2: Client derives code_challenge = BASE64URL(SHA256(code_verifier))
Step 3: Client redirects to:
  GET /oauth/authorize
    ?response_type=code
    &client_id=<client_id>
    &redirect_uri=<redirect_uri>
    &scope=read:users write:orders
    &state=<random_csrf_token>
    &code_challenge=<code_challenge>
    &code_challenge_method=S256
Step 4: User authenticates and authorizes
Step 5: Authorization server redirects back with code
Step 6: Client exchanges code for tokens:
  POST /oauth/token
    grant_type=authorization_code
    &code=<code>
    &redirect_uri=<redirect_uri>
    &client_id=<client_id>
    &code_verifier=<code_verifier>
Step 7: Receive access_token (15 min) + refresh_token (30 days)
Step 8: Include access_token in API requests:
  Authorization: Bearer <access_token>
Step 9: When access_token expires, use refresh_token to get new pair
```

**Server-side validation checklist:**
- [ ] Verify `code_challenge` matches `SHA256(code_verifier)` in token exchange
- [ ] Verify `redirect_uri` exactly matches registered URI
- [ ] Verify `state` parameter matches the session value (CSRF protection)
- [ ] Issue new refresh token on every refresh (rotation)
- [ ] Invalidate old refresh token immediately on rotation
- [ ] Detect refresh token reuse — revoke entire token family if detected

### Client Credentials Flow

```
POST /oauth/token
  grant_type=client_credentials
  &client_id=<service_client_id>
  &client_secret=<service_client_secret>
  &scope=read:internal write:internal

→ access_token only (no refresh token)
```

- Access token lifetime: 1 hour (longer than user tokens; no interactive re-auth)
- Rotate client secrets quarterly; support two valid secrets during rotation window
- Client credentials are never shared with end users

---

## JWT Hardening Checklist

- [ ] Algorithm is `RS256` (asymmetric) — never `HS256` for multi-service or public APIs
- [ ] `alg: none` is explicitly rejected at validation layer
- [ ] Validate `iss` (expected issuer URL)
- [ ] Validate `aud` (expected audience — the API's base URL)
- [ ] Validate `exp` (token has not expired)
- [ ] Validate `nbf` (token is not used before its not-before time)
- [ ] Validate `jti` against a revocation list for high-value operations
- [ ] Access token lifetime ≤ 15 minutes
- [ ] Refresh token rotated on every use
- [ ] Signing key rotated every 90 days; JWKS endpoint serves current + previous key
- [ ] Sensitive data (PII, payment info) is NOT stored in JWT payload
- [ ] Token stored in HttpOnly cookie or secure in-memory (never localStorage)
