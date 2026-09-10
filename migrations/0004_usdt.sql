-- USDT wallet shown on the member payment page
alter table mentor_settings
  add column if not exists usdt_network text not null default 'TRC20',
  add column if not exists usdt_address text not null default '';
