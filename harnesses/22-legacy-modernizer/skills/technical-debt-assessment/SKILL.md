---
name: technical-debt-assessment
description: "Use when quantifying technical debt in a legacy codebase — applies the SQALE model to measure debt principal, interest, and payoff priority. Supporting skill for the legacy-modernizer harness. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting-skill
  harness: 22-legacy-modernizer
---

# Technical Debt Assessment — SQALE Model and Quantification Guide

Structured approach to measuring technical debt using the SQALE (Software Quality Assessment based on Lifecycle Expectations) model, enabling data-driven prioritization of debt payoff during modernization.

## SQALE Model Overview

SQALE defines technical debt along five quality axes. Each axis has measurable remediation cost (the **debt principal**) and a carrying cost from not remediating (the **debt interest** — slow delivery, defect rate, onboarding cost).

### SQALE Quality Axes

| Axis | Measures | Key Indicators |
|------|----------|----------------|
| **Reliability** | Defect probability, failure rate | Cyclomatic complexity, missing error handling, null dereferences |
| **Security** | Vulnerability exposure | OWASP findings, unvalidated inputs, hardcoded credentials |
| **Maintainability** | Effort to understand and change | Code duplication, naming quality, documentation gaps |
| **Changeability** | Ease of modification | Coupling metrics, test coverage, interface stability |
| **Testability** | Ability to verify behavior | Cyclomatic complexity, dependency hardwiring, missing seams |

## Debt Quantification

### Debt Principal (Remediation Cost)
The cost to fix the debt item if addressed immediately.

**Estimation formula:**
```
Debt Principal (hours) =
  (Lines of Code to Refactor / Developer Productivity) × Complexity Multiplier
```

| Complexity Level | Multiplier |
|-----------------|-----------|
| Low (CC 1–5) | 1.0× |
| Medium (CC 6–10) | 1.5× |
| High (CC 11–20) | 2.5× |
| Critical (CC >20) | 4.0× |

**Developer productivity baseline**: 50–100 LOC/hour for refactoring (use team-specific measurement).

### Debt Interest (Carrying Cost)
The ongoing cost of NOT fixing the debt per sprint/month.

**Interest manifests as:**
- Defect rate increase: track bugs filed against high-complexity modules vs. low-complexity modules
- Development velocity drag: measure story point output for teams working in high-debt areas vs. low-debt areas
- Onboarding cost: time for a new developer to produce their first commit in a module

**Interest rate heuristic** (when no measurement data available):
| Debt Category | Monthly Interest Rate |
|--------------|----------------------|
| Undocumented critical path | 5–8% of principal/month |
| High coupling module | 3–5% of principal/month |
| Missing test coverage | 4–6% of principal/month |
| God Object / Big Ball of Mud | 6–10% of principal/month |

### Debt Ratio
Industry benchmark for acceptable technical debt:
```
Debt Ratio = Total Debt Principal (hours) / Total Development Cost (hours)
```
- **< 5%**: Healthy — debt is manageable
- **5–10%**: Warning — schedule debt payoff sprints
- **10–20%**: Danger — debt is slowing delivery significantly
- **> 20%**: Critical — debt payoff must be a top priority before new features

## Debt Register Template

Use this table to capture all identified debt items:

| ID | Module | SQALE Axis | Indicator | Principal (hrs) | Interest ($/mo) | Priority |
|----|--------|-----------|-----------|----------------|----------------|---------|
| D01 | [module] | Maintainability | God Object | [n hrs] | [$n/mo] | P1 |
| D02 | [module] | Testability | No tests, CC=18 | [n hrs] | [$n/mo] | P1 |
| D03 | [module] | Changeability | Circular dependency | [n hrs] | [$n/mo] | P2 |

**Priority scoring:**
```
Priority Score = (Interest Rate × Principal) / (Remediation Effort × Risk of Remediation)
```
Higher score = pay off first.

## Hotspot Cross-Reference

Cross-correlate SQALE findings with code-archaeologist data to identify the highest-impact debt items:

| Module | Cyclomatic Complexity | Coupling (Ce) | Age (yrs) | SQALE Debt (hrs) | Hotspot Score |
|--------|----------------------|--------------|----------|-----------------|--------------|
| [mod] | [CC] | [Ce] | [age] | [hrs] | (CC×0.3 + Ce×0.3 + Age×0.2 + Debt×0.2) |

**Hotspot Score > 15**: Address in Phase 0 (pre-migration hardening)
**Hotspot Score 8–15**: Address in Phase 1
**Hotspot Score < 8**: Address in later phases or accept

## Debt Payoff Strategies

### Strangler Fig Debt Payoff
During incremental migration, pay off debt opportunistically:
- **Boy Scout Rule**: Every bounded context migration leaves tests and documentation behind
- **Characterization test debt**: Install Golden Master tests as part of Phase 0 for every module in migration scope
- **Documentation debt**: Write architecture decision records (ADRs) for every technology selection and major design decision

### Technical Debt Sprint
For debt that cannot be addressed opportunistically:
1. Quantify total debt principal for the sprint scope
2. Set a debt budget (e.g., 20% of sprint velocity dedicated to debt payoff)
3. Prioritize by Priority Score (highest first)
4. Measure velocity impact before and after: debt payoff should show velocity improvement within 2 sprints

### Debt Acceptance Criteria
Some debt should be accepted, not paid off:
- **Legacy-only debt**: Modules scheduled for retirement in Phase 1–2 — accept and retire rather than refactor
- **Low-interest debt**: Interest < $100/month and not on migration critical path — accept with documentation
- **External dependency debt**: Third-party library issues — track separately; address during dependency upgrade sprints

## SQALE Reporting Format

```
# Technical Debt Assessment Report

## Summary
- **Total Debt Principal**: [n hours] / [$amount at $X/hour]
- **Debt Ratio**: [%]
- **Monthly Carrying Cost**: [$amount/month]
- **Debt Payoff Timeline** (at [budget hrs/sprint]): [n sprints]

## By SQALE Axis
| Axis | Debt Items | Principal (hrs) | % of Total |
|------|-----------|----------------|-----------|
| Reliability | [n] | [hrs] | [%] |
| Security | [n] | [hrs] | [%] |
| Maintainability | [n] | [hrs] | [%] |
| Changeability | [n] | [hrs] | [%] |
| Testability | [n] | [hrs] | [%] |

## Top 10 Priority Debt Items
[Ranked by Priority Score — highest first]

## Recommended Payoff Schedule
[Phase-aligned debt payoff plan]
```
