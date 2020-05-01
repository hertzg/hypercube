FROM node:12-alpine

RUN apk add --no-cache tesseract-ocr

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./bin/www ./bin/www
COPY ./app.js .
COPY ./routes ./routes
COPY ./public ./public
RUN ls -lah

EXPOSE 3000

ENV DEBUG=*

CMD npm start
