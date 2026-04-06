# `_workspace/` Layout Conventions

Every harness uses a consistent `_workspace/` directory layout for outputs and agent communication.

## Standard Layout

```
_workspace/
├── 00_input.md                    ← Orchestrator writes this first
├── 01_{first-output}.md           ← First agent's primary output
├── 02_{second-output}.md          ← Second agent's primary output
├── 03_{third-output}.md           ← Third agent's primary output
├── ...
├── {nn}_{final-report}.md         ← Synthesizer's final output
└── messages/                      ← Agent-to-agent communication
    ├── {agent-a}-to-{agent-b}.md  ← Handoff from A to B
    ├── {agent-a}-to-all.md        ← Broadcast handoff (if needed)
    └── ...
```

## File Naming Conventions

### Primary Output Files
```
{order}_{agent-role}_{artifact}.md
Examples:
  01_style_review.md
  02_security_review.md
  01_architecture.md
  02_api_spec.md
```

- `{order}`: Two-digit zero-padded number (00, 01, 02...)
- `{agent-role}`: Short identifier for the producing agent
- `{artifact}`: Artifact type (review, spec, design, report, etc.)

### Message Files
```
{from-agent}-to-{to-agent}.md
{from-agent}-to-all.md         ← when broadcasting to all subsequent agents

Examples:
  style-inspector-to-review-synthesizer.md
  architect-to-all.md
  pipeline-designer-to-pipeline-reviewer.md
```

## `00_input.md` Format

The orchestrator always creates `00_input.md` first. Standard sections:

```markdown
# Input: {Harness Name}

## Request
{Original user request, verbatim or paraphrased}

## Extracted Parameters
- **{Parameter 1}**: {value}
- **{Parameter 2}**: {value}
- **Scope**: {what's in / out}

## Assumptions
- {Assumption 1 — document when user didn't specify}
- {Assumption 2}

## Target Files / Resources
{List of files, PRs, URLs, or other resources to work with}
```

## Message File Format

```markdown
STATUS: COMPLETE | BLOCKED | NEEDS_REVIEW

FINDINGS:
- {Key finding 1}
- {Key finding 2}

{DOMAIN}_FOR_{RECIPIENT}:
- {Information specifically relevant to the recipient agent}

BLOCKERS:
- {Only if STATUS is BLOCKED: what is blocking and what is needed}
```

## Workspace Lifecycle

1. **Create** — Orchestrator creates `_workspace/` and `_workspace/messages/` at start
2. **Populate** — Each agent writes its output file + message file
3. **Read** — Each subsequent agent reads relevant predecessors
4. **Synthesize** — Final agent reads all outputs + messages
5. **Archive** — User can save `_workspace/` to track session history
6. **Clean** — Delete `_workspace/` before a new run (or confirm stale)

## Multi-Run Handling

If `_workspace/` already exists when a harness starts:

1. Orchestrator checks for existing files
2. If files match expected outputs: skip corresponding agents (resume mode)
3. If files are stale/incomplete: confirm with user before overwriting
4. If user says "start fresh": delete `_workspace/` and restart

## Example: code-reviewer Workspace

```
_workspace/
├── 00_input.md                                    ← "Review PR #42 for security"
├── 01_style_review.md                             ← style-inspector output
├── 02_security_review.md                          ← security-analyst output
├── 03_performance_review.md                       ← performance-analyst output
├── 04_architecture_review.md                      ← architecture-reviewer output
├── 05_review_summary.md                           ← review-synthesizer output
└── messages/
    ├── style-inspector-to-review-synthesizer.md
    ├── security-analyst-to-review-synthesizer.md
    ├── performance-analyst-to-review-synthesizer.md
    └── architecture-reviewer-to-review-synthesizer.md
```
