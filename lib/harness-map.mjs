/**
 * Harness map — signal → harness recommendation rules.
 *
 * @typedef {{ id: string, signals: string[], weight: number,
 *             reason: string, agents: string[], triggerPhrase: string }} HarnessEntry
 *
 * weight: higher = more specific / higher priority match
 */

/** @type {HarnessEntry[]} */
export const HARNESS_MAP = [
  {
    id: '21-code-reviewer',
    signals: ['git-repo'],
    weight: 1,
    reason: 'Code review for any codebase',
    agents: ['style-inspector', 'security-analyst', 'performance-analyst', 'architecture-reviewer', 'review-synthesizer'],
    triggerPhrase: 'Review my recent changes for security and architecture issues',
  },
  {
    id: '16-fullstack-webapp',
    signals: ['react', 'next', 'vue', 'svelte'],
    weight: 10,
    reason: 'Full-stack web application development',
    agents: ['architect', 'frontend-dev', 'backend-dev', 'qa-engineer', 'devops-engineer'],
    triggerPhrase: 'Build a full-stack web application for [description]',
  },
  {
    id: '17-mobile-app-builder',
    signals: ['expo', 'flutter'],
    weight: 10,
    reason: 'Mobile app development (iOS/Android/cross-platform)',
    agents: ['ux-architect', 'ios-specialist', 'android-specialist', 'state-manager', 'app-store-optimizer'],
    triggerPhrase: 'Build a mobile app for [description]',
  },
  {
    id: '18-api-designer',
    signals: ['openapi', 'swagger', 'graphql', 'routes-dir', 'api-dir', 'express', 'fastapi'],
    weight: 8,
    reason: 'API design, documentation, and security',
    agents: ['api-architect', 'rest-specialist', 'graphql-specialist', 'security-designer', 'docs-generator'],
    triggerPhrase: 'Design REST and GraphQL APIs for [service]',
  },
  {
    id: '19-database-architect',
    signals: ['prisma', 'drizzle', 'typeorm', 'migrations-dir'],
    weight: 8,
    reason: 'Database schema design and optimization',
    agents: ['schema-designer', 'query-optimizer', 'migration-planner', 'replication-specialist', 'data-reviewer'],
    triggerPhrase: 'Design the database schema for [description]',
  },
  {
    id: '20-cicd-pipeline',
    signals: ['github-workflows', 'dockerfile', 'docker-compose'],
    weight: 9,
    reason: 'CI/CD pipeline design and optimization',
    agents: ['pipeline-designer', 'infra-engineer', 'security-scanner', 'monitoring-specialist', 'pipeline-reviewer'],
    triggerPhrase: 'Set up a CI/CD pipeline for this project',
  },
  {
    id: '23-microservice-designer',
    signals: ['kubernetes', 'k8s'],
    weight: 9,
    reason: 'Microservice architecture design',
    agents: ['domain-modeler', 'service-designer', 'api-gateway-specialist', 'data-architect', 'deployment-planner'],
    triggerPhrase: 'Design microservice architecture for [system]',
  },
  {
    id: '24-test-automation',
    signals: ['jest', 'playwright', 'cypress', 'pytest', 'test-dir'],
    weight: 7,
    reason: 'Test strategy and automation framework',
    agents: ['test-strategist', 'unit-test-writer', 'integration-test-writer', 'e2e-test-writer', 'test-reviewer'],
    triggerPhrase: 'Create a comprehensive test suite for this project',
  },
  {
    id: '26-infra-as-code',
    signals: ['terraform'],
    weight: 9,
    reason: 'Infrastructure as Code design (Terraform/Kubernetes)',
    agents: ['infra-architect', 'terraform-specialist', 'k8s-specialist', 'security-hardener', 'infra-reviewer'],
    triggerPhrase: 'Design infrastructure as code for [environment]',
  },
  {
    id: '22-legacy-modernizer',
    signals: ['legacy'],
    weight: 7,
    reason: 'Legacy codebase modernization and migration planning',
    agents: ['code-archaeologist', 'risk-assessor', 'modernization-planner', 'refactor-specialist', 'migration-reviewer'],
    triggerPhrase: 'Modernize this legacy codebase',
  },
  {
    id: '25-incident-postmortem',
    signals: ['incident', 'postmortem', 'runbook'],
    weight: 6,
    reason: 'Incident postmortem and root cause analysis',
    agents: ['incident-analyst', 'root-cause-investigator', 'impact-assessor', 'action-planner'],
    triggerPhrase: 'Run a blameless postmortem for the recent incident',
  },
  {
    id: '27-data-pipeline',
    signals: ['airflow', 'kafka', 'spark', 'dbt'],
    weight: 8,
    reason: 'Data pipeline architecture and ETL design',
    agents: ['pipeline-architect', 'ingestion-specialist', 'transformation-engineer', 'quality-monitor', 'pipeline-reviewer'],
    triggerPhrase: 'Design a data pipeline for [description]',
  },
  {
    id: '28-security-audit',
    signals: ['snyk', 'dependabot', 'security-policy', 'api-dir'],
    weight: 6,
    reason: 'Security audit and vulnerability assessment',
    agents: ['threat-modeler', 'code-security-analyst', 'dependency-auditor', 'config-reviewer', 'security-reporter'],
    triggerPhrase: 'Perform a security audit of this codebase',
  },
  {
    id: '29-performance-optimizer',
    signals: ['lighthouse'],
    weight: 6,
    reason: 'Performance profiling and optimization',
    agents: ['profiling-analyst', 'frontend-optimizer', 'backend-optimizer', 'infra-tuner', 'performance-reviewer'],
    triggerPhrase: 'Profile and optimize the performance of this application',
  },
  {
    id: '30-open-source-launcher',
    signals: ['contributing-md', 'code-of-conduct', 'changelog-present'],
    weight: 5,
    reason: 'Open source project launch and community setup',
    agents: ['oss-strategist', 'readme-writer', 'ci-setup-specialist', 'community-planner'],
    triggerPhrase: 'Launch this project as open source',
  },
]
