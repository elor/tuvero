FROM node:9

# create app directory
RUN mkdir -p /cache/cli

COPY package.json /cache
COPY cli/package.json /cache/cli/package.json

WORKDIR /cache/cli
RUN npm install

WORKDIR /cache
RUN npm install

CMD [ "bash" ]
