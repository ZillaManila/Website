import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Products live in the database and are managed from the owner portal (see src/lib/store.ts).

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

export const collections = { blog };
