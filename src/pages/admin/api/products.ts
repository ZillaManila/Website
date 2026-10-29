import type { APIRoute } from 'astro';
import { parseProduct } from '../../../lib/schema';
import { deleteProduct, ReadOnlyError, saveProduct } from '../../../lib/store';

export const prerender = false;

const fail = (status: number, errors: string[]) => Response.json({ ok: false, errors }, { status });

export const POST: APIRoute = async ({ request }) => {
  let body: { action?: string; slug?: string; previousSlug?: string; product?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail(400, ['Something went wrong sending the form. Please try again.']);
  }

  try {
    if (body.action === 'delete') {
      if (!body.slug) return fail(400, ['Missing product.']);
      await deleteProduct(body.slug);
      return Response.json({ ok: true });
    }
    const parsed = parseProduct(body.product);
    if (!parsed.ok) return fail(422, parsed.errors);
    const result = await saveProduct(parsed.product, body.previousSlug || undefined);
    return Response.json({ ok: true, result, slug: parsed.product.slug });
  } catch (err) {
    if (err instanceof ReadOnlyError) return fail(503, [err.message]);
    const message = err instanceof Error ? err.message : 'Could not save.';
    console.error('product save failed', err);
    return fail(400, [message]);
  }
};
