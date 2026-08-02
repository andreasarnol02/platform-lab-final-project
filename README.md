# Marketplace

A full-stack multi-vendor marketplace for customers and sellers. The project includes a React/Vite web client, a Node.js/Express API, MongoDB persistence, simulated checkout, seller product management, and seller order fulfillment.

## Requirements

- Node.js 22.22.0 or newer
- MongoDB with transaction support
- npm

Checkout uses a MongoDB transaction to reserve stock, create one order per seller, and clear the cart atomically. Use MongoDB Atlas or a local replica set for checkout testing; a standalone MongoDB server does not support transactions.

## Quick Start

Install the root workspace runner and both application dependencies:

```bash
npm install
npm --prefix api install
npm --prefix web install
```

Create local environment files:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Set `MONGODB_URI` and a long random `JWT_SECRET` in `api/.env`. Generate a secret with:

```bash
openssl rand -hex 32
```

Start the API and web client together from the repository root:

```bash
npm run dev
```

The services are available at:

- Web client: `http://localhost:5173`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/`

The API also allows the local web origin `http://127.0.0.1:5173` by default.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API and web client together |
| `npm test` | Run API and web Jest tests |
| `npm run build` | Create the web production build |
| `npm --prefix api test` | Run API tests only |
| `npm --prefix web test` | Run web tests only |
| `npm --prefix web run test:e2e` | Run Playwright browser tests |
| `npm --prefix web run preview` | Preview the web production build |

## Application Areas

Customer routes include:

- `/` - storefront home
- `/products` - searchable product catalog
- `/products/:id` - product details
- `/cart` - shopping cart
- `/checkout` - simulated checkout
- `/orders` - order history
- `/profile` - customer profile

Seller routes include:

- `/seller/login` and `/seller/register` - seller authentication
- `/seller/dashboard` - seller overview
- `/seller/products` - owned product management
- `/seller/orders` - incoming orders and fulfillment status

The API enforces authentication, customer/seller role separation, and resource ownership. Checkout creates one order per seller and immediately marks payment as simulated and confirmed.

## Project Structure

```text
api/                 Express API, models, routes, middleware, and tests
web/                 React/Vite customer and seller applications
docs/                Product, technical, and design documentation
.github/workflows/   CI checks
package.json         Root development, test, and build commands
```

Detailed service documentation is available in:

- [`api/README.md`](api/README.md)
- [`web/README.md`](web/README.md)
- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/technical-requirements.md`](docs/technical-requirements.md)
- [`docs/design-system.md`](docs/design-system.md)

## Verification

The CI workflow runs API tests, frontend tests and build, Playwright browser tests, dependency audits, CodeQL analysis, and secret scanning. Local verification can be run with:

```bash
npm test
npm run build
npm --prefix web run test:e2e
```

Never commit `.env` files or real credentials. Only `.env.example` files belong in version control.
