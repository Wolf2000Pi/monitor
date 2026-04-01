FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package.json server.js update.js ./
COPY public ./public
COPY assets ./assets
COPY config.json ./

RUN chmod 644 config.json && chown node:node config.json

USER node

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
