# ---- Build ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    RUN corepack enable
    
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile
    
    COPY . .
    RUN pnpm build
    
    # ---- Run ----
    FROM node:20-alpine
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV NITRO_HOST=0.0.0.0
    ENV NITRO_PORT=3000
    
    COPY --from=build /app/.output ./.output
    
    EXPOSE 3000
    CMD ["node", ".output/server/index.mjs"]
    