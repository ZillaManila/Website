// Serves the owner portal only at the secret ADMIN_PATH, and only after sign-in.
// The portal's pages live under /admin internally; that path itself is never reachable.
import { defineMiddleware } from 'astro:middleware';
import { hasSession, portalConfig } from './lib/auth';

async function notFound(next: (path?: string) => Promise<Response>) {
  const page = await next('/404');
  return new Response(page.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) return next();
  const { pathname, search } = ctx.url;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) return notFound(next);

  const cfg = portalConfig();
  if (!cfg) return next();
  const base = `/${cfg.path}`;
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return next();

  const rest = pathname.slice(base.length).replace(/\/$/, '') || '';
  ctx.locals.adminBase = base;
  const isApi = rest.startsWith('/api/');
  const isLogin = rest === '/login' || rest === '/api/login';

  if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
    const origin = ctx.request.headers.get('origin');
    if (!origin || origin !== ctx.url.origin) return new Response('Forbidden', { status: 403 });
  }

  if (!isLogin && !hasSession(ctx.cookies, cfg.password)) {
    if (isApi) return Response.json({ error: 'Please sign in again.' }, { status: 401 });
    return ctx.redirect(`${base}/login`);
  }

  const res = await next(`/admin${rest}${search}`);
  const headers = new Headers(res.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Referrer-Policy', 'same-origin');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
});
