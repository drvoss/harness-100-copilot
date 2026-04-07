---
name: core-web-vitals
description: "Use when measuring or optimizing Core Web Vitals -- provides LCP/FID/CLS/INP targets, measurement tool configurations, and optimization techniques for each vital metric."
metadata:
  category: skill
  harness: 29-performance-optimizer
  agent_type: general-purpose
---

# Core Web Vitals -- LCP/FID/CLS Optimization Reference

Reference skill for Core Web Vitals optimization used by the frontend-optimizer agent.

## Vital Metrics & Targets (2024)

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| INP (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 800ms | 800ms - 1800ms | > 1800ms |
| FCP (First Contentful Paint) | < 1.8s | 1.8s - 3.0s | > 3.0s |

## LCP Optimization Techniques

1. Preload the LCP element resource:
   ```html
   <link rel="preload" as="image" href="hero.webp" fetchpriority="high">
   ```

2. Eliminate render-blocking resources:
   ```html
   <script src="analytics.js" defer></script>
   <link rel="preload" href="font.woff2" as="font" crossorigin>
   ```

3. Use a CDN with edge caching for the LCP image

4. Reduce TTFB: server-side caching, CDN, database query optimization

5. Avoid lazy loading the LCP element (common mistake)

## CLS Fixes

1. Always set width and height on images:
   ```html
   <img width="800" height="600" src="product.jpg">
   ```

2. Reserve space for ads and embeds:
   ```css
   .ad-slot { min-height: 250px; }
   ```

3. Avoid inserting content above existing content

4. Use CSS transform for animations instead of layout-triggering properties

5. `font-display: optional` (zero CLS from font swap)

## INP (Interaction to Next Paint) Optimization

1. Break up long tasks (> 50ms) with `scheduler.yield()` or `setTimeout`
2. Use web workers for heavy computation
3. Debounce/throttle high-frequency event handlers
4. Avoid synchronous XHR
5. Use `React.startTransition` for non-urgent state updates

## Measurement Tools

- **Lighthouse CI**: automated audit in CI/CD pipeline
- **WebPageTest**: real browser testing with waterfall view
- **Chrome DevTools**: Performance tab, Coverage tab for unused JS/CSS
- **Core Web Vitals field data**: CrUX (Chrome User Experience Report) via PageSpeed Insights
- **web-vitals.js library**: measure in-field CWV from real users

## Lighthouse CI Configuration

```js
module.exports = {
  ci: {
    collect: {
      url: ['https://example.com/', 'https://example.com/product'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['error', {maxNumericValue: 300}]
      }
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lhci.example.com'
    }
  }
}
```
