import { getCollection, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;

export async function getProducts() {
  const all = await getCollection('products');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function totalStock(p: Product) {
  return p.data.colors.reduce((n, c) => n + c.stock, 0);
}

export function availability(p: Product): { label: string; tone: 'ok' | 'low' | 'out' | 'special' } {
  if (p.data.specialOrder) return { label: 'Special order', tone: 'special' };
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
  return p.data.colors.find((c) => c.stock > 0) || p.data.colors[0];
}

export const usd = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

export function priceLabel(p: Product) {
  return `${p.data.priceFrom || p.data.options ? 'From ' : ''}${usd(p.data.price)}`;
}

export const categoryLabels: Record<string, string> = {
  gummikins: 'Gummikins',
  keychains: 'Keychains',
  blankets: 'Blankets & sensory',
};
