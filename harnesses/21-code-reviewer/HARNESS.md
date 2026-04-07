# 21 — Code Reviewer

Automated code review harness: an agent team systematically reviews code across style, security, performance, and architecture domains, then synthesizes a prioritized action report.

## Structure

```
harnesses/21-code-reviewer/
├── HARNESS.md                         (this file)
├── agents/
│   ├── style-inspector.md             Code style: conventions, naming, readability
│   ├── security-analyst.md            Security: vulnerabilities, injection, auth, exposure
│   ├── performance-analyst.md         Performance: complexity, memory, concurrency, queries
│   ├── architecture-reviewer.md       Architecture: patterns, SOLID, dependencies, coupling
│   └── review-synthesizer.md          Synthesis: prioritization, conflicts, final verdict
└── skills/
    ├── code-reviewer/SKILL.md         Orchestrator — team coordination, workflow, error handling
    ├── vulnerability-patterns/SKILL.md Security extension — CWE classification, language-specific patterns
    └── refactoring-catalog/SKILL.md   Architecture extension — code smells, SOLID violations, metrics
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| style-inspector | Code style: conventions, naming, readability | `01_style_review.md` |
| security-analyst | Security: vulnerabilities, injection, auth, exposure | `02_security_review.md` |
| performance-analyst | Performance: complexity, memory, concurrency, queries | `03_performance_review.md` |
| architecture-reviewer | Architecture: patterns, SOLID, dependencies, coupling | `04_architecture_review.md` |
| review-synthesizer | Synthesis: prioritization, conflicts, final verdict | `05_review_summary.md` |

## Quick Start

```bash
cp -r harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harnesses/21-code-reviewer/skills/ .github/skills/
```
Then ask Copilot: `Review this code`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full code review | Full Pipeline (all 5) | all |
| Security and architecture review | Reduced (2 agents) | security-analyst → architecture-reviewer |
| Quick style check | Single | style-inspector only |

## Usage

Trigger the `code-reviewer` skill or make a natural language request:
- "Review this code"
- "PR review for PR #42"
- "Security review of src/auth/"
- "Architecture review"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:
- `00_input.md` — Organized review request
- `01_style_review.md` — Style findings
- `02_security_review.md` — Security findings
- `03_performance_review.md` — Performance findings
- `04_architecture_review.md` — Architecture findings
- `05_review_summary.md` — Synthesized final report

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/21-code-reviewer/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/21-code-reviewer/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/21-code-reviewer)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
