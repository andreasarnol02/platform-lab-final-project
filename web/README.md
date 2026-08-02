# Marketplace Web

The unified React web application for both marketplace roles. It runs on one Vite server and keeps customer and seller experiences separate through route namespaces and role-specific JWT sessions.

## Requirements

- Node.js LTS
- The shared API running from `../api`

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The web application runs at `http://localhost:5173`.

Start the API separately:

```bash
cd ../api
npm install
npm run dev
```

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/api` | Shared API base URL |
| `VITE_GA_ID` | empty | Optional Google Analytics 4 measurement ID |

Analytics is disabled when `VITE_GA_ID` is empty. Vite exposes environment variables at build time; do not place secrets in this file.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the unified Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run frontend unit and integration tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:e2e` | Run Playwright browser tests against the configured app |

## Customer Routes

- `/` - storefront home
- `/products` - product catalog with search and category filters
- `/products/:id` - product detail
- `/cart` - authenticated customer cart
- `/checkout` - authenticated simulated checkout
- `/orders` - authenticated order history
- `/orders/:id` - authenticated order detail
- `/profile` - authenticated customer profile
- `/login` and `/register` - customer authentication

## Seller Routes

- `/seller/login` and `/seller/register` - seller authentication
- `/seller/dashboard` - product, order, stock, and revenue overview
- `/seller/products` - products owned by the authenticated seller
- `/seller/products/new` - create a product
- `/seller/products/:id/edit` - edit an owned product
- `/seller/orders` - incoming orders for the authenticated seller

## Authentication and Ownership

- Customer sessions use `mp_customer_session`.
- Seller sessions use `mp_seller_session`.
- The browser only controls presentation; the API enforces token type and ownership.
- A customer and seller may use the same email because they are separate account namespaces.
- A seller only receives orders created for products owned by that seller.

## Product Images and Prices

- Product images use one direct `imageUrl` string.
- The API validates image URLs and the UI shows a placeholder when the URL is absent or cannot load.
- File upload is intentionally deferred until an object-storage service such as S3 or Cloudinary is selected.
- Seller prices are entered with Indonesian dot grouping, for example `7.777.777.777`, then sent to the API as the numeric value `7777777777`.

## Checkout

- A cart containing products from multiple sellers creates one order per seller.
- The customer sees all seller-specific invoices in order history.
- The checkout is simulated; no real payment is processed.

## Test Layers

- Jest unit tests cover formatting, utilities, and isolated components.
- Jest plus React Testing Library cover frontend interactions and API calls at the component boundary.
- Playwright covers browser-level navigation and protected route behavior.

E2E tests start the Vite server automatically and mock the public product response, so they do not require MongoDB or the API. Set `E2E_BASE_URL` when testing a deployed web URL.

## Continuous Integration

`.github/workflows/ci.yml` runs API tests, frontend tests and build, Playwright browser tests, high-severity dependency audits, CodeQL analysis, and a verified-secret scan on pushes and pull requests.

## Project Structure

```text
src/
├── api/          Axios client and session helpers
├── components/   Customer UI, icons, states, and shared components
├── context/      Customer authentication and cart state
├── pages/        Customer routes
├── seller/       Seller UI, pages, API client, auth, and styles
├── styles/       Customer design tokens and responsive styles
└── utils/        Formatting and analytics helpers
```

The shared visual contract is documented in `../docs/design-system.md`.
