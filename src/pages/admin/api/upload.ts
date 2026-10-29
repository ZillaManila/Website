import type { APIRoute } from 'astro';
import { saveImage } from '../../../lib/media';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || !file.size) return Response.json({ ok: false, error: 'Choose a photo first.' }, { status: 400 });
    const url = await saveImage(file);
    return Response.json({ ok: true, url });
  } catch (err) {
    console.error('upload failed', err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : 'Upload failed.' }, { status: 400 });
  }
};
