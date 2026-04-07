/**
 * Harness installer — copies agent and skill files into the target project.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..')

/**
 * Copy a directory recursively. Creates destination directories as needed.
 * @param {string} src
 * @param {string} dest
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false
  fs.mkdirSync(dest, { recursive: true })
  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    const srcPath  = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
  return true
}

/**
 * Install a harness into the current working directory's .github/ folder.
 * @param {string} harnessId  e.g. "21-code-reviewer"
 * @returns {Promise<boolean>} true if installed successfully
 */
export async function installHarness(harnessId) {
  const harnessDir = path.join(REPO_ROOT, 'harnesses', harnessId)

  if (!fs.existsSync(harnessDir)) {
    console.error(`\n❌  Harness not found in this repository: harnesses/${harnessId}`)
    console.error(`    Available harnesses: ${listAvailableHarnesses().join(', ')}`)
    return false
  }

  const cwd = process.cwd()
  const agentsSrc  = path.join(harnessDir, 'agents')
  const skillsSrc  = path.join(harnessDir, 'skills')
  const agentsDest = path.join(cwd, '.github', 'agents')
  const skillsDest = path.join(cwd, '.github', 'skills')

  let installed = false

  if (fs.existsSync(agentsSrc)) {
    copyDir(agentsSrc, agentsDest)
    const count = fs.readdirSync(agentsSrc).filter(f => f.endsWith('.md')).length
    console.log(`  ✓ Copied ${count} agent file(s) → .github/agents/`)
    installed = true
  }

  if (fs.existsSync(skillsSrc)) {
    copyDir(skillsSrc, skillsDest)
    const count = fs.readdirSync(skillsSrc).length
    console.log(`  ✓ Copied ${count} skill(s) → .github/skills/`)
    installed = true
  }

  if (!installed) {
    console.error(`  ⚠️  No agents/ or skills/ found in harnesses/${harnessId}`)
    return false
  }

  return true
}

/**
 * List harness IDs available in the repository.
 * @returns {string[]}
 */
function listAvailableHarnesses() {
  const harnessRoot = path.join(REPO_ROOT, 'harnesses')
  if (!fs.existsSync(harnessRoot)) return []
  return fs.readdirSync(harnessRoot).filter(d =>
    fs.existsSync(path.join(harnessRoot, d, 'HARNESS.md'))
  )
}
