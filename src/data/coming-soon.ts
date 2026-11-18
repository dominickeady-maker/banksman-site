// What's on the way, for the home page section, /coming-soon/ and the sales chat.
// Everything here is "Coming soon": no dates, nothing described as available. When something ships,
// take it out of here (and add it to features.ts as 'live').
// Rules: say "team", not "crew"; name no suppliers ("trade suppliers"); Xero and QuickBooks as text only.
import type { FeatureId } from './features';

export interface SoonGroup {
  id: string;
  title: string;
  /** Stroke icon paths (24×24, like the features icons) */
  icon: string;
  points: string[];
}

export const COMING_SOON_INTRO =
  "Built by a builder, and we're not stopping. Join now on the 14-day free trial and get most new features as they land, at no extra cost on your plan.";

/** Shown under the groups, so the "no extra cost" line stays honest. */
export const COMING_SOON_NOTE =
  'A few bigger tools, like the AI materials and pricing calculator, may be a paid add-on. If so, we’ll say before they launch.';

export const COMING_SOON: SoonGroup[] = [
  {
    id: 'paid',
    title: 'Get paid faster',
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/>',
    points: [
      'Quotes to invoices in one tap, paid by card or bank transfer',
      'Sync with your accounting software: Xero and QuickBooks',
      'CIS deductions and subbie statements',
      'Extras and variations signed off by your client',
      'Valuations and retentions',
      'Live profit on every job',
    ],
  },
  {
    id: 'ai',
    title: 'AI tools',
    icon: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>',
    points: [
      'AI materials and pricing calculator: quantities, supplier prices and labour from a drawing or a description',
      'Order materials from trade suppliers',
      'Voice notes turned into tasks',
      'An automatic site diary',
      'AI drafts of your RAMS',
      'Photo snagging',
    ],
  },
  {
    id: 'plan',
    title: 'Plan the job',
    icon: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M7 13h6M7 17h9"/>',
    points: [
      'A Gantt chart view of the programme for every site',
      'Google and Outlook calendar sync',
      'Send quotes and invoices by email from the app',
    ],
  },
  {
    id: 'uk',
    title: 'Built for UK sites',
    icon: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    points: [
      'A client portal under your own brand',
      'CSCS and CPCS card expiry alerts',
      'Plant and hire tracker',
      'Works with no signal',
    ],
  },
];

/** Smaller things also on the way (features.ts 'coming-soon' items the groups above don't already cover). */
export const ALSO_ON_THE_WAY: FeatureId[] = ['cisInvoices', 'siteLeads', 'materialUrgency'];

export const FEATURE_IDEA_MAILTO = 'mailto:dom@dm4u.ai?subject=' + encodeURIComponent('Banksman feature idea');
export const voteMailto = (title: string) =>
  'mailto:dom@dm4u.ai?subject=' + encodeURIComponent(`Vote for what's next: ${title}`) +
  '&body=' + encodeURIComponent(`I'd like "${title}" next, because:\n\n`);
