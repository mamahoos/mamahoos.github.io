# Changelog

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
