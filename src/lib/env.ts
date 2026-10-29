// Server-side env lookup that works in `astro dev` (.env) and on Vercel.
export function env(name: string): string | undefined {
  const v = process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
  return v && v.trim() ? v.trim() : undefined;
}

export const isProd = import.meta.env.PROD;
export const onVercel = !!process.env.VERCEL;
