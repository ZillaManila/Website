import type { APIRoute } from 'astro';
import { ReadOnlyError, setStock } from '../../../lib/store';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug, key, stock } = (await request.json()) as { slug?: string; key?: string; stock?: number };
    const n = Number(stock);
    if (!slug || !key || !Number.isInteger(n) || n < 0 || n > 9999) {
      return Response.json({ ok: false, error: 'Stock must be a whole number from 0 to 9999.' }, { status: 400 });
    }
    const product = await setStock(slug, key, n);
    return Response.json({ ok: true, colors: product.colors });
  } catch (err) {
    const status = err instanceof ReadOnlyError ? 503 : 400;
    return Response.json({ ok: false, error: err instanceof Error ? err.message : 'Could not save.' }, { status });
  }
};
