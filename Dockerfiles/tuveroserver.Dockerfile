FROM node:26-alpine

WORKDIR /app

COPY . .

RUN npm install && rm -rf node_modules

WORKDIR /app/cli
RUN npm install && npm test

EXPOSE 8080
CMD [ "npm", "start"]
