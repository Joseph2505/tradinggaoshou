-- Discord invite shown only to paid members
alter table mentor_settings
  add column if not exists discord_url text not null default '';
