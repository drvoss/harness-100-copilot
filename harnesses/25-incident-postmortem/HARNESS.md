# 25 — Incident Postmortem

Structured incident postmortem harness: four specialist agents reconstruct the timeline, identify root causes, quantify impact, and produce a prioritized action plan — all following blameless postmortem principles.

## Structure

```
harnesses/25-incident-postmortem/
├── HARNESS.md                                   (this file)
├── agents/
│   ├── incident-analyst.md                      Timeline reconstruction, log correlation, sequence of events
│   ├── root-cause-investigator.md               Root cause analysis: 5 Whys and Fishbone diagram
│   ├── impact-assessor.md                       SLO violations, MTTR, customer impact, business cost
│   └── action-planner.md                        Prevention actions, follow-up tasks, runbook updates
└── skills/
    ├── incident-postmortem/SKILL.md              Orchestrator — team coordination, workflow, error handling
    └── blameless-postmortem/SKILL.md             Supporting — blameless culture, psychological safety
```

## Usage

Trigger the `incident-postmortem` skill or make a natural language request:
- "Run a postmortem for last night's outage"
- "Postmortem for the SEV1 database failure on 2024-01-15"
- "Incident review: payment service was down for 45 minutes"
- "What caused the API latency spike this morning?"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized incident details (date, duration, severity, affected systems)
- `01_timeline.md` — Chronological incident timeline and log correlation
- `02_root_cause.md` — 5 Whys analysis and Fishbone diagram findings
- `03_impact_assessment.md` — SLO/SLA impact, MTTR, customer and business cost
- `04_action_plan.md` — Prioritized action items, owners, due dates, runbook updates

## Pipeline Flow

```
incident-analyst → root-cause-investigator → impact-assessor → action-planner
      │                     │                       │
      ▼                     ▼                       ▼
  01_timeline.md      02_root_cause.md    03_impact_assessment.md
      │                     │                       │
      └── message ──────────┘                       │
                            └── message ────────────┘
                                                     └── message → 04_action_plan.md
```

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/25-incident-postmortem/agents/ /path/to/your/project/.github/agents/

# Copy skill definitions
cp -r harnesses/25-incident-postmortem/skills/ /path/to/your/project/.github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/25-incident-postmortem) under Apache 2.0 License. Key adaptation: SendMessage peer communication replaced with file-based message bus (`_workspace/messages/`).
