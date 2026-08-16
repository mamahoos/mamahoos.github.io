---
title: airbar-finance
summary: A dedicated Go finance service — ledger, escrow, wallet, and PSP callbacks — with dependency direction, idempotency, and a real promotion path.
type: service
category: Software architecture
repo: https://github.com/mamahoos/airbar-finance
stack:
  - Go
  - PostgreSQL
  - Redis
  - gRPC
  - Docker Compose
featured: true
order: 5
---

Airbar needed ledger entries, escrow, wallet balances, withdrawals, and payment-provider callbacks as their own service — not a module buried in the main application.

This repository is that service. It has its own schema (`finance.*`), its own image, and its own deploy path.

## Why a separate finance service?

Financial writes have different failure modes from ordinary HTTP handlers. A PSP may retry the same callback. Ledger rows should not be an afterthought of the product API.

Splitting the service isolates:

- the public HTTP surface Zibal needs for browser redirects
- gRPC contracts consumed by `airbar-core`
- migrations and readiness probes that can fail without taking the rest of the product down

The cost is operational: another compose overlay, another health endpoint, another deploy.

## Architecture

Dependency direction is the architecture:

```text
delivery
   ↓
usecase
   ↓
domain
   ↑
infrastructure
```

`domain` does not import gRPC, pgx, Redis, or Zibal. Infrastructure implements the ports the domain declares. `cmd/server` is the composition root.

Inbound adapters:

| Surface | Role |
|---|---|
| gRPC | Escrow, payments, wallet, withdrawal, treasury, reconciliation, credit |
| HTTP | `GET /health/ready`, Zibal callback |

Health on both surfaces pings Postgres and Redis before calling the process ready.

## Idempotency

A payment provider may send the same callback more than once. That is not a transport quirk to handle in one handler.

Mutating gRPC methods go through a unary interceptor. The key comes from metadata or the request body. The guard:

1. looks in Redis (`idempotency:{key}`, 24h TTL)
2. on miss, `INSERT … ON CONFLICT DO NOTHING` in `finance.idempotency_records`
3. replays a stored snapshot, or runs the handler and completes
4. on handler failure, deletes the in-flight row

> **Operational note**
>
> Postgres is the source of truth. Redis is a hot cache of snapshots, not the authorization to run the side effect twice.

Read RPCs and the HTTP Zibal callback are not behind that interceptor.

## Delivery

Compose overlays share a base file. Dev builds locally and exposes ports. Staging and production pull GHCR and join a shared `airbar-net`; they do **not** bundle Postgres or Redis.

CI on the self-hosted runner: `go mod verify`, `go vet`, `go test`, `go build`, goose-backed integration tests, `govulncheck`. Staging deploy runs migrations and probes `/health/ready`.

## What this demonstrates

Software architecture that survives contact with money: ports and adapters, a split transport surface, idempotency as a use case, and promotion via compose overlays rather than a single “works here” file.
