# Dockerfile for SafeGuard Web Dashboard (Next.js SSR)
FROM node:20-alpine

WORKDIR /app

RUN npm install -g bun

# Copy package files
COPY package.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN bun install

# Copy source code
COPY packages ./packages
COPY apps/web ./apps/web

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://safeguard-api-production.up.railway.app/v1}
RUN cd apps/web && npm run build

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start command
CMD ["sh", "/app/apps/web/start.sh"]
