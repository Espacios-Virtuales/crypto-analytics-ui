# --- Build Angular ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Serve con Nginx ---
FROM nginx:1.27-alpine

# Copia explícita del output Angular (ajusta si el projectName difiere)
COPY --from=build /app/dist/crypto-analytics-ui/browser/ /usr/share/nginx/html/

# Config Nginx mínima para SPA
COPY ops/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
    