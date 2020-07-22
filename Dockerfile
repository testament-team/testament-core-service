FROM node:12.16.3-alpine3.11
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
ENTRYPOINT [ "npm", "start" ]