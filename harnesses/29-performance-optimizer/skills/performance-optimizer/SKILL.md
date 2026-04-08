---
name: performance-optimizer
description: "Use when optimizing application or system performance — dispatches profiling-analyst, frontend-optimizer, backend-optimizer, infra-tuner, and performance-reviewer to identify bottlenecks, implement optimizations, and validate improvements with ROI estimation. Covers full-stack performance from Core Web Vitals through API latency, database queries, caching, and infrastructure tuning. Does NOT cover application security review (use security harness), load testing execution, or capacity planning for new systems. Also triggers on: speed up my app, fix slow page load, reduce API latency, optimize Core Web Vitals, tune Kubernetes scaling, reduce infrastructure costs."
metadata:
  category: harness
  harness: 29-performance-optimizer
  agent_type: general-purpose
---

# Performance Optimizer — Full-Stack Performance Pipeline

A 5-agent team profiles system bottlenecks, optimizes frontend and backend performance, tunes infrastructure, and produces a validated improvement report with ROI estimation.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| profiling-analyst | agents/profiling-analyst.md | Bottleneck identification, baseline metrics | general-purpose |
| frontend-optimizer | agents/frontend-optimizer.md | Core Web Vitals, bundles, images, CDN | general-purpose |
| backend-optimizer | agents/backend-optimizer.md | API latency, N+1, Redis caching, pools | general-purpose |
| infra-tuner | agents/infra-tuner.md | HPA, VPA, CDN config, PgBouncer | general-purpose |
| performance-reviewer | agents/performance-reviewer.md | Before/after, ROI, SLOs, budgets | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md                     (system under review, performance targets, current metrics if known)
├── 01_profiling_report.md          (profiling-analyst output: bottleneck map, baseline metrics)
├── 02_frontend_optimizations.md    (frontend-optimizer output)
├── 03_backend_optimizations.md     (backend-optimizer output)
├── 04_infra_tuning.md              (infra-tuner output)
├── 05_performance_review.md        (performance-reviewer output — TERMINAL)
└── messages/
    ├── profiling-analyst-to-frontend-optimizer.md
    ├── profiling-analyst-to-backend-optimizer.md
    ├── frontend-optimizer-to-infra-tuner.md
    ├── backend-optimizer-to-infra-tuner.md
    └── infra-tuner-to-performance-reviewer.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All agent files present in `agents/`
- [ ] System access or metrics data available for profiling

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's performance optimization request. Create _workspace/ and _workspace/messages/ directories. Extract: system_under_review (URL/service/application), performance_targets (LCP target, API latency target, Apdex target), current_metrics (if provided), tech_stack (frontend framework, backend language, database, infrastructure). Write organized input to _workspace/00_input.md with sections: SYSTEM, PERFORMANCE_TARGETS, CURRENT_METRICS, TECH_STACK, ADDITIONAL_CONTEXT.")
```

## Phase 2: Profiling & Analysis

### Step 2.1 — Profiling Analyst

```
task(agent_type="general-purpose",
     description="You are the profiling-analyst agent in the performance-optimizer harness. Read agents/profiling-analyst.md for your full instructions. Read _workspace/00_input.md. Perform comprehensive performance profiling: identify bottlenecks using the USE method (Utilization, Saturation, Errors), establish baseline metrics (P50/P95/P99 latency, RPS, error rate, Apdex score), analyze flame graphs or profiling data if provided, quantify frontend vs backend split, and produce a prioritized bottleneck map. Write full report to _workspace/01_profiling_report.md. Write BOTH: _workspace/messages/profiling-analyst-to-frontend-optimizer.md (with FRONTEND_BOTTLENECKS) AND _workspace/messages/profiling-analyst-to-backend-optimizer.md (with BACKEND_BOTTLENECKS and DATABASE_HINTS). Both messages need STATUS: COMPLETE and BASELINE_METRICS.")
```

## Phase 3: Parallel Optimization (run sequentially)

### Step 3.1 — Frontend Optimizer (reads from 2.1)

```
task(agent_type="general-purpose",
     description="You are the frontend-optimizer agent in the performance-optimizer harness. Read agents/frontend-optimizer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_profiling_report.md, and _workspace/messages/profiling-analyst-to-frontend-optimizer.md. Optimize frontend performance: analyze and fix Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), produce bundle analysis with code splitting plan, design image optimization strategy (WebP/AVIF, lazy loading, srcset), configure CDN caching headers, and define critical CSS strategy. Quantify expected improvement per change. Write to _workspace/02_frontend_optimizations.md. Write handoff to _workspace/messages/frontend-optimizer-to-infra-tuner.md with STATUS: COMPLETE, FINDINGS, CDN_REQUIREMENTS, INFRA_CHANGES. Also consult references/performance-checklist.md for the full frontend performance checklist.")
```

### Step 3.2 — Backend Optimizer (reads from 2.1)

```
task(agent_type="general-purpose",
     description="You are the backend-optimizer agent in the performance-optimizer harness. Read agents/backend-optimizer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_profiling_report.md, and _workspace/messages/profiling-analyst-to-backend-optimizer.md. Optimize backend performance: analyze slow API endpoints, detect and fix N+1 queries (DataLoader/eager loading), design Redis caching strategy (cache-aside, write-through, TTL by data type), size connection pools (PgBouncer formula), and identify async optimization opportunities. Quantify expected latency improvement per change. Write to _workspace/03_backend_optimizations.md. Write handoff to _workspace/messages/backend-optimizer-to-infra-tuner.md with STATUS: COMPLETE, FINDINGS, INFRA_REQUIREMENTS, DATABASE_CHANGES, CACHE_REQUIREMENTS.")
```

## Phase 4: Infrastructure Tuning

### Step 4.1 — Infra Tuner (reads from 3.1 and 3.2)

```
task(agent_type="general-purpose",
     description="You are the infra-tuner agent in the performance-optimizer harness. Read agents/infra-tuner.md for your full instructions. Read _workspace/00_input.md, _workspace/01_profiling_report.md, _workspace/02_frontend_optimizations.md, _workspace/03_backend_optimizations.md, _workspace/messages/frontend-optimizer-to-infra-tuner.md, and _workspace/messages/backend-optimizer-to-infra-tuner.md. Tune infrastructure: configure Kubernetes HPA (CPU/memory targets at 65%, stabilization windows: 60s scale-up, 300s scale-down), apply VPA recommendations for right-sizing, optimize CDN cache hit ratio (target > 90%, fix Vary headers, cache-control headers, enable origin shield), configure PgBouncer (transaction mode, size pools correctly), define auto-scaling warm-up strategy (preStop hooks, readiness probes). Write to _workspace/04_infra_tuning.md. Write handoff to _workspace/messages/infra-tuner-to-performance-reviewer.md with STATUS: COMPLETE, FINDINGS, SCALING_IMPROVEMENTS, CDN_IMPROVEMENTS, RISK_ITEMS, COST_IMPACT.")
```

## Phase 5: Review & Validation

### Step 5.1 — Performance Reviewer (Terminal)

```
task(agent_type="general-purpose",
     description="You are the performance-reviewer agent in the performance-optimizer harness. Read agents/performance-reviewer.md for your full instructions. Read ALL workspace files: _workspace/00_input.md, _workspace/01_profiling_report.md, _workspace/02_frontend_optimizations.md, _workspace/03_backend_optimizations.md, _workspace/04_infra_tuning.md, and all 5 message files in _workspace/messages/. Validate performance improvements: produce before/after comparison table for all key metrics, calculate ROI (revenue impact using Amazon latency-revenue rule, infrastructure cost delta), define CI performance budgets (Lighthouse CI thresholds), define SLOs with error budgets for all critical services, recommend monitoring alert thresholds, and assess rollback risk for each change. Final verdict: APPROVED/CHANGES REQUIRED/BLOCKED. Write to _workspace/05_performance_review.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full performance audit | Full Pipeline | All 5 |
| Frontend only | Frontend Mode | profiling-analyst + frontend-optimizer + performance-reviewer |
| Backend/DB only | Backend Mode | profiling-analyst + backend-optimizer + performance-reviewer |
| Infra tuning only | Infra Mode | profiling-analyst + infra-tuner + performance-reviewer |
| Quick assessment | Review Mode | performance-reviewer (direct analysis from provided metrics) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; performance-reviewer notes unavailable for that domain |
| No profiling data provided | profiling-analyst documents assumptions from tech stack defaults |
| Ambiguous performance target | Default to Google Core Web Vitals Good thresholds; document in 00_input.md |
| Conflicting frontend vs infra requirements | infra-tuner resolves; escalate to user if unresolvable |
| Target not found | Ask user to clarify before proceeding |

## Test Scenarios
1. **Normal case:** "My React+Node.js app is slow, LCP is 4s and API p99 is 800ms" → full pipeline produces profiling + frontend + backend + infra + review report
2. **Existing profiling:** `01_profiling_report.md` already present → skip Phase 2, run optimization agents directly
3. **Error case:** Frontend optimizer output missing → infra-tuner uses profiling data only, performance-reviewer notes partial data

## Performance Standards

### Optimization Workflow (Measure First)

Instruct the profiling-analyst to always follow this 5-step process:

```
1. MEASURE  → Establish baseline with real data (not assumptions)
2. IDENTIFY → Find the actual bottleneck (not assumed bottleneck)
3. FIX      → Address the specific bottleneck identified
4. VERIFY   → Measure again, confirm the improvement with numbers
5. GUARD    → Add monitoring or CI performance budgets to prevent regression
```

**The GUARD step is mandatory.** An optimization without regression protection will be undone by the next feature change. Every optimization must result in either a CI performance budget check or a monitoring alert threshold.

### Core Web Vitals Targets

Instruct the frontend-optimizer to target these thresholds (Google's "Good" tier):

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

Any optimization must demonstrate movement toward the "Good" tier with before/after measurements.

### Performance Budget

Instruct agents to enforce these budgets and flag violations:

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS:               < 50KB gzipped
API response time: < 200ms (P95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: ≥ 90
```

Violations must be included in `_workspace/05_performance_review.md` as actionable findings.

### What Counts as Done

Performance work is only complete when:
1. Before and after measurements exist (specific numbers, not "it feels faster")
2. The specific bottleneck is identified and addressed
3. Core Web Vitals are within "Good" thresholds (or documented deviation with justification)
4. A regression guard is in place (CI budget check or monitoring alert)

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "We'll optimize later" | Performance debt compounds. Fix obvious anti-patterns now, defer micro-optimizations. |
| "It's fast on my machine" | Your machine isn't the user's. Profile on representative hardware and networks. |
| "This optimization is obvious" | If you didn't measure, you don't know. Profile first. |
| "Users won't notice 100ms" | Research shows 100ms delays impact conversion rates. Users notice more than you think. |
| "The framework handles performance" | Frameworks prevent some issues but can't fix N+1 queries or oversized bundles. |

## Red Flags

- Optimization without profiling data to justify it
- N+1 query patterns in data fetching code
- List endpoints without pagination
- Images without dimensions, lazy loading, or responsive sizes
- Bundle size growing without review
- No performance monitoring in production
- Claiming "done" without before/after measurement numbers

## Verification

After the full performance optimization pipeline completes:

- [ ] Before and after measurements documented with specific numbers
- [ ] The specific bottleneck identified (not assumed) and addressed
- [ ] Core Web Vitals within "Good" thresholds (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)
- [ ] JS bundle size under 200KB gzipped (initial load)
- [ ] API P95 response time under 200ms
- [ ] CI performance budget or monitoring alert configured (GUARD step complete)
- [ ] `_workspace/05_performance_review.md` exists with before/after comparison and ROI
