# NittoJatra — নিত্যযাত্রা

A mobile app for booking intercity bus tickets in Bangladesh. Search routes, pick seats, pay with bKash or Nagad — that's it.

---

## Stack

**Mobile** — React Native (Expo SDK 54), TypeScript, Expo Router, Zustand  
**Backend** — NestJS, PostgreSQL, Prisma, JWT auth _(work in progress)_

---

## Project layout

```
nittojatra/
├── mobile/       React Native app
├── backend/      NestJS API
└── README.md
```

---

## Getting started

**Mobile**

```bash
cd mobile
npm install
npx expo start
```

Press `a` for Android, `i` for iOS.

Needs Node 18+. Android Studio or Xcode for emulators.

**Backend**

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

Server runs on `http://localhost:3000`. Swagger at `/api/docs`.

---

## Environment variables

`mobile/.env`

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

`backend/.env`

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/nittojatra
JWT_SECRET=changeme
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=changeme_refresh
PORT=3000
```

---

## What's done / what's next

- [x] Auth screens (login, register)
- [x] Home with route search
- [x] Ride listings + filters
- [x] Seat selection
- [x] Booking flow
- [x] Booking history
- [x] Profile & settings
- [ ] Connect to real API
- [ ] bKash / Nagad integration
- [ ] E-ticket download
- [ ] Live seat availability

---
