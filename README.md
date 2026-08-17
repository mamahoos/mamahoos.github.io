# portfolio

```
mamahoos.github.io
        |  Pages
        v
portfolio.mamahoos.ir     the site
        ^
        |  301
resume.mamahoos.ir        /resume/
```

CI builds in Docker and deploys Pages. Then dnscontrol updates Cloudflare: `portfolio` is grey-cloud A records to GitHub; `resume` is an orange-cloud CNAME plus a 301 to `/resume/`.

## Dev

```bash
docker compose up
```

```bash
docker compose run --rm web npm run check
docker compose run --rm web npm run build
```

http://localhost:4321
