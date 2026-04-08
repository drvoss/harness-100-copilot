---
name: code-reviewer
description: "Use when you need thorough code review of a PR or file set — dispatches style-inspector, security-analyst, performance-analyst, and architecture-reviewer in sequence, then synthesizes findings into a prioritized action report. Covers correctness, security vulnerabilities, performance bottlenecks, and architecture alignment. Does NOT cover runtime testing, deployment validation, or auto-merging PRs. Also triggers on: re-run, update, revise, supplement."
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

## Phase 2: Sequential Domain Reviews (file-bus port of original parallel step)

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

## Review Standards

### Change Sizing Guidelines

Small, focused changes are easier to review, faster to merge, and safer to deploy.

```
~100 lines changed   → Good. Reviewable in one sitting.
~300 lines changed   → Acceptable if it's a single logical change.
~1000 lines changed  → Too large. Request the author to split it.
```

When a PR is too large, use these splitting strategies:

| Strategy | How | When |
|----------|-----|------|
| **Stack** | Submit a small change, start the next one based on it | Sequential dependencies |
| **By file group** | Separate changes for groups needing different reviewers | Cross-cutting concerns |
| **Horizontal** | Create shared code/stubs first, then consumers | Layered architecture |
| **Vertical** | Break into smaller full-stack slices of the feature | Feature work |

**Separate refactoring from feature work.** A change that refactors existing code and adds new behavior is two changes.

### Severity Labels for Review Findings

Every review comment should be labeled so the author knows what is required vs optional:

| Label | Meaning | Author Action |
|-------|---------|---------------|
| *(no prefix)* | Required change | Must address before merge |
| **Critical:** | Blocks merge | Security vulnerability, data loss, broken functionality |
| **Nit:** | Minor, optional | Author may ignore — formatting, style preferences |
| **Optional:** / **Consider:** | Suggestion | Worth considering but not required |
| **FYI** | Informational only | No action needed — context for future reference |

Instruct all reviewer agents to label their findings accordingly.

### Multi-Model Review Pattern

Use different agents for different review perspectives to catch blind spots:

```
style-inspector reviews for conventions
        │
        ▼
security-analyst reviews for vulnerabilities (reads style findings)
        │
        ▼
performance-analyst reviews for bottlenecks (reads security findings)
        │
        ▼
architecture-reviewer reviews for design (reads previous findings)
        │
        ▼
review-synthesizer aggregates and resolves conflicts → final verdict
```

Different models have different blind spots. The sequential pipeline ensures each specialist can incorporate prior findings, and the synthesizer resolves conflicts with a consistent severity framework.

### Dead Code Hygiene

After any refactoring review, instruct agents to check for orphaned code:

1. Identify code that is now unreachable or unused
2. List it explicitly in their review output
3. **Do not silently delete** — note it as: "Should these now-unused elements be removed: [list]?"

Dead code confuses future readers and agents. Explicit identification prevents silent deletion of code the author may have intended to keep.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It works, that's good enough" | Working code that's unreadable, insecure, or architecturally wrong creates debt that compounds. |
| "I wrote it, so I know it's correct" | Authors are blind to their own assumptions. Every change benefits from another set of eyes. |
| "We'll clean it up later" | Later never comes. The review is the quality gate — use it. |
| "AI-generated code is probably fine" | AI code needs more scrutiny, not less. It's confident and plausible, even when wrong. |
| "The tests pass, so it's good" | Tests are necessary but not sufficient. They don't catch architecture problems, security issues, or readability concerns. |

## Red Flags

- PRs merged without any review
- Review that only checks if tests pass (ignoring other axes)
- "LGTM" without evidence of actual review (rubber-stamping)
- Security-sensitive changes without security-focused review
- Large PRs that are "too big to review properly" — split them instead
- No regression tests accompanying a bug fix PR
- Review comments without severity labels — authors can't tell what's required vs optional

## Verification

After the full review pipeline completes:

- [ ] All Critical findings are resolved or explicitly escalated to the user
- [ ] All Important/Required findings are resolved or deferred with justification
- [ ] Severity labels applied to all review findings
- [ ] Synthesizer produced a final verdict: APPROVED / CHANGES REQUESTED / BLOCKED
- [ ] Dead code identified (if any refactoring was reviewed)
- [ ] `_workspace/05_review_summary.md` exists and contains the final verdict