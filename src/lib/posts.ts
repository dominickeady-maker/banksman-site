import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// A post with a publish date in the future is scheduled: it stays off the live site until that
// day's build. A daily rebuild (netlify/functions/scheduled-publish.mjs) picks it up.
export const isScheduled = (post: Post) => post.data.pubDate.getTime() > Date.now();

// Drafts and scheduled posts are visible in `npm run dev` and never built for production.
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || (!data.draft && data.pubDate.getTime() <= Date.now()));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;
export const shareImageUrl = (post: Post) => post.data.image ?? `/og/${post.id}.png`;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const coverUrl = (post: Post) => post.data.cover ?? `/assets/blog/${post.id}.webp`;
export const coverAlt = (post: Post) => post.data.coverAlt ?? post.data.title;
