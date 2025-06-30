FROM node:20-alpine

WORKDIR /home/node/app
COPY package*.json .
RUN npm ci --loglevel=verbose

CMD npx nx run $PROJECT_NAME:serve --verbose --skip-nx-cache
