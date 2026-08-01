# Technical Requirements Document (TRD)
### Online Marketplace — "Tokopedia-style" Two-Sided Marketplace

| | |
|---|---|
| **Course** | Specialized Platform Development |
| **Deliverable** | Tugas Kelompok Project Lab — Week 10 |
| **Document** | Technical Requirements (Customer site + Seller site) |
| **Companion** | `product-requirements.md` |
| **Status** | Draft for review |
| **Date** | 2026-08-01 |

---

## 1. Introduction

This document specifies the **technical design** for the marketplace defined in `product-requirements.md`. It covers system architecture, the shared API, the data model, authentication/authorization, the four client apps, deployment, monitoring, and local setup.

The system is **four client applications served by one backend**:

1. Customer Web (React)
2. Customer Mobile (React Native / Expo)
3. Seller Web (React)
4. Seller Mobile (React Native / Expo)

All four consume a single **Node.js + Express REST API** backed by **MongoDB**.

---

## 2. System Architecture

```mermaid
flowchart TB
    subgraph Clients
        CW["Customer Web<br/>(React + Vite)"]
        CM["Customer Mobile<br/>(React Native / Expo)"]
        SW["Seller Web<br/>(React + Vite)"]
        SM["Seller Mobile<br/>(React Native / Expo)"]
    end

    API["REST API<br/>(Node.js + Express)"]
    DB[("MongoDB<br/>(Atlas)")]
    MON["Monitoring<br/>Google Analytics / LogRocket"]

    CW -->|"HTTPS / JSON<br/>Axios · JWT"| API
    CM -->|"HTTPS / JSON<br/>Axios · JWT"| API
    SW -->|"HTTPS / JSON<br/>Axios · JWT"| API
    SM -->|"HTTPS / JSON<br/>Axios · JWT"| API

    API -->|"Mongoose ODM"| DB
    CW -.->|"page/events"| MON
    SW -.->|"page/events"| MON
```

**Design principles**

- **One API, many clients.** Business rules (gated cart, ownership, stock, order lifecycle) live in the API so every client inherits them and cannot bypass them.
- **Stateless auth.** The API keeps no server session; each request carries a JWT. This scales horizontally and works identically for web and mobile.
- **Thin clients.** Clients render, validate for UX, and call the API. Authorization is never trusted from the client.

### 2.1 Request flow (example: gated add-to-cart)

```mermaid
sequenceDiagram
    participant U as Customer (client)
    participant API as Express API
    participant DB as MongoDB

    U->>API: POST /api/cart/items { productId, qty }<br/>Authorization: Bearer customerJWT
    API->>API: authMiddleware → verify JWT, require type=customer
    alt token missing/invalid
        API-->>U: 401 Unauthorized
    else valid customer
        API->>DB: load product, validate stock
        API->>DB: upsert cart line for customer
        API-->>U: 200 { cart }
    end
```

---

## 3. Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Customer/Seller Web | **React 18 + React Router**, built with **Vite** | Responsive via Flexbox / CSS Grid |
| Mobile (both sides) | **React Native + Expo** | JWT stored on device; QR-shareable build |
| HTTP client | **Axios** (Fetch acceptable) | Shared request/interceptor pattern |
| Backend | **Node.js + Express.js** | RESTful API |
| Database | **MongoDB** (Atlas) + **Mongoose** | Schemas & validation |
| Auth | **JWT** (`jsonwebtoken`) + **bcrypt** | Separate customer/seller identities |
| Validation | **express-validator** (or `zod`) | Server-side input validation |
| Deploy — Web | **Vercel** (or Netlify) | Two web projects (customer, seller) |
| Deploy — API | **Render** (or Heroku) | Single service |
| Deploy — Mobile | **Expo** (EAS / `expo publish`) | Shareable QR code |
| Monitoring | **Google Analytics** or **LogRocket** | On web clients |

> The stack is fixed to match the graded Lab modules. Choose **one** option where alternatives are listed (e.g. Vercel *or* Netlify) and use it consistently.

---

## 4. Suggested Repository Structure

A monorepo keeps the shared API and four clients discoverable; separate repos are equally acceptable if the team prefers.

```
marketplace/
├── api/                     # Node.js + Express + Mongoose  (deployed to Render)
│   ├── src/
│   │   ├── models/          # Customer, Seller, Product, Cart, Order
│   │   ├── routes/          # auth, products, cart, orders
│   │   ├── controllers/
│   │   ├── middleware/      # auth (JWT), validation, error handler
│   │   └── app.js
│   └── package.json
├── web-customer/            # React + Vite  (deployed to Vercel)
├── web-seller/              # React + Vite  (deployed to Vercel)
├── mobile-customer/         # React Native + Expo
├── mobile-seller/           # React Native + Expo
└── docs/                    # this PRD + TRD
```

---

## 5. Data Model

Separate `customers` and `sellers` collections reflect the **separate-accounts** decision (BR-1). Products belong to a seller; orders reference a customer and snapshot line items.

```mermaid
erDiagram
    CUSTOMER ||--o{ CART : has
    CUSTOMER ||--o{ ORDER : places
    SELLER   ||--o{ PRODUCT : lists
    SELLER   ||--o{ ORDER : receives
    PRODUCT  ||--o{ CART_ITEM : "referenced by"
    PRODUCT  ||--o{ ORDER_ITEM : "snapshotted in"
    CART     ||--o{ CART_ITEM : contains
    ORDER    ||--o{ ORDER_ITEM : contains

    CUSTOMER {
        string id
        string name
        string email
        string passwordHash
        string address
    }
    SELLER {
        string id
        string storeName
        string email
        string passwordHash
    }
    PRODUCT {
        string id
        string sellerId
        string name
        number price
        string category
        number stock
        string imageUrl
        boolean active
    }
    CART {
        string id
        string customerId
    }
    CART_ITEM {
        string productId
        number qty
    }
    ORDER {
        string id
        string customerId
        string sellerId
        string status
        number total
        string shippingAddress
        date createdAt
    }
    ORDER_ITEM {
        string productId
        string name
        number unitPrice
        number qty
    }
```

### 5.1 Collection schemas (Mongoose-style)

**customers**
```js
{
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  address:      { type: String },
  createdAt:    { type: Date, default: Date.now }
}
```

**sellers**
```js
{
  storeName:    { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt:    { type: Date, default: Date.now }
}
```

**products**
```js
{
  sellerId:   { type: ObjectId, ref: 'Seller', required: true, index: true },
  name:       { type: String, required: true },
  description:{ type: String },
  price:      { type: Number, required: true, min: 0 },      // IDR
  category:   { type: String, required: true, index: true },
  stock:      { type: Number, required: true, min: 0 },
  imageUrl:   { type: String },                              // URL, not uploaded file
  active:     { type: Boolean, default: true }
}
```

**carts** (one per customer)
```js
{
  customerId: { type: ObjectId, ref: 'Customer', required: true, unique: true },
  items: [{ productId: { type: ObjectId, ref: 'Product' }, qty: { type: Number, min: 1 } }]
}
```

**orders** — **one order per seller** (a single checkout may create several; line items are snapshotted — BR-6, BR-7)
```js
{
  customerId: { type: ObjectId, ref: 'Customer', required: true, index: true },
  sellerId:   { type: ObjectId, ref: 'Seller',   required: true, index: true },  // one seller per order
  items: [{
    productId: { type: ObjectId, ref: 'Product' },
    name:      String,
    unitPrice: Number,   // price at time of purchase
    qty:       Number
  }],
  total:           { type: Number, required: true },   // this seller's sub-total
  status:          { type: String, enum: ['PENDING','PAID','PROCESSED','SHIPPED','COMPLETED','CANCELLED'], default: 'PENDING' },
  shippingAddress: { type: String, required: true },
  createdAt:       { type: Date, default: Date.now }
}
```

> **Why one order per seller?** An order carries a single `status` that its seller advances (BR-3). If one order spanned multiple sellers, seller A marking it `SHIPPED` would wrongly flip the status for seller B's unshipped items and mislead the customer. So checkout **groups the cart by `sellerId` and creates one order per seller** (BR-7) — the same way Tokopedia splits a checkout into one invoice per store. Each order then has exactly one seller, one clean status, a cheap inbox query (`orders.find({ sellerId: me })`), and its own sub-total.
>
> **Why snapshot `name` and `unitPrice` into each line?** Orders are historical records. If a seller later edits a price or deletes a product, past orders must stay accurate (BR-6).

---

## 6. REST API Specification

Base URL: `/api`. All request/response bodies are JSON. Protected routes require `Authorization: Bearer <JWT>`.

**Legend:** 🔓 public · 🧑 customer token · 🏪 seller token

### 6.1 Authentication (separate customer/seller flows)

| Method | Path | Access | Purpose |
|--------|------|:------:|---------|
| POST | `/api/auth/customer/register` | 🔓 | Create customer account |
| POST | `/api/auth/customer/login` | 🔓 | Customer login → JWT (`type: "customer"`) |
| POST | `/api/auth/seller/register` | 🔓 | Create seller account |
| POST | `/api/auth/seller/login` | 🔓 | Seller login → JWT (`type: "seller"`) |
| GET | `/api/auth/me` | 🧑/🏪 | Return current identity from token |

### 6.2 Products

| Method | Path | Access | Purpose |
|--------|------|:------:|---------|
| GET | `/api/products` | 🔓 | List/browse (query: `?search=&category=&page=`) |
| GET | `/api/products/:id` | 🔓 | Product detail |
| POST | `/api/products` | 🏪 | Seller creates a product (owner = token seller) |
| PUT | `/api/products/:id` | 🏪 | Seller updates **own** product (BR-4) |
| DELETE | `/api/products/:id` | 🏪 | Seller deletes/deactivates **own** product (BR-4) |
| GET | `/api/seller/products` | 🏪 | Seller's own product list (S5) |

### 6.3 Cart — **gated (customer only)**

| Method | Path | Access | Purpose |
|--------|------|:------:|---------|
| GET | `/api/cart` | 🧑 | View current cart |
| POST | `/api/cart/items` | 🧑 | Add item `{ productId, qty }` (gated — BR-2) |
| PUT | `/api/cart/items/:productId` | 🧑 | Update quantity |
| DELETE | `/api/cart/items/:productId` | 🧑 | Remove line |

> All cart routes return **`401`** without a valid customer token. This is the enforcement point for the "gated add-to-cart" requirement (BR-2) — the UI redirect to login is convenience only.

### 6.4 Orders

| Method | Path | Access | Purpose |
|--------|------|:------:|---------|
| POST | `/api/orders` | 🧑 | Checkout: **group cart by seller → create one order per seller**, decrement stock, empty cart (C6, BR-7). Returns the created order(s). |
| GET | `/api/orders` | 🧑 | Customer's order history — all their per-seller orders (C7) |
| GET | `/api/orders/:id` | 🧑 | Customer order detail |
| GET | `/api/seller/orders` | 🏪 | Seller's orders — `find({ sellerId: me })` (S6) |
| PUT | `/api/seller/orders/:id/status` | 🏪 | Advance order status per lifecycle (S7, BR-3) |

### 6.5 Response & error conventions

- **Success:** `2xx` with `{ data }` (or the resource directly).
- **Validation error:** `400` with `{ error, details: [...] }`.
- **Auth:** `401` (missing/invalid token) vs `403` (valid token, wrong type/owner).
- **Not found:** `404`. **Server:** `500` (never leak stack traces to clients).

---

## 7. Authentication & Authorization

```mermaid
flowchart LR
    L["POST /auth/{type}/login"] --> V{verify bcrypt}
    V -- ok --> J["sign JWT<br/>{ sub, type, exp }"]
    J --> C["client stores token<br/>web: memory/localStorage<br/>mobile: SecureStore/AsyncStorage"]
    C --> R["request + Bearer token"]
    R --> M{authMiddleware}
    M -- "no/expired token" --> E401[401]
    M -- "wrong type/owner" --> E403[403]
    M -- ok --> H[route handler]
```

- **JWT payload:** `{ sub: <userId>, type: 'customer' | 'seller', iat, exp }`. Signed with `JWT_SECRET`; expiry (e.g. 7d) configurable.
- **Passwords:** hashed with **bcrypt** (never stored or logged in plaintext).
- **Middleware:**
  - `requireAuth` — verifies token, attaches `req.user`.
  - `requireCustomer` / `requireSeller` — assert `req.user.type` (enforces BR-1).
  - `requireOwnership` — for product/order writes, assert the resource belongs to `req.user.sub` (enforces BR-4).
- **Protected routes (Soal 4):** cart, checkout, order history, profile (customer); all product-write and order routes (seller).
- **Token storage on mobile:** Expo **SecureStore** (preferred) or **AsyncStorage**, so the session survives an app restart (C8-AC3).

---

## 8. Frontend Architecture

### 8.1 Customer / Seller Web (React + Vite)

- **Routing (React Router):**
  - Customer web: `/`, `/products`, `/products/:id`, `/cart` 🔒, `/checkout` 🔒, `/orders` 🔒, `/login`, `/register`.
  - Seller web: `/login`, `/register`, `/dashboard` 🔒, `/products` 🔒, `/products/new` 🔒, `/products/:id/edit` 🔒, `/orders` 🔒.
  - 🔒 routes are wrapped in a `<ProtectedRoute>` that checks the token and redirects to login (mirroring the API gate).
- **State:** lightweight — React Context for auth/session + cart; component/local state elsewhere. (Redux is optional and not required.)
- **API layer:** a single Axios instance with a base URL from env and a request interceptor that attaches the Bearer token; a response interceptor that redirects to login on `401`.
- **Responsive (Soal 1):** Flexbox/CSS Grid; product grid collapses to a single column on narrow viewports; no fixed pixel-width layouts.

### 8.2 Customer / Seller Mobile (React Native + Expo)

- **Navigation:** React Navigation (stack + tabs).
  - Customer mobile screens: Product List, Product Detail, Login/Register, Order History (+ optional Cart/Checkout).
  - Seller mobile screens: Login/Register, My Products, Add/Edit Product, Orders Inbox, Update Status.
- **API integration (Soal 3):** same Axios pattern; base URL points at the deployed API.
- **Token persistence:** SecureStore/AsyncStorage; an auth bootstrap on launch restores the session.

### 8.3 Shared client conventions

- Environment-driven API base URL (`VITE_API_URL` / Expo `extra.apiUrl`) — never hard-code the deployed host.
- Explicit **loading / empty / error** states on every data screen.
- Client-side validation is for UX only; the API is the source of truth.

---

## 9. Security & Validation

| Concern | Requirement |
|---------|-------------|
| Passwords | bcrypt hashed; minimum length enforced at registration |
| Secrets | `JWT_SECRET`, DB URI, etc. in environment variables — never committed |
| Input validation | Server-side on every write (express-validator/zod): types, required fields, price/stock ≥ 0, enum status values |
| AuthZ | Route-level type checks (customer vs seller) + ownership checks (BR-1, BR-4) |
| Gated cart | Enforced server-side (`401`) independent of UI (BR-2) |
| CORS | Restrict to the known web origins (customer/seller Vercel domains) |
| Rate limiting | Basic `express-rate-limit` on auth endpoints to blunt brute force |
| Transport | HTTPS everywhere (provided by Vercel/Render) |
| Error hygiene | No stack traces or secrets in client-facing error responses |

---

## 10. Deployment Architecture (Soal 5)

```mermaid
flowchart LR
    subgraph Vercel
        VW1["web-customer"]
        VW2["web-seller"]
    end
    R["Render<br/>Express API"]
    A[("MongoDB Atlas")]
    E["Expo<br/>customer + seller apps<br/>(QR code)"]

    VW1 --> R
    VW2 --> R
    E --> R
    R --> A
```

| Artifact | Platform | Output |
|----------|----------|--------|
| Customer Web | Vercel (or Netlify) | Public URL |
| Seller Web | Vercel (or Netlify) | Public URL |
| API | Render (or Heroku) | Public HTTPS base URL |
| Database | MongoDB Atlas | Connection URI (env) |
| Mobile (both) | Expo | Shareable **QR code** |

- **Env-var promotion:** each deployment target holds its own env vars (API holds `MONGODB_URI`, `JWT_SECRET`; web holds `VITE_API_URL`; mobile holds the API URL via Expo config).
- **Fallback (per assignment):** if any deployment fails, archive the project (including the built `.apk`) into a `.rar` and submit it — deployment failure affects grading, so keep a working local build as backup.

---

## 11. Monitoring & Analytics (Soal 5)

- **Google Analytics** (GA4) or **LogRocket** integrated on the **web** clients.
- Track at minimum: page/route views and a key conversion event (e.g. `add_to_cart`, `checkout_completed`).
- Keep the measurement id / app id in env vars; disable in local dev to avoid noise.

---

## 12. Local Development Setup

**Prerequisites:** Node.js LTS, npm/pnpm, a MongoDB Atlas URI (or local MongoDB), Expo CLI for mobile.

```bash
# 1. API
cd api
cp .env.example .env         # set MONGODB_URI, JWT_SECRET, PORT
npm install
npm run dev                  # http://localhost:4000

# 2. Customer / Seller Web (repeat per app)
cd ../web-customer
cp .env.example .env         # set VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                  # http://localhost:5173

# 3. Mobile (repeat per app)
cd ../mobile-customer
npm install
# set the API URL in app config (Expo extra.apiUrl)
npx expo start               # scan QR with Expo Go
```

### 12.1 Environment variables

| App | Variable | Example |
|-----|----------|---------|
| API | `MONGODB_URI` | `mongodb+srv://…` |
| API | `JWT_SECRET` | `<random-long-string>` |
| API | `PORT` | `4000` |
| API | `CORS_ORIGINS` | `https://customer.example.app,https://seller.example.app` |
| Web | `VITE_API_URL` | `https://api.example.com/api` |
| Web | `VITE_GA_ID` / LogRocket id | `G-XXXX` |
| Mobile | `apiUrl` (Expo `extra`) | `https://api.example.com/api` |

---

## 13. Requirements → Grading Rubric Mapping (Soal 1–5)

| Soal (weight) | Topic | Technical coverage |
|---------------|-------|--------------------|
| **Soal 1 (20%)** | Frontend React Web | §8.1 — React Router, `ProtectedRoute`, responsive Flexbox/Grid, home/list/detail/cart/checkout |
| **Soal 2 (20%)** | Backend Node/Express + MongoDB | §5 data model, §6 REST API, §9 validation — CRUD for products & users with input validation |
| **Soal 3 (20%)** | Mobile React Native | §8.2 — Expo apps (customer + seller), API integration, JWT stored on device |
| **Soal 4 (20%)** | Data Integration & Auth | §7 JWT auth, protected routes, ownership/type guards; §8.3 Axios/Fetch integration |
| **Soal 5 (15%)** | Deployment & Monitoring | §10 Vercel + Render + Expo (QR); §11 Google Analytics / LogRocket |

---

## 14. Open Technical Decisions (to confirm during build)

| # | Decision | Default taken |
|---|----------|---------------|
| D1 | Pagination strategy for product list | Simple `page`/`limit` query params |
| D2 | Payment simulation timing | Auto-confirm `PENDING → PAID` at checkout (BR-3) |
| D3 | State management on web | React Context (no Redux) unless complexity grows |
| D4 | Multi-seller cart at checkout | Split into **one order per seller** (grouped by `sellerId`); one combined payment, per-seller orders & statuses (BR-7) |
| D5 | Image handling | `imageUrl` strings only; no upload service |

> These are recorded so they can be revisited without reopening the whole design. Changing one should be a local edit here, not a redesign.
