# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Make sure api host env variable from compose is read
ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST $REACT_APP_API_HOST
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]