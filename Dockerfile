FROM node:alpine AS builder

ARG configuration=docker

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build:$configuration

FROM nginx:alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/