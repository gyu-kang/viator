FROM node:12-alpine

COPY . /app

WORKDIR /app
RUN yarn install

RUN cd server && npx prisma generate

ENTRYPOINT ["/bin/sh", "-c", "chmod +x /app/wait-for && /app/wait-for prisma:4466 -t 60 -- yarn run server:${APP_ENV}"]
