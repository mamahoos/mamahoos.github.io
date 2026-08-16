---
title: pacman-vpn
summary: Containerized edge stack that joins existing Traefik and Postgres networks instead of bundling another proxy or database.
type: infrastructure
category: Edge infrastructure
repo: https://github.com/mamahoos/pacman-vpn
relatedRepos:
  - label: infra-traefik
    url: https://github.com/mamahoos/infra-traefik
  - label: infra-postgres
    url: https://github.com/mamahoos/infra-postgres
stack:
  - Docker Compose
  - Traefik
  - PostgreSQL
  - PasarGuard
featured: true
order: 2
---

This repository is an application stack that **plugs into the platform**, not a second copy of it.

It needs `infra_proxy_net` and `infra_db_net` to already exist. Compose does not define Traefik or Postgres.

## Architecture

Two services, two jobs:

```text
              Internet
                 │
                 ▼
        Traefik (infra-traefik)
       /                      \
      /                        \
 Admin host                 Edge host
   :443 TLS                   :443 TLS
      │                          │
      ▼                          ▼
   panel                      node
   (PasarGuard)               (Xray inbound)
      │
      ▼
  PostgreSQL (infra-postgres)
```

| Service | Networks | Responsibility |
|---|---|---|
| `panel` | proxy + db | Dashboard, API, subscriptions, SQLAlchemy |
| `node` | proxy only | Inbound traffic; no database |

Traefik labels bind both services to `infra_proxy_net`. The panel talks to Postgres over `infra_db_net` via `SQLALCHEMY_DATABASE_URL`. Images are pinned (`ghcr.io/pasarguard/panel:v5.2.1`, `node:v0.5.3`).

The control plane is gRPC from panel to node. The data plane is the edge hostname.

## Why TLS is not on Xray

The node inbound is plaintext VLESS over WebSocket. Clients are told to use TLS on port 443.

> **Engineering constraint**
>
> One certificate store, one terminator. Traefik already owns TLS for the rest of the platform.

That keeps cert rotation and Cloudflare Full/Strict checks on the edge, not inside Xray. A contract test freezes this split: inbound stays `security: none`; the client host template stays `port: 443` / `security: tls`.

## Why Postgres is not in this compose file

The platform already runs Postgres. Bundling another instance would mean another backup policy, another volume, another upgrade clock.

The panel is just a client of `infra-postgres`.

## Delivery pipeline

```text
Pull request / push
        │
        ├── contract tests (images, routing, TLS split)
        ├── seed / Cloudflare check unit tests
        ├── docker compose config
        └── gitleaks
                │
                ▼
        workflow_dispatch deploy
                │
                ├── backup on host
                ├── scp stack files
                ├── compose pull && up
                └── smoke; roll back on failure
```

CD ships compose and config templates. It does **not** ship `.env` or client records.

A separate Cloudflare workflow checks proxied DNS, zone SSL mode, and HTTP smoke against the admin path and the edge host.

## Migration

Tests assert the stack is PasarGuard and **not** `ghcr.io/mhsanaei/3x-ui`. Env names like `XUI_DOMAIN` are leftover vocabulary from the previous panel; the runtime is not.

## What this demonstrates

Attaching a workload to shared edge and data networks, terminating TLS in one place, pinning images, and treating deploy as backup → replace → smoke → rollback.
