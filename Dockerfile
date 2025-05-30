# Etapa de desarrollo (instalar dependencias y compilar)
FROM node:22.13.1-alpine as dev-deps
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código fuente al contenedor (excepto lo ignorado en .dockerignore)
COPY . .

# Instalar TypeScript localmente en el proyecto
RUN npm install --save-dev typescript

# Ejecutar la compilación TypeScript
RUN npm run build

# Etapa de producción (usar los archivos compilados)
FROM node:22.13.1-alpine as prod
WORKDIR /app

# Copiar las dependencias de producción
COPY --from=dev-deps /app/node_modules ./node_modules

# Copiar los archivos compilados desde la etapa de desarrollo
COPY --from=dev-deps /app/dist ./dist

# Copiar los archivos necesarios para producción (si no está en dist)
COPY package.json ./

# Ejecutar la aplicación Express usando los archivos compilados
CMD ["npm", "start"]