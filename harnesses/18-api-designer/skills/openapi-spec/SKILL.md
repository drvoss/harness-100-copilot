---
name: openapi-spec
description: "Use when generating, validating, or extending an OpenAPI 3.0 specification — provides common schema patterns, reusable component templates, and best-practice structures for paths, securitySchemes, responses, and parameters. Supporting skill for the api-designer harness. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting-skill
  harness: 18-api-designer
---

# OpenAPI Spec — OpenAPI 3.0 Patterns Reference

Supporting reference skill for the docs-generator agent. Provides reusable component templates, common schema patterns, and structural best practices for OpenAPI 3.0 documents.

## Common Schema Components

### Pagination Envelope
```yaml
components:
  schemas:
    CursorPage:
      type: object
      required: [data, meta]
      properties:
        data:
          type: array
          items: {}  # replaced by $ref in specific endpoints
        meta:
          type: object
          required: [has_more]
          properties:
            has_more:
              type: boolean
            next_cursor:
              type: string
              nullable: true
            prev_cursor:
              type: string
              nullable: true

    OffsetPage:
      type: object
      required: [data, meta]
      properties:
        data:
          type: array
          items: {}
        meta:
          type: object
          required: [total, page, per_page]
          properties:
            total:
              type: integer
            page:
              type: integer
            per_page:
              type: integer
```

### RFC 7807 Problem Details
```yaml
components:
  schemas:
    ProblemDetails:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri
          example: "https://api.example.com/errors/validation-error"
        title:
          type: string
          example: "Validation Error"
        status:
          type: integer
          example: 422
        detail:
          type: string
          example: "The 'email' field must be a valid email address."
        instance:
          type: string
          format: uri
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              code:
                type: string
              message:
                type: string
```

### Common Field Types
```yaml
components:
  schemas:
    # UUID identifier
    UUID:
      type: string
      format: uuid
      readOnly: true
      example: "550e8400-e29b-41d4-a716-446655440000"

    # ISO 8601 datetime
    DateTime:
      type: string
      format: date-time
      example: "2025-01-15T10:30:00Z"

    # Money amount
    Money:
      type: object
      required: [amount, currency]
      properties:
        amount:
          type: integer
          description: Amount in the smallest currency unit (e.g., cents)
          example: 1999
        currency:
          type: string
          pattern: '^[A-Z]{3}$'
          description: ISO 4217 currency code
          example: "USD"

    # URL
    URL:
      type: string
      format: uri
      example: "https://example.com/resource"

    # Email
    Email:
      type: string
      format: email
      maxLength: 320
      example: "user@example.com"
```

## Common Response Definitions

```yaml
components:
  responses:
    Unauthorized:
      description: Authentication token missing or invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
          example:
            type: "https://api.example.com/errors/unauthorized"
            title: "Unauthorized"
            status: 401
            detail: "Bearer token is missing or expired."

    Forbidden:
      description: Authenticated but not authorized for this resource
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    ValidationError:
      description: Request body or parameters failed validation
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    RateLimited:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          $ref: '#/components/headers/RateLimitLimit'
        X-RateLimit-Remaining:
          $ref: '#/components/headers/RateLimitRemaining'
        Retry-After:
          $ref: '#/components/headers/RetryAfter'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
```

## Common Parameter Definitions

```yaml
components:
  parameters:
    ResourceId:
      name: id
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: The unique identifier of the resource

    PageCursor:
      name: page_cursor
      in: query
      required: false
      schema:
        type: string
      description: Opaque cursor from a previous response's `meta.next_cursor`

    PageSize:
      name: page_size
      in: query
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
      description: Number of results per page

    SortOrder:
      name: sort
      in: query
      required: false
      schema:
        type: string
        pattern: '^-?[a-z_]+$'
        example: "-created_at"
      description: Sort field; prefix with `-` for descending (e.g., `-created_at`)

    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: false
      schema:
        type: string
        format: uuid
      description: Client-generated UUID for idempotent POST requests
```

## Common Header Definitions

```yaml
components:
  headers:
    RateLimitLimit:
      description: Maximum requests allowed in the current window
      schema:
        type: integer
      example: 1000

    RateLimitRemaining:
      description: Requests remaining in the current window
      schema:
        type: integer
      example: 750

    RetryAfter:
      description: Seconds to wait before retrying after rate limit
      schema:
        type: integer
      example: 60

    RequestId:
      description: Unique identifier for this request (use for support tickets)
      schema:
        type: string
        format: uuid
```

## Security Scheme Templates

### OAuth 2.0 Authorization Code + PKCE
```yaml
components:
  securitySchemes:
    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.example.com/oauth/authorize
          tokenUrl: https://auth.example.com/oauth/token
          refreshUrl: https://auth.example.com/oauth/token
          scopes:
            read:users: Read user profiles and preferences
            write:users: Create and update user accounts
            delete:users: Delete user accounts
            read:orders: Read order history and status
            write:orders: Place and modify orders
            admin: Full administrative access
```

### API Key
```yaml
components:
  securitySchemes:
    ApiKey:
      type: apiKey
      in: header
      name: X-API-Key
```

### Bearer JWT
```yaml
components:
  securitySchemes:
    BearerJWT:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Path Operation Best Practices

### Complete POST Operation Template
```yaml
paths:
  /v1/users:
    post:
      summary: Create a user
      description: |
        Creates a new user account. Returns 201 with the created resource.
        Supports idempotent creation via `Idempotency-Key` header.
      operationId: createUser
      tags: [Users]
      security:
        - OAuth2: [write:users]
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            example:
              email: "jane@example.com"
              displayName: "Jane Smith"
              role: "MEMBER"
      responses:
        '201':
          description: User created successfully
          headers:
            Location:
              description: URL of the created user
              schema:
                type: string
                format: uri
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          description: Email address already registered
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'
        '429':
          $ref: '#/components/responses/RateLimited'
```

## Spec Validation Checklist

Before finalising an OpenAPI 3.0 document:
- [ ] Every `$ref` resolves to an existing component
- [ ] Every path has at least one response code defined
- [ ] Every `operationId` is unique across the entire document
- [ ] `security` is declared at operation level for every protected endpoint
- [ ] All required properties are listed in `required: []`
- [ ] Examples are provided for the most common success response of each operation
- [ ] The document validates with `spectral lint` or `openapi-validator`
