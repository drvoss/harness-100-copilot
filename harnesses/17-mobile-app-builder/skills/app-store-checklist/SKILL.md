---
name: app-store-checklist
description: "Use when preparing an app for Apple App Store or Google Play submission — provides a comprehensive pre-submission checklist covering metadata character limits, screenshot specifications for all device types, review guideline compliance, privacy requirements, Data Safety form guidance, and common rejection reasons with fixes. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: harness
  harness: 17-mobile-app-builder
  agent_type: general-purpose
---

# App Store Checklist — Pre-Submission Compliance Reference

A comprehensive checklist for Apple App Store and Google Play pre-submission review, covering metadata requirements, screenshot specs, privacy, technical compliance, and common rejection reasons.

---

## Apple App Store Pre-Submission Checklist

### Metadata Requirements
- [ ] **App Name** (≤30 characters) — no competitor names; no category descriptors that duplicate App Store categories (e.g., "App" or "Games")
- [ ] **Subtitle** (≤30 characters) — distinct value from app name; include primary keyword if natural
- [ ] **Keywords** (≤100 characters total, comma-separated) — no spaces after commas; never repeat words from name or subtitle; include competitor gap keywords
- [ ] **Description** (≤4000 characters) — no unsubstantiated superlatives ("best", "most popular") without third-party evidence
- [ ] **Promotional Text** (≤170 characters) — appears above description; updatable without App Review
- [ ] **Privacy Policy URL** — publicly accessible without login or account creation
- [ ] **Support URL** — working URL leading to real support resource
- [ ] **What's New** (≤4000 characters) — honest description of changes; no marketing language

### Screenshots

| Device | Required | Portrait Size | Landscape Size |
|--------|----------|--------------|----------------|
| iPhone 6.7" (Pro Max) | ✅ Required | 1290×2796 | 2796×1290 |
| iPhone 5.5" | Optional | 1242×2208 | 2208×1242 |
| iPad Pro 12.9" | Required if iPad supported | 2048×2732 | 2732×2048 |
| iPad Pro 11" | Optional | 1668×2388 | 2388×1668 |

- [ ] Screenshots show actual in-app functionality (no mockups misrepresenting features)
- [ ] No device frames that differ from the declared device type
- [ ] No promotional pricing, award badges, or third-party customer reviews
- [ ] Captions or annotations do not obscure key UI elements
- [ ] App Preview video (optional): 15–30 seconds, captured directly from app, no external voice-over

### Technical Requirements
- [ ] Submitted with Xcode latest stable release
- [ ] No private or restricted API calls (`nm -u` binary check; search for `@_silgen_name` and private frameworks)
- [ ] App runs without crash on all declared supported devices and iOS versions
- [ ] 64-bit binary only (required since iOS 11; 32-bit apps rejected)
- [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) included if app uses covered APIs
- [ ] All `NSUsageDescription` keys present in `Info.plist` for every requested permission

### Privacy Compliance
- [ ] App Tracking Transparency (ATT) prompt shown before accessing IDFA — never on first launch, only before use
- [ ] App Privacy Nutrition Labels in App Store Connect accurately reflect data collection
- [ ] Data collection matches privacy policy content
- [ ] No collection of banned device identifiers (UDID, MAC address, IMEI)
- [ ] Required Reason APIs declared: file timestamps, user defaults, disk space, active keyboard, system boot time

### Required Reason APIs Reference
| API Category | Example Usage | Required Reason Code |
|-------------|---------------|---------------------|
| File timestamp APIs | File modification dates | `C617.1` (app functionality) |
| User defaults | `UserDefaults.standard` | `CA92.1` (app functionality) |
| Disk space APIs | `URLResourceValues.volumeAvailableCapacity` | `E174.1` (display to user) |
| Active keyboard APIs | `UITextInputMode.activeInputModes` | `54BD.1` (custom keyboard) |
| System boot time APIs | `ProcessInfo.systemUptime` | `35F9.1` (measure performance) |

### Common Rejection Reasons (App Store 2024)

| Guideline | Issue | Fix |
|-----------|-------|-----|
| 2.1 — Performance | App crashes or freezes during review | Test on clean device; reproduce review conditions (no iCloud, fresh install) |
| 2.3.3 — Accurate Metadata | Screenshots do not reflect app functionality | Use only actual in-app screenshots |
| 3.1.1 — Payments | Digital goods bypass StoreKit | All in-app purchases must use StoreKit 2; no external payment links |
| 4.0 — Design | Non-standard UI or broken layouts | Follow Human Interface Guidelines; test all device sizes |
| 4.3 — Spam | Duplicate or low-value app | Demonstrate clear differentiation; ensure genuine utility |
| 5.1.1 — Privacy Policy | Policy missing, inaccessible, or incomplete | Provide public URL; policy must cover all data collected |
| 5.1.2 — Data Use | Privacy labels do not match actual collection | Audit all SDKs and analytics tools for data collection |
| 1.5 — Developer Information | Developer profile incomplete | Complete all required fields in App Store Connect |

---

## Google Play Pre-Submission Checklist

### Metadata Requirements
- [ ] **App Name** (≤30 characters) — no keyword stuffing; no claims like "Free" or "#1"
- [ ] **Short Description** (≤80 characters) — shown in search results; make compelling and keyword-rich
- [ ] **Full Description** (≤4000 characters) — Play indexes this for search; integrate keywords naturally at ~2% density; first 167 chars shown before "Read more"
- [ ] **Privacy Policy URL** — required for all apps that access sensitive data
- [ ] **Developer Email** — publicly visible; must be monitored for user inquiries

### Graphics Assets

| Asset | Required | Specifications |
|-------|----------|----------------|
| App Icon | ✅ Required | 512×512 PNG, no alpha channel |
| Feature Graphic | ✅ Required | 1024×500 JPG or 24-bit PNG (no alpha) |
| Phone Screenshots | ✅ Min 2, max 8 | 320–3840px on each side; 16:9 or 9:16 aspect ratio |
| 7" Tablet Screenshots | Optional | Same size rules as phone |
| 10" Tablet Screenshots | Optional | Same size rules |
| TV Banner | Required for Android TV | 1280×720 JPG/PNG |
| Wear OS Screenshots | Required for Wear OS | 384×384 or 450×450 (round) |

### Technical Requirements
- [ ] **Target API level**: Must target Android 14 (API 34) for new apps submitted after August 2024
- [ ] **64-bit binaries**: All APKs/AABs must include `arm64-v8a` and `x86_64` native libraries
- [ ] **Android App Bundle (AAB)**: Required format for all new app submissions; APK deprecated
- [ ] **App signing**: Enrolled in Play App Signing (required for AAB)
- [ ] **ProGuard/R8**: Obfuscation rules set correctly; test release build before submission

### Permissions and Data Safety
- [ ] **Data Safety form** completed accurately in Play Console (reviewers verify against app behavior)
  - Data types collected: what is collected (location, contacts, app activity, etc.)
  - Data sharing: which third parties receive data and for what purpose
  - Security practices: data encrypted in transit, user can request deletion
- [ ] **Dangerous permissions** declared with contextual rationale at time of use
- [ ] **Special permissions** justified in Play Console:
  - `MANAGE_EXTERNAL_STORAGE` — required only for true file manager apps
  - `QUERY_ALL_PACKAGES` — required only for apps needing full app inventory
  - `SYSTEM_ALERT_WINDOW` — required only for specific overlay use cases
  - `INSTALL_PACKAGES` — required only for app stores or MDM apps
- [ ] No declared permissions that are not actually used in the app

### Age and Content Rating
- [ ] **IARC rating questionnaire** completed (international rating system; replaces manual per-region ratings)
- [ ] Content rating accurate; adult content requires separate content declaration
- [ ] **COPPA compliance**: Apps targeting children under 13 must comply with Families Policy
  - No interest-based advertising
  - No collection of persistent device identifiers for advertising
  - All SDKs must be approved for children's use

### Common Rejection Reasons (Google Play 2024)

| Policy | Issue | Fix |
|--------|-------|-----|
| Spam | Repetitive, low-quality, or template-generated content | Demonstrate clear utility and differentiation from similar apps |
| Misleading behavior | Store listing metadata does not match app functionality | Align all screenshots, descriptions, and app name with actual in-app behavior |
| Data Safety violation | Undisclosed data collection or sharing | Audit all SDKs (especially analytics and advertising); complete Data Safety form accurately |
| Sensitive permissions | Dangerous permissions without justification | Provide clear contextual rationale; request at point of use, not on launch |
| Target API non-compliance | App targets below minimum API level | Update `targetSdkVersion` to 34 (Android 14) |
| Malware / deceptive behavior | Flagged by Play Protect scanning | Remove policy-violating SDKs; avoid obfuscated code that looks like malware |
| Impersonation | App name, icon, or description resembles another brand | Ensure distinct branding; obtain permission for any third-party branding |

---

## ASO Quick Reference

### Keyword Research Framework
1. **Seed keywords** — Core functionality terms (e.g., "task manager", "to-do list", "project tracker")
2. **Competitor keywords** — Top 3–5 competitors' names and their primary category terms (iOS keywords field)
3. **Long-tail keywords** — More specific phrases with less competition ("offline task manager for teams", "daily planner with reminders")
4. **iOS-specific**: Keywords field (100 chars) — never repeat title or subtitle words; prioritize high-volume terms not in name
5. **Android-specific**: No separate keywords field — embed naturally in description at ~2% density; Play indexes full description

### Metadata Character Count Template

```
iOS App Name:      ______________________________ (__ / 30 chars)
iOS Subtitle:      ______________________________ (__ / 30 chars)
iOS Keywords:      ____________________________________________________________... (__ / 100 chars)
iOS Promo Text:    __________________________________________________________________________ (__ / 170 chars)

Android Name:      ______________________________ (__ / 30 chars)
Android Short:     ________________________________________________________________________________ (__ / 80 chars)
```

### Rating and Review Strategy
- **iOS**: Use `SKStoreReviewRequest.requestReview()` — Apple limits display to 3 times per 365 days; prompt after positive events
- **Android**: Use In-App Review API (`ReviewManager`) — Google suppresses excessive prompts automatically
- **Timing**: Always prompt after a user achieves a goal (completed task, reached milestone) — never on launch, never mid-flow
- **Never**: Incentivize ratings, require rating to continue, or redirect negative reviewers away from the store

### Localization Priority Guide
| Market | iOS Revenue Share | Android Revenue Share | Screenshot Localization ROI |
|--------|------------------|-----------------------|-----------------------------|
| United States | ~30% | ~15% | Baseline |
| Japan | ~20% | ~8% | Very High — localize first |
| United Kingdom | ~8% | ~6% | High |
| Germany | ~6% | ~8% | High |
| South Korea | ~4% | ~12% | High (Android-heavy market) |
| China | N/A (App Store) | ~20% | Requires separate APK/store |
