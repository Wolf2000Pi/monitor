FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package.json server.js update.js ./
COPY public ./public
COPY assets ./assets
COPY config.json ./config.json

RUN chown -R node:node /app

USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "node", "server.js"]
