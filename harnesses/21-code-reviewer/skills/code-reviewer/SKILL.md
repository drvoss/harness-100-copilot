---
name: code-reviewer
description: "Use when you need thorough code review of a PR or file set — dispatches style-inspector, security-analyst, performance-analyst, and architecture-reviewer in sequence, then synthesizes findings into a prioritized action report. Covers correctness, security vulnerabilities, performance bottlenecks, and architecture alignment. Does NOT cover runtime testing, deployment validation, or auto-merging PRs."
metadata:
  category: harness
  harness: 21-code-reviewer
  agent_type: general-purpose
---

# Code Reviewer — Automated Code Review Pipeline

An agent team systematically reviews code across style, security, performance, and architecture domains, then synthesizes a prioritized final report.

## Execution Mode

**File-Bus Team** — 4 specialist agents write results to `_workspace/`, then synthesizer aggregates. Agents communicate via `_workspace/messages/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| style-inspector | `agents/style-inspector.md` | Conventions, formatting, naming, readability | general-purpose |
| security-analyst | `agents/security-analyst.md` | Vulnerabilities, injection, auth, data exposure | general-purpose |
| performance-analyst | `agents/performance-analyst.md` | Complexity, memory, concurrency, queries | general-purpose |
| architecture-reviewer | `agents/architecture-reviewer.md` | Design patterns, SOLID, dependencies, coupling | general-purpose |
| review-synthesizer | `agents/review-synthesizer.md` | Priority synthesis, conflict resolution, final verdict | general-purpose |

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] Target code or PR number is available

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's code review request. Create _workspace/ and _workspace/messages/ directories. Extract: target code/PR, language/framework, review scope, context. Write organized input to _workspace/00_input.md with sections: TARGET_CODE, LANGUAGE, SCOPE, CONTEXT, STYLE_GUIDE.")
```

## Phase 2: Parallel Domain Reviews

Run all 4 in sequence (each reads from `_workspace/00_input.md`):

### Step 2.1 — Style Inspector
```
task(agent_type="general-purpose",
     description="You are the style-inspector agent. Read agents/style-inspector.md for your full instructions. Read _workspace/00_input.md for the review target. Perform a complete code style review covering naming, formatting, readability, and documentation. Write your full findings to _workspace/01_style_review.md and write a summary message to _workspace/messages/style-inspector-to-review-synthesizer.md following the format in your agent instructions.")
```

### Step 2.2 — Security Analyst
```
task(agent_type="general-purpose",
     description="You are the security-analyst agent. Read agents/security-analyst.md for your full instructions. Read _workspace/00_input.md for the review target. Check _workspace/messages/style-inspector-to-review-synthesizer.md for the SENSITIVE_INFO_FOR_SECURITY section. Perform a complete security review covering OWASP Top 10, CWE classification, injection, auth, and data exposure. Write your full findings to _workspace/02_security_review.md and write a summary message to _workspace/messages/security-analyst-to-review-synthesizer.md.")
```

### Step 2.3 — Performance Analyst
```
task(agent_type="general-purpose",
     description="You are the performance-analyst agent. Read agents/performance-analyst.md for your full instructions. Read _workspace/00_input.md for the review target. Check _workspace/messages/style-inspector-to-review-synthesizer.md for COMPLEX_FUNCTIONS_FOR_PERFORMANCE and _workspace/messages/security-analyst-to-review-synthesizer.md for PERFORMANCE_IMPACT. Perform a complete performance review covering algorithmic complexity, memory, concurrency, and database queries. Write your full findings to _workspace/03_performance_review.md and write a summary message to _workspace/messages/performance-analyst-to-review-synthesizer.md.")
```

### Step 2.4 — Architecture Reviewer
```
task(agent_type="general-purpose",
     description="You are the architecture-reviewer agent. Read agents/architecture-reviewer.md for your full instructions. Read _workspace/00_input.md for the review target. Check _workspace/messages/security-analyst-to-review-synthesizer.md for ARCHITECTURE_CONCERNS and _workspace/messages/performance-analyst-to-review-synthesizer.md for ARCHITECTURE_STRUCTURAL_ISSUES. Perform a complete architecture review covering SOLID, design patterns, coupling, and testability. Write your full findings to _workspace/04_architecture_review.md and write a summary message to _workspace/messages/architecture-reviewer-to-review-synthesizer.md.")
```

## Phase 3: Synthesis

### Step 3.1 — Review Synthesizer
```
task(agent_type="general-purpose",
     description="You are the review-synthesizer agent. Read agents/review-synthesizer.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_style_review.md, _workspace/02_security_review.md, _workspace/03_performance_review.md, _workspace/04_architecture_review.md, and all 4 message files in _workspace/messages/. Synthesize into a final prioritized report. De-duplicate cross-domain findings. Determine final verdict (APPROVED/CHANGES REQUESTED/BLOCKED). Write to _workspace/05_review_summary.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| "Review this code" / "full review" | Full Pipeline | All 5 |
| "Security review only" | Security Mode | security-analyst → review-synthesizer |
| "Performance analysis" | Performance Mode | performance-analyst → review-synthesizer |
| "Architecture review" | Architecture Mode | architecture-reviewer → review-synthesizer |
| "Code style check" | Style Mode | style-inspector → review-synthesizer |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run that agent once; if still missing, synthesizer notes "unavailable" for that domain |
| Target code not found | Ask user to provide file paths or PR number before proceeding |
| Ambiguous review scope | Apply full review, note assumptions in `00_input.md` |

## Test Scenarios
1. **Normal case:** PR number or file paths provided, all 4 domain reviews complete, synthesizer produces verdict
2. **Partial scope:** User asks "security review only" — run only security-analyst and review-synthesizer
3. **Error case:** One agent fails to produce output — synthesizer produces partial report noting missing domain
