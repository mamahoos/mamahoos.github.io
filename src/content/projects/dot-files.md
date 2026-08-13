---
title: dot-files
summary: Versioned Linux environment that mirrors the filesystem and installs with a single symlink script, plus CI for the repo itself.
category: Linux
repo: https://github.com/mamahoos/dot-files
stack:
  - Shell
  - Git
featured: true
order: 5
---

## Problem

Dotfiles and editor config drift across machines. Copying them by hand loses history and makes a new laptop slower than it needs to be.

## Architecture

The repo layout matches the filesystem: `home/` → `$HOME`, `config/` → `~/.config`. `install.sh` symlinks those trees and moves replaced files into `~/.dotfiles-backup/`. Cursor skills that come from upstreams are synced by a repo script, not installed as a blob.

## Decisions

- Link `.cursor` children individually so Cursor-managed paths are not replaced wholesale.
- Keep GitHub workflows and sync scripts under `.github/`, outside the install target.
- Treat the machine as cattle for config, not for secrets — nothing private belongs here.
