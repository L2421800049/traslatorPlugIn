FROM node:16-alpine

WORKDIR /opt/apps

COPY package*.json ./

RUN npm install --registry=http://registry.npmmirror.com

COPY . .

CMD node main.js