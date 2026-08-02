# Product Requirements Document (PRD)
### Online Marketplace — "Tokopedia-style" Two-Sided Marketplace

| | |
|---|---|
| **Course** | Specialized Platform Development |
| **Deliverable** | Tugas Kelompok Project Lab — Week 10 |
| **Document** | Product Requirements (Unified web marketplace) |
| **Companion** | `technical-requirements.md` |
| **Status** | Draft for review |
| **Date** | 2026-08-01 |

---

## 1. Overview & Vision

We are building an **online marketplace** modelled on [Tokopedia](https://www.tokopedia.com): a platform where independent **sellers** list products and **customers** browse, add to cart, and check out. The current deliverable is one responsive web application backed by a single REST API; native mobile clients and public deployment remain future work.

The marketplace is **two-sided**:

- **Customer side** — a storefront for discovering and buying products.
- **Seller side** — a merchant dashboard for listing products and fulfilling orders.

Both sides share the web application through separate route namespaces and account sessions. Customers and sellers hold **separate accounts** with separate registration and login flows.

> **Guiding constraint:** everything in this document must be buildable within the Lab Module 1–5 skill set (React, Node/Express, MongoDB, React Native/Expo, JWT, cloud deployment). We deliberately keep the feature set lean so it can be built, deployed, and demonstrated end-to-end.

---

## 2. Goals & Success Criteria

| # | Goal | Success signal |
|---|------|----------------|
| G1 | A customer can go from landing to placed order | Guest → register → browse → add to cart → checkout → order visible in history |
| G2 | A seller can stock the marketplace and fulfil demand | Seller → register → add product → product appears in storefront → order arrives → status updated |
| G3 | Add-to-cart is gated behind authentication | A logged-out user cannot add to cart on **any** client, and the API rejects the attempt |
| G4 | One backend serves both marketplace roles | The unified web app consumes the shared API for customer and seller workflows |
| G5 | Keep future delivery deployable | The current local web/API build is documented; public deployment and mobile artifacts are deferred |

---

## 3. Personas & Roles

| Persona | Description | Primary jobs-to-be-done |
|---------|-------------|-------------------------|
| **Guest** | Unauthenticated visitor | Browse products, view details, search — **cannot** add to cart or checkout |
| **Customer** | Registered buyer (separate account) | Add to cart, checkout, view order history, manage profile |
| **Seller** | Registered merchant (separate account) | List/manage products, view and fulfil orders, view a simple sales dashboard |

**Account separation.** Customers and sellers are distinct account types with distinct registration and login entry points. A customer account cannot access seller functions and vice-versa (see business rule BR-1). This mirrors Tokopedia's split between the buyer app and the Seller (Toko) dashboard.

---

## 4. Scope

### 4.1 In scope
- Customer storefront (responsive web): browse, search, cart, checkout, order history.
- Seller dashboard (responsive web): product CRUD, order management, sales overview.
- Separate customer/seller authentication (register, login, protected areas).
- Gated add-to-cart and checkout (authentication required).
- A **simulated** checkout that creates an order record (no real money movement).
- Basic web monitoring/analytics.

### 4.2 Out of scope (explicitly)
- **Real payment gateway** integration (Midtrans/Stripe/etc.). Checkout is simulated — it creates an order in a `PENDING`/`PAID` state without charging a card.
- Product **image upload/storage service** — product images are referenced by **URL**.
- Native mobile applications (React Native/Expo) are deferred beyond the current web milestone.
- Public deployment is deferred until the local web/API flows are complete.
- Ratings, reviews, chat/messaging, wishlists, promotions/vouchers.
- Shipping-cost calculation and courier integration (a flat/placeholder value may be shown).
- Admin/superuser role and moderation tooling.
- Multi-currency — all prices are in **IDR**.

> Out-of-scope items are named so reviewers can see the boundary was a deliberate decision, not an omission. Any of them is a natural future extension.

---

## 5. Customer Site — Product Requirements

Platform: **Web** (React + Vite). A future mobile client can consume the same API but is not part of this milestone.

### 5.1 Feature list

| ID | Feature | Web | Auth required |
|----|---------|:---:|:-------------:|
| C1 | Home / Beranda (featured + entry to catalog) | ✅ | No |
| C2 | Product list with search & category filter | ✅ | No |
| C3 | Product detail | ✅ | No |
| C4 | **Add to cart (gated)** | ✅ | **Yes** |
| C5 | Cart view (update quantity, remove) | ✅ | Yes |
| C6 | Checkout (simulated) → creates order | ✅ | Yes |
| C7 | Order history & order detail | ✅ | Yes |
| C8 | Customer register / login (JWT) | ✅ | — |
| C9 | Profile (view basic info, logout) | ✅ | Yes |

### 5.2 Key user stories & acceptance criteria

**C2 — Browse & search products**
> As a guest or customer, I want to browse and search products so I can find what I want.
- **AC1:** Product list shows image, name, price (IDR), and seller/store name.
- **AC2:** A search box filters by product name (case-insensitive, substring).
- **AC3:** A category filter narrows the list.
- **AC4:** The layout is responsive (mobile → single column, desktop → grid).

**C4 — Add to cart (gated auth)** ⭐ *core requirement*
> As a customer, I want to add a product to my cart; as a guest, I should be prompted to log in first.
- **AC1:** A **guest** who taps "Add to cart" is redirected to the customer **login** page (with a return path back to the product).
- **AC2:** A logged-in **customer** adds the item; the cart badge/count updates.
- **AC3:** The **API rejects** any add-to-cart request without a valid customer token (`401`) — the gate is enforced server-side, not only in the UI (see BR-2).
- **AC4:** Adding an item already in the cart increases its quantity rather than duplicating the line.

**C6 — Checkout (simulated)**
> As a customer, I want to place an order for the items in my cart.
- **AC1:** Only reachable when authenticated **and** the cart is non-empty.
- **AC2:** Submitting groups the cart by seller and creates **one order per seller** (BR-7), each capturing that seller's line items, quantities, unit prices, and sub-total; the cart is then emptied.
- **AC3:** The new order(s) appear immediately in the customer's order history with status `PAID`; the simulated payment confirms the order during checkout (see BR-3).
- **AC4:** Product **stock** is decremented for each ordered line.

**C7 — Order history**
> As a customer, I want to see my past orders and their status.
- **AC1:** Lists the customer's orders (most recent first) with order id, date, total, and status.
- **AC2:** Order detail shows line items and the current status set by the seller.

**C8 — Customer authentication**
> As a customer, I want to register and log in securely.
- **AC1:** Registration requires email + password (+ name); duplicate emails are rejected.
- **AC2:** Login returns a JWT; protected customer routes/screens are inaccessible without it.
- **AC3:** On mobile, the token is stored on-device and the session survives an app restart.

---

## 6. Seller Site — Product Requirements

Platform: **Web** (React + Vite seller dashboard). Sellers hold **separate accounts** from customers.

### 6.1 Feature list

| ID | Feature | Web | Auth required |
|----|---------|:---:|:-------------:|
| S1 | Seller register / login (JWT, separate flow) | ✅ | — |
| S2 | Product management — create | ✅ | Yes (seller) |
| S3 | Product management — edit / update stock | ✅ | Yes (seller) |
| S4 | Product management — delete / deactivate | ✅ | Yes (seller) |
| S5 | My products list | ✅ | Yes (seller) |
| S6 | Incoming orders inbox | ✅ | Yes (seller) |
| S7 | Update order status (fulfilment) | ✅ | Yes (seller) |
| S8 | Sales dashboard (counts & totals) | ✅ | Yes (seller) |

### 6.2 Key user stories & acceptance criteria

**S2/S3 — Manage products**
> As a seller, I want to add and edit my products so customers can buy them.
- **AC1:** Create requires name, price, description, category, stock, and image URL.
- **AC2:** A newly created product **immediately appears** in the customer storefront (C2).
- **AC3:** A seller can only edit/delete **their own** products (ownership enforced by the API — BR-4).
- **AC4:** Editing stock to `0` hides the product from purchase (shown as out of stock).

**S6/S7 — Fulfil orders**
> As a seller, I want to see orders for my products and update their status.
- **AC1:** The inbox lists **this seller's own** orders (one order per seller — BR-7), newest first.
- **AC2:** The seller can advance their order's status along the defined lifecycle (BR-3).
- **AC3:** The status change is reflected in the customer's order history (C7).

**S8 — Sales dashboard**
> As a seller, I want a quick overview of my sales.
- **AC1:** Shows total number of orders and total revenue for the seller's products.
- **AC2:** Shows a count of products currently listed and how many are out of stock.

---

## 7. Cross-Cutting Business Rules

| ID | Rule |
|----|------|
| **BR-1** | Customer and seller accounts are separate namespaces. A token issued for one type must not grant access to the other type's protected resources. |
| **BR-2** | **Gated cart:** add-to-cart, view-cart, and checkout require a valid **customer** token. The gate is enforced at the API layer (`401` on missing/invalid token), with the UI redirecting to login as a convenience — never as the only barrier. |
| **BR-3** | **Order lifecycle:** `PENDING → PAID → PROCESSED → SHIPPED → COMPLETED`, with `CANCELLED` reachable from `PENDING`/`PAID`. Payment is simulated: checkout confirms each per-seller order (BR-7) as `PAID` immediately, representing the `PENDING → PAID` step. The owning seller advances `PAID → PROCESSED → SHIPPED → COMPLETED`. |
| **BR-4** | **Ownership:** a seller may read/update/delete only products they own and may view/advance only their own orders. |
| **BR-5** | **Stock:** checkout decrements stock; an order line cannot exceed available stock at time of checkout. |
| **BR-6** | **Pricing snapshot:** an order stores the unit price at time of purchase, so later price edits by the seller do not change historical orders. |
| **BR-7** | **One order per seller:** at checkout the cart is grouped by seller and a separate order is created for each seller (a single checkout may produce multiple orders). This keeps each order's single `status` owned by exactly one seller (like Tokopedia's per-store invoices). |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Responsiveness** | The web layout uses Flexbox/CSS Grid and adapts from mobile (~360px) to desktop (~1280px+). |
| **Usability** | Consistent navigation; clear empty/loading/error states; primary actions reachable in ≤ 3 taps. |
| **Performance** | Product list first render within a couple of seconds on a normal connection; paginate or cap list size to keep payloads reasonable. |
| **Security** | Passwords hashed; secrets in environment variables; protected routes enforced server-side; input validated (see TRD §9). |
| **Availability** | The local web/API flow is runnable from the documented setup; public deployment and mobile artifacts are deferred. |
| **Maintainability** | Customer and seller route surfaces remain separated inside one web app, backed by the shared API. |
| **Observability** | Basic analytics/monitoring wired on the web client (Google Analytics or LogRocket). |

---

## 9. Assumptions & Constraints

- Prices and totals are in **IDR**; no tax/discount engine.
- One product belongs to exactly one seller; there are no product variants (size/colour) in this version.
- A single cart per customer; checkout groups the cart by seller and creates **one order per seller** (BR-7), so a single checkout may produce multiple orders — each owned and fulfilled independently by its seller.
- Shipping address is captured as free text at checkout; no address book.
- The tech stack is fixed by the assignment (see `technical-requirements.md` §3).

---

## 10. Requirements → Grading Rubric Mapping (Soal 1–5)

This marketplace is designed so each graded component maps to concrete features here.

| Soal (weight) | Topic | Covered by |
|---------------|-------|-----------|
| **Soal 1 (20%)** | Frontend React Web | C1–C6 customer web (home, list, detail, cart, checkout) + React Router + responsive Flexbox/Grid |
| **Soal 2 (20%)** | Backend Node/Express + MongoDB | The shared API: product & user (customer/seller) management, CRUD + validation (see TRD §6) |
| **Soal 3 (20%)** | Mobile React Native | Deferred mobile milestone; the shared REST contracts are documented for future customer and seller clients |
| **Soal 4 (20%)** | Data Integration & Authentication | C8/S1 JWT auth, BR-1/BR-2 protected & gated routes, Axios/Fetch API integration |
| **Soal 5 (15%)** | Deployment & Monitoring | Web analytics is implemented; public web/API deployment and Expo delivery remain deferred |

---

## Appendix A — Glossary

- **Gated auth / gated cart** — the requirement that add-to-cart (and everything after) is available only to authenticated customers, enforced at the API.
- **Simulated checkout** — order creation without a real payment gateway.
- **Order lifecycle** — the fixed sequence of statuses an order moves through (BR-3).
- **Beranda** — Indonesian for "Home"; the storefront landing page.
