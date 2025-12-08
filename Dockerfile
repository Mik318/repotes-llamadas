# 1. Construir la App
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# 2. Servir con Nginx
FROM nginx:alpine
# Copiar los archivos construidos de Angular
COPY --from=build /app/dist/front-ia-call/browser /usr/share/nginx/html
COPY nginx.custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
