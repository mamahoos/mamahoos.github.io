---
title: pgsync
summary: A deliberately small wrapper around pg_dump piped to psql — rsync-shaped flags, safer defaults, a GHCR Docker image, and CI from ShellCheck through Bats integration tests.
type: developer-tool
category: Automation
repo: https://github.com/mamahoos/pgsync
stack:
  - Bash
  - PostgreSQL
  - Docker
  - GitHub Actions
featured: true
order: 4
---

> A deliberately boring tool.

Copying a database between two Postgres instances is easy to get wrong in a hurry: dump flags, `ON_ERROR_STOP`, and whether logs contaminate the dump stream.

The problem did not need a service, a framework, or a container.

## Why a Bash script?

PostgreSQL already provides the primitive:

```text
pg_dump | psql
```

`pgsync` wraps that primitive with safer defaults, URI source/target, bash completion, and a few flags people already know from rsync.

The interesting decision was knowing what **not** to build. There is no incremental mode. This is always a full logical dump/restore.

## The pipe is the interface

All status goes to stderr. stdout is reserved for the dump. A dry-run prints the quoted pipeline and exits.

`psql` runs with `ON_ERROR_STOP=1`. Unless `--no-clean`, dump uses `--clean --if-exists`. Every dump uses `--no-owner --no-privileges` so restores do not drag source roles onto the target.

`--delete` is a separate, explicit pre-step: `DROP SCHEMA public CASCADE` then `CREATE SCHEMA public`.

## rsync-shaped CLI

| Flag | Behavior |
|---|---|
| `-n` | Print the pipeline; do not run it |
| `--delete` | Recreate `public` on the target first |
| `-q` / `-v` | Quiet / show the exact command |
| `--schema-only` / `--data-only` | Narrow the dump |

Completion lives in `completions/pgsync.bash` and does not require `bash-completion.deb`. `install.sh` places the binary and the completion file under a configurable prefix.

## Docker and GHCR

The same script runs in a container built on `postgres:16-bookworm`, so callers do not need local `pg_dump` / `psql`:

```bash
docker run --rm ghcr.io/mamahoos/pgsync:latest \
  -s 'postgresql://user:pass@source:5432/dbname' \
  -t 'postgresql://user:pass@target:5432/dbname'
```

Every version tag publishes to [GHCR](https://github.com/mamahoos/pgsync/pkgs/container/pgsync) with semver and `latest`. `docker-compose.yml` runs a two-Postgres smoke test — the same stack the publish workflow exercises before push.

## CI

GitHub Actions splits concerns instead of one catch-all job:

| Workflow | Trigger | What it proves |
|---|---|---|
| `test.yml` | push / PR | ShellCheck on the scripts, Bats unit tests, then integration sync against two Postgres 16 services |
| `docker-publish.yml` | version tag | image build, compose smoke test, push to GHCR |

Integration tests use real URIs and assert quiet mode, data-only restores, and the full dump/restore path. The Docker publish job only runs after the image passes the same compose sync the README documents.

## What this demonstrates

Operational restraint: a one-shot, auditable script with Unix I/O discipline, instead of a platform around a two-command pipeline — plus just enough packaging and CI to trust it in other workflows.
