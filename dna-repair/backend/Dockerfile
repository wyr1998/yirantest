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

CMD ["npm", "start"] 