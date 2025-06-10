# ---- Build Stage ----
FROM node:lts AS build

WORKDIR /app

# Install dependencies (including devDependencies for build tools)
COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

# ---- Production Stage ----
FROM node:lts AS production
COPY docker/scripts/wait-for-it.sh /usr/local/bin/wait-for-it
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]

