# Skill Writing Guide for Copilot CLI Harnesses

Adapted from revfactory/harness skill-writing-guide.md for Copilot CLI conventions.

---

## Core Principle: Description is Everything

The model sees only `name` + `description` when deciding whether to invoke a skill.
A weak description means the skill never triggers. Every description must be "pushy."

### Required Elements (in order)

1. **Trigger situation** — "Use when [concrete user scenario]"
2. **Dispatched agents** — "Dispatches X, Y, Z to [action]"
3. **Coverage scope** — "Covers [list]"
4. **Explicit exclusions** — "Does NOT cover [list]" (prevent false activations)
5. **Follow-up keywords** — "Also triggers on: re-run, update, revise, supplement"

### Before / After

**Before (weak):**
```yaml
description: "Code review harness with 4 specialist agents"
```

**After (strong):**
```yaml
description: "Use when reviewing a PR, file set, or recent commits for quality issues.
Dispatches style-inspector, security-analyst, performance-analyst, and architecture-reviewer
in sequence, then synthesizes into a prioritized action report. Covers correctness,
OWASP vulnerabilities, performance bottlenecks, and architecture alignment.
Does NOT cover runtime testing or deployment validation.
Also triggers on: re-run review, update review findings, revise security analysis."
```

---

## Core Principle: Why-First

In SKILL.md body text, explain the *reason* before the *rule*.

**Wrong (rule without reason):**
```markdown
ALWAYS write output to _workspace/
NEVER skip the synthesis phase
```

**Right (reason first):**
```markdown
Write output to _workspace/ so downstream agents can read findings without additional
tool calls or state passing — the file bus is the only shared state in this harness.

The synthesis phase resolves conflicts between specialist findings. Individual analysts
may flag the same issue at different severity levels; the synthesizer applies a consistent
severity framework and eliminates duplicates.
```

---

## Core Principle: Progressive Disclosure

Split content into three levels to manage context window pressure:

```
Level 1: SKILL.md frontmatter
         → Model always loads this (name + description)
         → Max ~150 words; trigger-first required

Level 2: SKILL.md body
         → Loaded when skill activates
         → Execution phases, error handling, scale modes
         → Target 200-400 lines

Level 3: references/ files
         → Loaded only when explicitly referenced in task() instructions
         → Domain knowledge, checklists, examples, standards
         → Files over 300 lines MUST have a table of contents at top
```

**Example structure:**
```
skills/security-audit/
├── SKILL.md                    (phases, error handling — always loaded)
└── references/
    ├── owasp-top10.md          (OWASP details — referenced by code-security-analyst)
    └── cvss-scoring.md         (CVSS framework — referenced by security-reporter)
```

---

## Agent File Structure (Canonical)

Every agent .md file follows this exact structure:

```markdown
---
name: {agent-name}
description: "Use when [scenario] — [what this agent does]. Part of {harness-name}."
metadata:
  harness: {nn}-{harness-name}
  role: specialist | synthesizer | orchestrator | qa
---

# {Agent Name} — {One-Line Role}

## Identity
- **Role:** {one sentence}
- **Expertise:** {domains, frameworks, tools}
- **Output format:** {file path and content type}

## Core Responsibilities
1. **{Primary}** — {why this matters}
2. **{Secondary}** — {why this matters}
...

## Working Principles
- **{Principle}** — {reason why, not just the rule}

## Input Contract
Read from `_workspace/` before starting:
- `00_input.md` — user request
- `messages/{prev}-to-{this}.md` — upstream handoff

## Output Contract
Write to `_workspace/` when done:
- `{nn}_{output}.md` — {content description}

## Message Protocol (File-Based)
When complete, write to `_workspace/messages/{this}-to-{next}.md`:
STATUS: COMPLETE | BLOCKED | NEEDS_REVIEW
FINDINGS:
- {key finding 1}
CROSS_DOMAIN_FOR_{OTHER_AGENT}:
- {info for other agents}

## Domain Knowledge
{Embedded standards, checklists, frameworks — not in references/ unless 300+ lines}

## Quality Gates
- [ ] Output file written to `_workspace/`
- [ ] Message written to `_workspace/messages/`
- [ ] {Domain-specific gate}
```

---

## Agent Separation Decision Framework

Ask these 4 questions before creating a new agent vs. merging with an existing one:

| Question | Yes → Separate | No → Merge |
|----------|---------------|-----------|
| Does it need different domain knowledge? | Separate | Merge |
| Can it run independently (no blocking dep)? | Separate | Merge |
| Would a single agent exceed 300 lines of instructions? | Separate | Merge |
| Is this agent reused across other harnesses? | Separate | Merge |

**Rule of thumb:** 4-6 agents is the sweet spot. Under 4 — consider merging.
Over 6 — consider Hierarchical pattern with 2-tier structure.

---

## Message Format Consistency

All message files use exactly this format:

```
STATUS: COMPLETE | BLOCKED | NEEDS_REVIEW
FINDINGS:
- [concrete finding, not vague summary]
- [each finding actionable or informational]
CROSS_DOMAIN_FOR_{AGENT_NAME}:
- [specific info for that agent — optional]
RECOMMENDATIONS:
- [action items — optional, for pipeline patterns]
```

The `CROSS_DOMAIN_FOR_` section is how agents share information without tight coupling.
The receiving agent checks for this section in the message and incorporates it.

---

## Scripting Conventions

Create a `scripts/` folder in the harness directory when:
1. The same shell command runs 3+ times across agent instructions
2. The same `pip install` or `npm install` is repeated
3. A multi-step helper sequence would be repeated verbatim

Example: if `security-audit` always runs `npm audit && pip-audit --format json`:
```
harnesses/28-security-audit/
└── scripts/
    └── run-audit.sh
```

---

## Reference File Guidelines

- Files under 100 lines: embed content directly in agent Domain Knowledge section
- Files 100-300 lines: use `references/` with a 2-line description at top
- Files over 300 lines: **required** table of contents at the top of the file
- Domain separation: one file per major framework (`references/owasp-top10.md`,
  not one giant `references/security.md`)

---

## Skill Anatomy Principles

*"Process, not prose. Skills are workflows agents follow, not reference docs they read."*
— Inspired by addyosmani/agent-skills docs/skill-anatomy.md

### Each Step Must Have a Verifiable Output

Every step in a SKILL.md workflow must produce a concrete, checkable artifact. "Seems right" is not done.

**Wrong (no verifiable output):**
```markdown
### Step 2.1 — Analyzer
task(description="Analyze the codebase and identify issues.")
```

**Right (verifiable output specified):**
```markdown
### Step 2.1 — Analyzer
task(description="...Write findings to _workspace/01_analysis.md. 
Write handoff to _workspace/messages/analyzer-to-reviewer.md with STATUS: COMPLETE.")
```

The output file IS the proof of completion. If the file doesn't exist, the step didn't complete.

### Write Workflows, Not Prose

Skills should describe processes agents execute, not explanations agents read. Every sentence should either:
- Describe an action the agent takes
- Specify a condition that determines which action to take
- Define the output format of an action

If a sentence is explanation rather than instruction, it belongs in a `references/` file, not the SKILL.md body.

### Red Flags Section Is Mandatory

Every SKILL.md must include a Red Flags section. This enables agents to self-detect when they're misapplying the skill:

```markdown
## Red Flags
- {Specific observable sign that this skill is being applied incorrectly}
- {Specific sign that a required step is being skipped}
- {Specific sign that outputs are being accepted without verification}
```

Red flags should be concrete and observable, not vague ("if things seem wrong"). An agent reading a red flag should be able to immediately recognize whether it applies to the current situation.

### Verification Section Is Mandatory

Every SKILL.md must include a Verification section with a checklist of completion evidence:

```markdown
## Verification
- [ ] {Specific file exists at specific path}
- [ ] {Specific condition is true in that file}
- [ ] {Domain-specific criterion that can be checked without interpretation}
```

"The pipeline ran" is not verification. "All 5 output files exist in `_workspace/` and `05_final.md` contains a verdict of APPROVED, CHANGES REQUESTED, or BLOCKED" is verification.
