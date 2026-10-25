# Support form setup (for Dom)

The new page is **banksman.app/support/**. People fill in their name, email, account number, a reason (bug report, help request, feature suggestion or other) and a message.

What happens when someone sends it:

1. **Netlify Forms** receives it (form name `support`), with spam filtering built in.
2. **Netlify emails Dom and Matt** (set up once in the Netlify dashboard, step 2 below).
3. **The Netlify function** `netlify/functions/submission-created.mjs` files it in **Supabase (DM4U-CRM)**:
   - bug reports, help requests and "other" → table `support_tickets`, status `new` (then `in_progress`, `done`), with a ticket number like `BM-1001`;
   - feature suggestions → table `feature_suggestions`, status `new` (then `considering`, `planned`, `built`, `declined`).

If Supabase isn't set up yet, the form still works and the emails still arrive. The function just logs that it skipped saving.

## One-off setup (about 10 minutes)

### 1. Create the tables in DM4U-CRM
Supabase dashboard → DM4U-CRM project → **SQL Editor** → New query → paste the whole of `supabase/support.sql` → **Run**.
It is safe to run twice. Row level security is on with no public policies, so the tables can't be read from a browser.

### 2. Email notifications to Dom and Matt
Netlify → banksman.app site → **Forms** → you should see a `support` form after the first deploy (if not, check **Form detection** is enabled).
→ **Form notifications** → Add notification → **Email notification**
- Event: New form submission
- Email to notify: `dom@dm4u.ai` (add a second one for `matt@dm4u.ai`)
- Form: `support`

### 3. Give the function access to Supabase
Supabase → DM4U-CRM → **Project Settings → API**: copy the **Project URL** and the **service_role** key (not the anon key).
Netlify → Site configuration → **Environment variables** → Add:
- `SUPABASE_URL` = the Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = the service role key (tick "Contains secret values", scope: **Functions**)

Also add `NETLIFY_API_TOKEN`: Netlify → User settings → Applications → **Personal access tokens** → New access token (name it "Banksman spam cleanup"). Paste it as `NETLIFY_API_TOKEN` (tick "Contains secret values", scope: **Functions**). It lets the site mark bot submissions as spam and delete them.

Then **Deploys → Trigger deploy → Deploy site** so the functions pick them up.

### 4. Test it
Send one of each from banksman.app/support/: a bug report and a feature suggestion.
- Both emails should arrive.
- Supabase → Table editor: one row in `support_tickets` (with `ticket_ref` BM-1001) and one in `feature_suggestions`.
- If a row is missing: Netlify → **Logs → Functions → submission-created** shows the reason.

## Marking tickets
Until the CRM app is built, change `status` straight in the Supabase Table editor:
- `support_tickets.status`: `new` → `in_progress` → `done`
- `feature_suggestions.status`: `new` → `considering` → `planned` → `built` (or `declined`)
`updated_at` changes automatically. `assigned_to` and `internal_notes` are free text for you two.

## Later: the DM4U-CRM app
A small internal app (login for Dom and Matt only) that lists tickets by status, lets you change status, assign, add notes and reply by email, plus a separate "Ideas" view for feature suggestions. It reads the same two tables with the service role on the server, so nothing here needs to change.

## Spam protection (both forms)
- A hidden "Company website" field that people never see. Bots fill it in, so Netlify marks the submission as spam straight away and doesn't email it.
- A timer: anything sent within 2 seconds of the page loading is treated as a bot.
- `submission-created` marks anything suspicious as spam and **deletes** it, so it never reaches Supabase.
- `purge-spam` runs every morning at about 3am and deletes everything in Netlify's spam list, so it never piles up.
Without `NETLIFY_API_TOKEN` the honeypot still works, but spam sits in Netlify's spam list instead of being deleted.
