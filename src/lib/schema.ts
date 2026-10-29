import { z } from 'astro/zod';
import type { Product } from './types';

const money = z.coerce.number().min(0).max(100000);
const rating = z.coerce.number().int().min(1).max(5);
const imageUrl = z.string().trim().max(1000).refine((v) => v === '' || v.startsWith('/') || /^https:\/\//.test(v), 'Image must be an uploaded file or https link');

export const productSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and dashes').max(80),
  name: z.string().trim().min(1, 'Name is required').max(120),
  tagline: z.string().trim().max(240).default(''),
  category: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and dashes').max(40),
  size: z.string().trim().max(40).default(''),
  sizeLabel: z.string().trim().max(60).default(''),
  price: money,
  priceFrom: z.boolean().default(false),
  shipping: money.optional(),
  specialOrder: z.boolean().default(false),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(100),
  kind: z.enum(['gummikin', 'keychain', 'nest', 'blanket', 'none']).default('none'),
  materials: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  feel: z.object({
    softness: rating,
    squish: rating,
    weight: rating,
    texture: z.string().trim().max(400).default(''),
    notes: z.string().trim().max(600).default(''),
  }),
  care: z.string().trim().max(600).default(''),
  options: z
    .array(z.object({ label: z.string().trim().min(1).max(80), price: money, shipping: money }))
    .max(10)
    .optional()
    .transform((v) => (v && v.length ? v : undefined)),
  colors: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Each color needs a name').max(40),
        key: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).max(40),
        hex: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a color'),
        stock: z.coerce.number().int().min(0).max(9999),
        image: imageUrl,
      })
    )
    .min(1, 'Add at least one color')
    .max(30),
  gallery: z.array(imageUrl).max(20).default([]),
  description: z.string().max(10000).default(''),
});

export function parseProduct(input: unknown): { ok: true; product: Product } | { ok: false; errors: string[] } {
  const r = productSchema.safeParse(input);
  if (r.success) {
    const keys = new Set<string>();
    for (const c of r.data.colors) {
      if (keys.has(c.key)) return { ok: false, errors: [`Two colors share the name "${c.name}"`] };
      keys.add(c.key);
    }
    return { ok: true, product: r.data as Product };
  }
  return { ok: false, errors: r.error.issues.map((i) => `${i.path.join(' › ') || 'Product'}: ${i.message}`) };
}
