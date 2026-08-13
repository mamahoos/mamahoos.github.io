---
title: Composable Docker infrastructure
summary: Traefik and PostgreSQL as separate Compose stacks that share networks, with TLS and backups kept out of application repos.
category: Infrastructure
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

## Problem

Application stacks should attach to an edge proxy and a database without baking TLS issuance or backup policy into every service repo.

## Architecture

`infra-traefik` runs Traefik on a shared Docker network (`infra_proxy_net`). Apps join that network and publish routes with labels. Certificate files come from the host (`acme.sh`); Traefik does not issue ACME certs in this repo.

`infra-postgres` is a sibling stack: named volume for data, bind-mounted config, optional backup/restore scripts, and an internal `infra_db_net`. Application roles are documented as out of band.

## Decisions

- Split edge and data so each stack can change without the other.
- Keep `exposedByDefault: false` so only labeled containers are routed.
- Treat backups as optional and explicit (`BACKUP_ENABLED`), not silent side effects.
