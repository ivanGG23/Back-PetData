FROM node:20-alpine

WORKDIR /app

# Dependencias del sistema para Prisma
RUN apk add --no-cache openssl

# Copiar dependencias primero (mejor cache de Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código (incluye entrypoint.sh)
COPY . .

# Compilar TypeScript
RUN npm run build

# Dar permisos al entrypoint
RUN chmod +x ./entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]