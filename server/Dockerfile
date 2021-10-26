FROM node:12-alpine as base

# An important note about creating Dockerfiles is that we want to be strategic about the number
# of RUN, COPY, and ADD lines we add to them because these instructions create new layers in
# the image that add to the final build size. We chain mkdir and chown
# together and also chain both npm install commands for this reason.
#
# At the same time, we also want to leverage the cacheable nature of a Docker image’s layers
# to speed up subsequent rebuilds. If layers have been previously cached and we make a
# change to our application’s code, then Docker will only start rebuilding from the layer
# where it detects the change. This is why we COPY the package.json and package-lock.json
# files separately from the rest of the server code—if we change our source code later on
# in a way that doesn’t touch these two files, then Docker can skip reinstalling the npm packages
# and just rebuild the COPY --chown=node:node . . layer.
#
# Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”

# Get and set the environment variables
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Make a directory for the application, owned by the node user
# Use the -p flag to make the parent app directory too
RUN mkdir -p /home/node/app/node_modules && \
	chown -R node:node /home/node/app

# Change into the app directory
WORKDIR /home/node/app

# Switch to the node user
USER node

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --no-optional pm2 -g && \
	npm install --no-optional && npm cache clean --force

# Copy over all of the files from our local server directory into the app directory
# And make the node user the owner
COPY --chown=node:node . .

FROM base as production

RUN npm prune --production

EXPOSE 4000