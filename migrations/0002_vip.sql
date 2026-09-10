-- VIP applications, payment QR codes, admin claim, mentor contact
create table if not exists applications (
  id          serial primary key,
  user_id     text not null unique,
  plan_id     text not null,
  full_name   text not null,
  wechat_id   text not null,
  phone       text not null,
  email       text not null,
  note        text not null default '',
  status      text not null default 'pending',
  admin_note  text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists applications_status_idx on applications (status);
create index if not exists applications_plan_idx on applications (plan_id);

create table if not exists payment_qrs (
  plan_id     text primary key,
  image_data  text not null,
  updated_at  timestamptz not null default now(),
  updated_by  text not null
);

create table if not exists admins (
  user_id     text primary key,
  created_at  timestamptz not null default now()
);

create table if not exists mentor_settings (
  id          integer primary key check (id = 1),
  wechat_id   text not null default '',
  updated_at  timestamptz not null default now(),
  updated_by  text not null default ''
);

insert into mentor_settings (id) values (1) on conflict do nothing;
