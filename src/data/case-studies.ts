// Customer case studies. One source for the case study pages, the case studies list, the homepage
// quote banner and the sales chat, so a quote reads the same everywhere it appears.
// Quotes are the customer's own words: don't edit them without checking with the customer.

export interface CaseQuote {
  text: string;
  featured?: boolean;
}

export interface CaseStudy {
  slug: string;
  client: string;
  shortName: string;
  website: string;
  cover: string;
  coverAlt: string;
  place: string;
  work: string;
  years: string;
  person: { name: string; role: string };
  published: string;
  updated: string;
  headline: string;
  summary: string;
  quotes: Record<string, CaseQuote>;
  quickAnswers: { q: string; a: string }[];
}

export const CORNERSTONE: CaseStudy = {
  slug: 'cornerstone-developments',
  client: 'Cornerstone Developments Ltd',
  shortName: 'Cornerstone Developments',
  website: 'https://cornerstonesdevelopments.com/',
  cover: '/assets/case-studies/cornerstone/detached-new-build.webp',
  coverAlt: 'Finished stone detached new build with a block paved drive, built by Cornerstone Developments',
  place: 'Huddersfield, West Yorkshire',
  work: 'New builds, extensions, renovations, retaining walls, foundations and hard landscaping',
  years: '20+ years',
  person: { name: 'Dom Keady', role: 'Runs Cornerstone Developments and founded Banksman' },
  published: '2026-11-09',
  updated: '2026-11-09',
  headline: 'Cornerstone Developments: how a Huddersfield builder runs every site on Banksman',
  summary:
    'Cornerstone Developments is a Huddersfield building firm with over 20 years in the trade, run by Banksman founder Dom Keady. Every Cornerstone job runs on Banksman. The biggest change Dom has seen is the money saved, from fewer double orders, hours that can be checked and less driving between sites. The team is paid from approved timesheets, every site’s progress is on one screen, and material orders are requested in the app and approved before they are placed.',
  quotes: {
    leaks: { text: 'It’s not one big thing. It’s lots of little leaks plugged, and over a year that adds up to a lot of money.', featured: true },
    trust: { text: 'If I’m asking other builders to trust their sites to Banksman, I should be trusting mine to it first.' },
    agreed: { text: 'There’s no arguing about what was agreed, because it’s right there.' },
    office: { text: 'It’s all tracked, so I can sit in the office and get the paperwork done without worrying about what’s happening on site.' },
    phones: { text: 'No more constant phone calls, no more missed WhatsApp messages. It’s all in one place.' },
  },
  quickAnswers: [
    {
      q: 'Who are Cornerstone Developments?',
      a: 'Cornerstone Developments Ltd is a building firm based in Huddersfield, West Yorkshire, with over 20 years in the trade. It builds new homes and multi-plot and commercial developments, and does extensions, renovations, retaining walls, foundations and hard landscaping.',
    },
    {
      q: 'Does Cornerstone Developments use Banksman?',
      a: 'Yes. Every Cornerstone Developments job runs on Banksman. The firm is run by Dom Keady, who founded Banksman, so it was the first firm to use the app day to day.',
    },
    {
      q: 'What has Banksman changed for Cornerstone Developments?',
      a: 'The main change is money saved: no materials ordered twice, hours that can be checked against the job and fewer trips between sites. Paying the team is quicker because hours and price work are approved in the app, every site’s progress is on one screen, and Dom can work in the office knowing the team’s sign ins and hours are tracked.',
    },
    {
      q: 'How do material orders work for Cornerstone Developments?',
      a: 'The team raises a material order in Banksman, Dom approves it and places the order, and everyone can see when it is due. Nothing is ordered without a manager’s approval, which replaced phone calls and WhatsApp messages.',
    },
  ],
};

export const CASE_STUDIES: CaseStudy[] = [CORNERSTONE];

export const casePath = (c: CaseStudy) => `/case-studies/${c.slug}/`;
