// Plans and checkout links, as shown in the home page pricing section. Used by the sales chat
// (src/pages/chat-knowledge.json.ts); scripts/check-content.mjs checks the home page still matches.
export interface Plan {
  name: string;
  /** £, including VAT */
  price: number;
  per: 'month' | 'one-off';
  users?: number;
  points: string[];
  checkout: string;
}

export const PLANS: Plan[] = [
  { name: 'Starter', price: 79, per: 'month', users: 10, checkout: 'https://buy.stripe.com/aFadR28IYdmH1Fea5N5sA07',
    points: ['Every feature in the app', 'Manager and worker logins', 'Optional onboarding call with us', 'Support from Dom or Matt'] },
  { name: 'Growth', price: 149, per: 'month', users: 25, checkout: 'https://buy.stripe.com/aFa28k8IYgyT5Vu6TB5sA05',
    points: ['Everything in Starter', 'For larger teams across more sites', 'Priority support, straight to Dom or Matt'] },
  { name: 'Enterprise', price: 299, per: 'month', users: 75, checkout: 'https://buy.stripe.com/eVqdR2cZedmH2Ji91J5sA09',
    points: ['Everything in Growth', 'For bigger firms running lots of sites', 'Priority support, straight to Dom or Matt'] },
  { name: 'White label add-on', price: 999, per: 'one-off', checkout: 'https://buy.stripe.com/7sY7sE4sIbez4Rq2Dl5sA08',
    points: ['On top of any monthly plan', 'Three 1-on-1 calls with Dom and Matt', 'Exclusive features built for your business', 'A fully customised app with your name on it'] },
];
