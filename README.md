# Gummikins™ website

The website for [gummikins.com](https://gummikins.com): handmade crochet plush companions.

Built with [Astro](https://astro.build) on Vercel, with live 3D Gummikins (three.js) on the home page,
product pages, and special-order page. Products and stock live in a Postgres database and are managed
from a private owner portal.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # builds for Vercel
```

Locally, products are stored in a small test database in `.data/` (created automatically and filled with the
starter products). Delete that folder to start over. The owner portal is at
**http://localhost:4321/studio** with the password **gummikins** unless you set `ADMIN_PATH` / `ADMIN_PASSWORD`
in a `.env` file (see `.env.example`).

## Owner portal

A private dashboard for the owners at a secret link, protected by a password. From it they can:

- change stock for every color with + / − buttons (saves instantly)
- add, edit, hide, and delete products
- upload photos for each color, plus extra angles (resized automatically)
- set prices, size options, shipping, and the “How it feels” ratings
- create new collections, which appear as filter buttons in the shop

Changes show on the live site within about 20 seconds.

## Putting it live on Vercel

1. Import the GitHub repo into Vercel (it detects Astro automatically).
2. **Storage tab → Create Database → Neon (Postgres)**, and connect it to the project. This adds `DATABASE_URL`.
   The starter products are copied in automatically on first visit.
3. **Storage tab → Create → Blob**, and connect it. This adds `BLOB_READ_WRITE_TOKEN` for photo uploads.
4. **Settings → Environment Variables**, add:
   - `ADMIN_PATH`: the secret part of the portal link, e.g. `burrow-7kq2m9x4` → `gummikins.com/burrow-7kq2m9x4`
   - `ADMIN_PASSWORD`: a strong password
5. Redeploy. Until steps 2–4 are done the shop still works, showing the starter products, and the portal is off.

The portal is never at `/admin`; that address always shows “not found”.

## Pages

| Page | File |
| --- | --- |
| Home | `src/pages/index.astro` |
| Shop + filters | `src/pages/shop/index.astro` |
| Product pages | `src/pages/shop/[slug].astro` |
| Owner portal | `src/pages/admin/` (served only at the secret `ADMIN_PATH`, see `src/middleware.ts`) |
| Our story | `src/pages/about.astro` |
| Special orders (Giants) | `src/pages/custom.astro` |
| Gallery | `src/pages/gallery.astro` |
| Journal (blog) | `src/pages/journal/` + posts in `src/content/blog/` |
| FAQ | `src/pages/faq.astro` + questions in `src/data/faq.ts` |
| Contact | `src/pages/contact.astro` |
| Policies | `src/data/policies.ts` (shipping, returns, privacy, terms) |

## Updating content

- **Products, photos, prices, and stock** are managed in the owner portal. The starter set lives in
  `src/data/seed-products.json` and is only used to fill an empty database.
- **Shipping rates, testimonials, size guide, reasons, email, Instagram** are in `src/data/site.ts`.
- **Journal posts**: add a Markdown file to `src/content/blog/`.
- **Images** go in `public/images/`. Reference them as `/images/...`.

## What is placeholder (replace before launch)

- **Product photos** in `public/images/products/` are 3D renders generated from the procedural Gummikins model
  (`npm run render:placeholders`). Replace them by uploading real photos in the owner portal.
- **Lifestyle photos** in `public/images/placeholder/` are crops from the brand board.
- **Logo**: `src/components/Logo.astro` and `public/favicon.svg` are drawn from the brand board. Swap in the
  final SVG files when they arrive.
- **Prices, stock counts, and product details** are samples.
- **Brand story** (`src/pages/about.astro`) is a sample written in the owner's voice. Replace with her own words.
- **Policies and the FAQ safety answer (ages 3+)** are sample wording. They need the owners' review.
- **Gift notes at checkout** are promised in the FAQ and shipping policy. Make sure the checkout supports them.

## Still to connect

- **Checkout & payments.** The basket works in the browser today. Stock does not yet go down automatically
  when something sells; once checkout is connected, its order notifications should call `setStock` in
  `src/lib/store.ts`. The Checkout button shows a preview notice
  (`src/components/CartDrawer.astro`, `[data-checkout]`). Hook it up to the chosen store platform. It needs
  per-size flat shipping, address-based sales tax, inventory, and a real cart with quantities.
- **Forms** (newsletter, contact, special orders) validate and show a thank-you message, but don't send
  anywhere yet (`src/scripts/site.ts`). Point them at the email/CRM tool (e.g. Simplero).
- **Instagram feed** shows placeholder tiles linking to @gummikins_plush (`src/components/InstagramGrid.astro`).
