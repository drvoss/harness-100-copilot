---
name: refactoring-catalog
description: "Use when identifying code smells, SOLID violations, and refactoring opportunities — provides a structured catalog of code smell patterns, complexity metrics, and refactoring recipes. Extends the architecture-reviewer and performance-analyst agents."
metadata:
  category: harness
  harness: 21-code-reviewer
  agent_type: general-purpose
---

# Refactoring Catalog — Code Smell & Refactoring Reference

A structured reference for identifying code smells, measuring complexity, and applying proven refactoring recipes.

## Code Smell Catalog

### Class-Level Smells
| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| God Class | >200 lines, >10 methods, >5 responsibilities | Extract Class, Move Method |
| Data Class | Only getters/setters, no behavior | Move Method, Encapsulate Field |
| Refused Bequest | Subclass ignores inherited behavior | Replace Inheritance with Delegation |
| Parallel Inheritance Hierarchies | Adding a subclass requires adding another in parallel | Move Method, Move Field |

### Method-Level Smells
| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| Long Method | >20 lines (guideline), multiple responsibilities | Extract Method |
| Feature Envy | Method uses other class's data more than its own | Move Method |
| Long Parameter List | >3-4 parameters | Introduce Parameter Object |
| Switch Statements | Switch on type codes | Replace Conditional with Polymorphism |
| Duplicate Code | Same structure in multiple places | Extract Method, Form Template Method |

### Design Smells
| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| Divergent Change | One class changes for many unrelated reasons | Extract Class |
| Shotgun Surgery | One change requires many small edits across classes | Move Method, Inline Class |
| Inappropriate Intimacy | Classes use each other's private parts | Move Method, Extract Class |
| Message Chains | `a.getB().getC().getD()` | Hide Delegate |
| Middle Man | Class delegates most work to another | Remove Middle Man, Inline Method |

## Complexity Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Cyclomatic Complexity | ≤5 | 6-10 | >10 |
| Cognitive Complexity | ≤10 | 11-20 | >20 |
| Lines per Method | ≤20 | 21-50 | >50 |
| Parameters per Method | ≤3 | 4-5 | >5 |
| Depth of Nesting | ≤3 | 4-5 | >5 |
| Class Coupling | ≤7 | 8-15 | >15 |

## SOLID Violation Patterns

### SRP Violations (Single Responsibility)
```
Signs: class does X AND Y (logging + business logic, parsing + persistence)
Fix: Extract the secondary responsibility into a new class
```

### OCP Violations (Open/Closed)
```
Signs: switch/if-else on type that requires modification for new types
Fix: Introduce polymorphism (interface + implementations)
```

### LSP Violations (Liskov Substitution)
```
Signs: subclass throws NotImplementedException, narrows preconditions
Fix: Replace Inheritance with Delegation, or redesign hierarchy
```

### ISP Violations (Interface Segregation)
```
Signs: interface with >5 methods, implementations leave many empty
Fix: Split into smaller focused interfaces
```

### DIP Violations (Dependency Inversion)
```
Signs: new ConcreteClass() inside business logic, high-level imports low-level
Fix: Constructor injection, introduce interfaces/abstractions
```

## Refactoring Safety Checklist
Before any refactoring:
- [ ] Tests cover the code being refactored (run them first to establish baseline)
- [ ] Refactoring is behavior-preserving (no logic changes)
- [ ] One refactoring at a time (don't mix refactoring with feature work)
- [ ] Tests pass after each step
