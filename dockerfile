FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx prisma generate

RUN npx prisma migrate deploy

COPY . .

CMD [ "npm","run","dev" ]