# Imagem base para o projeto
FROM node:20-alpine AS base
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3 
ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL

# Imagem intermediária para instalar dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Imagem intermediária para build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npx prisma generate
RUN npm run build

# Imagem final para produção, sem dependências de desenvolvimento
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN mkdir .next

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev
EXPOSE 3000
ENV PORT 3000
CMD HOSTNAME="0.0.0.0" node server.js