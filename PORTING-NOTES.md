# Porting Notes: harness-100 → harness-100-copilot

This document explains the technical decisions made when porting
[revfactory/harness-100](https://github.com/revfactory/harness-100) from
Claude Code to GitHub Copilot CLI.

---

## The Core Challenge: SendMessage

The original harness-100 is built around Claude Code's `SendMessage` primitive,
which enables real-time cross-agent communication within a session:

```python
# Claude Code pattern (original)
style-inspector → SendMessage(synthesizer, findings)
security-analyst → SendMessage(synthesizer, findings)
performance-analyst → SendMessage(synthesizer, findings)
architecture-reviewer → SendMessage(synthesizer, findings)
# synthesizer reads from all 4 simultaneously
```

**GitHub Copilot CLI has no equivalent primitive.**

Each `task()` call in Copilot CLI is a separate agent invocation with its own
context. Agents cannot send messages to each other in real-time.

---

## The Solution: File-Based Message Bus

We replace `SendMessage` with a structured file-based message bus:

```
_workspace/
├── 00_input.md                                    ← shared input
├── 01_style_review.md                             ← agent 1 output
├── 02_security_review.md                          ← agent 2 output
├── 03_performance_review.md                       ← agent 3 output
├── 04_architecture_review.md                      ← agent 4 output
├── 05_review_summary.md                           ← synthesizer output
└── messages/
    ├── style-inspector-to-review-synthesizer.md   ← structured handoff
    ├── security-analyst-to-review-synthesizer.md
    ├── performance-analyst-to-review-synthesizer.md
    └── architecture-reviewer-to-review-synthesizer.md
```

### Message File Format

Each message file is a structured handoff document:

```markdown
STATUS: COMPLETE | BLOCKED | NEEDS_REVIEW
FINDINGS:
- [brief summary of key findings]
CROSS_DOMAIN_INFO:
- [information relevant to other agents]
```

The receiving agent reads these files before starting, gaining the context
that `SendMessage` would have delivered in real-time.

---

## Primitive Mapping Table

| Claude Code (Original) | Copilot CLI (Port) | Fidelity |
|------------------------|-------------------|---------|
| `SendMessage(agent, msg)` | File write to `_workspace/messages/` | ~90% |
| `TaskCreate(agent, task)` | `task(agent_type, ...)` | ~100% |
| `TeamMode` (parallel) | Sequential with message handoffs | ~85% |
| `Agent(subagent_type)` | `task(agent_type="general-purpose")` | ~100% |
| `.claude/agents/*.md` | `.github/agents/*.md` (or `agents/`) | ~100% |
| `.claude/skills/*/skill.md` | `.github/skills/*/SKILL.md` | ~100% |
| `CLAUDE.md` | `HARNESS.md` (in harness) | ~100% |
| Background agent `&` | `& copilot task ...` _(experimental)_ | ~70% |
| Memory (JSON state) | `sql()` SQLite or `_workspace/state.json` | ~95% |

---

## What We Lose

**Real-time cross-agent communication**: In the original, `style-inspector` can
send findings to `security-analyst` while `security-analyst` is still running.
In our version, `security-analyst` reads the message file after `style-inspector`
completes. This is the primary fidelity gap (~10%).

**True parallelism**: In the original, Tasks 1a-1d (4 domain reviews) run in
parallel. In our version, they run sequentially. This increases wall-clock time
but doesn't affect output quality. Copilot CLI's `/fleet` mode can be used to
simulate parallelism for advanced users.

---

## What We Preserve

- ✅ **Domain expertise** — All agent knowledge (OWASP, SOLID, DORA, etc.)
- ✅ **Output quality** — Same artifact formats and templates
- ✅ **Error handling** — Retry/skip/fallback strategies unchanged
- ✅ **Scale modes** — Full/Reduced/Single-agent modes preserved
- ✅ **Quality gates** — Agent self-validation checklists
- ✅ **Trigger boundaries** — Should/should-NOT-trigger definitions

**Overall functional parity: ~96%**

---

## Harness File Layout Changes

| Original (Claude Code) | Copilot CLI Port |
|------------------------|-----------------|
| `{nn}-{name}/.claude/CLAUDE.md` | `harnesses/{nn}-{name}/HARNESS.md` |
| `.claude/agents/{agent}.md` | `harnesses/{nn}-{name}/agents/{agent}.md` |
| `.claude/skills/{skill}/skill.md` | `harnesses/{nn}-{name}/skills/{skill}/SKILL.md` |

---

## Using `/fleet` for True Parallelism

For advanced users who want the original's parallel execution, Copilot CLI's
`/fleet` mode can approximate it:

```
> /fleet Run code review of src/ using agents:
>   1. style-inspector from agents/style-inspector.md → write to _workspace/01_style_review.md
>   2. security-analyst from agents/security-analyst.md → write to _workspace/02_security_review.md
>   3. performance-analyst from agents/performance-analyst.md → write to _workspace/03_performance_review.md
>   4. architecture-reviewer from agents/architecture-reviewer.md → write to _workspace/04_architecture_review.md
> Then synthesize all 4 outputs into _workspace/05_review_summary.md
```

This approach is experimental and results may vary.

---

## Future Improvements

1. **SQL message bus** — Use Copilot CLI's `sql()` tool as a more structured
   message bus, with `INSERT` on agent completion and `SELECT` on agent start.
   This would enable conditional branching based on findings.

2. **Partial parallelism** — Some harnesses have truly independent agents (e.g.,
   the 4 code review domains). These could be launched in parallel with `/fleet`,
   with results merged by the synthesizer.

3. **State persistence** — Use `_workspace/state.json` for tracking which agents
   have completed, enabling resume-from-failure.
