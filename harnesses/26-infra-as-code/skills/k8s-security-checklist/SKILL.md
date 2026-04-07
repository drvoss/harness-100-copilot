---
name: k8s-security-checklist
description: "Use when securing Kubernetes workloads and clusters — provides CIS Kubernetes Benchmark controls, Pod Security Standards configuration, NetworkPolicy templates, and RBAC hardening patterns. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: skill
  harness: 26-infra-as-code
  agent_type: general-purpose
---

# K8s Security Checklist — CIS Kubernetes Benchmark & Pod Security Standards

Reference skill for Kubernetes security controls used by the k8s-specialist and security-hardener agents.

## CIS Kubernetes Benchmark (v1.8) — Critical Controls

### API Server Hardening
- `--anonymous-auth=false` — Disable anonymous API access
- `--authorization-mode=Node,RBAC` — Enable RBAC, disable AlwaysAllow
- `--audit-log-path=/var/log/kubernetes/audit.log` — Enable audit logging
- `--tls-min-version=VersionTLS12` — Enforce TLS 1.2+

### etcd Security
- `--cert-file` and `--key-file` configured for client TLS
- `--client-cert-auth=true` — Require client certificates
- `--peer-cert-file` and `--peer-key-file` for peer communication

### Node Security
- `--anonymous-auth=false` for kubelet
- `--authorization-mode=Webhook` for kubelet
- Disable read-only kubelet port (10255)

## Pod Security Standards

### Baseline (minimum for production)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/warn: restricted
```

### Restricted (for sensitive workloads)
```yaml
labels:
  pod-security.kubernetes.io/enforce: restricted
  pod-security.kubernetes.io/enforce-version: v1.28
```

## NetworkPolicy Templates

### Deny All Default (apply first)
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
```

### Allow Specific Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - port: 8080
```

## RBAC Least Privilege Patterns

### Read-Only ClusterRole
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

### Namespace-Scoped Admin (avoid ClusterAdmin)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: team-lead-binding
  namespace: production
subjects:
- kind: User
  name: team-lead@example.com
roleRef:
  kind: ClusterRole
  name: admin
  apiGroup: rbac.authorization.k8s.io
```

## Security Context Best Practices
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 65534    # nobody
  runAsGroup: 65534
  fsGroup: 65534
  seccompProfile:
    type: RuntimeDefault
containers:
- securityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities:
      drop: ["ALL"]
```
