# Real Estate App

Full‑stack MERN real estate application with authentication, listings, search, contact, booking, and Stripe Checkout. Client is built with Vite + React and served via Nginx in Docker. API is Express + MongoDB.

## Features
- Google auth (redirect‑based, COOP‑safe)
- Create/Update listings with validations
  - contactNumber: exactly 10 digits
  - imageUrls: at least 2
- Listing details show phone and open address in Google Maps
- Booking flow
  - Collect customer name, phone, address, ID proof upload
  - Fixed price: offer ? discountPrice : regularPrice
  - Stripe Checkout (USD)
- Dockerized: mongo, api, client with Nginx reverse proxy

## Tech stack
- Client: React, Vite, Tailwind, Nginx (serve), react-router
- API: Node.js, Express, Mongoose, Multer, Stripe
- DB: MongoDB
- Docker: docker-compose (mongo, api, client)

---

## Local development (without Docker)
Prereqs: Node 18+, MongoDB, npm

1) API
- Create `api/.env`:
```
MONGO=mongodb://localhost:27017/realestate
JWT_SECRET=change_this
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
PORT=3000
```
- Install and run:
```
cd api
npm install
npm start
```
The API listens on http://localhost:3000

2) Client
- Optional `client/.env`:
```
VITE_API_BASE=/api
```
- Install and run:
```
cd client
npm install
npm run dev
```
Vite dev server: http://localhost:5173 (proxy /api defined in vite.config.js)

---

## Docker setup (recommended)
Prereqs: Docker Desktop

1) Ensure `api/.env` exists:
```
MONGO=mongodb://mongo:27017/realestate
JWT_SECRET=change_this
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost
PORT=3000
```

2) Build and run
```
docker compose build
docker compose up -d
```
- Client: http://localhost:5173
- API: http://localhost:3000
- Mongo: localhost:27017
- Uploads: http://localhost:5173/uploads/<filename>

3) Stop
```
docker compose down
```

---

## Environment variables
API (`api/.env`)
- `MONGO` Mongo connection string
- `JWT_SECRET` Random long string
- `STRIPE_SECRET_KEY` Stripe test secret key
- `FRONTEND_URL` Base URL used for Stripe success/cancel (http://localhost in Docker)
- `PORT` API port (3000)

Client (`client/.env`) optional for local dev
- `VITE_API_BASE` Default `/api`

---

## Booking flow
1) Open a listing → Book Now → Booking page
2) Fill form and upload ID (required)
3) Save Booking → creates draft booking on server
4) Continue and Pay → server creates Stripe Checkout Session and redirects

API endpoints
- `POST /api/bookings/upload-id` (auth, multipart form-data; field `idProof`)
  - Response: `{ url: "/uploads/<file>" }`
- `POST /api/bookings` (auth, JSON)
```
{
  "listingId": "<LISTING_ID>",
  "customerName": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "idProofUrl": "/uploads/<file>",
  "amount": 500,
  "currency": "USD"
}
```
  - Response includes booking id (`_id`)
- `POST /api/bookings/checkout-session` (auth, JSON)
```
{ "bookingId": "<BOOKING_ID>" }
```
  - Response: `{ url, id }` → redirect to `url`

---

## Listing creation (API)
`POST /api/listing/create` (auth, JSON)
```
{
  "name":"...",
  "description":"...",
  "address":"...",
  "contactNumber":"1234567890",
  "regularPrice":1000,
  "discountPrice":800,
  "bedrooms":2,
  "bathrooms":1,
  "furnished":false,
  "parking":true,
  "type":"rent",
  "offer":true,
  "imageUrls":["https://.../1.jpg","https://.../2.jpg"],
  "userRef":"<USER_ID>"
}
```
Validation: `contactNumber` 10 digits; `imageUrls` length ≥ 2.

---

## Troubleshooting
- 401 Unauthorized: you’re not signed in; ensure cookie is sent (browser) or sign in via `/api/auth/signin` (Postman).
- 400 No file uploaded: `upload-id` requires `form-data` with key `idProof` as File.
- Stripe error: install server SDK (`npm i stripe`), set `STRIPE_SECRET_KEY`, restart API.
- COOP popup issues: Google auth uses redirect flow.

---

## Scripts
- API: `npm start` runs `index.js`
- Client: `npm run dev` (Vite), `npm run build`

---

## License
MIT (add your own if needed)
