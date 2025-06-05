# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (including devDependencies for build tools)
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]

