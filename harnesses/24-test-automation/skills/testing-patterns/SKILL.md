---
name: testing-patterns
description: "Use when you need reference patterns for structuring tests — provides Given/When/Then, test doubles taxonomy, test data builders, and common testing idioms for unit, integration, and E2E contexts."
metadata:
  category: skill
  harness: 24-test-automation
  agent_type: general-purpose
---

# Testing Patterns — Test Structure & Test Doubles Reference

A supporting skill that provides canonical testing patterns: Given/When/Then (BDD), test doubles taxonomy, test data builders, and common idioms for writing clear, maintainable tests.

## When to Use

- Establishing test structure conventions for a new project
- Deciding which type of test double (mock, stub, spy, fake, dummy) to use
- Applying BDD Given/When/Then style for scenario-driven tests
- Building test data with the Builder or Mother pattern
- Reviewing whether existing tests follow established patterns
- Augmenting the `unit-test-writer` or `integration-test-writer` agents with pattern guidance

## Core Patterns

### Pattern 1: Given / When / Then (BDD)

Given/When/Then maps directly to Arrange/Act/Assert and is preferred for scenario-driven or acceptance tests because it communicates intent to non-technical stakeholders.

```gherkin
# Gherkin (Cucumber / SpecFlow)
Scenario: Applying a loyalty discount
  Given a customer with 500 loyalty points
  And a shopping cart totalling $80
  When the customer applies their loyalty discount
  Then the cart total should be $70
  And the customer's loyalty points should decrease by 100
```

```typescript
// Jest with explicit GWT comments
it('should apply loyalty discount when customer has sufficient points', () => {
  // Given
  const customer = buildCustomer({ loyaltyPoints: 500 })
  const cart = buildCart({ total: 80 })
  const discountService = new DiscountService()

  // When
  const result = discountService.applyLoyaltyDiscount(customer, cart)

  // Then
  expect(result.total).toBe(70)
  expect(result.customerPoints).toBe(400)
})
```

### Pattern 2: Test Doubles Taxonomy

| Type | Definition | Use Case |
|------|-----------|---------|
| **Dummy** | Passed but never used | Fill required constructor parameters |
| **Stub** | Returns pre-configured values | Provide indirect inputs (query results, config) |
| **Spy** | Records calls; may delegate to real | Verify that a side effect occurred |
| **Mock** | Pre-programmed with call expectations | Assert exact interactions with a collaborator |
| **Fake** | Working simplified implementation | In-memory DB, fake message queue |

**Decision guide:**
```
Need to control return values?         → Stub
Need to verify a call was made?        → Mock (or Spy)
Need real behavior + call tracking?    → Spy
Need a working substitute (e.g. DB)?   → Fake
Just need to satisfy a parameter?      → Dummy
```

### Pattern 3: Test Data Builder

The Builder pattern creates readable, explicit test data without large parameter lists.

```typescript
// TypeScript builder
class UserBuilder {
  private data: Partial<User> = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'viewer',
    isActive: true,
  }

  withRole(role: UserRole): this {
    this.data.role = role
    return this
  }

  withEmail(email: string): this {
    this.data.email = email
    return this
  }

  inactive(): this {
    this.data.isActive = false
    return this
  }

  build(): User {
    return this.data as User
  }
}

// Usage
const adminUser = new UserBuilder().withRole('admin').build()
const inactiveEditor = new UserBuilder().withRole('editor').inactive().build()
```

### Pattern 4: Object Mother

Object Mother provides a catalogue of named, ready-to-use test objects for common scenarios.

```java
// Java Object Mother
public class OrderMother {
  public static Order pendingOrder() {
    return Order.builder()
      .id(UUID.randomUUID())
      .status(OrderStatus.PENDING)
      .items(List.of(OrderItemMother.standardItem()))
      .build();
  }

  public static Order completedOrder() {
    return pendingOrder().toBuilder()
      .status(OrderStatus.COMPLETED)
      .completedAt(Instant.now())
      .build();
  }

  public static Order orderWithExpiredPayment() {
    return pendingOrder().toBuilder()
      .payment(PaymentMother.expiredPayment())
      .build();
  }
}
```

### Pattern 5: Parameterized Tests

Use parameterized tests to cover multiple input combinations without duplicating test bodies.

```typescript
// Jest parameterized
it.each([
  { input: '',          valid: false, reason: 'empty string' },
  { input: 'user@',     valid: false, reason: 'missing domain' },
  { input: '@example',  valid: false, reason: 'missing local part' },
  { input: 'a@b.com',   valid: true,  reason: 'minimal valid email' },
  { input: 'user@example.com', valid: true, reason: 'standard email' },
])('should return $valid for "$input" ($reason)', ({ input, valid }) => {
  expect(validateEmail(input)).toBe(valid)
})
```

```python
# pytest parametrize
@pytest.mark.parametrize("amount, expected", [
  (0,    0.0),
  (99,   0.0),
  (100,  5.0),
  (200, 10.0),
])
def test_discount_calculation(amount, expected):
  assert calculate_discount(amount) == expected
```

### Pattern 6: Arrange–Act–Assert (AAA) with One Assert Rule

Each `it()` / `test()` block tests exactly one behavior.

```typescript
// ✅ Good — one behavior per test
it('should hash the password on save', async () => {
  const user = new UserBuilder().withPassword('plaintext').build()
  await userRepository.save(user)
  const saved = await userRepository.findById(user.id)
  expect(saved.password).not.toBe('plaintext')
})

it('should reject duplicate emails on save', async () => {
  const email = 'dup@example.com'
  await userRepository.save(new UserBuilder().withEmail(email).build())
  await expect(
    userRepository.save(new UserBuilder().withEmail(email).build())
  ).rejects.toThrow(UniqueConstraintError)
})

// ❌ Bad — two behaviors in one test (split into separate tests)
it('should save user and reject duplicates', async () => {
  const user = new UserBuilder().build()
  await userRepository.save(user)
  expect(user.password).not.toBe('plaintext')                    // behavior 1
  await expect(userRepository.save(user)).rejects.toThrow()      // behavior 2
})
```

### Pattern 7: Test Isolation Checklist

Before committing a test, verify:
- [ ] Test does not read or write to the file system (use in-memory alternatives)
- [ ] Test does not make real HTTP calls (use stubs or recorded fixtures)
- [ ] Test does not depend on environment variables being set (inject config)
- [ ] Test does not depend on the current time (inject a clock)
- [ ] Test does not depend on execution order (runs in any order independently)
- [ ] Test cleans up any created data in `afterEach` / teardown

## Usage in Pipeline

This skill is referenced by the `unit-test-writer` and `integration-test-writer` agents for pattern selection. It can also be invoked standalone for code review of test structure:

```
task(agent_type="general-purpose",
     description="You are using the testing-patterns skill. Read skills/testing-patterns/SKILL.md. Review the test files at [paths]. Identify which patterns are being used and which would improve test clarity or maintainability. Write recommendations to _workspace/pattern-review.md.")
```
