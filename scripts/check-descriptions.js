#!/usr/bin/env node
/**
 * Validate that all SKILL.md files use trigger-first descriptions.
 * A valid description starts with one of the TRIGGER_FIRST_PATTERNS.
 * Run: node scripts/check-descriptions.js
 * Exit code 1 if any descriptions fail; 0 if all pass.
 */

'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

const TRIGGER_FIRST_PATTERNS = [
  /^use when/i,
  /^triggers when/i,
  /^activate when/i,
  /^deploy when/i,
]

function findSkillFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findSkillFiles(full))
    } else if (entry.name === 'SKILL.md') {
      results.push(full)
    }
  })
  return results
}

const searchDirs = [
  path.join(ROOT, 'harnesses'),
  path.join(ROOT, 'skills'),
]

let errors = 0
let checked = 0

searchDirs.forEach(dir => {
  findSkillFiles(dir).forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8')
    const relPath = path.relative(ROOT, filePath)

    // Extract description from YAML frontmatter
    // Handles single-line and multi-line (quoted) descriptions
    const descMatch = content.match(/^description:\s*["']?([\s\S]+?)["']?\s*^(?:metadata:|---)/m)
    if (!descMatch) {
      // Try simple single-line match
      const simpleMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m)
      if (!simpleMatch) {
        console.warn(`⚠️  No description found in ${relPath}`)
        return
      }
      const desc = simpleMatch[1].trim()
      checked++
      if (!TRIGGER_FIRST_PATTERNS.some(p => p.test(desc))) {
        console.error(`❌  ${relPath}`)
        console.error(`    description: "${desc.substring(0, 80)}..."`)
        errors++
      }
      return
    }

    const desc = descMatch[1].replace(/\n\s*/g, ' ').trim()
    checked++
    if (!TRIGGER_FIRST_PATTERNS.some(p => p.test(desc))) {
      console.error(`❌  ${relPath}`)
      console.error(`    description: "${desc.substring(0, 80)}..."`)
      errors++
    }
  })
})

console.log(`\nChecked ${checked} SKILL.md file(s)`)
if (errors > 0) {
  console.error(`Found ${errors} description(s) not following trigger-first pattern`)
  process.exit(1)
} else {
  console.log('✅  All descriptions follow trigger-first pattern')
}
