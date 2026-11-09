// The website's forms ask this before sending: "is this email real enough to reply to?"
// POST /.netlify/functions/check-email with {"email": "..."} → {"ok": true} or
// {"ok": false, "reason": "...", "message": "...", "suggestion"?: "..."}.
// The rules live in netlify/lib/email-check.mjs. submission-created.mjs runs the same check again
// on every submission, so turning off JavaScript doesn't get a fake address through.
import { checkEmail } from '../lib/email-check.mjs';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { ok: false, reason: 'method' });
  let email;
  try {
    ({ email } = await req.json());
  } catch {
    return json(400, { ok: false, reason: 'bad-request' });
  }
  if (typeof email !== 'string' || email.length > 320) return json(400, { ok: false, reason: 'bad-request' });
  return json(200, await checkEmail(email));
};
