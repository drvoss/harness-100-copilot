---
name: service-mesh-patterns
description: "Use when configuring service mesh infrastructure for microservices — provides Istio/Linkerd pattern guidance, traffic management VirtualService/DestinationRule templates, mTLS configuration, and observability setup. Does NOT cover application-level API design or database configuration. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: supporting-skill
  harness: 23-microservice-designer
  agent_type: general-purpose
---

# Service Mesh Patterns — Istio/Linkerd Configuration Reference

Supporting skill providing service mesh pattern guidance for the microservice-designer harness.

## Istio Traffic Management

### VirtualService — Routing Rules
Defines how traffic is routed to a service, including canary splits and header-based routing.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: {service-name}
  namespace: {namespace}
spec:
  hosts:
  - {service-name}
  http:
  - match:
    - headers:
        x-version:
          exact: v2
    route:
    - destination:
        host: {service-name}
        subset: v2
  - route:
    - destination:
        host: {service-name}
        subset: v1
      weight: 90
    - destination:
        host: {service-name}
        subset: v2
      weight: 10
    timeout: 10s
    retries:
      attempts: 3
      perTryTimeout: 3s
      retryOn: 5xx,reset,connect-failure
```

### DestinationRule — Load Balancing + Circuit Breaker
Defines traffic policy for a service, including load balancing algorithm and outlier detection.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: {service-name}
  namespace: {namespace}
spec:
  host: {service-name}
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN  # or ROUND_ROBIN, RANDOM, CONSISTENT_HASH
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http2MaxRequests: 1000
        pendingHttpRequests: 100
        h2UpgradePolicy: UPGRADE
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 50
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

### Gateway — Ingress Entry Point
```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: {harness}-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: {tls-secret-name}
    hosts:
    - "api.{domain}"
```

## mTLS Configuration

### PeerAuthentication — Strict mTLS Namespace-Wide
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: {namespace}
spec:
  mtls:
    mode: STRICT  # PERMISSIVE for gradual migration
```

### AuthorizationPolicy — Zero-Trust Service-to-Service
```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: {service-name}-authz
  namespace: {namespace}
spec:
  selector:
    matchLabels:
      app: {service-name}
  rules:
  - from:
    - source:
        principals:
        - "cluster.local/ns/{namespace}/sa/{caller-service-account}"
    to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/v1/*"]
```

## Linkerd Patterns

### ServiceProfile — Timeouts + Retries
```yaml
apiVersion: linkerd.io/v1alpha2
kind: ServiceProfile
metadata:
  name: {service-name}.{namespace}.svc.cluster.local
  namespace: {namespace}
spec:
  routes:
  - name: GET /api/v1/orders/{id}
    condition:
      method: GET
      pathRegex: /api/v1/orders/[^/]+
    isRetryable: true
    timeout: 5s
  - name: POST /api/v1/orders
    condition:
      method: POST
      pathRegex: /api/v1/orders
    isRetryable: false  # POST must not be auto-retried (not idempotent)
    timeout: 10s
  retryBudget:
    retryRatio: 0.2       # at most 20% of requests can be retries
    minRetriesPerSecond: 10
    ttl: 10s
```

## Observability Patterns

### Distributed Tracing Headers

**B3 format (Zipkin-compatible, used by Istio by default):**
```
X-B3-TraceId: {128-bit trace ID as 32 hex chars}
X-B3-SpanId: {64-bit span ID as 16 hex chars}
X-B3-ParentSpanId: {parent span ID}
X-B3-Sampled: 1
```

**W3C TraceContext (OpenTelemetry standard):**
```
traceparent: 00-{trace-id}-{parent-id}-{trace-flags}
tracestate: {vendor-specific key=value pairs}
```

**Propagation rule**: Application code must forward all trace headers on every outbound request — even if not instrumenting spans. Istio proxies create spans but cannot propagate headers automatically across application logic.

### Prometheus Metrics Pod Annotations
```yaml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
    prometheus.io/path: "/metrics"
```

### Key SLIs for Microservices

| SLI | Prometheus Query | Typical SLO |
|-----|-----------------|-------------|
| Request rate | `rate(http_requests_total[5m])` | — |
| Error rate | `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])` | < 0.1% |
| P50 latency | `histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))` | < 100ms |
| P99 latency | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` | < 500ms |
| Availability | `sum(up{job=~"service.*"}) / count(up{job=~"service.*"})` | > 99.9% |

## Traffic Management Patterns

### Canary Deployment Weight Progression
```
Initial rollout:  5% canary / 95% stable
After 10 min (error rate OK): 20% canary / 80% stable
After 30 min (P99 latency OK): 50% canary / 50% stable
After 1 hour (all SLIs green): 100% canary (promote; retire stable)
Rollback trigger: error rate > 1% OR P99 latency increase > 20%
```

### Fault Injection for Chaos Testing (Istio)
```yaml
# Inject 5-second delay for 10% of requests to test timeout handling
fault:
  delay:
    percentage:
      value: 10.0
    fixedDelay: 5s

# Inject 503 abort for 1% of requests to test circuit breaker
fault:
  abort:
    percentage:
      value: 1.0
    httpStatus: 503
```

### Traffic Mirroring (Shadow Traffic)
```yaml
# Mirror 100% of production traffic to shadow service for testing
mirror:
  host: {service-name}-shadow
  subset: v2
mirrorPercentage:
  value: 100.0
```

## Istio vs Linkerd Decision Guide

| Criterion | Prefer Istio | Prefer Linkerd |
|-----------|-------------|---------------|
| Feature richness | Traffic shaping, fault injection, WASM plugins | Simpler; fewer moving parts |
| Operational complexity | Higher (more CRDs, control plane components) | Lower (automatic mTLS, simple config) |
| Performance overhead | ~5-10ms latency, ~50MB sidecar memory | ~1-2ms latency, ~10MB sidecar memory |
| Multi-cluster | Strong multi-cluster federation support | Linkerd multicluster extension |
| Ecosystem | Large; integrates with Kiali, Jaeger, Grafana | Smaller; Buoyant Cloud for observability |
| Use when | Complex traffic rules, multi-cluster, enterprise | Simplicity, performance-sensitive, Kubernetes-native |
