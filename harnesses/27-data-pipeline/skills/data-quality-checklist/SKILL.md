---
name: data-quality-checklist
description: "Use when configuring data quality monitoring — provides quality dimension definitions, Great Expectations patterns, data contract templates, and dbt test configurations for comprehensive data validation. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: skill
  harness: 27-data-pipeline
  agent_type: general-purpose
---

# Data Quality Checklist — Quality Dimensions & Monitoring Patterns

Reference skill for data quality configuration used by the quality-monitor agent.

## Data Quality Dimensions

| Dimension | Definition | Example Check |
|-----------|-----------|---------------|
| Completeness | Non-null rate meets threshold | `order_id` null rate = 0% |
| Consistency | Values match business rules | `amount > 0` for confirmed orders |
| Timeliness | Data freshness within SLA | Max `_ingested_at` < 1 hour ago |
| Validity | Values in expected domain | `status` in allowed values set |
| Uniqueness | No duplicate primary keys | `order_id` is unique |
| Accuracy | Values match source of truth | Reconciliation with source system |

## Great Expectations Patterns

### Checkpoint Configuration
```python
checkpoint_config = {
    "name": "orders_daily_checkpoint",
    "validations": [
        {
            "batch_request": {
                "datasource_name": "warehouse",
                "data_connector_name": "default_runtime_data_connector",
                "data_asset_name": "orders_daily"
            },
            "expectation_suite_name": "orders.critical"
        }
    ],
    "action_list": [
        {"name": "store_validation_result", "action": {"class_name": "StoreValidationResultAction"}},
        {"name": "update_data_docs", "action": {"class_name": "UpdateDataDocsAction"}},
        {"name": "send_slack_notification_on_failure",
         "action": {
            "class_name": "SlackNotificationAction",
            "slack_webhook": "${SLACK_WEBHOOK}",
            "notify_on": "failure"
         }}
    ]
}
```

## Data Contract Template (YAML)
```yaml
apiVersion: v1
kind: DataContract
metadata:
  name: [dataset]-v[major]
  owner: [team]
  consumers: [list of consumers]
  sla:
    freshness: [duration]  # e.g., 1h, 4h, 24h
    availability: 99.9%
spec:
  schema:
    fields:
      - name: [pk_field]
        type: string
        nullable: false
        unique: true
  quality:
    nullRate:
      [critical_field]: 0.0
    rowCountMin: [number]
    rowCountMax: [number]
  lifecycle:
    retentionDays: [number]
    breakingChangePolicy: versioned
```

## dbt Tests Coverage Matrix

| Test | When Required | Expectation |
|------|--------------|-------------|
| `not_null` | All primary keys | Always |
| `unique` | All primary keys | Always |
| `relationships` | All foreign keys | When FK present |
| `accepted_values` | Status/type fields | For enum columns |
| Custom row count | Fact tables | Row count in expected range |
| Custom freshness | All incremental models | Max timestamp < SLA |

## Freshness Monitoring (dbt source)
```yaml
sources:
  - name: [source_name]
    freshness:
      warn_after: {count: 1, period: hour}
      error_after: {count: 4, period: hour}
    loaded_at_field: _fivetran_synced  # or _ingested_at
    tables:
      - name: [table_name]
        freshness:
          warn_after: {count: 30, period: minute}  # table-level override
```
