import type { APIRoute } from 'astro';
import { listProducts } from '../lib/store';

export const prerender = false;

// Product pages are rendered on request, so they get their own always-current sitemap.
export const GET: APIRoute = async ({ site }) => {
  const products = await listProducts();
  const urls = products.map((p) => `  <url><loc>${new URL(`/shop/${p.slug}`, site)}</loc></url>`).join('\n');
  const shop = ['/', '/shop'].map((u) => `  <url><loc>${new URL(u, site)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${shop}\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=3600' },
  });
};
