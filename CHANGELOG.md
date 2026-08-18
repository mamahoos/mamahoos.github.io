# Changelog

## [1.3.0] - 2026-08-18

### Changed

- PDF skill labels sit in a fixed 1.3in column so the value lists align like the HTML page, instead of running inline with only a hanging indent.
- PDF sections, skill rows, bullets, and projects all breathe: section gaps 10pt to 16pt, bullet spacing 0 to 6pt, and a 7pt gap before each `Technologies:` line, so no paragraph touches the next heading.
- Page margins narrow to 0.6in x 0.5in. The wider measure is what pays for the spacing above — every line that ended one word short was costing a full line.
- Experience bullets tightened so each fits one line. No claim was dropped; the redundant company domain came out of two bullets, since the entry header already states it.

## [1.2.6] - 2026-08-18

### Changed

- PDF header ends in a hairline, and the summary below it is body ink instead of the muted grey shared with contact and dates, so it reads as the first line of content rather than more metadata.
- Section, skill, and project spacing each tighten by a point to pay for the header rule and keep the page at one.

## [1.2.5] - 2026-08-18

### Fixed

- PDF summary sits left-aligned under contact and above Skills. v1.2.4 wrongly put it in a page footer, which ATS often skips.

## [1.2.4] - 2026-08-18

### Changed

- PDF summary moves out of the centered title block into a left-aligned page footer so the name and role stay clean.

## [1.2.3] - 2026-08-18

### Changed

- Theme toggle is a `currentColor` sun SVG: filled in light, outline in dark. It stays a utility control, not a `[ ]` nav command.

## [1.2.2] - 2026-08-18

### Changed

- Resume summary drops “learning” and “from scratch”. Platform engineering is the current form of the work, not the beginning. Same text on `/resume` and the PDF.

## [1.2.1] - 2026-08-17

### Fixed

- `www.mamahoos.ir` has a grey-cloud CNAME to `mamahoos.github.io` so GitHub Pages can retrieve the DNS record.

## [1.2.0] - 2026-08-17

### Changed

- Canonical host is `mamahoos.ir`. `portfolio.mamahoos.ir` 301s there and keeps the path. `resume.mamahoos.ir` 301s to `/resume/`.

## [1.1.4] - 2026-08-17

### Changed

- Homepage principle is cause and model, not the infrastructure proverb. The tagline stays the meta description so `/` and `/resume` do not repeat the same positioning paragraph.

## [1.1.3] - 2026-08-17

### Added

- Homepage has a short principle under the tagline. It is not on `/resume` or the PDF.

## [1.1.2] - 2026-08-17

### Changed

- On narrow viewports, the HTML resume path stacks one step per line so it no longer overflows the frame.

## [1.1.1] - 2026-08-17

### Changed

- README maps `mamahoos.github.io`, `portfolio.mamahoos.ir`, and `resume.mamahoos.ir` in a few lines.

## [1.1.0] - 2026-08-17

### Added

- `resume.mamahoos.ir` is an optional 301 shortcut to `https://portfolio.mamahoos.ir/resume/`. The canonical site is still `portfolio.mamahoos.ir`.

## [1.0.4] - 2026-08-17

### Added

- A labeled “How I got here” path on the HTML `/resume` only: programming through microservices and DevOps to platform. It is origin, not current stack, and it is not on the PDF.

## [1.0.3] - 2026-08-17

### Added

- A short systems-practice summary on `/resume` and the PDF: five years of learning to design and build systems from scratch. It is not years of employment. Experience stays one list.

## [1.0.2] - 2026-08-16

### Changed

- Light is the default theme for every first visit, including visitors whose OS is in dark mode. An explicit choice still persists in `localStorage`.

## [1.0.1] - 2026-08-16

### Fixed

- Site frame and section rules are a 1px CSS line. Unicode box-drawing corners and T-caps no longer sit on that hairline, so the 1px step at every junction is gone.

## [1.0.0] - 2026-08-16

First public release of [portfolio.mamahoos.ir](https://portfolio.mamahoos.ir). The site is no longer marked as a demo.

### Added

- Homepage identity, six featured project case studies, and `/projects`
- `/resume` HTML page from a typed source of truth
- One-page ATS resume PDF at `/resume.pdf`, generated at build from the same data

### Changed

- Removed the `(demo)` mark next to the handle
