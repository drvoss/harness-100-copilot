# Copilot CLI Adaptation Rules

Rules to follow when generating or porting harnesses for Copilot CLI.
These rules differ from the original Claude Code (revfactory/harness-100) conventions.

---

## Rule 1: Replace SendMessage with File-Bus

Original Claude Code harnesses use `SendMessage("target-agent", payload)` for
peer-to-peer agent communication. Copilot CLI has no SendMessage API.

**Replacement pattern:**

```
// Original (Claude Code)
SendMessage("synthesizer", { findings: results, severity: "HIGH" })

// Copilot CLI replacement
// In the sending agent's Output Contract:
// "Write to _workspace/messages/{this}-to-synthesizer.md"
// Format:
// STATUS: COMPLETE
// FINDINGS:
// - {finding 1}
// SEVERITY: HIGH

// In the receiving agent's Input Contract:
// "Read _workspace/messages/{sender}-to-{this}.md before starting"
```

Every `SendMessage` in the original must become:
1. An **Output Contract** entry in the sending agent
2. An **Input Contract** entry in the receiving agent
3. A line in the **Workspace Layout** in HARNESS.md

---

## Rule 2: Explicit Workspace Layout

Every HARNESS.md and every orchestrator SKILL.md must include a complete
`_workspace/` layout section. Users need to know what files to expect.

**Required format:**
```
_workspace/
├── 00_input.md              (orchestrator setup — always first)
├── 01_{agent1_output}.md    (first specialist output)
├── 02_{agent2_output}.md    (second specialist output)
├── ...
├── {n}_{final_output}.md    (synthesizer/reviewer output — always last)
└── messages/
    ├── {agent1}-to-{agent2}.md
    └── {agentN}-to-synthesizer.md
```

Numbering rules:
- `00_` prefix: always the input setup file
- `01_` through `0{n}_`: specialist outputs in execution order
- Highest number: final synthesis/report

---

## Rule 3: task() Call Format

Orchestrator SKILL.md must use this exact task() call format:

```
task(agent_type="general-purpose",
     description="You are the {agent-name} agent in the {harness-name} harness.
     Read agents/{agent-name}.md for your full instructions.
     Read _workspace/{input-files}.
     {Task-specific instructions}.
     Write output to _workspace/{nn}_{output-name}.md.
     Write handoff to _workspace/messages/{this}-to-{next}.md with:
     STATUS: COMPLETE
     FINDINGS:
     - {summary of key findings}")
```

Key requirements:
- Always tell the agent to read its own `.md` file first (`agents/{name}.md`)
- Specify exact input files (not "read workspace files")
- Specify exact output file name (not "write results")
- Include the message format in the task description

---

## Rule 4: Trigger-First Descriptions (Required)

All SKILL.md `description:` fields must start with a trigger phrase.

```yaml
# ❌ WRONG
description: "A 5-agent mobile app development harness"
description: "Mobile app builder with iOS, Android, and UX specialists"

# ✅ CORRECT
description: "Use when building a mobile app from scratch, adding major features, or
redesigning the mobile UX. Dispatches ux-architect, ios-specialist, android-specialist,
state-manager, and app-store-optimizer in sequence. Covers UI/UX design through app
store submission. Does NOT cover backend API development (use 18-api-designer for that).
Also triggers on: re-run mobile build, update app architecture, revise store listing."
```

Valid trigger openers: "Use when", "Triggers when", "Activate when", "Deploy when"

---

## Rule 5: Error Handling Table Required

Every orchestrator SKILL.md must include an Error Handling table:

```markdown
## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output missing | Re-run agent once; synthesizer notes "unavailable" |
| Ambiguous input | Apply most common pattern; document in `00_input.md` |
| Conflicting findings | Synthesizer resolves; escalate if unresolvable |
| `_workspace/` conflict | Append `-2` suffix; document in final report |
```

Harness-specific errors (e.g., "API spec file not found") should be added to this table.

---

## Rule 6: Attribution Required

Every HARNESS.md must have an Attribution section.

**For harnesses ported from revfactory/harness-100:**
```markdown
## Attribution
Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/{nn}-{name})
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
```

**For newly generated harnesses (not in harness-100):**
```markdown
## Attribution
Generated harness — not ported from harness-100.
Pattern: {Pattern Name} (see skills/harness-generator/references/agent-design-patterns.md)
```

---

## Rule 7: No model: Directive

Original harness-100 agents specify `model: "claude-opus-4-5"` or similar.
Copilot CLI harnesses omit this — the CLI manages model selection.

```yaml
# ❌ WRONG (Claude Code convention)
---
name: security-analyst
model: "claude-opus-4-5"
description: "..."
---

# ✅ CORRECT (Copilot CLI convention)
---
name: security-analyst
description: "..."
metadata:
  harness: 28-security-audit
  role: specialist
---
```

---

## Rule 8: Scale Modes

Every orchestrator SKILL.md must include a Scale Modes table showing how to run
a reduced version for faster/cheaper execution:

```markdown
## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full audit requested | Full Pipeline | All 5 agents |
| Specific area only (e.g., "security only") | Targeted | threat-modeler + security-reporter |
| Quick check | Minimal | security-reporter with direct analysis |
```

This allows users to get value from partial runs without running all agents.

---

## Rule 9: Terminal Agent Exceptions

Terminal agents (synthesizers, final reviewers, reporters) do NOT need a
Message Protocol section — they have no downstream recipients.

Agents considered terminal by convention:
- Any agent named `*-synthesizer`
- Any agent named `*-reviewer` that is the LAST agent in the pipeline
- Any agent named `*-reporter` that is the LAST agent in the pipeline

These agents skip the `## Message Protocol` section and instead write only to
their final `_workspace/{nn}_report.md` file.

The test suite (tests/validate-harnesses.test.js) already accounts for this exception.
