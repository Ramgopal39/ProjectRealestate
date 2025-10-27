# API Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY . .

# Ensure uploads directory exists at runtime
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
