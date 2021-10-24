FROM node:12-alpine

# Create the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Dependencies
RUN npm install --no-optional && npm cache clean --force

# COPY all the files
COPY . .