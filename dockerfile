FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy



CMD [ "npm","run","dev" ]