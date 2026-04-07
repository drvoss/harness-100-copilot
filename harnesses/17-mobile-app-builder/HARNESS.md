# 17 — Mobile App Builder

Mobile application development harness: a 5-agent team designs UX/UI, implements iOS and Android in parallel, unifies cross-platform state management, and prepares for app store submission.

## Structure

```
harnesses/17-mobile-app-builder/
├── HARNESS.md                              (this file)
├── agents/
│   ├── ux-architect.md                    UX/UI design: navigation, design system, wireframes, accessibility
│   ├── ios-specialist.md                  iOS/SwiftUI: MVVM, TCA, App Store requirements
│   ├── android-specialist.md              Android/Jetpack Compose: MVVM, Hilt, Google Play compliance
│   ├── state-manager.md                   Cross-platform state: KMM, shared business logic, offline-first
│   └── app-store-optimizer.md             Store listing: metadata, screenshots, ASO, compliance (TERMINAL)
└── skills/
    ├── mobile-app-builder/SKILL.md        Orchestrator — fan-out/fan-in pipeline, team coordination
    ├── cross-platform-strategy/SKILL.md   Decision matrix: RN vs Flutter vs KMM vs native
    └── app-store-checklist/SKILL.md       App Store + Google Play review compliance checklist
```

## Agent Team

| Agent | Role | Output |
|-------|------|--------|
| ux-architect | UX/UI design: navigation, design system, wireframes, accessibility | `01_ux_spec.md` |
| ios-specialist | iOS/SwiftUI: MVVM, TCA, App Store requirements | `02_ios_implementation.md` |
| android-specialist | Android/Jetpack Compose: MVVM, Hilt, Google Play compliance | `02_android_implementation.md` |
| state-manager | Cross-platform state: KMM, shared business logic, offline-first | `03_state_design.md` |
| app-store-optimizer | Store listing: metadata, screenshots, ASO, compliance | `04_store_listing.md` |

## Quick Start

```bash
cp -r harnesses/17-mobile-app-builder/agents/ .github/agents/
cp -r harnesses/17-mobile-app-builder/skills/ .github/skills/
```
Then ask Copilot: `Build a mobile app for task management`

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full mobile app build | Full Pipeline (all 5) | all |
| UX and iOS only | Reduced (2 agents) | ux-architect → ios-specialist |
| App store submission only | Single | app-store-optimizer only |

## Usage

Trigger the `mobile-app-builder` skill or make a natural language request:

- "Build a mobile app for task management"
- "Create iOS and Android implementations for my fitness app"
- "Design the UX and architecture for a social media mobile app"
- "Prepare app store submission for my mobile app"
- "Re-run mobile build with React Native instead of native"

## Workspace Artifacts

All artifacts are saved in `_workspace/` in your project:

- `00_input.md` — App concept, target platforms, tech stack preference, timeline
- `01_ux_spec.md` — UX/UI design: navigation patterns, design system, wireframe descriptions
- `02_ios_implementation.md` — iOS/SwiftUI architecture, state, App Store compliance
- `02_android_implementation.md` — Android/Compose architecture, Hilt, Play compliance
- `03_state_design.md` — Cross-platform state management and shared business logic
- `04_store_listing.md` — App store metadata, screenshots spec, ASO, compliance checklist

## Installation

```bash
# Copy agent definitions to your project
cp -r harnesses/17-mobile-app-builder/agents/ .github/agents/

# Copy skill definitions
cp -r harnesses/17-mobile-app-builder/skills/ .github/skills/
```

## Attribution

Adapted from [revfactory/harness-100](https://github.com/revfactory/harness-100/tree/main/en/17-mobile-app-builder)
under Apache 2.0 License. Key adaptation: SendMessage peer communication
replaced with file-based message bus (`_workspace/messages/`).
