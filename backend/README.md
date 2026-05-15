# Applytics Backend

Backend Applytics dibuat menggunakan **Node.js**, **Express.js**, **PostgreSQL**, dan **Redis**.

PostgreSQL digunakan sebagai database utama untuk menyimpan data aplikasi, sedangkan Redis digunakan sebagai database pendukung untuk cache dashboard analytics.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Redis
- pg
- dotenv
- cors
- nodemon

---

## Setup

1) Install dependencies
```bash
cd backend
npm install
```

2) Create environment file
```bash
copy .env.example .env
```

3) Update `.env` values to match your local PostgreSQL and Redis.

---

## Run

Development mode (auto-reload):
```bash
cd backend
npm run dev
```

Production mode:
```bash
cd backend
npm start
```

Health check:
```
GET http://localhost:5000/api/health
```

