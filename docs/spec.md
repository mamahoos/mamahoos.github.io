# Spec: portfolio v1

## Objective

A static engineering portfolio at `https://portfolio.mamahoos.ir` for technical recruiters, hiring managers, and engineers. It should answer who this person is, what kind of work they do, and where the evidence lives.

## Tech Stack

- Astro (static output)
- TypeScript (`strict`)
- Markdown Content Collections
- Scoped CSS and CSS variables
- npm
- Node 24
- Docker (dev and CI toolchain only)
- GitHub Actions → GitHub Pages

No React, Tailwind, MDX, backend, or database in v1.

## Commands

- Dev: `docker compose up`
- Check: `docker compose run --rm web npm run check`
- Build: `docker compose run --rm web npm run build`

`package.json` `build` is `astro check && astro build`.

## Project Structure

```
src/components     UI pieces
src/layouts        Page shell
src/pages          Routes
src/styles         Tokens and global CSS
src/content        Markdown collections
public/            CNAME and static assets
docs/              Spec
tasks/             Plan and task list
```

## Visual

Warm paper in light mode and a slate editor surface in dark mode, with a teal accent. Chrome uses JetBrains Mono and box-drawing frames (`┌ ┐ └ ┘ ├ ┤`). Theme follows `prefers-color-scheme`, with an explicit Dark/Light control that persists in `localStorage`. Decorative ASCII is `aria-hidden="true"`.

## Code Style

Astro components for static markup. Type imports use `import type`. Content is queried with `getCollection()`. CSS tokens live on `:root` and `[data-theme]`. Decorative ASCII is `aria-hidden="true"`.

## Testing Strategy

v1 verification is `astro check` and `astro build` inside the Docker image. No unit-test framework until there is logic that needs it.

## Boundaries

- Always: keep secrets out of git; run `astro check` before treating a slice as done; do not invent metrics or extra repositories.
- Ask first: new runtime dependencies, extra pages, `/resume`.
- Never: put theme, roadmap, or career narrative in README; call the owner senior; list every GitHub repo; run a container as production.

## Success Criteria

- `docker compose up` serves the site
- Image build produces `dist/`
- Homepage shows Mohammad Hosein Kouhkan, handle `mamahoos`, role, profile one-liner, and contacts
- Six featured projects with real GitHub links and honest case studies
- GitHub Actions builds in the same Docker image and deploys Pages
- `site` is `https://portfolio.mamahoos.ir` with `public/CNAME` and no `base`

## Out of scope (v1)

`/resume`, a separate `/about` page, blog, GSAP, Lighthouse CI, `resume.mamahoos.ir`.
