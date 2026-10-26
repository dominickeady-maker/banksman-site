// Runs automatically every time Netlify receives a form submission (Netlify's "submission-created" event).
// 1. Every form: anything that looks like a bot (hidden field filled in, or sent within 2 seconds of the
//    page loading) is marked as spam and deleted, so it never reaches the CRM.
// 2. The Support form: each genuine message is filed in Supabase (the DM4U-CRM project).
//   Feature suggestions → feature_suggestions table (the ideas list for app updates)
//   Everything else      → support_tickets table (status: new / in_progress / done)
// 3. The sales chat's "Pass your details on" form (chat-lead): filed in the sales_leads table
//    (DM4U-CRM) with the chat transcript. See supabase/SALES_CHAT_SETUP.md.
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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Insert one row into a DM4U-CRM table with the service role. Returns an error message, or null.
async function insertRow(table, row) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set';
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
  return res.ok ? null : `insert into ${table} failed: ${res.status} ${await res.text()}`;
}

// A lead from the sales chat: name and a valid email are required (the form asks for both).
async function saveChatLead(payload) {
  const d = payload.data || {};
  if (!clean(d.name) || !clean(d.email) || !EMAIL.test(d.email.trim())) {
    await binSpam(payload.id);
    return reply(200, 'Incomplete, removed');
  }
  const failed = await insertRow('sales_leads', {
    netlify_submission_id: payload.id || null,
    name: clean(d.name, 120),
    business: clean(d.business, 160),
    email: clean(d.email, 254),
    phone: clean(d.phone, 40),
    transcript: clean(d.transcript, 20000),
    page: clean(d.page, 300),
    source: 'banksman.app/chat',
  });
  if (failed) {
    console.error(`Chat lead: ${failed}. It was only emailed.`);
    return reply(200, 'Saved by email only');
  }
  return reply(200, 'Saved');
}

// The submission as Netlify holds it (audit 25/10/2026, L6): act on Netlify's own copy, never on
// what the request says, so a forged call can't put junk in the CRM or get a real submission
// deleted as spam. Returns null when Netlify has no such submission.
async function verifiedSubmission(id) {
  const token = process.env.NETLIFY_API_TOKEN;
  if (!token) return undefined; // can't check without the token (see SUPPORT_SETUP.md)
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return null;
  const res = await fetch(`${NETLIFY_API}/submissions/${id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
  if (!res) throw new Error('Netlify API unreachable');
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Netlify API returned ${res.status}`);
  return res.json();
}

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body || '{}'));
  } catch {
    return reply(400, 'Bad request');
  }
  if (!payload) return reply(200, 'Ignored');
  try {
    const real = await verifiedSubmission(payload.id);
    if (real === null) {
      console.warn('submission-created: no such submission at Netlify, ignored', String(payload.id).slice(0, 40));
      return reply(200, 'Ignored: not a real submission');
    }
    if (real) payload = { ...payload, form_name: real.form_name ?? payload.form_name, data: real.data ?? {}, created_at: real.created_at ?? payload.created_at };
    else console.warn('submission-created: NETLIFY_API_TOKEN is not set, so the submission could not be checked with Netlify.');
  } catch (err) {
    console.error('submission-created: could not check the submission with Netlify:', err.message);
    return reply(500, 'Could not verify');
  }
  if (looksLikeSpam(payload.data, payload.created_at)) {
    await binSpam(payload.id);
    return reply(200, 'Spam removed');
  }
  if (payload.form_name === 'chat-lead') return saveChatLead(payload);
  if (payload.form_name !== 'support') return reply(200, 'Ignored');

  // The form requires name, email and a message. Anything arriving without them didn't come
  // through the page (browsers enforce required fields), so treat it as spam.
  const f = payload.data || {};
  const filled = (v) => typeof v === 'string' && v.trim().length > 0;
  if (!filled(f.first_name) || !filled(f.last_name) || !filled(f.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()) || !filled(f.message)) {
    await binSpam(payload.id);
    return reply(200, 'Incomplete, removed');
  }

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
