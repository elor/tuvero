FROM node:10

RUN apt update
RUN apt install -y tar curl lftp

# create app directory
RUN mkdir -p /root/cli/bin

COPY package.json /root/package.json
COPY cli/package.json /root/cli/package.json
COPY cli/bin/tuvero.js /root/cli/bin/tuvero.js

WORKDIR /root/cli
RUN npm install

WORKDIR /root
RUN npm install

WORKDIR /

CMD [ "bash" ]
