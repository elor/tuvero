FROM node:latest

# create app directory
RUN mkdir -p /usr/src/app/cli
WORKDIR /usr/src/app/cli

COPY cli/package.json /usr/src/app/cli
RUN npm install
RUN gulp lib

COPY cli/ /usr/src/app/cli
COPY scripts /usr/src/app/scripts
COPY basic/scripts /usr/src/app/basic/scripts
COPY boule/scripts /usr/src/app/boule/scripts
COPY tac/scripts /usr/src/app/tac/scripts

EXPOSE 8080
CMD [ "npm", "start"]
