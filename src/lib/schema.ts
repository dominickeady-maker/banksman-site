import { SITE } from '../site';
import type { Post } from './posts';
import { postUrl, shareImageUrl, coverUrl } from './posts';

const abs = (path: string) => new URL(path, SITE.url).href;

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: abs('/assets/icon-512.png'),
};

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { '@id': organization['@id'] } },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

// Post authors are written as first names in the CMS; give search engines the full person.
const AUTHORS: Record<string, { name: string; jobTitle: string }> = {
  matt: { name: 'Matt Guille', jobTitle: 'CMO' },
  'matt guille': { name: 'Matt Guille', jobTitle: 'CMO' },
  dom: { name: 'Dom Keady', jobTitle: 'CEO & founder' },
  'dom keady': { name: 'Dom Keady', jobTitle: 'CEO & founder' },
};
export function authorPerson(author: string) {
  const known = AUTHORS[author.trim().toLowerCase()];
  return known
    ? { '@type': 'Person', name: known.name, jobTitle: known.jobTitle, url: abs('/meet-the-team/'), worksFor: { '@id': organization['@id'] } }
    : { '@type': 'Person', name: author };
}

export function blogPostingSchema(post: Post) {
  const { title, description, pubDate, updatedDate, author, keyword } = post.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    keywords: keyword,
    image: [abs(shareImageUrl(post)), abs(coverUrl(post))],
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: author === SITE.name ? { '@id': organization['@id'] } : authorPerson(author),
    publisher: organization,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(postUrl(post)) },
    inLanguage: 'en-GB',
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
