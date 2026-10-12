import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One file per product in src/content/products. Each color is its own
// stock-tracked variant so sold-out colors show clearly in the shop.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    category: z.enum(['gummikins', 'keychains', 'blankets']),
    size: z.string(),
    sizeLabel: z.string(),
    price: z.number(),
    priceFrom: z.boolean().default(false),
    shipping: z.number().optional(),
    specialOrder: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    kind: z.enum(['gummikin', 'keychain', 'nest', 'blanket']),
    materials: z.array(z.string()),
    feel: z.object({
      softness: z.number().min(1).max(5),
      squish: z.number().min(1).max(5),
      weight: z.number().min(1).max(5),
      texture: z.string(),
      notes: z.string(),
    }),
    care: z.string(),
    options: z
      .array(z.object({ label: z.string(), price: z.number(), shipping: z.number() }))
      .optional(),
    colors: z.array(
      z.object({
        name: z.string(),
        key: z.string(),
        hex: z.string(),
        stock: z.number().int().min(0),
        image: z.string(),
        alt: z.string().optional(),
      })
    ),
    gallery: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

export const collections = { products, blog };
