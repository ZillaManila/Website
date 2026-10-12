# Gummikins™ website

The website for [gummikins.com](https://gummikins.com): handmade crochet plush companions.

Built with [Astro](https://astro.build) as a fast static site, with live 3D Gummikins (three.js) on the
home page, product pages, and special-order page.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs the finished site to dist/
npm run preview   # serve the built site
```

The `dist/` folder can be hosted anywhere static sites are hosted (Netlify, Vercel, Cloudflare Pages, etc.).

## Pages

| Page | File |
| --- | --- |
| Home | `src/pages/index.astro` |
| Shop + filters | `src/pages/shop/index.astro` |
| Product pages | `src/pages/shop/[slug].astro` (one per product file) |
| Our story | `src/pages/about.astro` |
| Special orders (Giants) | `src/pages/custom.astro` |
| Gallery | `src/pages/gallery.astro` |
| Journal (blog) | `src/pages/journal/` + posts in `src/content/blog/` |
| FAQ | `src/pages/faq.astro` + questions in `src/data/faq.ts` |
| Contact | `src/pages/contact.astro` |
| Policies | `src/data/policies.ts` (shipping, returns, privacy, terms) |

## Updating content

- **Products** live in `src/content/products/`, one Markdown file per product. Change the price, sizes,
  colors, stock counts, and the "How it feels" ratings in the top section. The text below it is the product
  description. Set a color's `stock` to `0` to mark it sold out. Add a new file to add a new product.
- **Shipping rates, testimonials, size guide, reasons, email, Instagram** are in `src/data/site.ts`.
- **Journal posts**: add a Markdown file to `src/content/blog/`.
- **Images** go in `public/images/`. Reference them as `/images/...`.

## What is placeholder (replace before launch)

- **Product photos** in `public/images/products/` are 3D renders generated from the procedural Gummikins model
  (`npm run render:placeholders`). Replace them with real photography, keeping the same file names or updating
  the paths in each product file.
- **Lifestyle photos** in `public/images/placeholder/` are crops from the brand board.
- **Logo**: `src/components/Logo.astro` and `public/favicon.svg` are drawn from the brand board. Swap in the
  final SVG files when they arrive.
- **Prices, stock counts, and product details** are samples.
- **Brand story** (`src/pages/about.astro`) is a sample written in the owner's voice. Replace with her own words.
- **Policies and the FAQ safety answer (ages 3+)** are sample wording. They need the owners' review.
- **Gift notes at checkout** are promised in the FAQ and shipping policy. Make sure the checkout supports them.

## Still to connect

- **Checkout & payments.** The basket works in the browser today. The Checkout button shows a preview notice
  (`src/components/CartDrawer.astro`, `[data-checkout]`). Hook it up to the chosen store platform. It needs
  per-size flat shipping, address-based sales tax, inventory, and a real cart with quantities.
- **Forms** (newsletter, contact, special orders) validate and show a thank-you message, but don't send
  anywhere yet (`src/scripts/site.ts`). Point them at the email/CRM tool (e.g. Simplero).
- **Instagram feed** shows placeholder tiles linking to @gummikins_plush (`src/components/InstagramGrid.astro`).
