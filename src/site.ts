// Single source for site-wide values. Change them here, not in pages.
export const SITE = {
  name: 'Banksman',
  url: 'https://banksman.app',
  // The demo is unlocked by the four-field form on the home page, which leads to /thanks.html.
  demoUrl: '/#demo',
  appUrl: 'https://app.banksman.app/',
  phone: '07508 300353',
  phoneIntl: '+447508300353',
  email: 'dom@dm4u.ai',
  // The people visitors can speak to. The main phone and email above are Dom's.
  contacts: [
    { name: 'Dom', role: 'CEO', phone: '07508 300353', phoneIntl: '+447508300353', email: 'dom@dm4u.ai' },
    { name: 'Matt', role: 'CMO', phone: '07964 660071', phoneIntl: '+447964660071', email: 'matt@dm4u.ai' },
  ],
  // Google Calendar appointment schedule for onboarding calls. Paste the booking page link here.
  bookingUrl: 'https://calendar.app.google/dDXv4gbhPwr3VkBw9',
  // Social profiles. Paste each full profile link; an icon only shows in the footer once its link is filled in.
  social: {
    linkedin: 'https://www.linkedin.com/company/banksman-app',
    facebook: 'https://www.facebook.com/profile.php?id=61594741089239',
    instagram: 'https://www.instagram.com/banksman.app',
    tiktok: '',
  },
  realPeople: 'Speak to Dom or Matt: real people, no call centres.',
  // The "Ask about Banksman" chat (src/components/SalesChat.astro). While `live` is false it only
  // shows on a page opened with ?chat=1 (for testing on the live site); set it to true to launch.
  salesChat: {
    live: true,
    endpoint: 'https://jpujykkjrskihqskbovu.supabase.co/functions/v1/sales-chat',
  },
  company: 'DM.AI 4U Ltd',
  locale: 'en_GB',
};
