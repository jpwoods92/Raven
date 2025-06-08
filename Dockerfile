# Multi-stage build
FROM node:23 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:23 AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM node:23
WORKDIR /app

# Copy backend
COPY --from=backend-build /backend/dist ./dist
COPY --from=backend-build /backend/package*.json ./

# Copy frontend build to backend's public folder
COPY --from=frontend-build /frontend/public ./public

RUN npm ci --only=production

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]