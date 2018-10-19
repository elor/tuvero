FROM node:9

# create app directory
RUN mkdir -p /builds/elor/tuvero/cli

COPY package.json /builds/elor/tuvero
COPY cli/package.json /builds/elor/tuvero/cli/package.json

WORKDIR /builds/elor/tuvero/cli
RUN npm install

WORKDIR /builds/elor/tuvero
RUN npm install

CMD [ "bash" ]
