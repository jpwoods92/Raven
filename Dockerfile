# Build frontend
FROM node:23 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/

# Generate .env file for frontend build
ARG REACT_APP_BACKEND_URL
RUN echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL" > ./frontend/.env

RUN cd frontend && npm run build

# Build backend
FROM node:23 AS backend-build
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/
RUN cd backend && npm run build

# Production stage
FROM node:23
WORKDIR /app

# Copy backend built files
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copy frontend built files
COPY --from=frontend-build /app/frontend/public ./backend/public

# Install backend production dependencies
RUN cd backend && npm ci --only=production

# Start the backend application from the backend directory
WORKDIR /app/backend
CMD ["npm", "run", "start:prod"]