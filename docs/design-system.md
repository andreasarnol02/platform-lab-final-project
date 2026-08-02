# Marketplace Design System

Status: Variant A, Quick commerce, selected for the production storefront.

This document is the shared visual contract for every customer and seller route. It favors a familiar marketplace structure, a calm green brand layer, high information density, and simple responsive behavior.

## Direction

- Make the next useful action obvious: search, browse, add to cart, or manage a store.
- Use product imagery and price as the strongest visual hierarchy.
- Keep trust visible without making the interface feel corporate.
- Use the same spacing, radius, type scale, and status language on customer and seller surfaces.
- Prefer real data. Do not invent ratings, stock, shipping promises, or seller claims in production UI.

## Design Tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--green` | `#00A86B` | Primary actions and brand accents |
| `--green-dark` | `#007D5A` | Links, active states, accessible green text |
| `--green-light` | `#E3F6ED` | Soft surfaces and selected states |
| `--ink` | `#172522` | Headings and primary text |
| `--ink-soft` | `#50645B` | Secondary text |
| `--muted` | `#71817C` | Helper text and metadata |
| `--line` | `#E5ECE8` | Borders and dividers |
| `--bg` | `#F5F9F7` | Application background |
| `--danger` | `#D32F2F` | Destructive actions and errors |

### Shape and Elevation

- Small control radius: `8px` to `10px`.
- Card radius: `14px` to `16px`.
- Hero radius: `20px` to `26px`.
- Pill radius: `999px`.
- Default shadow: `0 12px 28px rgba(23, 37, 34, 0.09)`.
- Hover elevation should be subtle: lift by `2px` to `3px`, never bounce.

### Spacing

Use a 4px base unit: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`.

- Page gutter: `20px` desktop, `14px` mobile.
- Card content: `12px` to `16px`.
- Section spacing: `32px` to `56px`.
- Form control height: `40px` to `46px`.

### Typography

- Primary family: system sans stack, with `Georgia` reserved for short editorial emphasis in hero copy.
- Body: `14px` to `16px`, line-height `1.5` to `1.65`.
- Product name: `12px` to `14px`, maximum two lines.
- Product price: `14px` to `18px`, weight `800`.
- Page heading: `24px` to `32px`.
- Hero heading: fluid, approximately `42px` to `57px` desktop and `42px` mobile.
- Uppercase labels use `9px` to `10px`, weight `800`, and letter spacing.

## Components

### Global Header

- Green utility ribbon at the top for one concise benefit.
- Main row contains brand, search, cart, and account actions.
- Secondary navigation contains high-value categories and the seller entry point.
- On mobile, keep brand, cart, account, and search. Hide the secondary navigation.
- Search submits to `/products?search=<term>`.

### Iconography

- Use `lucide-react` for interface icons in both applications.
- Keep icon names semantic at the component boundary, for example `MarketplaceIcon name="bag"` or `SellerIcon name="orders"`.
- Do not add hand-authored SVG path maps or emoji as interface icons.
- Default icon stroke is approximately `1.9`; use `currentColor` so state and hover colors come from CSS.
- Icon-only buttons require an accessible label; decorative icons use `aria-hidden`.

### Brand Mark

- Lowercase `marketplace` wordmark.
- Green square mark with a lowercase `m`.
- Do not use emoji as a navigation icon or brand mark.

### Search Field

- Search icon on the left.
- Placeholder describes useful searches, not generic filler.
- Visible focus ring using the green token.
- Preserve the entered term when navigating to the catalog.

### Category Row

- Seven categories maximum in the first row.
- Each category uses a soft tinted icon tile and a short label.
- Desktop uses a grid. Mobile becomes a horizontally scrollable row.
- Category links map to `/products?category=<category>`.

### Product Card

- Image first, with a stable aspect ratio.
- Optional availability badge at the image edge.
- Category, product name, price, seller, and stock metadata in that order.
- Product name is clamped to two lines so grids remain aligned.
- Entire card is a link; do not add competing actions inside the card.

### Hero

- Split copy and product visual on desktop.
- Stacks copy above visual on mobile.
- One primary CTA and one quiet secondary link.
- Include a small proof row only when the values come from real product data or a documented business rule.

### Trust Row

- Three short benefits maximum.
- Use shield, store, or speed iconography.
- Keep supporting copy below 40 characters where possible.

### Seller Banner

- Use the dark green surface to separate seller acquisition from shopping content.
- Keep one action: `Buka toko gratis`.
- Link to the seller application using the unified route `/seller/register`.

### Seller Sidebar

- Use the dark green surface as the seller workspace anchor.
- Keep three primary destinations visible: dashboard, products, and incoming orders.
- Active navigation uses the primary green surface and a compact line icon.
- On mobile, convert the sidebar into a horizontal navigation band above the page.

### Dashboard Stat Card

- Show one icon, one primary value, and one short label.
- Use a white card with a soft green icon tile.
- Keep five cards on wide screens, three on tablet, and two on mobile.

### Data Table and Order Card

- Tables are for dense seller management data and use a quiet green header row.
- Order cards are preferred for customer history and seller order actions.
- Keep actions grouped at the far edge and use green for the next valid lifecycle action.
- Destructive actions use text plus the danger color, never color alone.

### Auth Surface

- Customer and seller auth pages use the same soft background, card radius, field treatment, and focus ring.
- Seller auth adds the seller wordmark but does not introduce a separate color system.
- Keep the primary submit action full width and put cross-application links below the form.

### Status Badge

Use the existing order status vocabulary consistently:

- `PENDING`: warm yellow.
- `PAID`: blue.
- `PROCESSED`: green-blue.
- `SHIPPED`: violet.
- `COMPLETED`: green.
- `CANCELLED`: red.

Status must be readable by text and never rely on color alone.

## Responsive Rules

### Desktop, above 1050px

- Customer catalog uses four product columns where space allows.
- Header uses two rows plus the utility ribbon.
- Seller dashboard may use a persistent sidebar.

### Tablet, 761px to 1050px

- Reduce page gutters and hero copy padding.
- Collapse seller dashboard secondary panels before the main content.
- Keep product grids at two to four columns on tablet and desktop widths; collapse to one column on narrow phone widths.

### Mobile, 760px and below

- Use one-column page sections and two-column product grids.
- Convert category rows to horizontal scrolling.
- Hide secondary desktop navigation, not primary actions.
- Keep touch targets at least `40px` high.
- Stack seller banners and form actions.
- Never rely on hover to reveal important information.

## Accessibility

- Every icon-only control needs an accessible label.
- Preserve visible keyboard focus states.
- Maintain readable contrast for muted text and green links.
- Images require meaningful `alt` text; decorative images use empty alt text.
- Error and loading states must remain available without color cues.
- Use semantic links for navigation and buttons for actions.

## Implementation Notes

- Customer tokens and route surfaces live in `web/src/styles/global.css`.
- Shared customer iconography lives in `web/src/components/MarketplaceIcon.jsx`.
- Customer category navigation lives in `web/src/components/CategoryRow.jsx`.
- The production customer application covers `HomePage`, `ProductsPage`, `ProductDetailPage`, auth, cart, checkout, orders, profile, and empty/error states.
- Seller tokens and route surfaces live in `web/src/seller/styles/global.css`.
- Seller shared Lucide icon mapping lives in `web/src/seller/components/SellerIcon.jsx`.
- The seller application covers auth, sidebar navigation, dashboard, products, product forms, orders, and responsive states.
- Keep seller information architecture task-oriented rather than copying the storefront hero.
