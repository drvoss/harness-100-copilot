/**
 * Harness recommendation engine.
 * Maps detected project signals to candidate harnesses and ranks them by weight.
 */

import { HARNESS_MAP } from './harness-map.mjs'

/**
 * @param {{ signals: string[] }} projectInfo
 * @returns {Array<import('./harness-map.mjs').HarnessEntry>}  Top 3 recommendations
 */
export function recommendHarnesses(projectInfo) {
  const signalSet = new Set(projectInfo.signals)

  const scored = HARNESS_MAP.map(entry => {
    const matchCount = entry.signals.filter(s => signalSet.has(s)).length
    const score = matchCount * entry.weight
    return { ...entry, matchCount, score }
  }).filter(e => e.matchCount > 0)

  // Sort by score descending, then by weight (prefer specific over generic)
  scored.sort((a, b) => b.score - a.score || b.weight - a.weight)

  return scored.slice(0, 3)
}
