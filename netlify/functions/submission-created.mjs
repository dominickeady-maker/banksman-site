// Runs automatically every time Netlify receives a form submission (Netlify's "submission-created" event).
// 1. Every form: anything that looks like a bot (hidden field filled in, or sent within 2 seconds of the
//    page loading) is marked as spam and deleted, so it never reaches the CRM.
// 2. The Support form: each genuine message is filed in Supabase (the DM4U-CRM project).
//   Feature suggestions → feature_suggestions table (the ideas list for app updates)
//   Everything else      → support_tickets table (status: new / in_progress / done)
// Email notifications to Dom and Matt are sent by Netlify Forms itself (set up in the Netlify UI).
//
// Environment variables in Netlify (Site configuration → Environment variables, scope: Functions):
//   SUPABASE_URL               e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  the service role key (server-side only, never in the website code)
//   NETLIFY_API_TOKEN          a Netlify personal access token, used to mark spam and delete it
// See supabase/SUPPORT_SETUP.md.

const REASONS = new Set(['bug_report', 'help_request', 'feature_suggestion', 'other']);
const clean = (v, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null;

const reply = (statusCode, body) => ({ statusCode, body });
const NETLIFY_API = 'https://api.netlify.com/api/v1';
const MIN_SECONDS = 2;

// True when the submission looks like it came from a bot.
export const looksLikeSpam = (data = {}, createdAt) => {
  if (typeof data.company_website === 'string' && data.company_website.trim()) return true;
  const started = Number(data.form_started);
  if (started > 0) {
    const sent = createdAt ? Date.parse(createdAt) : Date.now();
    if (Number.isFinite(sent) && (sent - started) / 1000 < MIN_SECONDS) return true;
  }
  return false;
};

// Mark as spam (so Netlify's filter learns from it), then delete it.
async function binSpam(id) {
  const token = process.env.NETLIFY_API_TOKEN;
  if (!token || !id) {
    console.warn('Spam detected but NETLIFY_API_TOKEN is not set, so it was not deleted.', id);
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };
  await fetch(`${NETLIFY_API}/submissions/${id}/spam`, { method: 'PUT', headers }).catch(() => {});
  const del = await fetch(`${NETLIFY_API}/submissions/${id}`, { method: 'DELETE', headers }).catch(() => null);
  console.log(`Spam submission ${id} ${del && del.ok ? 'deleted' : 'could not be deleted'}.`);
}

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body || '{}'));
  } catch {
    return reply(400, 'Bad request');
  }
  if (!payload) return reply(200, 'Ignored');
  if (looksLikeSpam(payload.data, payload.created_at)) {
    await binSpam(payload.id);
    return reply(200, 'Spam removed');
  }
  if (payload.form_name !== 'support') return reply(200, 'Ignored');

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Support form: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set, so this message was only emailed.');
    return reply(200, 'Not configured');
  }

  const d = payload.data || {};
  const reason = REASONS.has(d.reason) ? d.reason : 'other';
  const row = {
    netlify_submission_id: payload.id || null,
    first_name: clean(d.first_name, 120),
    last_name: clean(d.last_name, 120),
    email: clean(d.email, 254),
    account_number: clean(d.account_number, 60),
    message: clean(d.message),
    source: 'banksman.app/support',
  };
  const table = reason === 'feature_suggestion' ? 'feature_suggestions' : 'support_tickets';
  if (table === 'support_tickets') row.reason = reason;

  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}?on_conflict=netlify_submission_id`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal,resolution=ignore-duplicates',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error(`Support form: Supabase insert into ${table} failed`, res.status, await res.text());
    return reply(200, 'Saved by email only');
  }
  return reply(200, 'Saved');
};
