---
title: airbar-finance
summary: Go finance service for ledger, escrow, wallet, and Zibal payments, with gRPC, Postgres, Redis, and Compose environments for dev, staging, and production.
category: Backend systems
repo: https://github.com/mamahoos/airbar-finance
stack:
  - Go
  - PostgreSQL
  - Redis
  - gRPC
  - Docker Compose
featured: true
order: 2
---

## Problem

Airbar needed a dedicated finance service for ledger entries, escrow, wallet balances, withdrawals, and PSP callbacks — not a payment module buried in the main app.

## Architecture

The repo follows a clean architecture layout: `domain` holds entities and ports, `usecase` holds interactors, `delivery` exposes gRPC and a small HTTP surface (`/health/ready`, Zibal callback), and `infrastructure` implements Postgres, Redis, and Zibal adapters.

Compose files exist for development, staging, and production. CI runs `go mod verify`, `go vet`, `go test`, and `go build`.

## Decisions

- Keep domain free of gRPC and driver imports.
- Use idempotency as a cross-cutting use case rather than scattering it in handlers.
- Treat Compose overlays as the promotion path instead of a single “works on my machine” file.
