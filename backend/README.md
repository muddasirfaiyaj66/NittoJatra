# NittoJatra Backend

NestJS API for the NittoJatra bus booking app.

## Stack
NestJS · MongoDB (Mongoose) · JWT auth · bcrypt · Swagger

## Run locally
```bash
cp .env.example .env   # fill in values
npm install
npm run start:dev
# API: http://localhost:3000/api/v1
# Docs: http://localhost:3000/api/docs
```

## Test
```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end
```

## Seed
Data seeds (locations, operators, routes, rides) run automatically on startup.
