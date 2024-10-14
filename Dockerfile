FROM node:16

# Install dependencies for the frontend in the app folder
WORKDIR /app
COPY package.json .
RUN yarn
RUN yarn build

# Install dependencies for the backend in the api folder
WORKDIR /api
COPY package.json .
RUN yarn