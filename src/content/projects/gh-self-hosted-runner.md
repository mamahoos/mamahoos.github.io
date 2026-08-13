---
title: gh-self-hosted-runner
summary: Docker Compose wrapper around a GitHub Actions self-hosted runner image, with the host Docker socket mounted for jobs that need to build containers.
category: CI/CD
repo: https://github.com/mamahoos/gh-self-hosted-runner
stack:
  - Docker Compose
  - GitHub Actions
featured: true
order: 6
---

## Problem

Private repositories need a runner that can execute jobs on a machine I control, including jobs that talk to Docker, without maintaining a custom runner image.

## Architecture

`compose.yml` runs `myoung34/github-runner` with `REPO_URL`, a short-lived `RUNNER_TOKEN`, labels, and `/var/run/docker.sock`. This repository is the wrapper and env example, not a fork of the runner.

## Decisions

- Reuse the upstream image instead of building another Actions runtime.
- Leave runner-data persistence commented until a restart policy actually needs it.
- Document the socket mount as a trust boundary: jobs get the same Docker access as the host.
