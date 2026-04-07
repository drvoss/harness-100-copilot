/**
 * Project signal detection — scans the current directory for markers
 * that indicate which type of project this is.
 */

import fs from 'fs'
import path from 'path'

/**
 * @param {string} cwd  Absolute path to the project root
 * @returns {{ cwd: string, signals: string[] }}
 */
export async function detectProject(cwd) {
  const signals = new Set()

  // ── package.json dependency scan ────────────────────────────────────
  const pkgPath = path.join(cwd, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

      if (allDeps['react'] || allDeps['next'] || allDeps['@remix-run/react']) signals.add('react')
      if (allDeps['next'])    signals.add('next')
      if (allDeps['vue'] || allDeps['nuxt'])           signals.add('vue')
      if (allDeps['svelte'] || allDeps['@sveltejs/kit']) signals.add('svelte')
      if (allDeps['expo'] || allDeps['react-native'])  signals.add('expo')
      if (allDeps['flutter'])                          signals.add('flutter')
      if (allDeps['express'] || allDeps['fastify'] || allDeps['hono']) signals.add('express')
      if (allDeps['prisma'] || allDeps['@prisma/client']) signals.add('prisma')
      if (allDeps['drizzle-orm'])                      signals.add('drizzle')
      if (allDeps['typeorm'])                          signals.add('typeorm')
      if (allDeps['jest'] || allDeps['vitest'])        signals.add('jest')
      if (allDeps['playwright'] || allDeps['@playwright/test']) signals.add('playwright')
      if (allDeps['cypress'])                          signals.add('cypress')
      if (allDeps['torch'] || allDeps['tensorflow'] || allDeps['scikit-learn']) signals.add('sklearn')
      if (allDeps['mlflow'])                           signals.add('mlflow')
      if (allDeps['graphql'] || allDeps['@apollo/server']) signals.add('graphql')
    } catch { /* malformed package.json — skip */ }
  }

  // ── requirements.txt (Python) ────────────────────────────────────────
  const reqPath = path.join(cwd, 'requirements.txt')
  if (fs.existsSync(reqPath)) {
    const req = fs.readFileSync(reqPath, 'utf8').toLowerCase()
    if (req.includes('torch') || req.includes('tensorflow') || req.includes('sklearn')) {
      signals.add('requirements-ml')
    }
    if (req.includes('mlflow'))     signals.add('mlflow')
    if (req.includes('fastapi') || req.includes('flask') || req.includes('django')) {
      signals.add('fastapi')
    }
    if (req.includes('pytest'))     signals.add('pytest')
    if (req.includes('airflow') || req.includes('apache-airflow')) signals.add('airflow')
    if (req.includes('kafka') || req.includes('confluent-kafka'))  signals.add('kafka')
    if (req.includes('pyspark') || req.includes('apache-spark'))   signals.add('spark')
    if (req.includes('dbt-core') || req.includes('dbt-'))          signals.add('dbt')
  }

  // ── File / directory checks ──────────────────────────────────────────
  const fileChecks = [
    ['.github/workflows', 'github-workflows'],
    ['Dockerfile',         'dockerfile'],
    ['docker-compose.yml', 'docker-compose'],
    ['docker-compose.yaml','docker-compose'],
    ['terraform',          'terraform'],
    ['kubernetes',         'kubernetes'],
    ['k8s',                'k8s'],
    ['openapi.yml',        'openapi'],
    ['openapi.yaml',       'openapi'],
    ['swagger.yml',        'swagger'],
    ['swagger.yaml',       'swagger'],
    ['api',                'api-dir'],
    ['routes',             'routes-dir'],
    ['migrations',         'migrations-dir'],
    ['tests',              'test-dir'],
    ['__tests__',          'test-dir'],
    ['mlflow',             'mlflow'],
    ['.git',               'git-repo'],
    // 22-legacy-modernizer
    ['legacy',             'legacy'],
    // 25-incident-postmortem
    ['RUNBOOK.md',         'runbook'],
    ['runbook',            'runbook'],
    ['postmortem',         'postmortem'],
    ['incident',           'incident'],
    // 27-data-pipeline
    ['dbt_project.yml',    'dbt'],
    // 28-security-audit
    ['.snyk',              'snyk'],
    ['.github/dependabot.yml', 'dependabot'],
    ['SECURITY.md',        'security-policy'],
    // 29-performance-optimizer
    ['lighthouse',         'lighthouse'],
    // 30-open-source-launcher
    ['CONTRIBUTING.md',    'contributing-md'],
    ['CODE_OF_CONDUCT.md', 'code-of-conduct'],
    ['CHANGELOG.md',       'changelog-present'],
  ]

  for (const [pattern, signal] of fileChecks) {
    if (fs.existsSync(path.join(cwd, pattern))) signals.add(signal)
  }

  // ── Glob-style checks (files with extension in root) ────────────────
  try {
    const rootFiles = fs.readdirSync(cwd)
    if (rootFiles.some(f => f.endsWith('.tf')))      signals.add('terraform')
    if (rootFiles.some(f => f.endsWith('.ipynb')))   signals.add('jupyter')
    if (rootFiles.some(f => f === 'Jenkinsfile'))    signals.add('dockerfile')
    if (rootFiles.some(f => f === '.gitlab-ci.yml')) signals.add('github-workflows')
    if (rootFiles.some(f => f === 'dbt_project.yml'))signals.add('dbt')
    if (rootFiles.some(f => f.toLowerCase().includes('legacy'))) signals.add('legacy')
  } catch { /* permission error — skip */ }

  return { cwd, signals: [...signals].sort() }
}
