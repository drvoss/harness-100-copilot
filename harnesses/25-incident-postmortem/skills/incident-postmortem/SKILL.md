---
name: incident-postmortem
description: "Use when conducting a structured incident postmortem after a production outage, degradation, or SEV1–SEV4 event. Dispatches incident-analyst, root-cause-investigator, impact-assessor, and action-planner in sequence to reconstruct the timeline, identify root causes, quantify SLO/customer impact, and produce a prioritized action plan. Covers timeline reconstruction, 5 Whys RCA, Fishbone analysis, MTTR/MTTD measurement, error budget calculation, and runbook update planning. Does NOT cover real-time incident response, live triage, on-call paging, or post-deployment smoke testing. Also triggers on: rerun postmortem, update action plan, revise root cause, supplement impact analysis, generate incident report."
metadata:
  category: harness
  harness: 25-incident-postmortem
  agent_type: general-purpose
---

# Incident Postmortem — Structured Analysis Pipeline

Four specialist agents collaborate to produce a complete, blameless incident postmortem: timeline reconstruction → root cause analysis → impact quantification → action planning.

## Execution Mode

**Pipeline (Sequential File-Bus)** — Each agent reads upstream output and a structured message before producing its own artifact. Agents communicate via `_workspace/messages/`.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| incident-analyst | `agents/incident-analyst.md` | Timeline reconstruction, log correlation, DORA metrics | general-purpose |
| root-cause-investigator | `agents/root-cause-investigator.md` | 5 Whys, Fishbone diagram, causal analysis | general-purpose |
| impact-assessor | `agents/impact-assessor.md` | SLO violations, error budget, customer impact, business cost | general-purpose |
| action-planner | `agents/action-planner.md` | Action items, runbook updates, prevention planning | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md                                              (incident details: date, duration, severity, affected systems)
├── 01_timeline.md                                           (incident-analyst output)
├── 02_root_cause.md                                         (root-cause-investigator output)
├── 03_impact_assessment.md                                  (impact-assessor output)
├── 04_action_plan.md                                        (action-planner output)
└── messages/
    ├── incident-analyst-to-root-cause-investigator.md
    ├── root-cause-investigator-to-impact-assessor.md
    └── impact-assessor-to-action-planner.md
```

## Pre-Flight Checks
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 4 agent files present in `agents/`
- [ ] Incident data available (at minimum: date, approximate duration, affected systems)
- [ ] Log access or exported log files available for incident-analyst

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's incident postmortem request. Create _workspace/ and _workspace/messages/ directories if they do not exist. Extract: incident date/time, duration, severity level (SEV1-4), affected systems, initial symptom description, available evidence (log files, alert IDs, monitoring dashboard links, chat exports). Write organized input to _workspace/00_input.md with sections: INCIDENT_METADATA (date, time UTC, duration, severity), AFFECTED_SYSTEMS (list), INITIAL_SYMPTOM (description), RESPONDERS (list if known), EVIDENCE_SOURCES (list of available data), CONTEXT (any additional background). If severity is not stated, ask once or default to SEV2 and note the assumption.")
```

## Phase 2: Sequential Analysis

### Step 2.1 — Incident Analyst (Timeline Reconstruction)

```
task(agent_type="general-purpose",
     description="You are the incident-analyst agent in the incident-postmortem harness. Read agents/incident-analyst.md for your full instructions. Read _workspace/00_input.md for the incident details. Reconstruct the complete chronological incident timeline by correlating all available evidence sources listed in 00_input.md. Calculate MTTD, MTTA, MTTM, and MTTR. Identify the first anomaly signal and the failure propagation path across services. Document all observability gaps. Write your full findings to _workspace/01_timeline.md following the output format in your agent instructions. Write handoff to _workspace/messages/incident-analyst-to-root-cause-investigator.md with: STATUS: COMPLETE, FINDINGS (key timeline events, DORA metrics), CROSS_DOMAIN_FOR_ROOT_CAUSE_INVESTIGATOR (first anomaly, propagation path, responder actions), CROSS_DOMAIN_FOR_IMPACT_ASSESSOR (customer-facing impact window, affected services, peak error rate).")
```

### Step 2.2 — Root Cause Investigator

```
task(agent_type="general-purpose",
     description="You are the root-cause-investigator agent in the incident-postmortem harness. Read agents/root-cause-investigator.md for your full instructions. Read _workspace/00_input.md for incident context. Read _workspace/01_timeline.md as your primary evidence source. Read _workspace/messages/incident-analyst-to-root-cause-investigator.md for CROSS_DOMAIN_FOR_ROOT_CAUSE_INVESTIGATOR — use the first anomaly signal and propagation path to anchor your 5 Whys starting point. Apply 5 Whys methodology to identify the root cause and construct a Fishbone diagram across People, Process, Technology, and Environment categories. Every causal claim must cite timeline evidence. Write your full findings to _workspace/02_root_cause.md. Write handoff to _workspace/messages/root-cause-investigator-to-impact-assessor.md with: STATUS: COMPLETE, FINDINGS (root cause statement, primary contributing factors), CROSS_DOMAIN_FOR_IMPACT_ASSESSOR (affected components for SLO assessment, recent change involvement), CROSS_DOMAIN_FOR_ACTION_PLANNER (process gaps, technology gaps, monitoring gaps, runbook deficiencies).")
```

### Step 2.3 — Impact Assessor

```
task(agent_type="general-purpose",
     description="You are the impact-assessor agent in the incident-postmortem harness. Read agents/impact-assessor.md for your full instructions. Read _workspace/00_input.md, _workspace/01_timeline.md, and _workspace/02_root_cause.md. Read _workspace/messages/root-cause-investigator-to-impact-assessor.md for CROSS_DOMAIN_FOR_IMPACT_ASSESSOR — use the component list to scope your SLO assessment. Calculate which SLOs were violated and by how much. Compute error budget consumption for the affected services for the trailing 30-day window. Classify customer impact by tier (P0 enterprise, P1 commercial, P2 free). Evaluate MTTR and MTTD against DORA elite benchmarks. Estimate business cost (revenue, SLA credit exposure, engineering hours). Write your full findings to _workspace/03_impact_assessment.md. Write handoff to _workspace/messages/impact-assessor-to-action-planner.md with: STATUS: COMPLETE, FINDINGS (SLOs breached, error budget consumed, customer tiers affected, MTTR gap), CROSS_DOMAIN_FOR_ACTION_PLANNER (SLOs requiring immediate remediation, SLA credit exposure, MTTR gap areas, detection delay breakdown, business cost drivers).")
```

### Step 2.4 — Action Planner (Terminal)

```
task(agent_type="general-purpose",
     description="You are the action-planner agent in the incident-postmortem harness. Read agents/action-planner.md for your full instructions. Read ALL of: _workspace/00_input.md, _workspace/01_timeline.md, _workspace/02_root_cause.md, _workspace/03_impact_assessment.md, and _workspace/messages/impact-assessor-to-action-planner.md. Synthesize all findings into a complete, prioritized action plan. Every action item must have: What (specific action), Who (team/role owner), When (due date), Done-When (verifiable completion criterion), and Category (Prevention/Detection/Response/Process). Use error budget criticality and recurrence risk to assign P0-P3 priority. Create runbook update specifications for every observability gap identified in the timeline. Ensure all language is blameless. Write the complete action plan to _workspace/04_action_plan.md. This is the terminal step — no outgoing message is required.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full postmortem requested | Full Pipeline | All 4 agents |
| "What caused this?" / RCA only | RCA Mode | incident-analyst → root-cause-investigator |
| "What was the impact?" | Impact Mode | incident-analyst → impact-assessor |
| "We have a timeline already" | Skip to RCA | root-cause-investigator → impact-assessor → action-planner (read existing 01_timeline.md) |
| "Just give me action items" | Action Mode | action-planner (reads all existing workspace files) |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run that agent once; if still missing, next agent notes "upstream analysis unavailable" and works from available inputs |
| Insufficient incident data | incident-analyst documents data gaps in observability section; postmortem proceeds with stated assumptions |
| SLO targets not provided | impact-assessor uses industry-standard thresholds (99.9% for API, 99.5% for async) and notes assumption |
| Root cause not determinable | root-cause-investigator documents all hypotheses with evidence quality rating; action-planner marks corresponding items as "investigation required" |
| Conflicting timeline evidence | incident-analyst notes conflict, uses most-cited source as authoritative, documents discrepancy |

## Test Scenarios
1. **Normal case:** SEV2 database outage — all 4 agents complete in sequence → final 04_action_plan.md with 8-12 action items
2. **Minimal data:** Only incident date and symptom provided → incident-analyst documents evidence gaps; downstream agents use stated assumptions
3. **Partial run:** User provides existing 01_timeline.md → skip Phase 2.1, begin from root-cause-investigator
4. **No SLO data:** impact-assessor uses standard thresholds and documents assumptions in 03_impact_assessment.md
