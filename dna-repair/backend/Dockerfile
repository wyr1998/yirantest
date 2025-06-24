FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Set npm registry to Tencent Cloud mirror for stable downloads
RUN npm config set registry http://mirrors.cloud.tencent.com/npm/

# Install ALL dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

EXPOSE 5000

CMD ["npm", "start"] 