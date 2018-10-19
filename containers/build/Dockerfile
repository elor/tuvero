FROM node:latest

# create app directory
RUN mkdir -p /usr/src/app/cli

COPY ../../package.json /usr/src/app
COPY ../../cli/package.json /usr/src/app/cli/package.json

WORKDIR /usr/src/app/cli
RUN npm install

WORKDIR /usr/src/app
RUN npm install

CMD [ "bash" ]
