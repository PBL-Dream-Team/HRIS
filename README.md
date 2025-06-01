## Introduction

### Cloud Architecture

![alt text](clouddiagram.png)

## Setup

### Install node modules

```
npm install
```

### Generate database from existing migrations

```
 npx prisma generate
```

Then,

```
npx prisma migrate deploy
```

### Create a .env file

You could create one by duplicating the `.env.example` file in root and renaming it to `.env`. Then configure the `PORT` and the PostgreSQL url in `DATABASE_URL` based on your Postgres configuration.

### To run the backend

```
npm run start:backend
```

More commands can be found on the `scripts` properties in `package.json` file in root.
