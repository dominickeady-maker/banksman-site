// Other products we sometimes mention. Any blog post that names one of them automatically gets
// the comparison disclaimer at the bottom (see src/layouts/BlogPost.astro). Add new names here.
export const COMPETITORS = [
  'Fieldwire', 'JobTread', 'Procore', 'Buildertrend', 'CoConstruct', 'ConstructionOnline',
  'Contractor Foreman', 'Fergus', 'Tradify', 'simPRO', 'ServiceM8', 'Raken', 'Autodesk Build',
  'PlanRadar', 'Sitemate', 'Dashpivot', 'Joist', 'Houzz Pro', 'Monday.com', 'Trello', 'Asana',
];

// Everyday tools we compare against. Posts naming these get a short trademark note.
export const EVERYDAY_TOOLS = ['WhatsApp', 'Excel', 'Google Sheets'];

const mentioned = (text: string, names: string[]) =>
  names.filter((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text));

export const competitorsIn = (text: string) => mentioned(text, COMPETITORS);
export const toolsIn = (text: string) => mentioned(text, EVERYDAY_TOOLS);

/** "A and B", "A, B and C" */
export const listNames = (names: string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
