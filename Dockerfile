FROM node:14-alpine

ARG HOST=localhost
ARG USER=guest
ARG PASS=guest
ARG PORT=5672
ARG MNG_PORT=15672
ARG TIME=10
ARG MONGO_URL=mongodb://admin:admin@localhost:27017
ARG MONGO_DB=manager
ARG MONGO_COLL=teste

# install curl
RUN apk --no-cache add curl

COPY ./src /manager

WORKDIR /manager

RUN npm install

RUN chmod +x ./wait-for-rabbit.sh

CMD ["./wait-for-rabbit.sh", "node", "manager"]