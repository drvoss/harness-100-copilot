---
name: deployment-strategies
description: "Use when choosing or implementing a deployment strategy — provides Blue-Green, Canary, Rolling, and Feature Flag patterns with DORA metrics impact analysis. Extends the pipeline-designer agent. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: harness
  harness: 20-cicd-pipeline
  agent_type: general-purpose
---

# Deployment Strategies — Pipeline Deployment Pattern Reference

Reference for deployment strategies with DORA metrics impact analysis, rollback procedures, and implementation guides.

## Strategy Comparison

| Strategy | Downtime | Risk | Rollback Speed | Resource Cost | Best For |
|----------|----------|------|----------------|---------------|----------|
| **Recreate** | Yes | High | Slow | Low | Non-critical, simple apps |
| **Rolling** | No | Medium | Medium | Low | Stateless apps, gradual rollout |
| **Blue-Green** | No | Low | Instant | High (2x infra) | Zero-downtime critical apps |
| **Canary** | No | Very Low | Fast | Medium | High-traffic apps, risk aversion |
| **Feature Flags** | No | Minimal | Instant | Low | Complex feature releases |

## Blue-Green Deployment

```
BLUE (current prod) → GREEN (new version)
Load balancer switch: blue → green
Rollback: switch back to blue (< 1 min)
```

**GitHub Actions pattern:**
```yaml
- name: Deploy to Green
  run: |
    kubectl set image deployment/app-green app=${{ env.IMAGE_TAG }}
    kubectl rollout status deployment/app-green

- name: Switch Traffic to Green
  run: |
    kubectl patch service app-lb -p '{"spec":{"selector":{"slot":"green"}}}'
    echo "Traffic switched to green"
```

## Canary Deployment

```
10% → 25% → 50% → 100% (with health checks at each step)
Rollback: route 100% back to stable
```

**GitHub Actions pattern with manual approval gates:**
```yaml
- name: Canary 10%
  run: kubectl apply -f k8s/canary-10.yaml

- name: Wait for approval to increase to 25%
  uses: trstringer/manual-approval@v1
  with:
    secret: ${{ github.TOKEN }}
    approvers: ops-team
    minimum-approvals: 1
```

## DORA Metrics Impact

| Strategy | Deployment Frequency | Lead Time | MTTR | Change Failure Rate |
|----------|---------------------|-----------|------|---------------------|
| Recreate | ↓ (fear of downtime) | No change | ↑ (slow rollback) | High |
| Rolling | → | No change | Medium | Medium |
| Blue-Green | ↑ (no downtime fear) | ↓ (fast verify) | ↓ (instant rollback) | Low |
| Canary | ↑↑ (safe to deploy more) | No change | ↓↓ (catch early) | Very Low |
| Feature Flags | ↑↑ (decouple deploy/release) | ↓↓ (deploy anytime) | ↓↓ (flag off) | Very Low |

## Rollback Procedures

### Blue-Green Rollback
```bash
# Instant: switch load balancer back to blue
kubectl patch service app-lb -p '{"spec":{"selector":{"slot":"blue"}}}'
```

### Canary Rollback
```bash
# Route all traffic back to stable
kubectl delete deployment app-canary
```

### Feature Flag Rollback
```bash
# Disable flag (no deployment needed)
launchdarkly feature-flag update my-feature --enabled false
```
