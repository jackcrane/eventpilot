# Base image for frontend and backend
FROM node:18-alpine AS base

# Log all environment variables
RUN echo "DATABASE_URL: $DATABASE_URL"

# Set the working directory to /app for the frontend
WORKDIR /app

# Copy app directory contents to /app
COPY ./app/ ./

# Install dependencies for the frontend
RUN yarn install

# Build the frontend
RUN yarn build

# Set the working directory to /api for the backend
WORKDIR /api

# Copy api directory contents to /api
COPY ./api/ ./

# Install dependencies for the backend
RUN yarn install

# Build Prisma (assumes you have a Prisma setup)
RUN npx prisma generate
RUN npx prisma migrate deploy

# Expose the required port for the backend
EXPOSE 2000

# Ensure environment variables are injected at runtime (no .env embedded)
CMD ["yarn", "start"]