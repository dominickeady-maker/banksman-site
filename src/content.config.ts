import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(10).max(90),
    description: z.string().min(50).max(170),
    // Optional shorter title for Google's results (about 60 characters). The H1 still uses `title`.
    seoTitle: z.string().min(10).max(60).optional(),
    keyword: z.string().min(3),
    author: z.string().default('Banksman'),
    category: z.string().default('Site management'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    // Card and header picture (1200×675). Falls back to /assets/blog/<slug>.webp.
    cover: z.string().optional(),
    // Describes the picture for screen readers and Google Images. Required whenever a cover is set.
    coverAlt: z.string().min(10).max(160).optional(),
    imageAlt: z.string().optional(),
    faq: z
      .array(z.object({ question: z.string().min(5), answer: z.string().min(5) }))
      .default([]),
  }),
});

export const collections = { blog };
