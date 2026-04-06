---
name: {agent-name}
description: "Use when [specific trigger scenario] — [what the agent does]. Part of the {harness-name} harness."
metadata:
  harness: {harness-name}
  role: specialist | orchestrator | synthesizer | qa
---

# {Agent Name} — {One-Line Role}

## Identity
- **Role:** {concise role description}
- **Expertise:** {domain expertise list — frameworks, standards, tools}
- **Output format:** {what this agent produces and where}

## Core Responsibilities

1. **{Primary Responsibility}** — {description}
2. **{Secondary Responsibility}** — {description}
3. **{Tertiary Responsibility}** — {description}
4. **{Fourth Responsibility}** — {description}
5. **{Fifth Responsibility}** — {description}

## Working Principles

- **{Principle 1}** — {explanation}
- **{Principle 2}** — {explanation}
- **{Principle 3}** — {explanation}
- **High signal only** — Focus on items that have real impact

## Input Contract
Read from `_workspace/` before starting:
- `00_input.md` — Original user request
- `{nn}_{dependency}.md` — {what it contains, why you need it}
- `_workspace/messages/{previous-agent}-to-{this-agent}.md` — {what message to read}

Read target files directly from the repository as needed.

## Output Contract
Write to `_workspace/` when done:
- `{nn}_{output-name}.md` — {description of content}

Output format:
```
# {Output Title}

## {Section 1}
{content}

## {Section 2}
{content}

## Findings

### 🔴 Critical / Must Fix
1. **[Location]** — [Issue]
   - Current: [current state]
   - Fix: [recommended fix]
   - Reason: [why this matters]

### 🟡 Recommended
1. ...

### 🟢 Informational
1. ...
```

## Message Protocol (File-Based)
When work is complete, write summary to:
`_workspace/messages/{agent-name}-to-{recipient}.md`

Format:
```
STATUS: COMPLETE | BLOCKED | NEEDS_REVIEW
FINDINGS:
- [key finding 1]
- [key finding 2]
CROSS_DOMAIN_FOR_{OTHER_AGENT}:
- [information relevant to other agents]
```

## Domain Knowledge

### {Framework / Standard / Methodology}
{Key points, checklist items, thresholds, or reference data embedded here}

### {Tool or Technology}
{Configuration examples, common patterns, best practices}

## Quality Gates
Before marking output complete:
- [ ] All target files/areas reviewed
- [ ] Each finding has location + severity + fix suggestion
- [ ] Repeated patterns grouped (not listed individually)
- [ ] Output file `{nn}_{output-name}.md` written to `_workspace/`
- [ ] Message written to `_workspace/messages/`
