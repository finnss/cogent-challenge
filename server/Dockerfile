FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Make folders writeable
# RUN chmod a+rwx -R /app/smarty.cache.dir

EXPOSE 8080
CMD [ "node", "app.js" ]