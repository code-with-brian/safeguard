# Multi-stage Dockerfile for SafeGuard - Web Dashboard Only

# Stage 1: Build Web
FROM node:20-alpine as web-builder
WORKDIR /app
RUN npm install -g bun
COPY package.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
RUN bun install
COPY packages ./packages
COPY apps/web ./apps/web
RUN cd apps/web && npm run build

# Stage 2: Production Web with Nginx
FROM nginx:alpine as web-production
COPY --from=web-builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
