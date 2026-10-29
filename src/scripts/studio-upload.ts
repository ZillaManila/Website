// Shrinks a photo in the browser (longest side 2000px, WebP) and uploads it.
const MAX_SIDE = 2000;

async function shrink(file: File): Promise<Blob> {
  if (file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.86));
    if (blob && blob.type === 'image/webp') return blob;
    return (await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.88))) || file;
  } catch {
    return file;
  }
}

export async function uploadPhoto(base: string, file: File): Promise<string> {
  const blob = await shrink(file);
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : file.name.split('.').pop();
  const name = `${file.name.replace(/\.[^.]+$/, '')}.${ext}`;
  const body = new FormData();
  body.append('file', new File([blob], name, { type: blob.type || file.type }));
  const res = await fetch(`${base}/api/upload`, { method: 'POST', body });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed. Please try again.');
  return data.url;
}

export function toast(text: string, tone: 'ok' | 'error' = 'ok') {
  window.dispatchEvent(new CustomEvent('studio:toast', { detail: { text, tone } }));
}
