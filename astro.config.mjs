import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://gummikins.com',
  trailingSlash: 'ignore',
  // Static by default; the shop pages and the owner portal render on request.
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    ssr: { external: ['@electric-sql/pglite'] },
  },
});
