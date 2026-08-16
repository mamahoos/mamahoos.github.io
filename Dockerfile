FROM node:24-bookworm-slim AS base

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    fonts-crosextra-carlito \
    fonts-liberation \
    poppler-utils \
    xz-utils \
  && curl -fsSL "https://github.com/typst/typst/releases/download/v0.13.1/typst-x86_64-unknown-linux-musl.tar.xz" \
    | tar -xJ -C /usr/local/bin --strip-components=1 \
  && apt-get purge -y curl xz-utils \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/* \
  && typst --version \
  && pdfinfo -v

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

FROM base AS dev

EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS ci

CMD ["npm", "run", "build"]
