FROM node:12-alpine

RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-deu tesseract-ocr-data-pol tesseract-ocr-data-rus

WORKDIR /app

COPY ./package*.json ./npm-*.json ./
RUN npm ci

COPY server.js ./
COPY debug.js ./
COPY src/ ./src/
RUN ls -lah

EXPOSE 3000

ENV DEBUG=hypercube:*

CMD npm start
