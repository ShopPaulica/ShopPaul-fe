# 1) Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2) Serve cu Nginx
FROM nginx:alpine

# IMPORTANT: path corect la tine 👇
COPY --from=build /app/dist/paul-fe/browser /usr/share/nginx/html

COPY nginx.front.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
