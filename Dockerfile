# -------- Builder Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (dev + prod) for migrations
RUN npm ci

# Copy all source code
COPY . .

# Build the app
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine
WORKDIR /app

# Copy package.json and prod deps only for running app
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app
COPY --from=builder /app/dist ./dist

# Copy db folder for Drizzle if needed
COPY --from=builder /app/src/db ./src/db

EXPOSE 3000
CMD ["node", "dist/main.js"]
