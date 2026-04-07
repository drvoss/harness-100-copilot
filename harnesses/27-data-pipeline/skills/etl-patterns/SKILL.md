---
name: etl-patterns
description: "Use when implementing data transformation pipelines — provides ELT vs ETL decision framework, dbt project structure best practices, Spark optimization patterns, and incremental processing strategies. Also triggers on: re-run, update, revise, supplement."
metadata:
  category: skill
  harness: 27-data-pipeline
  agent_type: general-purpose
---

# ETL Patterns — Transformation Best Practices Reference

Reference skill for ETL/ELT patterns used by the transformation-engineer agent.

## ELT vs ETL Decision Framework

| Criteria | ETL | ELT |
|----------|-----|-----|
| Transform location | Before load (external) | After load (in DWH) |
| DWH compute cost | Lower (pre-filtered) | Higher (raw first) |
| Raw data preserved | No | Yes |
| Flexibility | Low (reprocess to change) | High (re-run SQL) |
| Recommended when | Legacy DWH, strict compute limits | Modern cloud DWH (BigQuery, Snowflake, Redshift) |

**Modern recommendation**: ELT for cloud data warehouses; load raw then transform with dbt.

## dbt Best Practices

### Naming Conventions
- `stg_[source]__[entity]` — staging models (double underscore separates source from entity)
- `int_[entity]_[transformation]` — intermediate models
- `[domain]__[entity]` — mart models (e.g., `finance__revenue`)

### Materializations Guide
| Model Type | Materialization | When to Use |
|-----------|-----------------|-------------|
| Staging | View | Small sources, always fresh |
| Staging (large) | Table | > 1M rows, expensive source query |
| Intermediate | Ephemeral | Single use, complex logic |
| Mart (fact) | Incremental | > 10M rows, append or merge |
| Mart (dimension) | Table | < 1M rows, full refresh OK |

### Incremental Strategies
```sql
-- Merge (update + insert)
{{ config(materialized='incremental', unique_key='id', incremental_strategy='merge') }}

-- Append only (event data, immutable)
{{ config(materialized='incremental', incremental_strategy='append') }}

-- Delete + insert (partitioned tables)
{{ config(materialized='incremental', incremental_strategy='delete+insert',
          partition_by={'field': 'created_date', 'data_type': 'date'}) }}
```

## Spark Optimization Patterns

### Broadcast Join (small table < 10MB)
```python
from pyspark.sql.functions import broadcast

result = large_df.join(broadcast(small_dim_df), "customer_id")
```

### Partition Pruning
```python
# Write partitioned
df.write.partitionBy("year", "month", "day").parquet("s3://bucket/events/")

# Read with partition filter (Spark skips non-matching partitions)
df = spark.read.parquet("s3://bucket/events/").filter("year=2024 AND month=1")
```

### Avoiding Data Skew
```python
# Salting for skewed joins
from pyspark.sql.functions import concat, lit, rand

n_partitions = 10
skewed_df = skewed_df.withColumn("salt", (rand() * n_partitions).cast("int"))
large_df = large_df.withColumn("salt", explode(array([lit(i) for i in range(n_partitions)])))
result = skewed_df.join(large_df, ["join_key", "salt"])
```
