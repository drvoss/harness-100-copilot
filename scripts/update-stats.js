#!/usr/bin/env node
/**
 * Compute repository statistics and update the README.md harness count badge.
 * Run: node scripts/update-stats.js
 * CI: automatically run on push to main when harnesses change.
 */

'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

function countHarnesses() {
  const harnessDir = path.join(ROOT, 'harnesses')
  if (!fs.existsSync(harnessDir)) return 0
  return fs.readdirSync(harnessDir)
    .filter(d => fs.existsSync(path.join(harnessDir, d, 'HARNESS.md')))
    .length
}

function countAgents() {
  const harnessDir = path.join(ROOT, 'harnesses')
  if (!fs.existsSync(harnessDir)) return 0
  let count = 0
  fs.readdirSync(harnessDir).forEach(harness => {
    const agentsDir = path.join(harnessDir, harness, 'agents')
    if (fs.existsSync(agentsDir)) {
      count += fs.readdirSync(agentsDir).filter(f => f.endsWith('.md')).length
    }
  })
  return count
}

function countSkills() {
  const harnessDir = path.join(ROOT, 'harnesses')
  if (!fs.existsSync(harnessDir)) return 0
  let count = 0
  fs.readdirSync(harnessDir).forEach(harness => {
    const skillsDir = path.join(harnessDir, harness, 'skills')
    if (fs.existsSync(skillsDir)) {
      fs.readdirSync(skillsDir).forEach(skill => {
        if (fs.existsSync(path.join(skillsDir, skill, 'SKILL.md'))) count++
      })
    }
  })
  return count
}

const harnesses = countHarnesses()
const agents = countAgents()
const skills = countSkills()

console.log(`Harnesses : ${harnesses}`)
console.log(`Agents    : ${agents}`)
console.log(`Skills    : ${skills}`)

// Determine badge color based on completion percentage
let color
if (harnesses >= 100) color = 'brightgreen'
else if (harnesses >= 50) color = 'green'
else if (harnesses >= 25) color = 'yellowgreen'
else if (harnesses >= 10) color = 'yellow'
else color = 'orange'

const badgeText = harnesses === 100 ? '100' : `${harnesses}%20of%20100`

const readmePath = path.join(ROOT, 'README.md')
if (!fs.existsSync(readmePath)) {
  console.log('README.md not found — skipping badge update')
  process.exit(0)
}

let readme = fs.readFileSync(readmePath, 'utf8')
const updated = readme.replace(
  /harnesses-[^-]+-[a-z]+\.svg/,
  `harnesses-${badgeText}-${color}.svg`
)

if (updated !== readme) {
  fs.writeFileSync(readmePath, updated)
  console.log(`README.md badge updated: ${harnesses} harnesses (${color})`)
} else {
  console.log('README.md badge pattern not found — no update made')
}
