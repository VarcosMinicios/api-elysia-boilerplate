FROM oven/bun:1.3.6 AS base
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["bun", "run", "dev"]

FROM base AS builder
COPY . .
RUN bun run build

FROM base AS migrator
COPY tsconfig.json ./
COPY src ./src
ENV NODE_ENV=development
CMD ["bun", "run", "migration:up"]

FROM oven/bun:1.3.6-slim AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["bun", "dist/index.js"]
