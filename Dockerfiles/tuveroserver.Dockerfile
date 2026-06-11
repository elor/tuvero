FROM node:26-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN node cli/build.mjs

# Runtime image: only the four self-contained bundle files.
FROM node:26-alpine

WORKDIR /app
COPY --from=build /app/dist/cli ./

EXPOSE 8080
CMD ["node", "server.mjs"]
