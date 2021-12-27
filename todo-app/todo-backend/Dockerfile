FROM node:16-alpine3.12

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --only-production

CMD node index.js