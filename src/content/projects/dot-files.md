---
title: dot-files
summary: "A reproducible Linux environment: the repo mirrors the filesystem, install converges with symlinks, and CI guards the installer and its own maintenance."
type: developer-tool
category: Linux engineering
repo: https://github.com/mamahoos/dot-files
stack:
  - Bash
  - Git
  - Linux
  - GitHub Actions
featured: true
order: 3
---

This repository is more than a pile of dotfiles.

It treats `$HOME` as a filesystem that can be versioned, reproduced, and evolved through Git.

> A new machine should converge toward the same working environment without copying configuration by hand.

## The filesystem is the interface

```text
home/     →  $HOME
config/   →  ~/.config
```

There is no second abstraction. The tree in Git is the tree Linux already exposes, so a path is discoverable from the filesystem itself.

`.github/`, `install.sh`, and repo scripts are **not** install targets.

## Installation is a convergence operation

`install.sh` does not copy files. `_link_one` runs `ln -s`.

On conflict, the existing path is moved to `~/.dotfiles-backup/<timestamp>/`, mirroring its original location. If the destination is already the correct symlink, the installer returns. A second run is a no-op besides an empty backup directory.

Special cases are narrower than the directory they live in:

- **`.cursor`:** children are linked individually so Cursor-managed siblings are not replaced.
- **`.gnupg`:** only `gpg.conf`; the directory is `0700`, not a wholesale symlink.
- **`.ssh`:** a whitelist (`config.example`, `config.d`, …). Keys never enter the install set.

`--shell-only` limits the run to git and bash files.

## Why symlinks instead of copies?

```text
copy:     Git  ──copy──►  $HOME     (two sources of truth)
symlink:  Git  ──link──►  $HOME     (one)
```

After a copy, the two trees diverge. A symlink keeps the live environment attached to the versioned tree.

The cost is coupling to the clone path. That is accepted: the machine is cattle for **configuration**, not for the repository location of last resort.

## The `.cursor` problem

Replacing all of `~/.cursor` would also replace paths Cursor itself manages.

```text
~/.cursor/
├── (managed by Cursor)
├── skills  →  repository/home/.cursor/skills
└── rules   →  repository/home/.cursor/rules
```

> Do not take ownership of a directory when you only need ownership of part of its contents.

## Repository automation

The repo maintains itself.

| Workflow | What it actually runs |
|---|---|
| Lint | ShellCheck (`-S error`) and shfmt on `install.sh`, `home/`, and CI scripts |
| Install | Smoke + idempotent installer tests against a fake `HOME` |
| Agent skills | Drift check; on main, sync upstream skill sources and open reviewable PRs |
| Secret scan | gitleaks on full history |

Skill sync clones configured upstreams, rsyncs managed directories, and applies small overlays. Collision rule: first enabled source wins.

## Safety

`.bashrc.local` and `*.local` are gitignored. `.ssh` is not installed as a tree. gitleaks runs on every push and PR.

Configuration is versioned. Credentials are not.

## What this demonstrates

Linux path semantics, symlink-based configuration, safe state transitions, installer idempotency, and CI on the same repository that ships the environment.
