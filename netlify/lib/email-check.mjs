// Checks that an email address is real enough to reply to, for the website's forms.
// Used by netlify/functions/check-email.mjs (the forms ask it before sending) and by
// netlify/functions/submission-created.mjs (which bins anything that slipped past).
//
// It can't prove a mailbox exists, but it stops the usual fakes:
//  1. it doesn't look like an email address;
//  2. throwaway inboxes (Mailinator, Temp Mail, 10 Minute Mail and the like);
//  3. made up or placeholder addresses (test@test.com, asdf@asdf.com, name@example.com);
//  4. a domain that can't receive email (no MX record, checked with a DNS lookup).
// Obvious typos of the big providers (gmial.com, hotmial.co.uk) get a "did you mean" instead.
import { promises as dns } from 'node:dns';

const SYNTAX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

// Throwaway inbox providers. Not every one in existence, but the ones people actually use.
export const DISPOSABLE = new Set(`
mailinator.com mailinator.net mailinator.org mailinator2.com notmailinator.com
guerrillamail.com guerrillamail.net guerrillamail.org guerrillamail.biz guerrillamail.de guerrillamailblock.com sharklasers.com grr.la pokemail.net spam4.me
10minutemail.com 10minutemail.net 10minutemail.co.uk 10minmail.com 20minutemail.com 30minutemail.com
temp-mail.org temp-mail.io tempmail.com tempmail.net tempmail.dev tempmailo.com tempmail.plus tempr.email tempinbox.com tempmailaddress.com temporary-mail.net
throwawaymail.com trashmail.com trashmail.de trashmail.net trash-mail.com mytrashmail.com
yopmail.com yopmail.net yopmail.fr cool.fr.nf jetable.fr.nf nospam.ze.tc
getnada.com nada.email dispostable.com mailnesia.com maildrop.cc mintemail.com mohmal.com
emailondeck.com fakeinbox.com fakemail.net fake-mail.net fakemailgenerator.com
mailcatch.com mailpoof.com mail-temp.com mailtemp.net burnermail.io spambox.us spamgourmet.com
getairmail.com airmail.cc moakt.com tmail.ws tmpmail.org tmpmail.net emailfake.com
inboxkitten.com mail.tm mailsac.com discard.email discardmail.com spambog.com
33mail.com anonaddy.me linshiyouxiang.net 1secmail.com 1secmail.org 1secmail.net
harakirimail.com incognitomail.org mailexpire.com meltmail.com mvrht.com
`.trim().split(/\s+/));

// Placeholder domains nobody really uses for mail.
const PLACEHOLDER_DOMAINS = new Set(`
example.com example.co.uk example.org example.net test.com test.co.uk testing.com domain.com email.test
fake.com fakeemail.com noemail.com nomail.com none.com nowhere.com abc.com xyz.com asdf.com qwerty.com
sample.com mysite.com website.com company.com yourcompany.com yourdomain.com mail.com.com
`.trim().split(/\s+/));

// Local parts that are almost always made up (only rejected when the domain is a free provider
// or a placeholder, so a real "test@yourfirm.co.uk" mailbox at a business still gets through).
const JUNK_LOCAL = /^(test|testing|tester|asdf\w*|qwerty\w*|fake\w*|noemail|nomail|none|no|na|n\/a|abc|abcd|abc123|xxx+|aaa+|zzz+|123+|1234\w*|blah\w*|hello|me|user|example|sample|spam|nobody|anon\w*)$/i;
const FREE_PROVIDERS = new Set('gmail.com googlemail.com hotmail.com hotmail.co.uk outlook.com outlook.co.uk live.com live.co.uk yahoo.com yahoo.co.uk icloud.com me.com aol.com aol.co.uk btinternet.com sky.com virginmedia.com talktalk.net protonmail.com proton.me gmx.com gmx.co.uk mail.com zoho.com'.split(' '));

// Typos of the big providers, with the fix.
const TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.co.uk': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmial.co.uk': 'hotmail.co.uk', 'hotmail.co': 'hotmail.co.uk', 'hotmail.couk': 'hotmail.co.uk',
  'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yahoo.couk': 'yahoo.co.uk', 'yaho.co.uk': 'yahoo.co.uk',
  'icloud.co': 'icloud.com', 'iclod.com': 'icloud.com', 'btinternet.co.uk': 'btinternet.com', 'btinterent.com': 'btinternet.com',
};

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), ms))]);

// DNS says this domain can't receive mail. Lookup failures that aren't a clear "no" (timeouts,
// server errors) count as fine, so a slow DNS server never blocks a real person.
async function cannotReceiveMail(domain, resolver = dns) {
  try {
    const mx = await withTimeout(resolver.resolveMx(domain), 3000);
    if (mx.length === 0) return true;
    // A "null MX" (a single record pointing at ".") means the domain accepts no mail at all.
    return mx.every((r) => !r.exchange || r.exchange === '.');
  } catch (err) {
    if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') return false;
    if (err.code === 'ENOTFOUND') return true;
    // No MX record but the domain exists: mail can still go to its A record (rare, but allowed).
    try {
      const a = await withTimeout(resolver.resolve4(domain), 3000);
      return a.length === 0;
    } catch (e) {
      return e.code === 'ENODATA' || e.code === 'ENOTFOUND';
    }
  }
}

/**
 * @returns {Promise<{ ok: boolean, reason?: string, message?: string, suggestion?: string }>}
 */
export async function checkEmail(raw, { resolver } = {}) {
  const email = String(raw ?? '').trim().toLowerCase();
  if (!email || email.length > 254 || !SYNTAX.test(email)) {
    return { ok: false, reason: 'syntax', message: 'That doesn’t look like an email address. Please check it.' };
  }
  const [local, domain] = [email.slice(0, email.lastIndexOf('@')), email.slice(email.lastIndexOf('@') + 1)];
  if (TYPOS[domain]) {
    const suggestion = `${local}@${TYPOS[domain]}`;
    return { ok: false, reason: 'typo', suggestion, message: `Did you mean ${suggestion}?` };
  }
  if (DISPOSABLE.has(domain) || [...DISPOSABLE].some((d) => domain.endsWith(`.${d}`))) {
    return { ok: false, reason: 'disposable', message: 'Please use your own email address, not a throwaway inbox, so we can reply.' };
  }
  if (PLACEHOLDER_DOMAINS.has(domain) || /^(test|example|fake|invalid|localhost)(\.|$)/.test(domain) || /\.(test|example|invalid|localhost|local)$/.test(domain)) {
    return { ok: false, reason: 'placeholder', message: 'Please use your real email address so we can reply.' };
  }
  if (JUNK_LOCAL.test(local) && (FREE_PROVIDERS.has(domain) || local.replace(/\W/g, '') === domain.split('.')[0])) {
    return { ok: false, reason: 'junk', message: 'Please use your real email address so we can reply.' };
  }
  // Before saying no, make sure DNS itself is working: if even gmail.com can't be looked up,
  // the problem is the lookup, not the address, so let it through.
  if ((await cannotReceiveMail(domain, resolver)) && !(await cannotReceiveMail('gmail.com', resolver))) {
    return { ok: false, reason: 'no-mail', message: `${domain} doesn’t seem to receive email. Please check the address.` };
  }
  return { ok: true };
}
