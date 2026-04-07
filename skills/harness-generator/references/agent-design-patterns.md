# Agent Design Patterns for Copilot CLI Harnesses

Use this reference to select the right architectural pattern when generating a harness.
Each pattern maps to a specific workflow type and information flow structure.

---

## Pattern 1: Pipeline (순차 파이프라인)

**Use when:** Each step's output is the primary input for the next — linear workflow
with no branching.

**Structure:**
```
Agent A → Agent B → Agent C → Agent D (Synthesizer/Reporter)
```

**Copilot CLI implementation:**
- Call each agent in sequence with `task()`
- Each agent reads the previous agent's output file from `_workspace/`
- Message handoff: `_workspace/messages/{prev}-to-{next}.md`
- Workspace: `01_A.md → 02_B.md → 03_C.md → 04_report.md`

**Fits when:**
- Natural dependency chain exists (can't do B without A's output)
- No parallel work possible
- 4-6 agents total

**Example harnesses:** 25-incident-postmortem, 39-changelog-generator, 30-open-source-launcher

---

## Pattern 2: Fan-out/Fan-in (병렬 분석 후 집약)

**Use when:** Multiple specialists analyze the same input independently, then one
synthesizer combines all findings.

**Structure:**
```
              ┌→ Analyst 1 ──┐
Input ──────→ ├→ Analyst 2 ──┤→ Synthesizer → Final Report
              ├→ Analyst 3 ──┤
              └→ Analyst 4 ──┘
```

**Copilot CLI implementation (sequential simulation):**
- Run analyst agents in sequence (each produces independent output)
- Analysts read `00_input.md` only — NOT each other's outputs
- After all analysts complete, synthesizer reads ALL output files
- Workspace: `01_analyst1.md, 02_analyst2.md, 03_analyst3.md → 04_synthesis.md`

**Real parallelism:** Use `/fleet` mode (experimental) — document in HARNESS.md

**Fits when:**
- Multiple independent domains need coverage (security + performance + style)
- Analysts don't depend on each other's work
- A unified final report is required

**Example harnesses:** 21-code-reviewer (4 reviewers → synthesizer), 28-security-audit

---

## Pattern 3: Expert Pool (전문가 풀)

**Use when:** Input type determines which expert is selected — not all experts run
for every request.

**Structure:**
```
Router → [Expert A | Expert B | Expert C] → Reporter
```

**Copilot CLI implementation:**
- Orchestrator/router analyzes input and selects 1-2 relevant experts
- Only selected experts run via `task()`
- Router documents selection reason in `_workspace/00_input.md`
- Reporter summarizes selected expert's output

**Fits when:**
- Domain has distinct sub-specialties that rarely overlap
- Running all experts wastes context/time
- Input is classifiable (language type, domain type, size category)

**Example harnesses:** 56-language-tutor (expert per language), 33-writing-coach

---

## Pattern 4: Producer-Reviewer (생산자-검토자)

**Use when:** An artifact is created then reviewed/improved — iterative quality loop.

**Structure:**
```
Producer → Reviewer → [Producer (revision) →] Publisher
```

**Copilot CLI implementation:**
- Producer creates initial artifact → `_workspace/01_draft.md`
- Reviewer writes feedback → `_workspace/messages/reviewer-to-producer.md`
- Producer reads feedback → creates `_workspace/02_revised.md`
- Limit revisions to maximum 2 iterations (document in SKILL.md)
- Publisher/finalizer creates polished output

**Fits when:**
- Output quality benefits from adversarial review
- A "good enough" draft can be generated without review context
- Clear acceptance criteria exist

**Example harnesses:** 66-contract-reviewer, 83-proposal-writer, 44-blog-post-writer

---

## Pattern 5: Supervisor (감독자 패턴)

**Use when:** Work needs coordination, but specialists are mostly independent.
Supervisor assigns, then reviews overall quality.

**Structure:**
```
Supervisor → [Specialist 1, Specialist 2, Specialist 3] → Supervisor (review)
```

**Copilot CLI implementation:**
- Supervisor writes work assignments to `_workspace/00_supervisor_brief.md`
- Each specialist reads the brief and their specific assignment section
- Specialists write outputs independently
- Supervisor reads all outputs and writes final synthesis/approval

**Fits when:**
- Work has multiple parallel tracks requiring coordination
- Individual tracks need different expertise
- Quality review requires seeing all tracks together

**Example harnesses:** 43-startup-launcher, 93-project-manager

---

## Pattern 6: Hierarchical Delegation (계층적 위임)

**Use when:** Task is too large for a flat team — needs intermediate management layer.

**Structure:**
```
Manager → [Team Lead A → [Worker 1, Worker 2],
           Team Lead B → [Worker 3, Worker 4]]
```

**Copilot CLI implementation:**
- Maximum 2 tiers (3+ is too complex for file-bus)
- Each tier is a separate Phase in the orchestrator
- Workspace naming: `{tier}_{role}_{output}.md`
- Manager → `00_strategy.md`; Team Leads → `1{n}_plan.md`; Workers → `2{n}_work.md`

**Fits when:**
- Deliverable has clearly separable major components (chapters, modules, regions)
- Each component needs sub-specialization
- 8+ total agents needed

**Example harnesses:** 08-course-builder, 11-book-publishing, 47-enterprise-architecture

---

## Pattern Selection Decision Tree

```
Is work linear with strict dependencies?
  YES → Pipeline

Does the same input need multiple independent analyses?
  YES → Fan-out/Fan-in

Is the input type the primary decision factor (which expert)?
  YES → Expert Pool

Is iterative review and revision central to quality?
  YES → Producer-Reviewer

Are there parallel tracks needing coordination?
  YES → Supervisor

Is the task too large for 6 agents flat?
  YES → Hierarchical Delegation (max 2 tiers)
```
