import { listProducts } from './store';
import type { Product } from './types';

export type { Product };

export async function getProducts() {
  return listProducts();
}

export function totalStock(p: Product) {
  return p.colors.reduce((n, c) => n + c.stock, 0);
}

export function availability(p: Product): { label: string; tone: 'ok' | 'low' | 'out' | 'special' } {
  if (p.specialOrder) return { label: 'Special order', tone: 'special' };
  const n = totalStock(p);
  if (n === 0) return { label: 'Sold out', tone: 'out' };
  if (n <= 4) return { label: `Only ${n} left`, tone: 'low' };
  return { label: 'In stock', tone: 'ok' };
}

export function colorStatus(stock: number) {
  if (stock === 0) return 'Sold out';
  if (stock === 1) return 'Last one';
  if (stock <= 3) return `${stock} left`;
  return 'In stock';
}

export function leadColor(p: Product) {
  return p.colors.find((c) => c.stock > 0) || p.colors[0];
}

export const usd = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

export function priceLabel(p: Product) {
  return `${p.priceFrom || p.options ? 'From ' : ''}${usd(p.price)}`;
}

const knownCategories: Record<string, string> = {
  gummikins: 'Gummikins',
  keychains: 'Keychains',
  blankets: 'Blankets & sensory',
};

export function categoryLabel(key: string) {
  return knownCategories[key] || key.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

// Short CDN cache so stock changes from the portal show up within seconds.
export function shopCacheHeaders(headers: Headers) {
  headers.set('Cache-Control', 'public, max-age=0, s-maxage=20, stale-while-revalidate=120');
}

export const PHOTO_FALLBACK = '/images/placeholder/photo-coming.svg';
export const photo = (src?: string) => src || PHOTO_FALLBACK;
