// Plans and checkout links, as shown in the home page pricing section. Used by the sales chat
// (src/pages/chat-knowledge.json.ts); scripts/check-content.mjs checks the home page still matches.
export interface Plan {
  name: string;
  /** £ (Banksman isn't VAT registered: no VAT is charged) */
  price: number;
  per: 'month' | 'one-off';
  users?: number;
  points: string[];
  checkout: string;
}

export const PLANS: Plan[] = [
  { name: 'Starter', price: 89, per: 'month', users: 10, checkout: 'https://buy.stripe.com/fZu5kw3oE2I3fw4a5N5sA0b',
    points: ['14-day free trial', 'Every feature in the app', 'Manager and worker logins', 'Optional onboarding call with us', 'Support from Dom or Matt'] },
  { name: 'Growth', price: 149, per: 'month', users: 20, checkout: 'https://buy.stripe.com/aFa28k8IYgyT5Vu6TB5sA05',
    points: ['14-day free trial', 'Everything in Starter', 'For larger teams across more sites', 'Priority support, straight to Dom or Matt'] },
  { name: 'Enterprise', price: 299, per: 'month', users: 75, checkout: 'https://buy.stripe.com/eVqdR2cZedmH2Ji91J5sA09',
    points: ['14-day free trial', 'Everything in Growth', 'For bigger firms running lots of sites', 'Priority support, straight to Dom or Matt'] },
  { name: 'White label add-on', price: 999, per: 'one-off', checkout: 'https://buy.stripe.com/7sY7sE4sIbez4Rq2Dl5sA08',
    points: ['On top of any monthly plan', 'Three 1-on-1 calls with Dom and Matt', 'Exclusive features built for your business', 'A fully customised app with your name on it'] },
];
