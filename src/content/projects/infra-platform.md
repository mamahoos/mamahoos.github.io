---
title: Composable Docker infrastructure
summary: Independent edge and database stacks that applications join, so TLS and Postgres lifecycle stay out of every service repo.
type: infrastructure
category: Platform engineering
repo: https://github.com/mamahoos/infra-traefik
relatedRepos:
  - label: infra-postgres
    url: https://github.com/mamahoos/infra-postgres
stack:
  - Docker Compose
  - Traefik
  - PostgreSQL
  - Shell
featured: true
order: 1
---

Application stacks should attach to a proxy and a database. They should not each reinvent TLS issuance, HTTP routing, or backup policy.

This pair of repositories is the platform layer those applications join.

## Architecture

The infrastructure is two Compose stacks, not one monolith.

```text
Internet
   │
   ▼
┌─────────────────┐
│  infra-traefik  │
│     Traefik     │
└────────┬────────┘
         │  infra_proxy_net
    ┌────┼────┐
    ▼    ▼    ▼
   App  App  App
    │    │    │
    └────┼────┘
         ▼
┌─────────────────┐     infra_db_net
│ infra-postgres  │     (internal)
│   PostgreSQL    │
└─────────────────┘
```

`infra-traefik` publishes `web` (`:80`, redirect) and `websecure` (`:443`). The Docker provider is pinned to `infra_proxy_net` with `exposedByDefault: false`, so only labeled containers are routed.

`infra-postgres` puts the cluster on `infra_db_net` with `internal: true`. Data lives in a named volume. Cluster config is bind-mounted; application roles are not.

## Why separate stacks?

| Concern | Owner |
|---|---|
| TLS termination | Traefik |
| HTTP routing | Traefik (application labels) |
| Certificate issuance | Host (`acme.sh`), not Traefik ACME |
| Application lifecycle | Application repo |
| PostgreSQL lifecycle | `infra-postgres` |
| Backups | `infra-postgres`, opt-in |
| Application roles and schema | Application deployment |
| Network boundaries | Docker networks |

> **Engineering constraint**
>
> Application repositories should not own TLS or PostgreSQL lifecycle.

Splitting edge and data means either stack can change without the other. A Traefik bump does not imply a Postgres bump.

## Security boundaries

Traefik mounts the Docker socket **read-only** and keeps the dashboard off. Shared middleware (`security-headers@file`) is opt-in: HSTS, nosniff, frame deny, stripped `Server` / `X-Powered-By`.

Certificates are issued on the host and mounted read-only. Traefik does not run ACME in this design. File-provider watch reloads dynamic YAML; replacing cert files on disk still needs a Traefik restart.

Postgres authentication is `scram-sha-256`. Init SQL installs core extensions (`pgcrypto`, `citext`, `uuid-ossp`, `pg_stat_statements`) and nothing about application users. `create-db.sh` creates an empty database. Roles stay with the app or with external IaC.

## Operations

Backups are **off** until `BACKUP_ENABLED` is set. Then `backup.sh` writes custom-format dumps, and `rotate-backups.sh` can promote a GFS layout. Restore is explicit and destructive (`pg_restore --clean --if-exists`). There is no silent cron in the core compose file.

Images are versioned from env (`traefik:v3.3`, `postgres:17-alpine`). Healthchecks use Traefik's ping endpoint and `pg_isready`.

There is no GitHub Actions pipeline in these repos. Validation is local: `scripts/validate-config.sh` runs `compose config`, checks static files and TLS paths, and can ping a running Traefik.

## What this demonstrates

Platform ownership: networks, TLS at the edge, database lifecycle, and backup policy as **shared infrastructure**, not copy-paste into every app.
