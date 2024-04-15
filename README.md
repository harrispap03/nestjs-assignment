## Tundrax NestJS assignment

### Technologies used:  
Core framework => NestJS
ORM => TypeORM
DB => PostgreSQL
Auth library => PassportJS

## Installation

```bash
$ npm install
```
## Setting up environment variables

Copy the sample environment configuration file and modify it as needed for your local environment:


```bash
$ cp .env.example .env
```
Update the .env file with:
1. Your postgreSQL DB credentials
2. A JWT secret (string)
3. The env in which you'll be running the app in ("production" || "development")

## Seeding the DB
1. Checkout the script under ``src/seed.ts`` and edit the config so it aligns with the one of your db
2. Run ``npm run seed``

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

