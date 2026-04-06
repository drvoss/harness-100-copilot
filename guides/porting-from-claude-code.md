# Porting from Claude Code to Copilot CLI

This guide explains how to port a harness from the original
[revfactory/harness-100](https://github.com/revfactory/harness-100) (Claude Code)
to this repository's Copilot CLI format.

## Step 1: Understand the Original Harness

1. Open the original harness directory: `en/{nn}-{name}/.claude/`
2. Read `CLAUDE.md` — understand the agent team and their responsibilities
3. Read each agent file in `.claude/agents/` — note domain expertise and output formats
4. Read the orchestrator skill in `.claude/skills/{name}/skill.md` — map the workflow

Key questions to answer:
- How many agents? What are their roles?
- What artifacts does each agent produce?
- What does each `SendMessage(target, content)` call pass to the target?
- What are the parallel vs. sequential dependencies?

## Step 2: Create the Directory Structure

```
harnesses/{nn}-{name}/
├── HARNESS.md
├── agents/
│   └── (agent files will go here)
└── skills/
    ├── {orchestrator}/SKILL.md
    ├── {domain-skill-1}/SKILL.md
    └── {domain-skill-2}/SKILL.md
```

## Step 3: Map SendMessage to File Bus

For each `SendMessage(target, content)` in the original, create:

1. A message file path: `_workspace/messages/{from-agent}-to-{target}.md`
2. A structured format for the content being passed
3. Instructions in the sending agent to write this file on completion
4. Instructions in the receiving agent to read this file before starting

**Example mapping:**

Original:
```pseudocode
// style-inspector completes → calls:
SendMessage(synthesizer, {
  "findings": [...],
  "sensitive_items": [...],
  "complex_functions": [...]
})
```

Copilot CLI version (in style-inspector.md):
```markdown
## Message Protocol (File-Based)
When work is complete, write summary to:
`_workspace/messages/style-inspector-to-review-synthesizer.md`

Format:
```
STATUS: COMPLETE
FINDINGS:
- [summary]
SENSITIVE_INFO_FOR_SECURITY:
- [items]
COMPLEX_FUNCTIONS_FOR_PERFORMANCE:
- [items]
```
```

## Step 4: Port Each Agent File

For each `.claude/agents/{agent}.md`, create `agents/{agent}.md` with:

```markdown
---
name: {agent-name}
description: "Use when [trigger] — [what it does]. Part of the {harness-name} harness."
metadata:
  harness: {harness-name}
  role: specialist | orchestrator | synthesizer | qa
---
```

Then adapt the original content, adding:
- **Input Contract** section (what to read from `_workspace/`)
- **Output Contract** section (what to write to `_workspace/`)
- **Message Protocol** section (for handoff-producing agents — write to `_workspace/messages/`)
- **Quality Gates** checklist (self-validation before completion)

Keep unchanged:
- Domain knowledge (OWASP, SOLID, DORA metrics, etc.)
- Output formats and templates
- Working principles

## Step 5: Port the Orchestrator Skill

For `.claude/skills/{name}/skill.md`, create `skills/{name}/SKILL.md` with:

1. **Description** — Use trigger-first pattern (see below)
2. **Phase 1: Setup** — Orchestrator reads input, creates `_workspace/`
3. **Phase N: Agent steps** — Replace parallel `Agent()` calls with sequential `task()` calls
4. **Error handling** — Same strategies, adapted for file bus
5. **Scale modes** — Preserve the original's full/reduced/single modes

### SendMessage → task() Conversion

**Original (parallel):**
```pseudocode
// Tasks 1a-1d run in parallel
Task(style-inspector, ...)
Task(security-analyst, ...)
Task(performance-analyst, ...)
Task(architecture-reviewer, ...)
```

**Copilot CLI (sequential with message bus):**
```
# Step 2.1
task(agent_type="general-purpose",
     description="You are style-inspector. Read _workspace/00_input.md. ... Write to _workspace/01_style_review.md and _workspace/messages/style-inspector-to-review-synthesizer.md.")

# Step 2.2
task(agent_type="general-purpose",
     description="You are security-analyst. Read _workspace/00_input.md and _workspace/messages/style-inspector-to-review-synthesizer.md. ... Write to _workspace/02_security_review.md and _workspace/messages/security-analyst-to-review-synthesizer.md.")
```

Note: if agents are truly independent (no information to share), you can point all agents to read only `00_input.md` and run them in any order.

## Step 6: Write the Trigger-First Description

The SKILL.md `description` field is the most important line — it's what triggers the skill.

**❌ Bad (passive):**
```yaml
description: "Code review harness using 4 specialist agents"
```

**✅ Good (trigger-first):**
```yaml
description: "Use when you need thorough code review of a PR or file set — dispatches style-inspector, security-analyst, performance-analyst, and architecture-reviewer in sequence, then synthesizes findings into a prioritized action report. Covers correctness, security vulnerabilities, performance bottlenecks, and architecture alignment. Does NOT cover runtime testing, deployment validation, or auto-merging PRs."
```

Pattern:
```
"Use when [specific scenario] — [what it does, how, by whom]. Covers [scope]. Does NOT cover [exclusions]."
```

## Step 7: Write HARNESS.md

Create `HARNESS.md` from the `CLAUDE.md` template:

```markdown
# {NN} — {Harness Name}

{One paragraph description}

## Structure
[directory tree]

## Usage
[example triggers]

## Workspace Artifacts
[list of _workspace/ files]

## Installation
[cp command]

## Attribution
Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100) under Apache 2.0 License.
Key adaptation: SendMessage peer communication replaced with file-based message bus.
```

## Step 8: Port Domain Skills

For each `.claude/skills/{domain-skill}/skill.md`, create `skills/{domain-skill}/SKILL.md`.

Domain skills (non-orchestrator) are reference libraries embedded in the harness.
They:
- Extend specific agents with pattern libraries, checklists, or lookup tables
- Have a trigger-first description referencing the parent agent
- Don't coordinate other agents themselves

## Step 9: Validate

```bash
npm test
```

The test suite checks:
- `HARNESS.md` exists
- All agent files exist
- Orchestrator SKILL.md exists
- Descriptions use trigger-first pattern
- Attribution section present

## Porting Difficulty Levels

| Difficulty | SendMessage Dependency | Approach |
|-----------|----------------------|----------|
| Low | None / minimal | Direct file output mapping |
| Medium | Sequential (A→B→C) | Message chain, each reads previous |
| High | Complex parallel + cross-validation | Break into phases, use broadcast messages |

## Common Mistakes

1. **Forgetting required message protocols** — Handoff-producing agents that don't write message files break the chain (terminal/synthesizer agents are exempt)
2. **Too much in one task description** — Keep each `task()` call focused on one agent
3. **Not reading prerequisite messages** — Agent B must explicitly read Agent A's message
4. **Passive skill description** — Will never trigger; always use trigger-first pattern
5. **Missing attribution** — Every HARNESS.md must have the Attribution section
