# Build stage
FROM node:23 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy webpack config files
COPY webpack.*.js ./
COPY tsconfig* eslint* ./

# Copy source files
COPY src/ ./src/
COPY public/ ./public/

# Build the application with webpack
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/public /usr/share/nginx/html
# If your webpack outputs to a different directory than 'public', adjust the path accordingly

# Optional: Add custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
