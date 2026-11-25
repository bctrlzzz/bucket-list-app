-- An optional price per plan, in euros.
alter table plans add column price numeric(10, 2) check (price >= 0);