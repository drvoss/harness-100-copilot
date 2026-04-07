---
name: terraform-patterns
description: "Use when working with Terraform infrastructure code — provides module structure patterns, remote state configuration, workspace-per-environment guidance, and security scanning templates for checkov/tfsec."
metadata:
  category: skill
  harness: 26-infra-as-code
  agent_type: general-purpose
---

# Terraform Patterns — Terraform Module Structure Reference

Reference skill for Terraform best practices used by the terraform-specialist agent.

## Module Structure Standard

```
modules/
├── networking/
│   ├── main.tf        (VPC, subnets, route tables, NAT gateway, IGW)
│   ├── variables.tf   (environment, cidr_block, azs, enable_nat_gateway)
│   ├── outputs.tf     (vpc_id, public_subnet_ids, private_subnet_ids)
│   └── versions.tf    (terraform >=1.5.0, required_providers)
├── compute/
│   ├── main.tf        (EKS cluster, node groups, or EC2 ASG)
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
└── database/
    ├── main.tf        (RDS, Aurora, ElastiCache)
    ├── variables.tf
    ├── outputs.tf
    └── versions.tf
```

## Remote State Patterns

### AWS (S3 + DynamoDB)
```hcl
terraform {
  backend "s3" {
    bucket         = "${var.project}-terraform-state-${var.account_id}"
    key            = "${var.environment}/${var.module_name}/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "${var.project}-terraform-lock"
    kms_key_id     = "alias/terraform-state-key"
  }
}
```

### GCP (GCS)
```hcl
terraform {
  backend "gcs" {
    bucket  = "${var.project}-terraform-state"
    prefix  = "${var.environment}/${var.module_name}"
  }
}
```

## Workspace-Per-Environment Pattern
```bash
# Setup
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Usage
terraform workspace select prod
terraform plan -var-file="envs/prod.tfvars" -out=prod.plan
terraform apply prod.plan
```

## Variable Validation Pattern
```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```

## Security Scanning Integration
```bash
# Pre-apply checkov scan
checkov -d . --framework terraform --quiet --compact

# tfsec with custom config
tfsec . --format sarif --out results.sarif

# Key checks:
# MEDIUM: aws-s3-no-public-access-with-acl
# HIGH: aws-ec2-no-public-ingress-ssh
# CRITICAL: aws-iam-no-policy-wildcards
```
