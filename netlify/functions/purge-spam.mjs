// Clears the spam list for every form on banksman.app once a day, so spam never piles up.
// Netlify's own filters (the hidden honeypot field and its spam checker) put suspected spam in the
// spam list; this deletes it. Genuine submissions are never touched.
//
// Needs NETLIFY_API_TOKEN (a Netlify personal access token) in the site's environment variables.
// The site ID is provided by Netlify automatically; NETLIFY_SITE_ID can be set as a fallback.
const API = 'https://api.netlify.com/api/v1';

export default async () => {
  const token = process.env.NETLIFY_API_TOKEN;
  const site = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  if (!token || !site) {
    console.log('purge-spam: NETLIFY_API_TOKEN or the site ID is missing; nothing deleted.');
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };
  let deleted = 0;
  for (let round = 0; round < 20; round++) {
    const res = await fetch(`${API}/sites/${site}/submissions?state=spam&per_page=100`, { headers });
    if (!res.ok) { console.log(`purge-spam: could not list spam (${res.status}).`); break; }
    const spam = await res.json();
    if (!Array.isArray(spam) || spam.length === 0) break;
    for (const s of spam) {
      const del = await fetch(`${API}/submissions/${s.id}`, { method: 'DELETE', headers });
      if (del.ok) deleted++;
    }
  }
  console.log(`purge-spam: deleted ${deleted} spam submission(s).`);
};

// 03:17 UTC every day.
export const config = { schedule: '17 3 * * *' };
