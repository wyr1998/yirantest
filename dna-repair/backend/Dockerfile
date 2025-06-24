FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"] 