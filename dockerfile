# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false

# Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
RUN npx prisma generate

# Build NestJS (TypeScript -> JavaScript)
RUN npm run build

# Run the app
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Apply migrations (for production DBs, you may prefer `migrate deploy`)
RUN npx prisma migrate deploy

# Use the compiled app
CMD ["npm", "run", "dev"]
# CMD ["node", "dist/main"]

