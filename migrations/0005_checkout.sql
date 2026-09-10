-- Payment claim + Whop checkout links per plan
alter table applications
  add column if not exists pay_method text not null default '',
  add column if not exists pay_claimed_at timestamptz;

create table if not exists plan_checkouts (
  plan_id    text primary key,
  whop_url   text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);
