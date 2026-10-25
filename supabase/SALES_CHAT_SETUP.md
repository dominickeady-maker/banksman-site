# Sales chat setup (for Dom)

The "Ask about Banksman" chat answers visitors' questions with Claude (Sonnet 5.5).

## How it works
1. **The chat box** (`src/components/SalesChat.astro`) is on every page. It sends the chat to the `sales-chat` function in the Banksman production Supabase (buildflow-demo repo). The Anthropic key lives there, never in the website.
2. **What it knows** comes from `/chat-knowledge.json`. That file is built from the site's own data: features, plans, FAQ and links. When a feature goes live in `src/data/features.ts`, the chat knows within 10 minutes of the deploy.
3. **When someone wants a person**, the chat shows a short form (name, business, email, phone). It goes to Netlify Forms as `chat-lead`, with the chat so far, which emails it to Dom and Matt (step 1 below). The leads also stay in Netlify → Forms → `chat-lead`.
   - Not yet: saving leads in a CRM database. `submission-created` already files them in a `sales_leads` table once a CRM is connected (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in Netlify, and `supabase/sales_leads_check.sql` / `sales_leads_apply.sql` run in that project). Until then it just logs that it skipped saving.

## Limits
- **Spending cap:** £25 a month (Supabase secret `SALES_CHAT_CAP_GBP`, default 25). Once it's reached, the chat says "email or ring Dom" until the 1st of next month.
- **Per visitor:** 20 messages an hour. Each message can be up to 1,500 characters, and each chat up to 24 turns.
- **Where it works:** only on banksman.app pages.

## One-off setup
1. **Netlify → Forms:** after the first deploy you should see a `chat-lead` form. Under **Form notifications**, add an email notification for `chat-lead` to dom@dm4u.ai and matt@dm4u.ai, the same as for `support`.
2. **Banksman production:** the counters and the `sales-chat` function (buildflow-demo #38). Done: SQL applied, function deployed.

## Launching
`src/site.ts` → `salesChat.live`:
- `false`: the chat only shows on a page opened with `?chat=1`, for example https://banksman.app/?chat=1. It then stays on for that browser tab.
- `true`: the chat shows on every page for everyone.

## Leads
Each lead arrives by email and stays in Netlify → Forms → `chat-lead`, with the chat transcript.
