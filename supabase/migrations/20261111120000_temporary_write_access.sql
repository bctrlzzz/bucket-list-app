-- TEMPORARY: let the app create, change and delete plans and collections
-- without login. Replaced when we add login.
grant insert, update, delete on public.collections, public.plans to anon;
create policy "temporary public write" on collections
  for all to anon using (true) with check (true);

create policy "temporary public write" on plans
  for all to anon using (true) with check (true);