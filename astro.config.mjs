// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

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

// House style: no dashes in blog copy. Posts written in the CMS are tidied after the build,
// so an em or en dash becomes a comma (or "to" between numbers) without anyone having to remember.
/** @param {string} t */
const tidyDashes = (t) =>
  t
    .replace(/(\d)\s?[\u2013\u2014]\s?(£?\d)/g, '$1 to $2')
    .replace(/\s[\u2013\u2014]\s([^\u2013\u2014.!?<>]{1,70}?)\s[\u2013\u2014]\s/g, ', $1, ')
    .replace(/\s?[\u2013\u2014]\s?/g, ', ');
/** @type {import('astro').AstroIntegration} */
const noDashesInPosts = {
  name: 'no-dashes-in-posts',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const blog = new URL('blog/', dir);
      for (const slug of readdirSync(blog, { withFileTypes: true })) {
        if (!slug.isDirectory()) continue;
        const file = new URL(`${slug.name}/index.html`, blog);
        try {
          const html = readFileSync(file, 'utf8');
          const out = tidyDashes(html);
          if (out !== html) writeFileSync(file, out);
        } catch {}
      }
    },
  },
};

// Speed: the shared stylesheet in public/assets is copied as written, so shrink it after the build.
// lightningcss already ships with Astro; if it's ever missing the file is simply left as it is.
/** @type {import('astro').AstroIntegration} */
const minifySiteCss = {
  name: 'minify-site-css',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const url = new URL('assets/site.css', dir);
      try {
        const { transform } = await import('lightningcss');
        const { code } = transform({ filename: 'site.css', code: readFileSync(url), minify: true });
        writeFileSync(url, code);
      } catch (e) {
        console.warn('minify-site-css: left site.css as it is', e);
      }
    },
  },
};

export default defineConfig({
  site: 'https://banksman.app',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    noDashesInPosts,
    minifySiteCss,
    sitemap({
      // The CMS and share images are not pages; the purchase page is noindex.
      filter: (page) => !page.includes('/admin/') && !page.includes('/og/') && !page.includes('/purchase-complete/') && !page.includes('/support/sent/') && !page.includes('/getting-started/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (postDates[path]) item.lastmod = new Date(postDates[path]).toISOString();
        return item;
      },
    }),
  ],
});
