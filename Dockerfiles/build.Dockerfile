FROM node:9

# create app directory
RUN mkdir -p /root/cli

COPY package.json /root/package.json
COPY cli/package.json /root/cli/package.json

WORKDIR /root/cli
RUN npm install

WORKDIR /root
RUN npm install

WORKDIR /

CMD [ "bash" ]
