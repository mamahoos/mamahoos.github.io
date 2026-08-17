# portfolio

```
mamahoos.github.io
        |  Pages
        v
mamahoos.ir               the site
        ^
        |  301
portfolio.mamahoos.ir     old host (path kept)
resume.mamahoos.ir        /resume/
```

CI builds in Docker and deploys Pages. Then dnscontrol updates Cloudflare: apex `mamahoos.ir` is grey-cloud A records to GitHub; `www` is a grey-cloud CNAME to `mamahoos.github.io`; `portfolio` is an orange-cloud 301 to the apex; `resume` is an orange-cloud CNAME plus a 301 to `/resume/`.

## Dev

```bash
docker compose up
```

```bash
docker compose run --rm web npm run check
docker compose run --rm web npm run build
```

http://localhost:4321
