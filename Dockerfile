FROM node:latest

# create app directory
RUN mkdir -p /usr/src/app/cli

COPY package.json /usr/src/app
COPY bower.json /usr/src/app
COPY gulpfile.js /usr/src/app
COPY gulp-tools /usr/src/app/gulp-tools
COPY cli/ /usr/src/app/cli
COPY scripts /usr/src/app/scripts
COPY basic/scripts /usr/src/app/basic/scripts
COPY boule/scripts /usr/src/app/boule/scripts
COPY tac/scripts /usr/src/app/tac/scripts
COPY test/scripts /usr/src/app/test/scripts

WORKDIR /usr/src/app
RUN npm install
RUN node_modules/.bin/gulp lib

WORKDIR /usr/src/app/cli
RUN npm install

RUN npm test

EXPOSE 8080
CMD [ "npm", "start"]
