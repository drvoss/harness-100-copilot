# Message Bus Pattern

This guide explains the file-based message bus pattern used in harness-100-copilot
to replace Claude Code's `SendMessage` primitive.

## The Problem

GitHub Copilot CLI agents are stateless — each `task()` call runs a separate agent
with its own context. Unlike Claude Code's `SendMessage`, there is no mechanism for
one running agent to send information to another running agent.

## The Solution: `_workspace/messages/`

We use a structured directory of markdown files as a message bus:

```
_workspace/
└── messages/
    ├── {from-agent}-to-{to-agent}.md
    └── {from-agent}-to-all.md
```

Each agent, when it completes, writes a structured summary message to this directory.
The next agent reads relevant messages before starting work.

## Message File Format

```markdown
STATUS: COMPLETE

FINDINGS:
- [Brief summary point 1]
- [Brief summary point 2]

{DOMAIN}_FOR_{RECIPIENT}:
- [Information specifically relevant to the next agent]

BLOCKERS:
- [Only populated if STATUS is BLOCKED]
```

### Example: style-inspector → review-synthesizer

```markdown
STATUS: COMPLETE

FINDINGS:
- 14 total findings: 🔴 2 / 🟡 7 / 🟢 5
- Naming: camelCase used inconsistently in 3 files (should be snake_case for Python)
- Complexity: 2 functions exceed 50 lines

SENSITIVE_INFO_FOR_SECURITY:
- utils/crypto.py:47 has a TODO comment: "TODO: replace MD5 with bcrypt"
- config.py:12 has commented-out API key: "# api_key = 'sk-...'"

COMPLEX_FUNCTIONS_FOR_PERFORMANCE:
- process_batch() in batch_processor.py: ~80 lines, nested loops
- generate_report() in reporter.py: ~65 lines, multiple DB calls
```

The `security-analyst` reads this and immediately investigates the flagged items.

## Communication Flow Diagram

```
Phase 2: Parallel Domain Reviews
─────────────────────────────────
style-inspector       → _workspace/01_style_review.md
                      → messages/style-inspector-to-review-synthesizer.md
                            └─ SENSITIVE_INFO_FOR_SECURITY
                            └─ COMPLEX_FUNCTIONS_FOR_PERFORMANCE

security-analyst      reads: messages/style-inspector-to-review-synthesizer.md
                      → _workspace/02_security_review.md
                      → messages/security-analyst-to-review-synthesizer.md
                            └─ PERFORMANCE_IMPACT
                            └─ ARCHITECTURE_CONCERNS

performance-analyst   reads: messages/style-inspector-to-review-synthesizer.md
                             messages/security-analyst-to-review-synthesizer.md
                      → _workspace/03_performance_review.md
                      → messages/performance-analyst-to-review-synthesizer.md
                            └─ ARCHITECTURE_STRUCTURAL_ISSUES

architecture-reviewer reads: messages/security-analyst-to-review-synthesizer.md
                             messages/performance-analyst-to-review-synthesizer.md
                      → _workspace/04_architecture_review.md
                      → messages/architecture-reviewer-to-review-synthesizer.md

Phase 3: Synthesis
──────────────────
review-synthesizer    reads: ALL _workspace/*.md files
                             ALL messages/*.md files
                      → _workspace/05_review_summary.md (FINAL OUTPUT)
```

## Why This Works

1. **No lost information** — Everything that `SendMessage` would have delivered is
   captured in the message file, available for later agents.

2. **Persistent record** — Unlike in-memory `SendMessage`, the message files persist
   and can be inspected, debugged, or re-read if a run fails partway through.

3. **Sequential enrichment** — Each agent can build on context from all previous
   agents, not just its immediate predecessor.

4. **Resume capability** — If a run fails at step N, you can restart from step N
   without re-running steps 1 through N-1.

## Fidelity vs. Original SendMessage

| Aspect | SendMessage (original) | File Bus (this project) | Fidelity |
|--------|----------------------|------------------------|---------|
| Information transfer | ✅ Full | ✅ Full | 100% |
| Real-time delivery | ✅ Instant | ❌ After completion | ~80% |
| Parallel communication | ✅ Yes | ❌ Sequential | ~85% |
| Debugging visibility | ❌ Opaque | ✅ Files inspectable | Better |
| Resume on failure | ❌ No | ✅ Yes | Better |

**Overall: ~90% fidelity** for the communication aspect.

## Broadcast Messages

When an agent needs to inform ALL subsequent agents (not just one), use the
`-to-all` suffix:

```
_workspace/messages/architect-to-all.md
```

Format:
```markdown
STATUS: COMPLETE
TECH_STACK:
  frontend: Next.js 14
  backend: FastAPI
  database: PostgreSQL 16
API_STYLE: REST
...
```

All subsequent agents (`frontend-dev`, `backend-dev`, `devops-engineer`, `qa-engineer`)
read this broadcast message to understand the architecture context.

## Advanced: SQL Message Bus

For complex harnesses with conditional branching, you can use Copilot CLI's built-in
`sql()` tool as a more structured message bus:

```sql
-- Create message table at harness start
CREATE TABLE IF NOT EXISTS agent_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agent writes on completion
INSERT INTO agent_messages (from_agent, to_agent, key, value)
VALUES ('style-inspector', 'security-analyst', 'sensitive_files', 'config.py:12, utils/crypto.py:47');

-- Next agent reads
SELECT value FROM agent_messages
WHERE from_agent = 'style-inspector' AND to_agent = 'security-analyst' AND key = 'sensitive_files';
```

This enables conditional logic: if `security-analyst` finds critical issues,
the orchestrator can skip remaining agents and go straight to the synthesizer.
