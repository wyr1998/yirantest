# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files from main-frontend directory
COPY main-frontend/package*.json ./

# Install ALL dependencies for building
RUN npm install

# Copy source code from main-frontend directory
COPY main-frontend/ .

# Set environment variable to disable source maps
ENV GENERATE_SOURCEMAP=false

# Build the app
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 