FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json lerna.json ./
COPY packages/shared ./packages/shared
COPY packages/web ./packages/web

RUN npm install
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=@legisflow/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# With outputFileTracingRoot at the monorepo root, standalone output mirrors that layout.
COPY --from=builder /app/packages/web/public ./packages/web/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/static ./packages/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "packages/web/server.js"]
