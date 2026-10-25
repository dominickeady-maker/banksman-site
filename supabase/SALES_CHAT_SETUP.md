# Sales chat setup (for Dom)

The "Ask about Banksman" chat answers visitors' questions with Claude (Sonnet 5.5).

## How it works
1. **The chat box** (`src/components/SalesChat.astro`) is on every page. It sends the chat to the `sales-chat` function in the Banksman production Supabase (buildflow-demo repo). The Anthropic key lives there, never in the website.
2. **What it knows** comes from `/chat-knowledge.json`. That file is built from the site's own data: features, plans, FAQ and links. When a feature goes live in `src/data/features.ts`, the chat knows within 10 minutes of the deploy.
3. **When someone wants a person**, the chat shows a short form (name, business, email, phone). It goes to Netlify Forms as `chat-lead`, which emails it to Dom and Matt (step 2 below). `submission-created` also files it, with the chat so far, in the **`sales_leads`** table in DM4U-CRM.

## Limits
- **Spending cap:** £25 a month (Supabase secret `SALES_CHAT_CAP_GBP`, default 25). Once it's reached, the chat says "email or ring Dom" until the 1st of next month.
- **Per visitor:** 20 messages an hour. Each message can be up to 1,500 characters, and each chat up to 24 turns.
- **Where it works:** only on banksman.app pages.

## One-off setup
1. **DM4U-CRM (Supabase) → SQL Editor:** run `supabase/sales_leads_check.sql`, then `supabase/sales_leads_apply.sql`, then the check again. Every row should say `ok`.
2. **Netlify → Forms:** after the first deploy you should see a `chat-lead` form. Under **Form notifications**, add an email notification for `chat-lead` to dom@dm4u.ai and matt@dm4u.ai, the same as for `support`.
3. **Banksman production:** the counters and the function are in the buildflow-demo PR, which has its own steps.

## Launching
`src/site.ts` → `salesChat.live`:
- `false`: the chat only shows on a page opened with `?chat=1`, for example https://banksman.app/?chat=1. It then stays on for that browser tab.
- `true`: the chat shows on every page for everyone.

## Leads
In DM4U-CRM, open the Table editor → `sales_leads`. Set `status` to `new`, then `contacted`, then `won` or `lost`. `assigned_to` and `internal_notes` are free text.
