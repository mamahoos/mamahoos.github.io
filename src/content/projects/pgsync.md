---
title: pgsync
summary: A deliberately small wrapper around pg_dump piped to psql — rsync-shaped flags, safer defaults, and nothing else.
type: developer-tool
category: Automation
repo: https://github.com/mamahoos/pgsync
stack:
  - Bash
  - PostgreSQL
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

## What this demonstrates

Operational restraint: a one-shot, auditable script with Unix I/O discipline, instead of a platform around a two-command pipeline.
