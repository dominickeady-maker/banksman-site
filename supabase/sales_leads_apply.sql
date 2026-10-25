-- Banksman sales chat leads → DM4U-CRM: APPLY.
-- Run once in the DM4U-CRM project: Supabase dashboard → SQL Editor → New query → paste → Run.
-- Safe to run twice; nothing existing is changed. Run sales_leads_check.sql before and after.
-- Rows are written by the Netlify function netlify/functions/submission-created.mjs (form "chat-lead")
-- using the service role key. Row level security is on with no public policies, so nothing here can be
-- read or written from a browser.
begin;

create extension if not exists pgcrypto;

-- People from the banksman.app chat who asked to be contacted. Mark them new / contacted / won / lost.
create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  name text,
  business text,
  email text not null,
  phone text,
  transcript text,           -- the chat up to the moment they sent their details
  page text,                 -- the banksman.app page they were on
  assigned_to text,          -- 'Dom' or 'Matt'
  internal_notes text,
  source text default 'banksman.app/chat',
  netlify_submission_id text unique
);
create index if not exists sales_leads_status_idx on public.sales_leads (status, created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists sales_leads_touch on public.sales_leads;
create trigger sales_leads_touch before update on public.sales_leads
  for each row execute function public.touch_updated_at();

alter table public.sales_leads enable row level security;
revoke all on public.sales_leads from anon, authenticated;
-- No policies on purpose: only the service role (the Netlify function, and the CRM app later) can touch it.

commit;
