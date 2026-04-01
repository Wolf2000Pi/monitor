FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini && \
    apk cache clean

COPY package.json .
RUN npm ci --only=production && \
    npm cache clean --force

COPY server.js update.js ./
COPY public ./public
COPY assets ./assets

EXPOSE 3000

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
