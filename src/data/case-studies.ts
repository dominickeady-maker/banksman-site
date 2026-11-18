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

// DRAFT: Jamie's answers below were written from Matt's brief. Jamie and SB Homes must approve
// every quote (and the use of their photos) before this goes live.
export const SB_HOMES: CaseStudy = {
  slug: 'sb-homes',
  client: 'SB Homes Ltd',
  shortName: 'SB Homes',
  website: 'https://sbhomes.co.uk/',
  cover: '/assets/case-studies/sb-homes/stone-new-build.webp',
  coverAlt: 'Finished stone new build home with a landscaped garden, built by SB Homes in the Colne Valley',
  place: 'Colne Valley, Huddersfield',
  work: 'Family housebuilder: characterful, energy efficient new homes and the renovation of old mills and buildings',
  years: 'Building since 1997',
  person: { name: 'Jamie', role: 'Site manager, SB Homes' },
  published: '2026-11-09',
  updated: '2026-11-09',
  headline: 'SB Homes: how a Colne Valley housebuilder keeps a big team and several developments organised on Banksman',
  summary:
    'SB Homes is a family housebuilder in the Colne Valley, Huddersfield, building since 1997 with more than 500 homes completed and a team of over 35 people. Site manager Jamie runs its developments on Banksman. The biggest changes are money saved, from fewer wasted orders and hours that can be checked against each site, and a big team that is organised across several developments at once: who is on which site, what they are doing and what has been ordered, all on one screen.',
  quotes: {
    expensive: { text: 'When you’ve got a big team across a few sites, small mistakes get expensive fast. Banksman catches them before they cost us.', featured: true },
    whoswhere: { text: 'I can see who’s on which site and what they’re doing without picking up the phone.' },
    onescreen: { text: 'Every development is on one screen. I know where we’re up to before I’ve even left the house.' },
    subbies: { text: 'The subbies sign in, sign the RAMS and submit their price work on their phones. It’s all there when I need it.' },
  },
  quickAnswers: [
    {
      q: 'Who are SB Homes?',
      a: 'SB Homes Ltd is a family housebuilder based in the Colne Valley, Huddersfield, and part of the Byram Property Group. It has been building since 1997, has completed more than 500 homes and employs a team of over 35 people.',
    },
    {
      q: 'Does SB Homes use Banksman?',
      a: 'Yes. SB Homes runs its developments on Banksman, managed day to day by site manager Jamie.',
    },
    {
      q: 'How has Banksman saved SB Homes money?',
      a: 'By cutting the small, repeated costs of a big team: materials ordered twice or not at all, hours that couldn’t be checked against a site, and time spent ringing round and driving between developments to find out where things were.',
    },
    {
      q: 'How does SB Homes organise a big team across several sites?',
      a: 'Everyone signs in on site with a QR code, so Jamie can see who is on which development. Tasks are set per site, material orders are approved before they are placed, and subcontractors sign RAMS and submit price work on their phones.',
    },
  ],
};

export const CASE_STUDIES: CaseStudy[] = [CORNERSTONE, SB_HOMES];

export const casePath = (c: CaseStudy) => `/case-studies/${c.slug}/`;
