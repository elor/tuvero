FROM alpine:latest

RUN apk update
RUN apk add nodejs nodejs-npm git openssh-client lftp
RUN mkdir -m 700 -p ~/.ssh/
RUN install -m 600 /dev/null ~/.ssh/id_rsa
RUN ssh-keyscan -t rsa server.tuvero.de > ~/.ssh/known_hosts
RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
RUN git config --global user.email "info@tuvero.de"
RUN git config --global user.name "Tuvero Autobuild"
