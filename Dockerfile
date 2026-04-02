FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package.json server.js update.js ./
COPY public ./public
COPY assets ./assets
COPY config.json ./

RUN chmod 644 config.json && chown node:node config.json

RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "nameserver 8.8.8.8" > /etc/resolv.conf' >> /start.sh && \
    echo 'exec node server.js' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 3000

ENTRYPOINT ["/start.sh"]
