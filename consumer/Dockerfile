# --- prod-зависимости ---
FROM node:20.11.1-alpine3.18 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- сборка TypeScript ---
FROM node:20.11.1-alpine3.18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

# --- рантайм ---
FROM node:20.11.1-alpine3.18 AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
USER node
CMD ["node", "build/main.js"]