---
name: blameless-postmortem
description: "Use when facilitating or reviewing an incident postmortem to ensure blameless culture principles are followed — detects blame language, applies psychological safety guidelines, and provides rewrite suggestions for action items and findings. Covers blameless language review, psychological safety coaching, Just Culture framework application, and postmortem meeting facilitation guidance. Does NOT cover technical root cause analysis (use incident-postmortem skill for that) or live incident response. Also triggers on: review postmortem for blame, check blameless culture, validate psychological safety, facilitate postmortem meeting."
metadata:
  category: supporting-skill
  harness: 25-incident-postmortem
  agent_type: general-purpose
---

# Blameless Postmortem — Culture and Psychological Safety Skill

This supporting skill applies blameless culture principles to incident postmortems, ensuring the process produces systemic improvements rather than individual blame, and maintains psychological safety for all participants.

## When to Invoke This Skill

Invoke this skill:
- **Before the postmortem meeting** — to coach the facilitator on psychological safety practices
- **During document review** — to scan draft postmortem documents for blame language and suggest rewrites
- **After action plan creation** — to verify all action items are blameless and systemic
- **As a standalone review** — when a completed postmortem document needs a culture audit

## Core Framework: Just Culture

The Just Culture framework (Sidney Dekker) recognizes three types of behavior in incidents:

| Behavior Type | Description | Appropriate Response |
|---------------|-------------|---------------------|
| **Human error** | Inadvertent action or slip | Console and support; fix the system that allowed the error to have impact |
| **At-risk behavior** | Shortcut taken believing risk was low or justified | Coach; understand why the shortcut existed; fix the process |
| **Reckless behavior** | Conscious disregard for known risk | Remediate; this is the rare case where individual accountability is appropriate |

> **Key principle:** The vast majority of incidents involve human error or at-risk behavior, not recklessness. Default to system improvement, not individual accountability.

## Blame Language Detection Checklist

When reviewing a postmortem document, flag any instance of:

### ❌ Direct Blame Patterns
- "Engineer [name] should have..."
- "[Person] failed to..."
- "[Team] didn't bother to..."
- "If [person] had just..."
- "The mistake was made by..."

### ❌ Indirect Blame Patterns
- "The team was not paying attention"
- "Lack of diligence"
- "Carelessness"
- "Poor judgment by the on-call engineer"
- "Human error" (as a root cause, not a contributing factor description)

### ❌ Counterfactual Blame
- "This wouldn't have happened if [person] had..."
- "Anyone would have caught this if they were..."
- "Obviously the right thing to do was..."

### ✅ Blameless Rewrites

| Blame-Laden | Blameless |
|-------------|-----------|
| "Engineer X deployed without checking staging" | "The deployment process did not require a staging validation step" |
| "On-call team missed the alert" | "Alert routing did not have a secondary escalation path after 5 minutes" |
| "Developer wrote a bug" | "The code path lacked integration test coverage for this failure mode" |
| "Team didn't follow the runbook" | "The runbook was not accessible from the alert notification link" |
| "Human error" (root cause) | "The system did not prevent or detect the [specific error] before customer impact" |

## Psychological Safety in Postmortem Meetings

### Facilitator Responsibilities

1. **Set expectations at opening** — State explicitly: "We are here to learn and improve systems, not to assign blame. Everything said here stays in this room unless agreed otherwise."

2. **Interrupt blame in real time** — When blame surfaces, redirect: "Instead of focusing on what [person] did, let's ask: what in our systems or processes created the conditions for this to happen?"

3. **Invite all voices equally** — Explicitly ask quieter participants for their perspective: "I'd like to hear from everyone who was on-call. [Name], what was your experience during the mitigation phase?"

4. **Validate emotions before analysis** — Acknowledge that incidents are stressful: "Before we get into the timeline, I want to acknowledge that this was a hard week for the team."

5. **Separate the meeting from performance reviews** — Reinforce that postmortem participation and findings are not used in performance evaluations.

### Meeting Structure (90-minute postmortem)

| Phase | Duration | Purpose |
|-------|----------|---------|
| Opening and ground rules | 5 min | Psychological safety framing |
| Timeline walkthrough | 20 min | Shared understanding; corrections welcome |
| What went well | 10 min | Builds safety; surfaces positives |
| Root cause discussion | 25 min | Facilitated 5 Whys; blame-interrupt as needed |
| Impact review | 10 min | Data-driven; not emotional |
| Action item drafting | 15 min | Blameless, SMART actions |
| Wrap up and next steps | 5 min | Ownership confirmation |

## Document Review Workflow

When invoked to review a postmortem document:

```
task(agent_type="general-purpose",
     description="You are applying the blameless-postmortem skill. Read skills/blameless-postmortem/SKILL.md for your full instructions. Read the postmortem document provided (or all files in _workspace/ if running after incident-postmortem harness). Perform a blameless culture audit: 1) Scan for blame language patterns listed in the skill. 2) Flag each instance with line reference and category (direct blame / indirect blame / counterfactual). 3) Provide a specific blameless rewrite for each flagged instance. 4) Score overall blameless culture health (0-100). 5) Provide facilitator coaching notes if a meeting is planned. Write findings to _workspace/blameless_review.md.")
```

## Blameless Health Score

Rate the postmortem document on a 0–100 scale:

| Score | Assessment | Meaning |
|-------|-----------|---------|
| 90–100 | Excellent | Fully systemic; all action items address processes and systems |
| 70–89 | Good | Minor blame language; correctable with suggested rewrites |
| 50–69 | Needs Work | Multiple blame instances; action items partially individual-focused |
| 30–49 | Poor | Pervasive blame; document needs significant revision before sharing |
| 0–29 | Critical | Document will damage psychological safety; do not share without major revision |

## Quality Gates
Before completing a blameless postmortem review:
- [ ] All blame language instances identified and categorized
- [ ] Blameless rewrite provided for every flagged instance
- [ ] Action items reviewed: all are systemic (processes/systems), none are individual performance items
- [ ] Overall blameless health score assigned with justification
- [ ] Facilitator coaching notes included if meeting is planned
- [ ] Output written (to `_workspace/blameless_review.md` or provided inline)
