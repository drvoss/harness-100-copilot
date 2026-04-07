---
name: mobile-app-builder
description: "Use when building a mobile app from scratch, adding major features to an existing app, or redesigning the mobile UX and architecture. Dispatches ux-architect, ios-specialist, android-specialist, state-manager, and app-store-optimizer in a fan-out/fan-in pipeline. Covers UX design through app store submission for iOS and Android native apps. Does NOT cover backend API development (use a separate API design harness), web frontend, React Native or Flutter implementation (see cross-platform-strategy skill for platform selection). Also triggers on: re-run mobile build, update app architecture, revise store listing, add platform support."
metadata:
  category: harness
  harness: 17-mobile-app-builder
  agent_type: general-purpose
---

# Mobile App Builder — iOS + Android Development Pipeline

A 5-agent team designs UX, implements iOS and Android in parallel (fan-out), unifies cross-platform state (fan-in), and prepares for app store submission — using file-based message routing.

## Execution Mode

**File-Bus Team (Fan-Out/Fan-In)** — ux-architect fans out to ios-specialist and android-specialist in parallel; both fan in to state-manager; app-store-optimizer terminates the pipeline.

## Agent Composition

| Agent | File | Role | Type |
|-------|------|------|------|
| ux-architect | `agents/ux-architect.md` | Navigation patterns, design system, wireframes, accessibility | general-purpose |
| ios-specialist | `agents/ios-specialist.md` | SwiftUI, MVVM/TCA, Swift concurrency, App Store requirements | general-purpose |
| android-specialist | `agents/android-specialist.md` | Jetpack Compose, Hilt, Kotlin coroutines, Google Play compliance | general-purpose |
| state-manager | `agents/state-manager.md` | Cross-platform state, KMM, offline-first sync, conflict resolution | general-purpose |
| app-store-optimizer | `agents/app-store-optimizer.md` | Metadata, screenshots, ASO keywords, review compliance (TERMINAL) | general-purpose |

## Workspace Layout

```
_workspace/
├── 00_input.md                          (orchestrator setup — always first)
├── 01_ux_spec.md                        (ux-architect output)
├── 02_ios_implementation.md             (ios-specialist output — parallel with Android)
├── 02_android_implementation.md         (android-specialist output — parallel with iOS)
├── 03_state_design.md                   (state-manager output: fan-in from iOS + Android)
├── 04_store_listing.md                  (app-store-optimizer output — TERMINAL)
└── messages/
    ├── ux-architect-to-ios-specialist.md
    ├── ux-architect-to-android-specialist.md
    ├── ios-specialist-to-state-manager.md
    ├── android-specialist-to-state-manager.md
    └── state-manager-to-app-store-optimizer.md
```

## Pre-Flight Checks
- [ ] No duplicate agent instances running
- [ ] `_workspace/` is clean or confirmed stale (safe to overwrite)
- [ ] All 5 agent files present in `agents/`
- [ ] App concept, target platforms, and tech stack preference are available in the request

## Phase 1: Setup (Orchestrator)

```
task(agent_type="general-purpose",
     description="Read the user's mobile app request. Create _workspace/ and _workspace/messages/ directories. Extract: app concept and name, target platforms (iOS / Android / both), tech stack preference (SwiftUI+Compose native / KMM / React Native / Flutter), key user flows (list 3–5 core flows), timeline, and any design constraints or existing brand guidelines. Write organized input to _workspace/00_input.md with sections: APP_CONCEPT, TARGET_PLATFORMS, TECH_STACK_PREFERENCE, KEY_USER_FLOWS, TIMELINE, DESIGN_CONSTRAINTS.")
```

## Phase 2: UX Design

### Step 2.1 — UX Architect
```
task(agent_type="general-purpose",
     description="You are the ux-architect agent in the mobile-app-builder harness. Read agents/ux-architect.md for your full instructions. Read _workspace/00_input.md for the app concept and requirements. Design the complete mobile UX: navigation patterns (tab bar for iOS, bottom navigation for Android), design system (typography, color palette with light/dark variants, spacing scale, component library), wireframe descriptions for all key screens, accessibility checklist (44×44pt iOS touch targets, 48×48dp Android, contrast ratios, screen reader labels), and a platform divergence map showing where iOS HIG and Material Design 3 differ. Write your full UX specification to _workspace/01_ux_spec.md. Write handoff messages to BOTH _workspace/messages/ux-architect-to-ios-specialist.md AND _workspace/messages/ux-architect-to-android-specialist.md with STATUS: COMPLETE, key navigation decisions, design system summary, iOS-specific or Android-specific notes, and component priorities.")
```

## Phase 3: Platform Implementation (Fan-Out — run both steps)

### Step 3.1 — iOS Specialist
```
task(agent_type="general-purpose",
     description="You are the ios-specialist agent in the mobile-app-builder harness. Read agents/ios-specialist.md for your full instructions. Read _workspace/00_input.md and _workspace/01_ux_spec.md. Read _workspace/messages/ux-architect-to-ios-specialist.md for iOS-specific UX notes. Design the complete iOS implementation: choose architecture pattern (MVVM+Combine for standard complexity, TCA for complex state/testing needs), map all UX spec screens to SwiftUI components, specify Swift concurrency approach (async/await entry points, @MainActor usage, actor isolation), define data layer (CoreData / SwiftData / SQLite with caching), list App Store compliance items (PrivacyInfo.xcprivacy entries, entitlements, NSUsageDescription keys). Write your full implementation spec to _workspace/02_ios_implementation.md. Write handoff to _workspace/messages/ios-specialist-to-state-manager.md with STATUS: COMPLETE, architecture pattern, shared business logic candidates, and data model names.")
```

### Step 3.2 — Android Specialist
```
task(agent_type="general-purpose",
     description="You are the android-specialist agent in the mobile-app-builder harness. Read agents/android-specialist.md for your full instructions. Read _workspace/00_input.md and _workspace/01_ux_spec.md. Read _workspace/messages/ux-architect-to-android-specialist.md for Android-specific UX notes. Design the complete Android implementation: choose architecture pattern (MVVM+StateFlow for standard, MVI for strict unidirectional flow), map all UX spec screens to Jetpack Compose composables, specify Hilt module structure with component scopes, define Room entity schema and migration strategy, list Google Play compliance items (target SDK 34, Data Safety declarations, sensitive permissions justification). Write your full implementation spec to _workspace/02_android_implementation.md. Write handoff to _workspace/messages/android-specialist-to-state-manager.md with STATUS: COMPLETE, architecture pattern, shared business logic candidates, and Room entity names.")
```

## Phase 4: State Architecture (Fan-In)

### Step 4.1 — State Manager
```
task(agent_type="general-purpose",
     description="You are the state-manager agent in the mobile-app-builder harness. Read agents/state-manager.md for your full instructions. Read _workspace/00_input.md, _workspace/02_ios_implementation.md, and _workspace/02_android_implementation.md. Read BOTH _workspace/messages/ios-specialist-to-state-manager.md AND _workspace/messages/android-specialist-to-state-manager.md — these are the fan-in messages from parallel platform work. Reconcile the SHARED_BUSINESS_LOGIC candidates from both platforms. Choose cross-platform strategy: KMM if team has Kotlin expertise and wants native UI; React Native Bridge if team is JS/TS; native-with-protocol if code sharing is minimal. Define shared data models (reconciled from iOS and Android outputs), SQLDelight/Room schema, offline-first sync strategy, conflict resolution policy, and state mapping from iOS Combine/TCA to Android StateFlow/MVI. Write your full state architecture to _workspace/03_state_design.md. Write handoff to _workspace/messages/state-manager-to-app-store-optimizer.md with STATUS: COMPLETE, strategy chosen, app capabilities, all permissions used, and notable technical features.")
```

## Phase 5: App Store Submission (Terminal)

### Step 5.1 — App Store Optimizer
```
task(agent_type="general-purpose",
     description="You are the app-store-optimizer agent in the mobile-app-builder harness. Read agents/app-store-optimizer.md for your full instructions. Read _workspace/00_input.md, _workspace/01_ux_spec.md, and _workspace/03_state_design.md. Read _workspace/messages/state-manager-to-app-store-optimizer.md for the final capabilities and permissions list. Create the complete app store listing package: Apple App Store metadata (name ≤30 chars, subtitle ≤30 chars, keywords ≤100 chars total, description ≤4000 chars — verify every character count), Google Play metadata (name ≤30 chars, short description ≤80 chars, full description ≤4000 chars — embed keywords naturally), screenshot specifications for all required device sizes (iPhone 6.7\" required, iPad Pro 12.9\" if iPad, Google Play phone + feature graphic), ASO keyword strategy with primary and long-tail keywords, and review compliance checklist for both stores flagging all potential rejection risks. Write the complete store listing to _workspace/04_store_listing.md. This is the terminal step — no outgoing message is required.")
```

## Scale Modes

| Request Pattern | Mode | Agents Used |
|----------------|------|-------------|
| Full app build request | Full Pipeline | All 5 agents |
| UX design only | UX Mode | ux-architect only |
| iOS only | iOS Mode | ux-architect → ios-specialist → state-manager → app-store-optimizer |
| Android only | Android Mode | ux-architect → android-specialist → state-manager → app-store-optimizer |
| Store listing only | Store Mode | app-store-optimizer (reads existing `_workspace/` artifacts) |
| Architecture review / state design | Arch Mode | ios-specialist + android-specialist → state-manager |

## Error Handling

| Error Type | Strategy |
|-----------|----------|
| Agent output file missing | Re-run agent once; if still missing, downstream agent notes "unavailable" and proceeds with available data |
| iOS or Android implementation missing | state-manager proceeds with the available platform; notes missing platform in `03_state_design.md` |
| Ambiguous app concept | Apply most common pattern (MVVM, tab bar navigation); document assumptions in `00_input.md` |
| Platform not specified | Default to both iOS and Android; document assumption in `00_input.md` |
| Tech stack conflict between platforms | state-manager resolves by defaulting to KMM for native teams, RN for JS teams |
| Character limit exceeded | app-store-optimizer rewrites to fit limits; never truncate metadata silently |
| `_workspace/` conflict | Append `-2` suffix to conflicting files; document in `04_store_listing.md` |

## Test Scenarios
1. **Normal case:** Full app concept provided → all 5 agents produce outputs → `04_store_listing.md` is a complete, submission-ready package
2. **Single platform:** "iOS only" request → ux-architect + ios-specialist + state-manager + app-store-optimizer (Android step skipped)
3. **Error case:** ios-specialist output missing → state-manager notes "iOS output unavailable, proceeding with Android data only" → app-store-optimizer produces Android listing only
