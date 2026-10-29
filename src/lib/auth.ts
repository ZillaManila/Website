// Owner portal access: a secret URL plus a password.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { env, isProd } from './env';

export const COOKIE = 'gk_studio';
const MAX_AGE = 60 * 60 * 24 * 14; // two weeks

// Local development gets easy defaults; a deployed site needs both values set or the portal stays off.
export function portalConfig(): { path: string; password: string } | null {
  const path = env('ADMIN_PATH')?.replace(/^\/+|\/+$/g, '');
  const password = env('ADMIN_PASSWORD');
  if (path && password) return { path, password };
  if (!isProd) return { path: path || 'studio', password: password || 'gummikins' };
  return null;
}

function secret(password: string) {
  // Changing the password signs everyone out.
  return createHash('sha256').update(`${env('SESSION_SECRET') || ''}:${password}:gummikins-studio`).digest();
}

function sign(value: string, password: string) {
  return createHmac('sha256', secret(password)).update(value).digest('base64url');
}

export function passwordMatches(attempt: string, password: string) {
  const a = createHash('sha256').update(attempt).digest();
  const b = createHash('sha256').update(password).digest();
  return timingSafeEqual(a, b);
}

export function startSession(cookies: AstroCookies, password: string) {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const value = `${expires}.${sign(String(expires), password)}`;
  cookies.set(COOKIE, value, { httpOnly: true, secure: isProd, sameSite: 'strict', path: '/', maxAge: MAX_AGE });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export function hasSession(cookies: AstroCookies, password: string) {
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(exp, password));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
