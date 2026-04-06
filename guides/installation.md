# Installation Guide

This guide explains how to install and use harnesses from harness-100-copilot in your project.

## Prerequisites

- [GitHub Copilot CLI](https://github.com/github/copilot-cli) installed and authenticated
- A project directory where you want to use the harness

## Step 1: Clone the Repository

```bash
git clone https://github.com/drvoss/harness-100-copilot.git
cd harness-100-copilot
npm install
```

## Step 2: Choose a Harness

Browse the `harnesses/` directory and read the `HARNESS.md` for each harness to understand
what it does and which agents it includes.

Available harnesses (Phase 1):
- `16-fullstack-webapp` — Full-stack web app development
- `20-cicd-pipeline` — CI/CD pipeline design and setup
- `21-code-reviewer` — Multi-domain code review

## Step 3: Install into Your Project

Copy the harness agents and skills to your project's `.github/` directory:

```bash
# Example: installing the code-reviewer harness
HARNESS=21-code-reviewer
YOUR_PROJECT=/path/to/your/project

# Create directories
mkdir -p "$YOUR_PROJECT/.github/agents"
mkdir -p "$YOUR_PROJECT/.github/skills"

# Copy agents
cp -r harnesses/$HARNESS/agents/ "$YOUR_PROJECT/.github/agents/"

# Copy skills
cp -r harnesses/$HARNESS/skills/ "$YOUR_PROJECT/.github/skills/"
```

Your project structure will look like:
```
your-project/
├── .github/
│   ├── agents/
│   │   ├── style-inspector.md
│   │   ├── security-analyst.md
│   │   ├── performance-analyst.md
│   │   ├── architecture-reviewer.md
│   │   └── review-synthesizer.md
│   └── skills/
│       ├── code-reviewer/SKILL.md
│       ├── vulnerability-patterns/SKILL.md
│       └── refactoring-catalog/SKILL.md
└── ... (your project files)
```

## Step 4: Start Copilot CLI

```bash
cd your-project
copilot
```

## Step 5: Trigger a Harness

Use natural language to trigger the harness orchestrator skill:

```
# code-reviewer harness
> Review PR #42 for security and architecture issues
> Review the changes in src/auth/ for security vulnerabilities
> Full code review of the current branch

# fullstack-webapp harness
> Build me a task management web app with React and PostgreSQL
> Create a SaaS dashboard with user authentication

# cicd-pipeline harness
> Create a GitHub Actions CI/CD pipeline for my Node.js app
> Set up CI/CD with security scanning and monitoring
```

## Installing Multiple Harnesses

You can install multiple harnesses — agents and skills from different harnesses
coexist without conflict (they have different names):

```bash
# Install both code-reviewer and cicd-pipeline
cp -r harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harnesses/21-code-reviewer/skills/ .github/skills/
cp -r harnesses/20-cicd-pipeline/agents/ .github/agents/
cp -r harnesses/20-cicd-pipeline/skills/ .github/skills/
```

## Using the `_workspace/` Directory

Each harness writes its outputs to `_workspace/` in your current directory:

```
your-project/
└── _workspace/          ← created automatically when harness runs
    ├── 00_input.md
    ├── 01_style_review.md
    ├── 02_security_review.md
    ...
    └── messages/
        ├── agent-a-to-agent-b.md
        └── ...
```

**Before running a harness again:** either delete `_workspace/` or tell the orchestrator
to overwrite it.

## Validation

Run the test suite to verify harness file integrity:

```bash
npm test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Skill not triggering | Check that the SKILL.md `description` matches your request pattern. See [everything-copilot-cli: Skill Writing Best Practices](https://github.com/drvoss/everything-copilot-cli/blob/main/guides/) |
| `_workspace/` conflicts | Delete `_workspace/` and start fresh |
| Agent file not found | Verify the `.github/agents/` path matches the `agents/{file}.md` references in SKILL.md |

> **Note on agent paths after installation:** The orchestrator SKILL.md task descriptions
> reference agent files as `agents/{agent}.md` (source-tree relative paths). After installing
> to `.github/agents/`, Copilot CLI will find these files at `.github/agents/{agent}.md`.
> If an agent task fails with "file not found", update the path references in the SKILL.md
> `description` strings from `agents/` to `.github/agents/`.
