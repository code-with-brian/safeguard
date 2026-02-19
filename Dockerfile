# Multi-stage Dockerfile for SafeGuard

# Stage 1: Build API
FROM oven/bun:1 as api-builder
WORKDIR /app
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN bun install
RUN cd packages/database && bun run db:generate
RUN cd apps/api && bun run build

# Stage 2: Build Web
FROM node:20-alpine as web-builder
WORKDIR /app
RUN npm install -g bun
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN bun install
RUN cd apps/web && npm run build

# Stage 3: Production API
FROM oven/bun:1-slim as api-production
WORKDIR /app
COPY --from=api-builder /app/apps/api/dist ./dist
COPY --from=api-builder /app/packages/database/prisma ./prisma
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=api-builder /app/packages/database/dist ./packages/database/dist
COPY package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["bun", "dist/index.js"]

# Stage 4: Production Web (static served by API or separate nginx)
FROM nginx:alpine as web-production
COPY --from=web-builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
