create table collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  created_at timestamptz not null default now()
);

create table plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  place text,
  city text,
  collection_id uuid references collections on delete set null,
  pinned boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

grant select on public.collections, public.plans to anon;

-- Turn on the security rules.
alter table collections enable row level security;
alter table plans enable row level security;

-- TEMPORARY: anyone with the app can read all rows.
-- We replace these when we add login, so each person only sees their own plans.
create policy "temporary public read" on collections for select to anon using (true);
create policy "temporary public read" on plans for select to anon using (true);