#!/usr/bin/env node
/**
 * harness-detect — Analyze the current project and recommend/install harnesses.
 *
 * Usage:
 *   npx harness-detect           Interactive mode
 *   npx harness-detect --list    Show detected signals only
 *   npx harness-detect --dry-run Show install commands without executing
 *   npx harness-detect -y        Auto-install top recommendation
 */

import { detectProject } from '../lib/detect.mjs'
import { recommendHarnesses } from '../lib/recommend.mjs'
import { installHarness } from '../lib/installer.mjs'
import { createInterface } from 'readline'
import { parseArgs } from 'util'

const { values: args } = parseArgs({
  options: {
    yes:       { type: 'boolean', short: 'y', default: false },
    'dry-run': { type: 'boolean',              default: false },
    list:      { type: 'boolean', short: 'l', default: false },
  },
  strict: false,
})

async function main() {
  console.log('\n🔍  harness-detect — Analyzing your project...\n')

  const projectInfo = await detectProject(process.cwd())

  if (args.list || args['dry-run']) {
    console.log('Project signals detected:')
    if (projectInfo.signals.length === 0) {
      console.log('  (none)')
    } else {
      projectInfo.signals.forEach(s => console.log(`  • ${s}`))
    }
    console.log()
  }

  const recommendations = recommendHarnesses(projectInfo)

  if (recommendations.length === 0) {
    console.log('No specific harness recommendations for this project type.')
    console.log('Consider using 21-code-reviewer for any existing codebase.\n')
    process.exit(0)
  }

  console.log('Recommended harnesses for your project:\n')
  recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec.id}`)
    console.log(`     Reason  : ${rec.reason}`)
    console.log(`     Agents  : ${rec.agents.join(', ')}`)
    console.log(`     Trigger : "${rec.triggerPhrase}"`)
    console.log()
  })

  if (args['dry-run']) {
    const rec = recommendations[0]
    console.log('[Dry run] Would install top recommendation:')
    console.log(`  cp -r harnesses/${rec.id}/agents/ .github/agents/`)
    console.log(`  cp -r harnesses/${rec.id}/skills/ .github/skills/\n`)
    process.exit(0)
  }

  let choice = 0
  if (!args.yes) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise(resolve => {
      const max = recommendations.length
      rl.question(`Install top recommendation? [y/N] or enter 1-${max}: `, resolve)
    })
    rl.close()
    const trimmed = answer.trim().toLowerCase()

    if (!trimmed || trimmed === 'n') {
      console.log('No harnesses installed.')
      process.exit(0)
    }

    const num = parseInt(trimmed, 10)
    if (!isNaN(num)) {
      choice = Math.max(0, Math.min(recommendations.length - 1, num - 1))
    }
  }

  const selected = recommendations[choice]
  const installed = await installHarness(selected.id)

  if (installed) {
    console.log(`\n✅  Installed ${selected.id}`)
    console.log('\nNext steps:')
    console.log('  1. Review agent files in .github/agents/')
    console.log('  2. Start Copilot CLI in your project')
    console.log(`  3. Trigger: "${selected.triggerPhrase}"\n`)
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
