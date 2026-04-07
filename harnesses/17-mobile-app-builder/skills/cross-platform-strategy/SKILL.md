---
name: cross-platform-strategy
description: "Use when deciding between React Native, Flutter, Kotlin Multiplatform Mobile, or native (SwiftUI + Jetpack Compose) development. Provides a scored decision matrix, team-skill-based recommendation tree, and deep-dive analysis for each option covering performance, code sharing, ecosystem maturity, and timeline impact."
metadata:
  category: harness
  harness: 17-mobile-app-builder
  agent_type: general-purpose
---

# Cross-Platform Strategy — Technology Decision Framework

A structured decision framework for choosing between React Native, Flutter, Kotlin Multiplatform Mobile (KMM), and fully native (SwiftUI + Jetpack Compose) mobile development.

## Decision Matrix

| Criterion | Native | KMM | Flutter | React Native |
|-----------|--------|-----|---------|--------------|
| UI fidelity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Code sharing | ❌ ~0% | ✅ 40–70% (logic) | ✅ 80–95% (UI+logic) | ✅ 70–90% (UI+logic) |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| iOS/Android team fit | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| JS/TS team fit | N/A | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| New platform features (Day 0) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| App Store approval risk | Lowest | Low | Low | Medium |
| Ecosystem maturity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Initial development velocity | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Long-term maintainability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## Recommendation Decision Tree

```
Is the team primarily JS/TS developers?
  YES → Does the app require complex native UI or real-time performance?
          YES → Flutter (better performance than RN for complex UI)
          NO  → React Native with Expo (fastest JS/TS path)
  NO  → Continue ↓

Does the app require cutting-edge platform features on day 1?
  YES → Does the team have both iOS and Android specialists?
          YES → Native dual (SwiftUI + Compose) — maximum control
          NO  → KMM (native UI per platform, shared business logic)
  NO  → Continue ↓

Is maximizing business logic sharing the primary goal?
  YES → Does the team know Kotlin?
          YES → KMM (best native UI + shared logic combination)
          NO  → Flutter (best logic + UI sharing for non-Kotlin teams)
  NO  → Continue ↓

Does the app need maximum UI code sharing including custom design system?
  YES → Flutter
  NO  → KMM or Native
```

## Option Deep Dives

### Native (SwiftUI + Jetpack Compose)
**Best for:** Apps requiring cutting-edge platform features, highest performance, award-quality native UX, or maximum App Store/Play Store approval confidence.

**Strengths:**
- Each platform fully optimized with zero compromise
- New OS features available on day 0 (WidgetKit, Dynamic Island, Predictive Back)
- Largest hiring pool for iOS (Swift) and Android (Kotlin) separately
- Highest App Store review approval confidence (no bridge overhead, no third-party runtime)

**Tradeoffs:**
- Two separate codebases — business logic must be duplicated or coordinated
- 30–50% higher development time for identical feature parity
- Requires two specialized teams (iOS and Android)

**Avoid when:** Small team (< 4 devs), tight MVP timeline, or the same business logic in both apps will inevitably diverge.

---

### Kotlin Multiplatform Mobile (KMM)
**Best for:** Teams with existing Kotlin/Android expertise who want native UI quality while sharing business logic.

**What KMM shares:**
- Domain models, repository interfaces, use cases (business rules)
- Networking layer (Ktor HTTP client)
- Local database schema and queries (SQLDelight)
- ViewModels (optional, using KMP-compatible ViewModel)
- Data transformation and validation logic

**What stays native:**
- All UI: SwiftUI on iOS, Jetpack Compose on Android
- Platform permissions and system APIs
- Push notifications (APNs vs FCM)

**Production adoption:** Touchlab, Netflix, Square, VMware, Cash App

**Avoid when:** Team is primarily JS/TS; app has minimal shared logic; iOS developer availability is low (KMM requires a Kotlin developer who can produce iOS-compatible shared code).

---

### Flutter
**Best for:** Apps needing rich custom UI not following platform conventions, targeting web in addition to mobile, or teams wanting maximum code sharing with a single language (Dart).

**Strengths:**
- ~80–95% code sharing including UI layer
- Excellent for custom design systems not tied to iOS HIG or Material Design
- Strong GPU-accelerated rendering via Skia/Impeller engine
- Single codebase for iOS, Android, Web, macOS, Windows, Linux

**Tradeoffs:**
- Dart language — significant upskill if team is not already Dart-familiar
- Apps can feel slightly "non-native" in gesture responses and standard component behavior
- Access to new iOS/Android platform features requires waiting for Flutter plugin updates

**Avoid when:** App must feel fully native with platform-specific animations and gestures; team is iOS/Android specialists; access to new OS APIs on day 0 is required.

---

### React Native
**Best for:** JS/TS teams, startups needing rapid cross-platform prototype, or apps with existing web React code to reuse.

**Strengths:**
- JavaScript/TypeScript — no new language investment for web teams
- Expo for rapid development and OTA updates without store review
- New Architecture (JSI + Hermes) significantly improves performance over the legacy bridge
- Large ecosystem, Meta-backed, many third-party libraries

**Tradeoffs:**
- Performance ceiling lower than native or Flutter for complex animations and real-time features
- Bridge overhead still exists (even with New Architecture) for some native module calls
- Dependency on third-party libraries for native features; maintenance inconsistency
- Some App Store reviewers scrutinize JavaScript-heavy apps more carefully

**Avoid when:** Performance-critical features (games, real-time video, heavy animations); app needs platform-specific APIs on day 1; long-term maintenance stability is critical and team may not maintain React expertise.

---

## KMM Shared Module Structure

```
shared/
├── commonMain/
│   └── kotlin/com/app/shared/
│       ├── domain/
│       │   ├── model/          Task.kt, User.kt (shared data classes)
│       │   ├── repository/     TaskRepository.kt (interfaces only)
│       │   └── usecase/        GetTasksUseCase.kt (pure business logic)
│       └── data/
│           ├── local/          TaskQueries.sq (SQLDelight — generates type-safe code)
│           └── remote/         TaskApiClient.kt (Ktor — multiplatform HTTP)
├── androidMain/
│   └── kotlin/                 Android expect/actual (e.g., CoroutineDispatcher)
└── iosMain/
    └── kotlin/                 iOS expect/actual (e.g., CoroutineDispatcher → Main)
```

**iOS consumption:**
```swift
// KMM shared module exposed as Swift framework
let useCase = GetTasksUseCase(repository: TaskRepositoryImpl())
useCase.execute { tasks, error in
    // Called on main thread via @MainActor wrapper
}
```

## Timeline Impact Comparison

| Approach | MVP (2 devs, 3 months) | Full App (4 devs, 6 months) | Long-term maintenance |
|----------|----------------------|----------------------------|----------------------|
| Native dual | Difficult — need 2 specialists | +30–50% vs KMM | Cleanest; full control |
| KMM | Feasible with 1 iOS + 1 Android | Best architecture/quality ratio | Good — shared logic reduces drift |
| Flutter | Best shot at MVP | –20–30% vs native | Good — single codebase |
| React Native (Expo) | Fastest MVP | –25–35% vs native | Variable — ecosystem churn risk |

## Decision Output Template

When recommending a strategy, produce this summary:

```
RECOMMENDED: [Native / KMM / Flutter / React Native]

RATIONALE:
- Team: [team composition and how it fits]
- Timeline: [how the timeline aligns]
- App requirements: [features that drove the decision]

RISK MITIGATIONS:
- [Risk 1]: [mitigation]
- [Risk 2]: [mitigation]

REJECTED OPTIONS:
- [Option]: [one-sentence reason for rejection]

NEXT STEPS:
1. [First concrete action]
2. [Second concrete action]
```
