# Development
FROM node:20-alpine AS development
WORKDIR /app
# Install dependencies required for bcrypt
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
CMD ["npm", "run", "start:dev"]

# Production
FROM node:20-alpine AS production
WORKDIR /app
# Install dependencies required for bcrypt
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
RUN npm rebuild bcrypt --build-from-source
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]

