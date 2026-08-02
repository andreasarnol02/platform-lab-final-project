# Marketplace API

The shared Node.js and Express API for customer and seller marketplace flows.

## Requirements

- Node.js 22.22.0 or newer
- MongoDB running locally or a MongoDB deployment with transaction support

Checkout uses a MongoDB transaction to reserve stock, create per-seller orders, and clear the cart atomically. Use a replica set or MongoDB Atlas for checkout testing; a standalone MongoDB server does not support transactions.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:4000` by default.

To run the API and web application together from the repository root:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm run dev
```

The web application runs at `http://localhost:5173`.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | API port |
| `MONGODB_URI` | empty | MongoDB connection string |
| `JWT_SECRET` | empty | Long, random signing secret; never commit it |
| `JWT_EXPIRES` | `7d` | JWT lifetime |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated allowed web origins |

Generate a local secret with:

```bash
openssl rand -hex 32
```

## API Surface

- `POST /api/auth/customer/register` and `/login`
- `POST /api/auth/seller/register` and `/login`
- `GET /api/auth/me`
- `GET /api/products` and `GET /api/products/:id`
- Seller product management under `/api/products` and `/api/seller/products`
- Customer cart routes under `/api/cart`
- Customer checkout and order history under `/api/orders`
- Seller order inbox and status updates under `/api/seller/orders`

All responses are JSON. Successful responses use `{ success, message, data }`; validation, authorization, not-found, and server errors use safe JSON envelopes without stack traces.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API in production mode |
| `npm test` | Run API unit and integration tests |

## Security and Ownership

- Customer and seller JWT namespaces are separate.
- Cart and checkout routes require a customer token.
- Product and seller order operations enforce ownership in the API.
- Product writes validate names, prices, stock, categories, and HTTP(S) image URLs.
- Passwords are hashed with bcrypt and secrets are read from environment variables.
