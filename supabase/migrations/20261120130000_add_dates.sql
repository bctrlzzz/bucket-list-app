-- Dates for plans: one plan can have several dates or ranges.
create table plan_dates (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans on delete cascade,
  start_date date not null,
  start_time time,
  end_date date,
  end_time time,
  created_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create index plan_dates_plan_id_idx on plan_dates (plan_id); -- makes it fast to find the dates of a plan

alter table plan_dates enable row level security;
grant select, insert, update, delete on public.plan_dates to anon;

-- TEMPORARY, like the other tables: replaced when we add login.
create policy "temporary public access" on plan_dates
  for all to anon using (true) with check (true);

-- Dates for collections: one start–end range, days only (for trips).
alter table collections add column start_date date;
alter table collections add column end_date date;
alter table collections add constraint collections_dates_check
  check (end_date is null or (start_date is not null and end_date >= start_date));