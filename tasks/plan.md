# Implementation Plan: portfolio v1

## Overview

Ship a static Astro portfolio with a Docker toolchain for local and CI, ASCII-minimal layout, homepage identity, six featured projects, and GitHub Pages on `portfolio.mamahoos.ir`.

## Architecture Decisions

- Docker is the toolchain (dev + CI), not production runtime. Production is static files on GitHub Pages.
- CI builds inside the same image instead of `withastro/action`, so local and CI share one Dockerfile. Deploy still uses `actions/deploy-pages`.
- Custom domain: `site: 'https://portfolio.mamahoos.ir'`, no `base`, `public/CNAME`.
- Markdown Content Collections for projects. No MDX in v1.
- README is operational only.

## Task List

### Phase 1: Foundation

- [ ] Task 1: Scaffold Astro + TypeScript + Docker/compose
- [ ] Task 2: Layout, tokens, ASCII chrome, fonts, accessibility

### Checkpoint: Foundation

- [ ] `astro check` and `astro build` succeed in the image
- [ ] Layout renders with visible focus and reduced-motion support

### Phase 2: Core Features

- [ ] Task 3: Homepage identity and contacts
- [ ] Task 4: Project collection, index, and slug pages

### Checkpoint: Core Features

- [ ] Homepage and project pages build
- [ ] All six featured items have honest copy and real repo links

### Phase 3: Delivery

- [ ] Task 5: GitHub Actions Docker build + Pages deploy + CNAME

### Checkpoint: Complete

- [ ] v1 success criteria in `docs/spec.md` are met
- [x] `/resume` HTML is built from `src/data/resume.ts`

## Phase 4: Resume

- [x] Task 6: Typed resume source of truth and `/resume` HTML
- [x] Task 7: ATS resume PDF via Typst at `dist/resume.pdf`

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Compose bind-mount + node_modules | High | Solve anonymous volume in slice 1 |
| `gh-self-hosted-runner` still private | Med | Page exists; public link is not live until visibility changes |
| DNS not pointed yet | Med | Ship CNAME and `site`; owner configures DNS |

## Open Questions

None for the HTML resume and PDF artifact.

## v2: Resume shortcut

- Canonical site stays `portfolio.mamahoos.ir` on GitHub Pages (grey cloud).
- `resume.mamahoos.ir` is a proxied CNAME plus a Cloudflare Single Redirect (301) to `/resume/`.
- dnscontrol owns that redirect. Do not add the hostname to GitHub Pages.
