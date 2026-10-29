import type { APIRoute } from 'astro';
import { passwordMatches, portalConfig, startSession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const cfg = portalConfig();
  const base = locals.adminBase || '';
  if (!cfg) return new Response('Not found', { status: 404 });
  const form = await request.formData();
  const attempt = String(form.get('password') || '');
  if (attempt && passwordMatches(attempt, cfg.password)) {
    startSession(cookies, cfg.password);
    return redirect(base, 303);
  }
  // Slow down guessing.
  await new Promise((r) => setTimeout(r, 800));
  return redirect(`${base}/login?error=1`, 303);
};
