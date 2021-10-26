FROM node:12-alpine as base

# Create the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Dependencies
RUN npm install --no-optional && npm cache clean --force

# COPY all the files
COPY . .

FROM base as builder

RUN npm run builder

FROM nginx:1.17-alpine as production

EXPOSE 3000

# Copy over a config file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built React app files into the Nginx-based image
COPY --from=builder /usr/src/app/build /usr/share/nginx/html