FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Keep all dependencies for running seed scripts
# RUN npm prune --production

EXPOSE 5000

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Setting up admin user..."' >> /app/start.sh && \
    echo 'npm run setup:admin' >> /app/start.sh && \
    echo 'echo "Starting server..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"] 