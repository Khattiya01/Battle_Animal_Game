# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
RUN npm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

ENV NEXT_PUBLIC_FRONTEND_URL="https://battleanimal.marketlandverse.com"
ENV NEXT_PUBLIC_API_URL="https://battleanimal-api.marketlandverse.com"
ENV NEXT_PUBLIC_FRONTEND_IMAGE_URL="https://battleanimal.marketlandverse.com"

ENV NEXT_PUBLIC_AUTH_SECRET="l4Dwhk+jHlSGMogw+5wSmAiovVPIOPVqgX81HnUfyJ8="
ENV NEXT_PUBLIC_AUTH_EXPIRATION_HOUR=1
ENV NEXT_PUBLIC_AUTH_URL="https://battleanimal.marketlandverse.com"
# ENV NEXTAUTH_SECRET="l4Dwhk+jHlSGMogw+5wSmAiovVPIOPVqgX81HnUfyJ8="
# ENV NEXTAUTH_EXPIRATION_HOUR=1
# ENV NEXTAUTH_URL="https://battleanimal.marketlandverse.com/"
ENV NEXT_PUBLIC_APP_ID="cf231045-cdd3-40b6-ab2a-3d70c22e71a2"
ENV NEXT_PUBLIC_APP_KEY="8wK1qm4erJKuEhtVIk9DUn3Y1-Ok_kP4wcRYXqNhb-glux1hnWivKOXkmlTvY3Me"

ENV JWT_SECRET="JWT_SECRET2024"
ENV ACCESS_EXPIRATION_MINUTES=60
ENV REFRESH_EXPIRATION_DAYS=1
ENV VERSION="1.0.1"

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]