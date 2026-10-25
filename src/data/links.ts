// Internal linking map. Keeps related pages pointing at each other so search engines find and
// understand every page (and visitors find the next useful thing). Only links to pages that exist:
// draft or scheduled posts are filtered out wherever these are used.

/** Blog post slug → the trade pages it's most useful for (first = most relevant). */
export const POST_TRADES: Record<string, string[]> = {
  'banksman-vs-fieldwire': ['builders', 'subcontractors', 'fit-out-contractors'],
  'construction-site-management-software-small-builders-uk': ['builders', 'bricklayers', 'joiners', 'roofers'],
  'daywork-vs-price-work': ['bricklayers', 'groundworkers', 'scaffolders', 'joiners', 'subcontractors'],
  'get-your-building-site-off-whatsapp': ['builders', 'roofers', 'electricians', 'plumbers'],
  'what-is-a-construction-site-diary-app': ['builders', 'groundworkers', 'steel-erectors', 'fit-out-contractors'],
  'whatsapp-groups-liability-construction-site': ['groundworkers', 'electricians', 'window-fitters', 'worktop-fitters'],
  'construction-management-software-cost-uk': ['builders', 'subcontractors', 'fit-out-contractors'],
  'fieldwire-jobtread-alternatives': ['builders', 'subcontractors', 'steel-erectors'],
  'stop-losing-drawing-revisions-on-site': ['electricians', 'joiners', 'worktop-fitters', 'window-fitters', 'plumbers'],
};

/** Blog post slug → free tools worth pointing to from it. */
export const POST_TOOLS: Record<string, string[]> = {
  'daywork-vs-price-work': ['/tools/day-rate-calculator/', '/tools/cis-calculator/'],
  'construction-management-software-cost-uk': ['/tools/day-rate-calculator/'],
  'banksman-vs-fieldwire': [],
};

export const TOOLS = [
  { href: '/tools/day-rate-calculator/', name: 'Day rate calculator', blurb: 'Work out a fair day rate from what you need to earn.' },
  { href: '/tools/cis-calculator/', name: 'CIS calculator', blurb: 'See what comes off a payment under CIS.' },
];

/** Trade slug → posts for that trade, most relevant first. */
export const tradePosts = (trade: string) =>
  Object.entries(POST_TRADES)
    .filter(([, trades]) => trades.includes(trade))
    .sort((a, b) => a[1].indexOf(trade) - b[1].indexOf(trade))
    .map(([slug]) => slug);
