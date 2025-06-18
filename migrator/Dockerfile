# ---- Build Stage ----
FROM node:lts AS build
WORKDIR /app
COPY migrator/package*.json .
RUN npm install
COPY tsconfig.json  .
COPY migrator/src ./src
COPY src/models/schemas ./src/models/schemas
RUN npm run build

# ---- Production Stage ----
FROM node:lts AS production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
CMD ["node", "index.js"]

