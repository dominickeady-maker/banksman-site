// L6: submission-created acts on Netlify's own copy of a submission, not on what the request says.
// Netlify's API is stubbed; nothing leaves this machine. Run: node scripts/test-submission-created.mjs
const calls = [];
const REAL = {
  aaaaaaaaaaaaaaaaaaaaaaaa: { form_name: 'demo-access', data: { name: 'Real Person', email: 'real@test.local' }, created_at: '2026-10-01T10:00:00Z' },
  bbbbbbbbbbbbbbbbbbbbbbbb: { form_name: 'support', data: { first_name: 'Sam', last_name: 'Real', email: 'sam@test.local', message: 'Help', reason: 'help_request', form_started: '1' }, created_at: '2026-10-01T10:00:00Z' },
};
globalThis.fetch = async (url, opts = {}) => {
  calls.push(`${opts.method || 'GET'} ${url}`);
  const m = String(url).match(/submissions\/([^/]+)(\/spam)?$/);
  if (String(url).includes('boom')) return { ok: false, status: 503, json: async () => ({}) };
  if (m && !opts.method) return REAL[m[1]] ? { ok: true, status: 200, json: async () => REAL[m[1]] } : { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => ({}), text: async () => '' };
};
const { handler } = await import('../netlify/functions/submission-created.mjs');
let fails = 0; const check = (n, got, want) => { const ok = got === want; if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${ok ? '' : ` — got ${got} want ${want}`}`); };
const call = (payload) => handler({ body: JSON.stringify({ payload }) }).then((r) => `${r.statusCode} ${r.body}`);
process.env.NETLIFY_API_TOKEN = 'test-only';
delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;

check('forged id (Netlify has no such submission): ignored, nothing deleted', await call({ id: 'cccccccccccccccccccccccc', form_name: 'support', data: { company_website: 'x' } }), '200 Ignored: not a real submission');
check('…no spam/delete calls made for it', calls.filter((c) => c.startsWith('PUT') || c.startsWith('DELETE')).length, 0);
calls.length = 0;
check('real demo-access submission sent as "support" with junk: Netlify says demo-access → ignored', await call({ id: 'aaaaaaaaaaaaaaaaaaaaaaaa', form_name: 'support', data: { first_name: 'Junk', email: 'x@x.x', message: 'junk' } }), '200 Ignored');
check('real submission claimed as spam (honeypot in the forged body): not deleted', await call({ id: 'bbbbbbbbbbbbbbbbbbbbbbbb', form_name: 'support', data: { company_website: 'spam!' }, created_at: '2026-10-01T10:00:00Z' }), '200 Not configured');
check('…no spam/delete calls made', calls.filter((c) => c.startsWith('PUT') || c.startsWith('DELETE')).length, 0);
check('Netlify API down: 500 so Netlify retries', await call({ id: 'boomboomboomboom' }), '500 Could not verify');
delete process.env.NETLIFY_API_TOKEN;
check('no token: works as before (on the request body)', await call({ id: 'dddddddddddddddddddddddd', form_name: 'demo-access', data: {} }), '200 Ignored');
console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
