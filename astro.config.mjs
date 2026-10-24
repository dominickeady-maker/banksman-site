// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Last-modified dates for blog posts (updatedDate, or pubDate), so search engines know what's fresh.
const postDates = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(`./src/content/blog/${f}`, 'utf8').split('---')[1] ?? '';
      const date = fm.match(/^updatedDate:\s*['"]?([\d-]+)/m)?.[1] ?? fm.match(/^pubDate:\s*['"]?([\d-]+)/m)?.[1];
      return [`/blog/${f.replace(/\.md$/, '')}/`, date];
    })
    .filter(([, d]) => d),
);

export default defineConfig({
  site: 'https://banksman.app',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // The CMS and share images are not pages; the purchase page is noindex.
      filter: (page) => !page.includes('/admin/') && !page.includes('/og/') && !page.includes('/purchase-complete/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (postDates[path]) item.lastmod = new Date(postDates[path]).toISOString();
        return item;
      },
    }),
  ],
});
