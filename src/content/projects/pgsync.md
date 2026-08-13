---
title: pgsync
summary: One-shot PostgreSQL copy via pg_dump piped to psql, with an rsync-shaped CLI and installable bash completion.
category: Automation
repo: https://github.com/mamahoos/pgsync
stack:
  - Bash
  - PostgreSQL
featured: true
order: 3
---

## Problem

Copying a database between two Postgres instances usually means remembering `pg_dump` flags, `ON_ERROR_STOP`, and whether stdout is safe to wrap. That is easy to get wrong in a hurry.

## Architecture

`pgsync.sh` takes source and target URIs, runs `pg_dump | psql`, and keeps status messages on stderr so the dump stream never mixes with logs. An installer places the binary and bash completion under a configurable prefix.

## Decisions

- Mirror a few rsync flags (`-n`, `--delete`, `-q`) so the mental model is familiar.
- Default to `--no-owner` and `--no-privileges` so restores do not drag source roles onto the target.
- Stay a single script plus completion rather than a framework.
