// tests/validate-harnesses.test.js
// Validates the structure and quality of all harness directories

const fs = require('fs')
const path = require('path')

const HARNESSES_DIR = path.join(__dirname, '..', 'harnesses')

function getHarnessDirs() {
  if (!fs.existsSync(HARNESSES_DIR)) return []
  return fs.readdirSync(HARNESSES_DIR).filter(f =>
    fs.statSync(path.join(HARNESSES_DIR, f)).isDirectory()
  )
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

describe('Harness Structure Validation', () => {
  const harnesses = getHarnessDirs()

  test('harnesses/ directory exists and has at least one harness', () => {
    expect(fs.existsSync(HARNESSES_DIR)).toBe(true)
    expect(harnesses.length).toBeGreaterThan(0)
  })

  harnesses.forEach(harness => {
    const harnessPath = path.join(HARNESSES_DIR, harness)

    describe(`${harness}`, () => {
      test('HARNESS.md exists', () => {
        const harnessMd = path.join(harnessPath, 'HARNESS.md')
        expect(fs.existsSync(harnessMd)).toBe(true)
      })

      test('HARNESS.md contains Attribution section', () => {
        const harnessMd = path.join(harnessPath, 'HARNESS.md')
        const content = readFile(harnessMd)
        if (!content) return
        expect(content).toMatch(/##\s+Attribution/i)
        expect(content).toMatch(/revfactory\/harness-100/i)
        expect(content).toMatch(/Apache 2\.0/i)
      })

      test('agents/ directory exists and is not empty', () => {
        const agentsDir = path.join(harnessPath, 'agents')
        expect(fs.existsSync(agentsDir)).toBe(true)
        const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
        expect(agents.length).toBeGreaterThan(0)
      })

      test('skills/ directory exists with at least one SKILL.md', () => {
        const skillsDir = path.join(harnessPath, 'skills')
        expect(fs.existsSync(skillsDir)).toBe(true)
        const skillFiles = []
        fs.readdirSync(skillsDir).forEach(subdir => {
          const skillMd = path.join(skillsDir, subdir, 'SKILL.md')
          if (fs.existsSync(skillMd)) skillFiles.push(skillMd)
        })
        expect(skillFiles.length).toBeGreaterThan(0)
      })

      test('orchestrator SKILL.md has trigger-first description', () => {
        const skillsDir = path.join(harnessPath, 'skills')
        if (!fs.existsSync(skillsDir)) return

        // Find the orchestrator skill (shares name with harness or first skill)
        const skillDirs = fs.readdirSync(skillsDir)
        let orchestratorSkill = null

        // Look for skill named after the harness (e.g. 21-code-reviewer → code-reviewer)
        const harnessBaseName = harness.replace(/^\d+-/, '')
        skillDirs.forEach(skillDir => {
          if (skillDir === harnessBaseName || orchestratorSkill === null) {
            const skillMd = path.join(skillsDir, skillDir, 'SKILL.md')
            if (fs.existsSync(skillMd)) orchestratorSkill = skillMd
          }
        })

        if (!orchestratorSkill) return

        const content = readFile(orchestratorSkill)
        expect(content).toMatch(/description:\s*["']Use when/i)
      })

      test('orchestrator SKILL.md has "Does NOT cover" exclusion', () => {
        const skillsDir = path.join(harnessPath, 'skills')
        if (!fs.existsSync(skillsDir)) return

        const harnessBaseName = harness.replace(/^\d+-/, '')
        const orchestratorPath = path.join(skillsDir, harnessBaseName, 'SKILL.md')
        if (!fs.existsSync(orchestratorPath)) return

        const content = readFile(orchestratorPath)
        expect(content).toMatch(/Does NOT cover/i)
      })

      test('agent files have Input Contract and Output Contract sections', () => {
        const agentsDir = path.join(harnessPath, 'agents')
        if (!fs.existsSync(agentsDir)) return

        const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
        agentFiles.forEach(agentFile => {
          const content = readFile(path.join(agentsDir, agentFile))
          if (!content) return
          expect(content).toMatch(/##\s+Input Contract/i)
          expect(content).toMatch(/##\s+Output Contract/i)
        })
      })

      test('agent files have Message Protocol section', () => {
        const agentsDir = path.join(harnessPath, 'agents')
        if (!fs.existsSync(agentsDir)) return

        const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
        agentFiles.forEach(agentFile => {
          const content = readFile(path.join(agentsDir, agentFile))
          if (!content) return
          // Terminal agents (synthesizer, reporter, pipeline-reviewer, devops-engineer) do not send outgoing messages
          if (agentFile.includes('synthesizer') || agentFile.includes('reporter') || agentFile === 'pipeline-reviewer.md' || agentFile === 'devops-engineer.md' || agentFile === 'infra-reviewer.md' || agentFile === 'performance-reviewer.md' || agentFile === 'action-planner.md' || agentFile === 'community-planner.md') return
          expect(content).toMatch(/##\s+Message Protocol/i)
        })
      })

      test('agent files reference _workspace/messages/ in output', () => {
        const agentsDir = path.join(harnessPath, 'agents')
        if (!fs.existsSync(agentsDir)) return

        const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
        agentFiles.forEach(agentFile => {
          const content = readFile(path.join(agentsDir, agentFile))
          if (!content) return
          if (agentFile.includes('synthesizer') || agentFile.includes('reporter') || agentFile === 'pipeline-reviewer.md' || agentFile === 'devops-engineer.md' || agentFile === 'infra-reviewer.md' || agentFile === 'performance-reviewer.md' || agentFile === 'action-planner.md' || agentFile === 'community-planner.md') return // terminal agents
          expect(content).toMatch(/_workspace\/messages\//i)
        })
      })

      test('orchestrator SKILL.md references task(agent_type', () => {
        const skillsDir = path.join(harnessPath, 'skills')
        if (!fs.existsSync(skillsDir)) return

        const harnessBaseName = harness.replace(/^\d+-/, '')
        const orchestratorPath = path.join(skillsDir, harnessBaseName, 'SKILL.md')
        if (!fs.existsSync(orchestratorPath)) return

        const content = readFile(orchestratorPath)
        expect(content).toMatch(/task\(agent_type/i)
      })

      test('no agent file references SendMessage', () => {
        const agentsDir = path.join(harnessPath, 'agents')
        if (!fs.existsSync(agentsDir)) return

        const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
        agentFiles.forEach(agentFile => {
          const content = readFile(path.join(agentsDir, agentFile))
          if (!content) return
          expect(content).not.toMatch(/SendMessage\(/i)
        })
      })

      test('no SKILL.md references SendMessage', () => {
        const skillsDir = path.join(harnessPath, 'skills')
        if (!fs.existsSync(skillsDir)) return

        fs.readdirSync(skillsDir).forEach(subdir => {
          const skillMd = path.join(skillsDir, subdir, 'SKILL.md')
          if (!fs.existsSync(skillMd)) return
          const content = readFile(skillMd)
          if (!content) return
          expect(content).not.toMatch(/SendMessage\(/i)
        })
      })
    })
  })
})

describe('Template Files', () => {
  test('agent-template.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'templates', 'agent-template.md'))).toBe(true)
  })

  test('orchestrator-skill-template.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'templates', 'orchestrator-skill-template.md'))).toBe(true)
  })

  test('workspace-layout.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'templates', 'workspace-layout.md'))).toBe(true)
  })
})

describe('Guide Files', () => {
  test('installation.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'guides', 'installation.md'))).toBe(true)
  })

  test('message-bus-pattern.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'guides', 'message-bus-pattern.md'))).toBe(true)
  })

  test('porting-from-claude-code.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'guides', 'porting-from-claude-code.md'))).toBe(true)
  })
})
