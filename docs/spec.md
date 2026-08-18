# Spec: portfolio v1

## Objective

A static engineering portfolio at `https://mamahoos.ir` for technical recruiters, hiring managers, and engineers. It should answer who this person is, what kind of work they do, and where the evidence lives.

## Tech Stack

- Astro (static output)
- TypeScript (`strict`)
- Markdown Content Collections
- Scoped CSS and CSS variables
- npm
- Node 24
- Docker (dev and CI toolchain only)
- Typst (resume PDF in the same Docker image)
- GitHub Actions → GitHub Pages
- dnscontrol (Cloudflare DNS + Single Redirects) on deploy

No React, Tailwind, MDX, backend, or database in v1.

## Commands

- Dev: `docker compose up`
- Check: `docker compose run --rm web npm run check`
- Build: `docker compose run --rm web npm run build`

`package.json` `build` is `astro check && astro build`.

## Project Structure

```
src/components     UI pieces
src/data           Typed site and resume source of truth
src/lib            Resume PDF rendering
src/integrations   Build hooks
src/layouts        Page shell
src/pages          Routes
src/styles         Tokens and global CSS
src/content        Markdown collections
public/            static assets
docs/              Spec
tasks/             Plan and task list
```

## Visual

Warm paper in light mode and a slate editor surface in dark mode, with a teal accent. Chrome uses JetBrains Mono and a 1px frame. Theme defaults to light. An explicit Dark/Light control persists in `localStorage`: a `currentColor` sun icon, filled in light and outline in dark. Decorative rules are `aria-hidden="true"`.

## Code Style

Astro components for static markup. Type imports use `import type`. Content is queried with `getCollection()`. CSS tokens live on `:root` and `[data-theme]`. Decorative rules are `aria-hidden="true"`.

## Testing Strategy

v1 verification is `astro check` and `astro build` inside the Docker image. No unit-test framework until there is logic that needs it.

## Boundaries

- Always: keep secrets out of git; run `astro check` before treating a slice as done; do not invent metrics or extra repositories; treat `src/data/resume.ts` as the resume source of truth (not a PDF); do not commit generated `resume.pdf`.
- Ask first: new runtime dependencies, extra pages besides `/resume`.
- Never: put theme, roadmap, or career narrative in README; call the owner senior; list every GitHub repo; run a container as production; put a photo, birth date, gender, marital status, military status, or salary on `/resume` or the resume PDF.

## Success Criteria

- `docker compose up` serves the site
- Image build produces `dist/`
- Homepage shows Mohammad Hosein Kouhkan, handle `mamahoos`, role, a short principle (how I think), and contacts. The tagline is the meta description only. The principle is homepage-only: not `/resume`, not the PDF. `/resume` and the PDF keep the systems-practice summary and do not repeat the principle or the tagline.
- Six featured projects with real GitHub links and honest case studies
- GitHub Actions builds in the same Docker image and deploys Pages
- `site` is `https://mamahoos.ir` with no `base`. `resume.mamahoos.ir` and `portfolio.mamahoos.ir` are not a second site.
- `/resume` renders from `src/data/resume.ts` with role DevOps / Platform Engineer, a short systems-practice summary (not years of employment; platform engineering is the current form of that work, not the beginning), and skills including MinIO, Argo CD, and Loki. The HTML page does not repeat the contact line; header and footer are the site chrome, and the PDF carries phone plus the full ATS contact row. A labeled practice path may appear on the HTML page only: title “How I got here”, steps through microservices and DevOps, and no year range. Wide viewports keep a hanging shell `\` after freelance; narrow viewports stack one step per line and drop the wrap mark. It must not appear in the PDF.
- `astro build` writes a 1-page text-based `dist/resume.pdf` from the same resume data, including phone

## Out of scope (v1)

A separate `/about` page, blog, GSAP, Lighthouse CI, Word/docx resume.

## v2

The canonical hostname is `mamahoos.ir` on GitHub Pages. `resume.mamahoos.ir` and `portfolio.mamahoos.ir` are optional 301 shortcuts. They are not a second Pages site and must not be added as GitHub Pages custom domains.

- DNS: apex `mamahoos.ir` is DNS-only A records to GitHub Pages. Grey cloud so GitHub can issue the certificate. `www.mamahoos.ir` is a DNS-only CNAME to `mamahoos.github.io`; GitHub redirects it to the apex. Do not CNAME `www` to the apex.
- `portfolio.mamahoos.ir`: same GitHub A records, orange-cloud, Single Redirect 301 to `https://mamahoos.ir` plus the request path. Kept as A records (not CNAME) because `NO_PURGE` would leave the old A records behind.
- `resume.mamahoos.ir`: proxied CNAME → `mamahoos.ir`. Single Redirect 301 to `https://mamahoos.ir/resume/`. Path and query are dropped.
- Redirects are Cloudflare Single Redirects, managed by dnscontrol (`CF_SINGLE_REDIRECT`).
- The Cloudflare API token needs Zone → Single Redirect → Edit in addition to DNS Edit.
- dnscontrol owns Single Redirects for `mamahoos.ir`; extra dashboard redirects would be deleted on push.
- MX and other records not in this repo stay (`NO_PURGE`).
