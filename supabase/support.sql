-- Banksman support form → DM4U-CRM (Supabase).
-- Run once in the DM4U-CRM project: Supabase dashboard → SQL Editor → New query → paste → Run.
-- Rows are written by the Netlify function netlify/functions/submission-created.mjs using the service role key.
-- Row level security is on with no public policies, so nothing here can be read or written from a browser.

create extension if not exists pgcrypto;

-- Support tickets: bug reports, help requests and anything else. Mark them new / in_progress / done.
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_ref text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  reason text not null default 'other' check (reason in ('bug_report', 'help_request', 'other')),
  first_name text,
  last_name text,
  email text not null,
  account_number text,
  message text,
  assigned_to text,          -- 'Dom' or 'Matt'
  internal_notes text,
  source text default 'banksman.app/support',
  netlify_submission_id text unique
);

-- Feature suggestions: the ideas list to look at when planning app updates.
create table if not exists public.feature_suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'considering', 'planned', 'built', 'declined')),
  first_name text,
  last_name text,
  email text,
  account_number text,
  message text,
  votes integer not null default 1,   -- bump when someone else asks for the same thing
  internal_notes text,
  source text default 'banksman.app/support',
  netlify_submission_id text unique
);

create index if not exists support_tickets_status_idx on public.support_tickets (status, created_at desc);
create index if not exists feature_suggestions_status_idx on public.feature_suggestions (status, created_at desc);

-- Readable ticket numbers, e.g. BM-1001, BM-1002 …
create sequence if not exists public.support_ticket_seq start 1001;
create or replace function public.set_ticket_ref() returns trigger language plpgsql as $$
begin
  if new.ticket_ref is null then
    new.ticket_ref := 'BM-' || nextval('public.support_ticket_seq');
  end if;
  return new;
end $$;
drop trigger if exists support_tickets_ref on public.support_tickets;
create trigger support_tickets_ref before insert on public.support_tickets
  for each row execute function public.set_ticket_ref();

-- Keep updated_at current when a status changes.
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists support_tickets_touch on public.support_tickets;
create trigger support_tickets_touch before update on public.support_tickets
  for each row execute function public.touch_updated_at();
drop trigger if exists feature_suggestions_touch on public.feature_suggestions;
create trigger feature_suggestions_touch before update on public.feature_suggestions
  for each row execute function public.touch_updated_at();

alter table public.support_tickets enable row level security;
alter table public.feature_suggestions enable row level security;
-- No policies on purpose: only the service role (the Netlify function, and the CRM app later) can touch these tables.
