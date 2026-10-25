// What the sales chat knows about Banksman, built from the site's own data so the chat says
// what the site says. Read by the sales-chat function (buildflow-demo repo,
// supabase/functions/sales-chat). Only live features are described as available.
import type { APIRoute } from 'astro';
import { FEATURES, type FeatureId } from '../data/features';
import { FAQ } from '../data/faq';
import { PLANS } from '../data/plans';
import { TRADES } from '../data/trades';
import { SITE } from '../site';

export const prerender = true;

const ids = Object.keys(FEATURES) as FeatureId[];
const line = (id: FeatureId) => `- ${FEATURES[id].name}: ${FEATURES[id].summary}`;

export const knowledgeText = () => [
  `# Banksman`,
  `Construction site management software for small and mid-size UK building firms, built by Dom Keady, a bricklayer who runs his own building firm in Huddersfield. A product of ${SITE.company}. It runs in the browser and installs to the phone's home screen like an app (no app store). Managers and workers each get their own login.`,
  ``,
  `## Live features (in the app now)`,
  ...ids.filter((id) => FEATURES[id].status === 'live').map(line),
  ``,
  `## Coming soon (not in the app yet, no dates)`,
  ...ids.filter((id) => FEATURES[id].status === 'coming-soon').map(line),
  ``,
  `## Plans (all prices include VAT, no contract, cancel any time, every plan has every feature)`,
  ...PLANS.map((p) => `- ${p.name}: £${p.price} ${p.per === 'month' ? 'a month' : 'one-off'}${p.users ? `, up to ${p.users} users` : ''}. ${p.points.join('. ')}. Buy: ${p.checkout}`),
  `- Not sure which? It's usually Starter. Plans and details: ${SITE.url}/#pricing`,
  ``,
  `## Questions people ask`,
  ...FAQ.map(({ q, a }) => `Q: ${q}\nA: ${a}`),
  ``,
  `## Links`,
  `- Live demo (the real app on realistic sample data, four fields, no card, no sales call): ${SITE.url}/#demo`,
  `- Book a call with Dom or Matt: ${SITE.bookingUrl}`,
  `- Support for existing customers (bug, help, feature idea): ${SITE.url}/support/`,
  `- Compare with spreadsheets and WhatsApp: ${SITE.url}/compare/`,
  `- What's new: ${SITE.url}/whats-new/`,
  `- Free tools: ${SITE.url}/tools/cis-calculator/ and ${SITE.url}/tools/day-rate-calculator/`,
  `- Pages for each trade: ${TRADES.map((t) => `${t.name} ${SITE.url}/for-${t.slug}/`).join(', ')}`,
  ``,
  `## Replying to greetings`,
  `The chat already opens with a hello. If the visitor just says hi, hello, hiya, alright or similar (again), don't reply with a bare greeting. Reply in one or two friendly sentences and nudge them on: suggest two or three things they could ask, for example what it costs, which plan suits their team size, or how to try the free demo.`,
  ``,
  `## People`,
  ...SITE.contacts.map((c) => `- ${c.name}, ${c.role}: ${c.phone}, ${c.email}`),
  `- Dom and Matt answer sales and support themselves, by phone or email.`,
].join('\n');

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ text: knowledgeText() }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
