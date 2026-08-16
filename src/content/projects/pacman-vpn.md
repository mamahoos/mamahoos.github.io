---
title: pacman-vpn
summary: Personal VLESS stack on PasarGuard that joins existing Traefik and Postgres networks instead of bundling them.
category: Infrastructure
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
order: 6
---

## Problem

A personal VLESS endpoint needs a panel, a node, TLS at the edge, and a database. Those should not live in the VPN repo; Traefik and Postgres already exist as separate stacks.

## Architecture

`compose.yaml` runs a PasarGuard panel and node. Both join `infra_proxy_net`. The panel also joins `infra_db_net` and uses Postgres over SQLAlchemy. Traefik terminates TLS for the admin host and the edge host. The node inbound is VLESS over WebSocket; clients reach it on 443 through Traefik.

CI renders Compose, checks the panel/node/Xray contract, and runs gitleaks. A dispatch workflow deploys over SSH.

## Decisions

- Reuse the infra stacks instead of another proxy or database here.
- Keep the inbound plaintext on the node and put TLS on Traefik, not on Xray.
- Pin PasarGuard image tags and keep a regression test against the old 3x-ui images.
