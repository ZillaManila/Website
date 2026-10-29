// Image uploads: Vercel Blob in production, public/uploads when developing locally.
import { env, onVercel } from './env';

const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif' };
// Vercel functions accept bodies up to ~4.5 MB; the portal shrinks photos before upload.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function uploadsEnabled() {
  return !!env('BLOB_READ_WRITE_TOKEN') || !onVercel;
}

export async function saveImage(file: File): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new Error('Please upload a JPG, PNG, WebP, AVIF, or GIF image.');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('That photo is too large. Please try a smaller one.');
  const base = (file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'photo').slice(0, 40);
  const name = `${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const token = env('BLOB_READ_WRITE_TOKEN');
  if (token) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`products/${name}`, file, { access: 'public', contentType: file.type, token });
    return blob.url;
  }
  if (onVercel) throw new Error('Photo storage is not connected yet. Add Vercel Blob to the project.');
  const { mkdir, writeFile } = await import('node:fs/promises');
  await mkdir('public/uploads', { recursive: true });
  await writeFile(`public/uploads/${name}`, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
