FROM node:23 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY webpack.*.js ./
COPY tsconfig* eslint* ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/public /usr/share/nginx/html

# Create nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
