FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Set npm registry to Tencent Cloud mirror for stable downloads
RUN npm config set registry http://mirrors.cloud.tencent.com/npm/

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