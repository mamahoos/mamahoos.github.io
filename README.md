# portfolio

Static site for [portfolio.mamahoos.ir](https://portfolio.mamahoos.ir).

## Requirements

- Docker and Docker Compose

## Commands

```bash
docker compose up
```

```bash
docker compose run --rm web npm run check
docker compose run --rm web npm run build
```

The site is served on `http://localhost:4321` during development. Production is the `dist/` output deployed to GitHub Pages.
