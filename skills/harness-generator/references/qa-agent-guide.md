# QA Agent Guide for Copilot CLI Harnesses

Adapted from revfactory/harness qa-agent-guide.md.
Use this guide when creating or reviewing validation/QA agents in any harness.

---

## When to Include a QA Agent

Add a dedicated QA or reviewer agent when:
- The harness produces an artifact that has objective correctness criteria
- Multiple upstream agents could produce conflicting results
- The output will be consumed by an automated system (not just a human reader)
- Regulatory, security, or compliance requirements exist

Skip a dedicated QA agent when:
- The synthesizer already performs quality assessment
- The domain is inherently subjective (creative writing, design recommendations)
- The harness has ≤ 3 agents (overhead not justified)

---

## QA Agent Responsibilities

A QA agent in any harness follows this pattern:

1. **Completeness check** — All required sections present in upstream outputs
2. **Consistency check** — Cross-references between agents don't conflict
3. **Standard compliance** — Output conforms to known standards (OWASP, DORA, etc.)
4. **Actionability check** — Recommendations are specific, not vague
5. **Gap identification** — What was NOT covered that should have been

---

## QA Agent Input Contract

```markdown
## Input Contract
Read from `_workspace/` before starting:
- `00_input.md` — original user request (for scope validation)
- `01_*.md` through `0{n}_*.md` — all specialist outputs
- `messages/*-to-qa.md` — handoffs from all upstream agents
```

---

## QA Agent Output Format

```markdown
# QA Review — {Harness Name}

## Completeness Assessment
- [x] {Required section 1} — found in `{file}`
- [x] {Required section 2} — found in `{file}`
- [ ] {Missing section} — NOT FOUND — flagged for user

## Consistency Issues
### Issue 1: {Description}
- Agent A finding: {finding}
- Agent B finding: {conflicting finding}
- Resolution: {recommendation}

## Standards Compliance
- PASS: {standard checked}
- FAIL: {standard with violation description}

## Gaps
- {Topic not covered that falls within stated scope}
- {Recommendation that is too vague to be actionable}

## Final Assessment
PASS | PASS_WITH_NOTES | REQUIRES_REVISION

{1-2 sentence summary}
```

---

## Validation Checklist (Apply to Any Harness Output)

### For Technical Harnesses (code, infra, API, security)

- [ ] All code snippets are syntactically valid (if verifiable)
- [ ] File paths use `_workspace/` convention consistently
- [ ] No `SendMessage()` references
- [ ] Agent descriptions start with "Use when"
- [ ] HARNESS.md includes workspace layout and attribution

### For Content Harnesses (writing, analysis, strategy)

- [ ] Primary claim has supporting evidence
- [ ] Recommendations are specific (not "improve performance" but "add index on user_id column")
- [ ] Scope boundaries honored (Does NOT cover items not present)
- [ ] Attribution included if adapted from external source

### For Orchestrator SKILL.md Files

- [ ] `description:` starts with "Use when"
- [ ] "Does NOT cover" present
- [ ] "Also triggers on:" with ≥ 3 follow-up keywords
- [ ] All agents in composition table have corresponding .md files
- [ ] `task(agent_type=` pattern used (not direct function calls)
- [ ] Error Handling table present
- [ ] Scale Modes table present

---

## QA Agent as a Standalone Tool

For simple harnesses (3-4 agents), the QA function can be merged into the synthesizer
rather than creating a separate agent. Add this to the synthesizer's Quality Gates:

```markdown
## Quality Gates (synthesizer with QA function)
Before marking output complete:
- [ ] All specialist output files exist in `_workspace/`
- [ ] No specialist finding is left unaddressed in synthesis
- [ ] Conflicting findings explicitly resolved (not silently dropped)
- [ ] Synthesis provides priority ranking (Critical/High/Medium/Low)
- [ ] Output file written to `_workspace/`
```

---

## Testing QA Agents

Three test scenarios for any QA agent:

1. **All pass:** All upstream agents produce complete, consistent output → QA returns PASS
2. **Missing output:** One upstream agent's file is absent → QA flags gap, returns PASS_WITH_NOTES
3. **Conflict:** Two agents give conflicting severity ratings → QA resolves or escalates
