# 29 - Performance Optimizer

Performance optimization harness: an agent team profiles system bottlenecks, optimizes frontend Core Web Vitals and backend API latency, tunes infrastructure auto-scaling and connection pooling, then validates improvements with before/after comparison and ROI estimation.

## Structure

harnesses/29-performance-optimizer/
- HARNESS.md (this file)
- agents/
  - profiling-analyst.md - Performance profiling: bottleneck identification, baseline metrics, flame graphs
  - frontend-optimizer.md - Frontend performance: Core Web Vitals, bundle optimization, lazy loading, CDN
  - backend-optimizer.md - Backend performance: API latency, DB query optimization, caching strategy
  - infra-tuner.md - Infrastructure tuning: auto-scaling, resource limits, connection pooling, CDN config
  - performance-reviewer.md - Improvement validation: before/after comparison, ROI estimation (TERMINAL)
- skills/
  - performance-optimizer/SKILL.md - Orchestrator - team coordination, workflow, error handling
  - core-web-vitals/SKILL.md - Supporting - LCP/FID/CLS targets, measurement tools, optimization
  - db-query-optimization/SKILL.md - Supporting - EXPLAIN plan patterns, index tuning, N+1 detection

## Usage

Trigger the performance-optimizer skill or make a natural language request:
- "My app is slow, find the bottlenecks"
- "Optimize Core Web Vitals for our landing page"
- "API p99 latency is too high, fix it"
- "Right-size our Kubernetes auto-scaling"

## Workspace Artifacts

All artifacts are saved in _workspace/ in your project:
- 00_input.md - System under review, performance targets, current metrics
- 01_profiling_report.md - Profiling analyst output: bottleneck map, baseline metrics
- 02_frontend_optimizations.md - Frontend optimizer output
- 03_backend_optimizations.md - Backend optimizer output
- 04_infra_tuning.md - Infra tuner output
- 05_performance_review.md - Final review with before/after comparison (TERMINAL)

## Installation

Copy agents and skills to your project:
cp -r harnesses/29-performance-optimizer/agents/ /path/to/project/.github/agents/
cp -r harnesses/29-performance-optimizer/skills/ /path/to/project/.github/skills/

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/29-performance-optimizer)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (_workspace/messages/).
