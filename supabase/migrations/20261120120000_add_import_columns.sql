-- Where an imported plan came from. All empty for plans created in the app.
alter table plans add column source text;            -- 'instagram' or 'tiktok'
alter table plans add column source_url text unique; -- the link to the post
alter table plans add column source_saved_at timestamptz; -- when you saved it there
alter table plans add column image_url text;         -- a thumbnail, if we find one