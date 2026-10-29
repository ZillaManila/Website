// Database connection.
// - Production: Postgres via DATABASE_URL / POSTGRES_URL (e.g. Neon from the Vercel Marketplace).
// - Local development without a database URL: an embedded Postgres (PGlite) stored in .data/.
// - Deployed without a database: null, and the shop falls back to read-only seed data.
import { env, onVercel } from './env';

export type Row = Record<string, unknown>;
export interface Db {
  kind: 'postgres' | 'local';
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>;
}

let dbPromise: Promise<Db | null> | undefined;

async function connect(): Promise<Db | null> {
  const url = env('DATABASE_URL') || env('POSTGRES_URL');
  if (url) {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    return { kind: 'postgres', query: (text, params = []) => sql.query(text, params) as never };
  }
  if (onVercel) return null;
  // A runtime-built specifier keeps the dev-only embedded database out of the deployed bundle.
  const mod = process.env.PGLITE_MODULE || ['@electric-sql', 'pglite'].join('/');
  const { PGlite } = await import(/* @vite-ignore */ mod);
  const { mkdirSync } = await import('node:fs');
  mkdirSync('.data', { recursive: true });
  const pg = new PGlite('.data/pglite');
  return { kind: 'local', query: async (text, params = []) => (await pg.query(text, params)).rows };
}

export function getDb(): Promise<Db | null> {
  dbPromise ??= connect().catch((err) => {
    dbPromise = undefined;
    throw err;
  });
  return dbPromise;
}
