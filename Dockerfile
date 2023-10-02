FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .

RUN node init

EXPOSE 9000
CMD [ "node", "app" ]