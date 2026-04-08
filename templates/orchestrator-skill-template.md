---
name: {harness-name}
description: "Use when [specific trigger scenarios — be concrete]. Covers [scope]. Does NOT cover [explicit exclusions]."
metadata:
  category: harness
  harness: {nn}-{harness-name}
  agent_type: general-purpose
---

# {Harness Name} — {Team} Development Pipeline

{Brief description}: {N} specialist agents collaborate through {phases} using file-based message routing.

## Execution Mode

**File-Bus Team** — Agents communicate via `_workspace/messages/`, orchestrator sequences execution.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| {agent-1} | `agents/{agent-1}.md` | {role} | general-purpose |
| {agent-2} | `agents/{agent-2}.md` | {role} | general-purpose |
| {agent-3} | `agents/{agent-3}.md` | {role} | general-purpose |
| {agent-4} | `agents/{agent-4}.md` | {role} | general-purpose |
| {synthesizer} | `agents/{synthesizer}.md` | Final synthesis | general-purpose |

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All agent files present in `agents/`
- [ ] {Harness-specific prerequisite}

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's request. Create _workspace/ and _workspace/messages/ directories. Extract: [field-1], [field-2], [field-3]. Write organized input to _workspace/00_input.md with sections: FIELD_1, FIELD_2, FIELD_3.")
```

## Phase 2: {Primary Work}

### Step 2.1 — {First Agent}
```
task(agent_type="general-purpose",
     description="You are the {agent} agent. Read agents/{agent}.md for your full instructions. Read _workspace/00_input.md. [Specific task instructions]. Write output to _workspace/{nn}_{output}.md and write message to _workspace/messages/{agent}-to-{recipient}.md.")
```

### Step 2.2 — {Second Agent} (reads message from 2.1)
```
task(agent_type="general-purpose",
     description="You are the {agent} agent. Read agents/{agent}.md for your full instructions. Read _workspace/00_input.md and _workspace/messages/{previous-agent}-to-{this-agent}.md. [Specific task instructions]. Write output to _workspace/{nn}_{output}.md and write message to _workspace/messages/{agent}-to-{recipient}.md.")
```

## Phase 3: {Synthesis / Review}

### Step 3.1 — {Synthesizer/Reviewer}
```
task(agent_type="general-purpose",
     description="You are the {synthesizer} agent. Read agents/{synthesizer}.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/{01}_{output1}.md, _workspace/{02}_{output2}.md, and all message files in _workspace/messages/. [Synthesis instructions]. Write final report to _workspace/{nn}_{final}.md.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full request | Full Pipeline | All N |
| {Partial request pattern} | {Mode Name} | {subset} |
| {Minimal request} | Minimal | {agents} |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; synthesizer notes "unavailable" for that domain |
| Ambiguous input | Apply most common pattern, document assumptions in `00_input.md` |
| Conflicting findings | Synthesizer resolves; escalate to user only if truly unresolvable |
| Target not found | Ask user to clarify before proceeding |

## Test Scenarios
1. **Normal case:** {typical input description} → {expected output}
2. **Existing artifacts:** `_workspace/` already has some files → skip corresponding phases
3. **Error case:** {malformed input or missing dependency} → {fallback behavior}

## Attribution
Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/{nn}-{name})
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "{common excuse for skipping this harness}" | {why the excuse doesn't hold, with consequence} |
| "{common time-pressure excuse}" | {why deferral is more costly than doing it now} |
| "{common simplification rationalization}" | {why the simplification is a false economy} |

## Red Flags

- {Warning sign that this skill is being applied incorrectly or skipped}
- {Indicator that the wrong scale mode was selected}
- {Sign that outputs are being accepted without verification}
- {Pattern that indicates the pipeline is being short-circuited}

## Verification

After the pipeline completes:

- [ ] All agent outputs exist in `_workspace/` (no missing files)
- [ ] Final report (`_workspace/{nn}_{final}.md`) contains a clear verdict
- [ ] All Critical findings are resolved or explicitly escalated
- [ ] `_workspace/messages/` contains all handoff messages
- [ ] {Domain-specific completion criterion}
