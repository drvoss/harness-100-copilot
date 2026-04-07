# Orchestrator SKILL.md Template (Copilot CLI)

This is the canonical template for orchestrator SKILL.md files in this repository.
Copy this structure for every new harness orchestrator. Replace all `{placeholders}`.

---

## Full Template

```markdown
---
name: {harness-name}
description: "Use when [trigger scenario — be specific about what user says or does].
Dispatches [list of 3-5 agents] to [what they do], then [synthesis step].
Covers [explicit scope boundary].
Does NOT cover [explicit exclusions — what this harness hands off to other harnesses].
Also triggers on: re-run [name], update [name] findings, revise [name] results,
supplement with additional [scope]."
metadata:
  category: harness
  harness: {nn}-{harness-name}
  agent_type: general-purpose
---

# {Harness Name} — {N}-Agent {Domain} Pipeline

{One-sentence description}: {N} specialist agents collaborate via file-based message bus.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| {agent-1} | `agents/{agent-1}.md` | {role description} | general-purpose |
| {agent-2} | `agents/{agent-2}.md` | {role description} | general-purpose |
| {synthesizer} | `agents/{synthesizer}.md` | Final synthesis | general-purpose |

## Pre-Flight Checks

- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All agent files present in `agents/`
- [ ] {Harness-specific prerequisite}

## Phase 1: Setup

\`\`\`
task(agent_type="general-purpose",
     description="Read the user's request. Create _workspace/ and _workspace/messages/.
     Extract: [key-field-1], [key-field-2], [key-field-3].
     Write to _workspace/00_input.md with sections: FIELD_1, FIELD_2, FIELD_3.")
\`\`\`

## Phase 2: {Primary Work Phase Name}

### Step 2.1 — {First Specialist}

\`\`\`
task(agent_type="general-purpose",
     description="You are the {agent} agent in the {harness-name} harness.
     Read agents/{agent}.md for your full instructions.
     Read _workspace/00_input.md.
     [Specific task — what to analyze, produce, or decide].
     Write output to _workspace/01_{output-name}.md.
     Write handoff to _workspace/messages/{agent}-to-{next}.md with format:
     STATUS: COMPLETE
     FINDINGS:
     - [key finding 1]
     - [key finding 2]")
\`\`\`

### Step 2.2 — {Second Specialist} (after 2.1)

\`\`\`
task(agent_type="general-purpose",
     description="You are the {agent} agent.
     Read agents/{agent}.md for your full instructions.
     Read _workspace/00_input.md and _workspace/messages/{prev}-to-{this}.md.
     [Specific task].
     Write output to _workspace/02_{output-name}.md.
     Write handoff to _workspace/messages/{agent}-to-{next}.md.")
\`\`\`

## Phase 3: {Synthesis Phase Name}

### Step 3.1 — {Synthesizer}

\`\`\`
task(agent_type="general-purpose",
     description="You are the {synthesizer} agent.
     Read agents/{synthesizer}.md for your full instructions.
     Read ALL of: _workspace/00_input.md, _workspace/01_*.md, _workspace/02_*.md,
     and all files in _workspace/messages/.
     Synthesize all findings. Resolve conflicts. Prioritize by impact.
     Write final report to _workspace/{nn}_final_report.md.")
\`\`\`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full domain coverage | Full Pipeline | All {N} agents |
| {Partial scope request} | Reduced | {agent-subset} |
| Quick check | Minimal | {synthesizer} only with direct analysis |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; synthesizer notes "unavailable" for that domain |
| Ambiguous input | Apply most common pattern; document assumptions in `00_input.md` |
| Conflicting findings | Synthesizer resolves; escalate to user only if truly unresolvable |
| `_workspace/` file conflict | Append `-2` suffix to output filename |

## Test Scenarios

1. **Normal case:** User provides [typical input] → All {N} agents run → Final report in `_workspace/`
2. **Partial input:** User provides [minimal input] → Reduced mode → Synthesizer direct analysis
3. **Error case:** [Malformed or missing input] → Orchestrator asks user to clarify before Phase 2

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/{nn}-{name})
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
```

---

## Key Rules for Descriptions

### Trigger-First Pattern (Required)

Every orchestrator SKILL.md `description:` MUST:
1. Start with "Use when..." (not the harness name or a noun phrase)
2. List the agents dispatched ("Dispatches X, Y, Z to...")
3. State scope ("Covers...")
4. State exclusions ("Does NOT cover...")
5. Include follow-up keywords ("Also triggers on: re-run..., update..., revise...")

### Why Follow-up Keywords Matter

Without follow-up keywords, the orchestrator is triggered once and the model does not
recognize "re-run the security audit" as a second invocation of the same skill.
Always add at least 3 re-trigger phrases.

---

## Task() Call Patterns

### Pattern A: Agent reads its own .md file

```
task(agent_type="general-purpose",
     description="You are the {name} agent. Read agents/{name}.md for your full
     instructions, then proceed with the task.")
```

This pattern keeps the orchestrator compact — all agent domain knowledge lives in
the agent .md file, not the orchestrator.

### Pattern B: Direct inline instructions

```
task(agent_type="general-purpose",
     description="You are the {name} agent. [Full inline instructions here].
     Write output to _workspace/{nn}_{name}.md.")
```

Use Pattern B only for simple agents (< 10 instructions). Prefer Pattern A.

---

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| `description: "A harness for X"` | `description: "Use when X..."` |
| Agent reads another agent's workspace file without a message | Add explicit message file in Input Contract |
| Synthesizer receives no handoffs | Each upstream agent writes to `_workspace/messages/{a}-to-synthesizer.md` |
| Missing "Does NOT cover" | Always define explicit boundaries |
| `SendMessage(...)` in any file | Replace with `_workspace/messages/` file write instruction |
