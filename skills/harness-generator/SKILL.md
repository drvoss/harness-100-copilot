---
name: harness-generator
description: "Use when you need to create a new multi-agent harness for a domain not yet
covered in this repository, or when asked to 'build a harness', 'design an agent team',
or 'create agents for [domain]'. Analyzes the domain, selects one of 6 architectural
patterns (Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor,
Hierarchical), then generates all agent .md files, SKILL.md files, and HARNESS.md
following Copilot CLI file-bus conventions. Does NOT port existing Claude Code harnesses
— use PORTING-NOTES.md and guides/porting-from-claude-code.md for that.
Also triggers on: re-run harness design, update agent team, revise harness architecture,
supplement harness with additional agents."
metadata:
  category: meta-skill
  type: harness-generator
---

# Harness Generator

Generates a complete multi-agent harness from a domain description: agent definitions,
orchestrator skill, and HARNESS.md — all following this repository's file-bus conventions.

## Execution Mode

**Sequential Generation** — Six phases produce all files needed for a working harness.
Read `skills/harness-generator/references/copilot-adaptation-rules.md` before starting.

## Pre-Flight Checks

- [ ] Confirm domain is not already covered — check `harnesses/` directory
- [ ] Identify next available harness number (check existing nn- prefixes)
- [ ] Read `skills/harness-generator/references/agent-design-patterns.md` to select the right pattern
- [ ] Read `templates/agent-template.md` and `templates/orchestrator-skill-template.md`

## Phase 1: Domain Analysis

```
task(agent_type="general-purpose",
     description="Analyze the requested domain and answer these questions:
1. What is the primary workflow? (linear / parallel / conditional branching)
2. What are the 4-6 specialist roles needed? Name each with a clear domain boundary.
3. What is the natural information flow between roles? Draw an ASCII DAG.
4. Which of the 6 patterns best fits the workflow:
   Pipeline | Fan-out/Fan-in | Expert Pool | Producer-Reviewer | Supervisor | Hierarchical
   Read skills/harness-generator/references/agent-design-patterns.md for definitions.
5. What domain knowledge frameworks are relevant? (e.g. OWASP, DORA, SOLID, TOGAF)
6. What are 3 concrete trigger phrases a user would say?

Create _workspace/ and _workspace/messages/ directories.
Write analysis to _workspace/00_domain_analysis.md with sections:
WORKFLOW_TYPE, SPECIALIST_ROLES, INFORMATION_FLOW_DAG, PATTERN_SELECTION (with rationale),
DOMAIN_FRAMEWORKS, TRIGGER_PHRASES.")
```

## Phase 2: Team Architecture Design

```
task(agent_type="general-purpose",
     description="Based on _workspace/00_domain_analysis.md, design the agent team:
- Harness number: check harnesses/ directory for next available nn- prefix
- Team name: {nn}-{domain-name} (kebab-case)
- Agent list: 4-6 agents with role, expertise, and output file
- Information flow: which agent outputs feed into which (with _workspace/ file names)
- Workspace file layout: 00_input.md through {n}_{final}.md
- Message handoff points: {from}-to-{to}.md for each transition

Read templates/orchestrator-skill-template.md and
skills/harness-generator/references/orchestrator-template.md for structure guidance.
Write to _workspace/01_team_architecture.md with sections:
HARNESS_ID, AGENT_TABLE (name | role | output_file | receives_from),
WORKSPACE_LAYOUT (full _workspace/ tree), PATTERN_IMPLEMENTATION.")
```

## Phase 3: Agent File Generation

```
task(agent_type="general-purpose",
     description="Generate all agent .md files based on _workspace/01_team_architecture.md.

For each agent, follow templates/agent-template.md EXACTLY:
1. YAML frontmatter: name, description (trigger-first: 'Use when...')
2. Identity: Role, Expertise, Output format
3. Core Responsibilities: 4-5 numbered items
4. Working Principles: Why-First format (no ALWAYS/NEVER — explain the reason instead)
5. Input Contract: list all _workspace/ files this agent reads
6. Output Contract: exact output file path and format
7. Message Protocol: exact _workspace/messages/{from}-to-{to}.md path and STATUS format
8. Domain Knowledge: embed relevant frameworks/standards/checklists
9. Quality Gates: self-validation checklist

Read skills/harness-generator/references/skill-writing-guide.md for best practices.
Read skills/harness-generator/references/copilot-adaptation-rules.md for Copilot CLI rules.

Write each agent file to harnesses/{nn}-{name}/agents/{agent-name}.md
Confirm no SendMessage() references — use file-bus only.")
```

## Phase 4: Skill File Generation

```
task(agent_type="general-purpose",
     description="Generate the orchestrator SKILL.md and 1-2 domain skill files.

For orchestrator SKILL.md (harnesses/{nn}-{name}/skills/{name}/SKILL.md):
Follow templates/orchestrator-skill-template.md EXACTLY:
1. trigger-first description with Does NOT cover + follow-up keywords
2. Execution Mode: File-Bus Team
3. Agent Composition table
4. Pre-Flight Checks
5. Phase-by-phase task() calls (each referencing the agent .md file)
6. Scale Modes table (Full / Reduced / Minimal)
7. Error Handling table
8. Test Scenarios (3 types)
9. Attribution section

For domain skills (1-2 supporting skills), embed relevant frameworks/checklists.
These go in harnesses/{nn}-{name}/skills/{skill-name}/SKILL.md

Validate all SKILL.md descriptions start with 'Use when'.
Read skills/harness-generator/references/qa-agent-guide.md for validation checklist.")
```

## Phase 5: HARNESS.md Generation

```
task(agent_type="general-purpose",
     description="Generate HARNESS.md for harnesses/{nn}-{name}/ with ALL of:
- H1 title: '{nn} — {Harness Name}'
- Overview paragraph (what it does, when to use)
- Structure section: directory tree with file descriptions
- Usage section: trigger phrases (3 examples)
- Workspace Artifacts: full _workspace/ layout with file descriptions
- Agent Team table: agent | role | output
- Scale Modes: Full Pipeline / Reduced / Minimal
- Quick Start: cp command + trigger phrase
- Attribution:
  'Generated harness — not ported from harness-100.
   Pattern: {Pattern Name} (see skills/harness-generator/references/agent-design-patterns.md)'
   OR if adapted from harness-100:
  'Adapted from [revfactory/harness-100](...) under Apache 2.0 License.'

Write to harnesses/{nn}-{name}/HARNESS.md")
```

## Phase 6: Validation

```
task(agent_type="general-purpose",
     description="Validate the generated harness against all quality gates:

1. File existence:
   - harnesses/{nn}-{name}/HARNESS.md ✓
   - All agent .md files listed in Agent Composition table ✓
   - All skill SKILL.md files ✓

2. Content checks:
   - Each agent has Input Contract + Output Contract + Message Protocol sections ✓
   - Orchestrator SKILL.md description starts with 'Use when' ✓
   - Orchestrator SKILL.md contains 'Does NOT cover' ✓
   - Orchestrator SKILL.md contains task(agent_type ✓
   - No SendMessage() in any file ✓
   - HARNESS.md contains Attribution section ✓

3. Run: npm test
   Report any test failures with file and line context.

If issues found: fix them directly. If ambiguous: report to user with options.")
```

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Ambiguous domain | Ask user for the 3 most important agent roles before continuing |
| Harness number conflict | Increment to next available number |
| Missing domain knowledge | Embed best available general knowledge; note limitation in HARNESS.md |
| Test failure | Fix the specific file causing the failure; re-run npm test |
