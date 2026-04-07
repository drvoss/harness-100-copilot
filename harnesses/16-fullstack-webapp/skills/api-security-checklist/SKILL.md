---
name: api-security-checklist
description: "Use when reviewing or building a backend API for security — provides OWASP API Security Top 10 checklist, authentication patterns, and security header configuration. Extends the backend-dev agent. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: harness
  harness: 16-fullstack-webapp
  agent_type: general-purpose
---

# API Security Checklist — Backend Security Reference

Comprehensive security checklist for REST/GraphQL APIs based on OWASP API Security Top 10 (2023).

## OWASP API Security Top 10 (2023)

| # | Risk | Key Checks |
|---|------|------------|
| API1 | Broken Object Level Authorization | Validate ownership for every resource access |
| API2 | Broken Authentication | Secure token handling, session management |
| API3 | Broken Object Property Level Auth | Return only fields user is allowed to see |
| API4 | Unrestricted Resource Consumption | Rate limiting, pagination limits, request size limits |
| API5 | Broken Function Level Authorization | Check permissions per HTTP method, not just route |
| API6 | Server-Side Request Forgery | Validate/allowlist URLs in user input |
| API7 | Security Misconfiguration | Remove debug endpoints, disable verbose errors in prod |
| API8 | Lack of Protection from Automated Threats | Bot detection, CAPTCHA for sensitive flows |
| API9 | Improper Inventory Management | Document all endpoints, deprecate old versions |
| API10 | Unsafe Consumption of APIs | Validate data from third-party APIs |

## Authentication Implementation

### JWT Best Practices
```javascript
// ✅ Short-lived access tokens + refresh token rotation
const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '15m',
  algorithm: 'RS256', // Use asymmetric — safer than HS256 with shared secret
})

// ✅ Validate on every request
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_PUBLIC_KEY)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit'

// Auth endpoints: stricter limits
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts',
  standardHeaders: true,
  legacyHeaders: false,
})

// API endpoints: generous limits
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 })

app.use('/api/auth', authLimiter)
app.use('/api/', apiLimiter)
```

## Security Headers

```javascript
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Adjust for your CSS approach
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}))

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))
```

## Input Validation (Zod)

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  name: z.string().min(1).max(100).trim(),
})

// Middleware
const validate = (schema: z.ZodType) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() })
  }
  req.body = result.data // Normalized data
  next()
}
```

## Security Checklist Before Deploy

```
Authentication:
- [ ] JWT secret is strong (≥256 bits) and stored in env var
- [ ] Access token expiry ≤ 15 minutes
- [ ] Refresh token rotation implemented
- [ ] Password hashed with bcrypt (cost ≥ 12) or Argon2id

Authorization:
- [ ] Every endpoint checks authentication
- [ ] Every resource access validates ownership (BOLA check)
- [ ] Admin endpoints have role check
- [ ] Sensitive fields filtered from responses

Transport:
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] HSTS header configured
- [ ] CORS restricted to known origins

Injection Prevention:
- [ ] All SQL queries use parameterized statements (no string concat)
- [ ] All user input validated with schema (Zod/Joi/Pydantic)
- [ ] File uploads type-checked and size-limited

Operational:
- [ ] Rate limiting on auth endpoints
- [ ] No verbose error messages in production
- [ ] No stack traces in API responses
- [ ] Secrets only in environment variables (not code)
```
