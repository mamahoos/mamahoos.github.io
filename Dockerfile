FROM node:24-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

FROM base AS dev

EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS ci

CMD ["npm", "run", "build"]
