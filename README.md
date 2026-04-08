<p align="center">
  <img src="https://raw.githubusercontent.com/primer/octicons/main/icons/copilot-48.svg" width="80" alt="Copilot CLI" />
</p>

<h1 align="center">harness-100-copilot</h1>

<p align="center">
  <strong>100 production-grade multi-agent harnesses for GitHub Copilot CLI</strong><br/>
  Adapted from <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a> for the Copilot CLI ecosystem
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0" /></a>
  <a href="#"><img src="https://img.shields.io/badge/copilot--cli-ready-28a745?logo=github" alt="Copilot CLI Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/harnesses-15%20of%20100-yellow" alt="15 of 100 Harnesses" /></a>
  <a href="#"><img src="https://img.shields.io/badge/agents-73-blueviolet" alt="73 Agents" /></a>
  <a href="#"><img src="https://img.shields.io/badge/parity-~96%25-green" alt="~96% parity" /></a>
</p>

<p align="center">
  <a href="README.ko.md">🇰🇷 한국어</a>
</p>

---

## What is this?

**harness-100-copilot** is a port of [revfactory/harness-100](https://github.com/revfactory/harness-100) for **GitHub Copilot CLI**.

The original harness-100 provides 100 production-grade multi-agent team harnesses for Claude Code, where agents communicate via `SendMessage`. This project adapts the available Phase 2 harnesses (15 of 100 planned) to work with Copilot CLI's file-based message bus pattern, achieving **~96% functional parity**.

> **What's a harness?** A pre-assembled team of 4-7 specialist agents that collaborate through a structured pipeline to complete complex tasks — like building a full-stack web app, reviewing a PR, or setting up a CI/CD pipeline.

---

## At a Glance

| Attribute | Value |
|-----------|-------|
| Total harnesses | 15 available now (Phase 2 complete); 100 planned across 10 domains |
| Agent definitions | 73 now (489 at full 100-harness target) |
| Skills (orchestrator + domain) | 43 now (315 at full 100-harness target) |
| Functional parity vs. original | ~96% |
| Key adaptation | `SendMessage` → file-based message bus |
| Primary use case | Complex multi-agent workflows in Copilot CLI |

---

## Quick Start

```bash
# 1. Clone this repository
git clone https://github.com/drvoss/harness-100-copilot.git

# 2. Copy a harness to your project (example: code-reviewer)
cp -r harness-100-copilot/harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harness-100-copilot/harnesses/21-code-reviewer/skills/ .github/skills/
cp -r harness-100-copilot/references/ references/

# 3. Start Copilot CLI in your project
cd your-project
copilot

# 4. Trigger a harness
> Review my recent changes for security and architecture issues
```

> 📖 See [guides/installation.md](guides/installation.md) for detailed setup instructions.

---

## Key Difference: Message Bus

The original harness-100 uses Claude Code's `SendMessage` for real-time cross-agent communication:

```
style-inspector → SendMessage(synthesizer, findings)
security-analyst → SendMessage(synthesizer, findings)
```

GitHub Copilot CLI doesn't have this primitive. We replace it with a **file-based message bus**:

```
_workspace/
  messages/
    style-inspector-to-review-synthesizer.md
    security-analyst-to-review-synthesizer.md
    performance-analyst-to-review-synthesizer.md
  01_style_review.md
  02_security_review.md
  ...
```

Each agent writes its output and a structured message summary to `_workspace/messages/`. The next agent reads the relevant messages before starting. This achieves **~90% of the communication richness** with zero extra infrastructure.

> 📖 See [guides/message-bus-pattern.md](guides/message-bus-pattern.md) and [PORTING-NOTES.md](PORTING-NOTES.md) for the full explanation.

---

## Harness Categories

### ✅ Category 2: Software Development & DevOps (16-30) — Phase 2 (Available Now)

| # | Harness | Description | Status |
|---|---------|-------------|--------|
| 16 | [fullstack-webapp](harnesses/16-fullstack-webapp/) | Full-stack web app: design → frontend → backend → test → deploy | ✅ Available |
| 17 | [mobile-app-builder](harnesses/17-mobile-app-builder/) | Mobile app: UI/UX, code, API, store deployment | ✅ Available |
| 18 | [api-designer](harnesses/18-api-designer/) | REST/GraphQL API: design, docs, mocks, tests | ✅ Available |
| 19 | [database-architect](harnesses/19-database-architect/) | Database: modeling, optimization, migrations | ✅ Available |
| 20 | [cicd-pipeline](harnesses/20-cicd-pipeline/) | CI/CD: design, security gates, monitoring | ✅ Available |
| 21 | [code-reviewer](harnesses/21-code-reviewer/) | Code review: style, security, performance, architecture | ✅ Available |
| 22 | [legacy-modernizer](harnesses/22-legacy-modernizer/) | Legacy code modernization and refactoring | ✅ Available |
| 23 | [microservice-designer](harnesses/23-microservice-designer/) | Microservice architecture and decomposition | ✅ Available |
| 24 | [test-automation](harnesses/24-test-automation/) | Test automation strategy and implementation | ✅ Available |
| 25 | [incident-postmortem](harnesses/25-incident-postmortem/) | Incident analysis and postmortem generation | ✅ Available |
| 26 | [infra-as-code](harnesses/26-infra-as-code/) | Infrastructure as Code with Terraform/Kubernetes | ✅ Available |
| 27 | [data-pipeline](harnesses/27-data-pipeline/) | Data pipeline design and implementation | ✅ Available |
| 28 | [security-audit](harnesses/28-security-audit/) | Comprehensive security audit | ✅ Available |
| 29 | [performance-optimizer](harnesses/29-performance-optimizer/) | Application performance optimization | ✅ Available |
| 30 | [open-source-launcher](harnesses/30-open-source-launcher/) | Open source project launch | ✅ Available |

### 🔜 Other Categories (Coming Soon)

| Category | Range | Domain |
|----------|-------|--------|
| Content Creation & Creative | 01-15 | YouTube, Podcast, Newsletter, Brand |
| Data & AI/ML | 31-42 | ML experiments, Data analysis, LLM apps |
| Business & Strategy | 43-55 | Market analysis, Strategic planning |
| Education & Learning | 56-65 | Course design, Tutoring systems |
| Legal & Compliance | 66-72 | Contract review, Compliance audits |
| Health & Lifestyle | 73-80 | Health tracking, Wellness plans |
| Communication & Docs | 81-88 | Technical writing, Documentation |
| Operations & Process | 89-95 | Project management, Process optimization |
| Specialized Domains | 96-100 | Finance, Research, Niche domains |

---

## How to Use a Harness

Each harness is self-contained in `harnesses/{nn}-{name}/`:

```
{nn}-{harness-name}/
├── HARNESS.md          # Overview, agent list, usage, installation
├── agents/
│   ├── specialist-1.md
│   ├── specialist-2.md
│   └── ...
└── skills/
    ├── orchestrator/SKILL.md    # Layer 1: team coordination
    ├── domain-skill-1/SKILL.md  # Layer 2: domain expertise
    └── domain-skill-2/SKILL.md  # Layer 2: domain expertise
```

**To install a harness into your project:**

```bash
# Copy agents and skills to your project's .github directory
cp -r harnesses/21-code-reviewer/agents/ your-project/.github/agents/
cp -r harnesses/21-code-reviewer/skills/ your-project/.github/skills/
```

Then trigger the orchestrator skill with a natural language request in Copilot CLI.

> 📖 See [guides/installation.md](guides/installation.md) for detailed instructions.

---

## Templates

Building a new harness? Use the provided templates:

- [templates/agent-template.md](templates/agent-template.md) — Agent definition template
- [templates/orchestrator-skill-template.md](templates/orchestrator-skill-template.md) — Orchestrator SKILL.md template
- [templates/workspace-layout.md](templates/workspace-layout.md) — `_workspace/` layout conventions

---

## Related: everything-copilot-cli

For individual skills, orchestration patterns, and guides — not full harnesses:
→ [drvoss/everything-copilot-cli](https://github.com/drvoss/everything-copilot-cli)

```
everything-copilot-cli    ←→    harness-100-copilot
  Pattern guides                  Full harness teams
  Individual skills (~40)         Team harnesses (100)
  Orchestration examples          Production pipelines
```

---

## Contributing

1. **Port a harness** — Pick an unimplemented harness and follow [PORTING-NOTES.md](PORTING-NOTES.md)
2. **Improve existing harnesses** — Fix bugs, improve agent prompts, add test scenarios
3. **Add domain skills** — Extend harnesses with new domain-specific skills
4. **Test and validate** — Run `npm test` to validate harness structure

```bash
npm install
npm test        # Validate all harness structures
npm run lint:md # Lint markdown
```

---

## License

Apache 2.0 — See [LICENSE](LICENSE) and [ATTRIBUTION.md](ATTRIBUTION.md)

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100) (Apache 2.0).

---

<p align="center">
  <sub>Built for the GitHub Copilot CLI community · Adapted from <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a></sub>
</p>
