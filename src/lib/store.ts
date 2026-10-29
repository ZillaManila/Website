// Product storage. Every product is one row holding its JSON document.
import { getDb, type Db } from './db';
import type { Product } from './types';
import seed from '../data/seed-products.json';

const seedProducts = (seed as unknown as Partial<Product>[]).map(normalize);

function normalize(p: Partial<Product>): Product {
  return {
    priceFrom: false,
    specialOrder: false,
    featured: false,
    published: true,
    order: 100,
    kind: 'none',
    materials: [],
    care: '',
    gallery: [],
    description: '',
    tagline: '',
    size: '',
    sizeLabel: '',
    ...p,
  } as Product;
}

let ready: Promise<Db | null> | undefined;

async function db(): Promise<Db | null> {
  ready ??= (async () => {
    const d = await getDb();
    if (!d) return null;
    await d.query(`CREATE TABLE IF NOT EXISTS products (
      slug text PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    const [{ n }] = await d.query<{ n: number }>('SELECT count(*)::int AS n FROM products');
    if (n === 0) {
      for (const p of seedProducts) {
        await d.query('INSERT INTO products (slug, data) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING', [p.slug, JSON.stringify(p)]);
      }
    }
    return d;
  })().catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}

export class ReadOnlyError extends Error {
  constructor() {
    super('No database is connected, so changes cannot be saved yet.');
  }
}

export async function storageStatus(): Promise<'postgres' | 'local' | 'none'> {
  const d = await db();
  return d ? d.kind : 'none';
}

const byOrder = (a: Product, b: Product) => a.order - b.order || a.name.localeCompare(b.name);

export async function listProducts({ includeHidden = false } = {}): Promise<Product[]> {
  const d = await db();
  const all = d ? (await d.query<{ data: Product }>('SELECT data FROM products')).map((r) => normalize(r.data)) : seedProducts;
  return all.filter((p) => includeHidden || p.published).sort(byOrder);
}

export async function getProduct(slug: string, { includeHidden = false } = {}): Promise<Product | undefined> {
  const d = await db();
  const p = d
    ? (await d.query<{ data: Product }>('SELECT data FROM products WHERE slug = $1', [slug])).map((r) => normalize(r.data))[0]
    : seedProducts.find((x) => x.slug === slug);
  return p && (includeHidden || p.published) ? p : undefined;
}

export async function saveProduct(product: Product, previousSlug?: string): Promise<'created' | 'updated'> {
  const d = await db();
  if (!d) throw new ReadOnlyError();
  if (previousSlug && previousSlug !== product.slug) {
    const clash = await d.query('SELECT 1 FROM products WHERE slug = $1', [product.slug]);
    if (clash.length) throw new Error(`Another product already uses the link name "${product.slug}".`);
    await d.query('UPDATE products SET slug = $1, data = $2, updated_at = now() WHERE slug = $3', [product.slug, JSON.stringify(product), previousSlug]);
    return 'updated';
  }
  if (!previousSlug) {
    const clash = await d.query('SELECT 1 FROM products WHERE slug = $1', [product.slug]);
    if (clash.length) throw new Error(`Another product already uses the link name "${product.slug}".`);
  }
  const rows = await d.query<{ inserted: boolean }>(
    `INSERT INTO products (slug, data) VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
     RETURNING (xmax = 0) AS inserted`,
    [product.slug, JSON.stringify(product)]
  );
  return rows[0]?.inserted ? 'created' : 'updated';
}

export async function deleteProduct(slug: string) {
  const d = await db();
  if (!d) throw new ReadOnlyError();
  await d.query('DELETE FROM products WHERE slug = $1', [slug]);
}

// Set one color's stock without touching the rest of the product.
export async function setStock(slug: string, colorKey: string, stock: number): Promise<Product> {
  const d = await db();
  if (!d) throw new ReadOnlyError();
  const rows = await d.query<{ data: Product }>(
    `UPDATE products SET
       data = jsonb_set(data, '{colors}', (
         SELECT jsonb_agg(CASE WHEN c->>'key' = $2 THEN jsonb_set(c, '{stock}', to_jsonb($3::int)) ELSE c END ORDER BY i)
         FROM jsonb_array_elements(data->'colors') WITH ORDINALITY AS t(c, i)
       )),
       updated_at = now()
     WHERE slug = $1 AND data->'colors' @> jsonb_build_array(jsonb_build_object('key', $2::text))
     RETURNING data`,
    [slug, colorKey, stock]
  );
  if (!rows[0]) throw new Error('That product or color no longer exists.');
  return normalize(rows[0].data);
}
