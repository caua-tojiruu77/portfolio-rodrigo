-- Run this once in Supabase: SQL Editor > New query > Run.
-- Personal data is intentionally kept server-side; do not expose a service key
-- or DATABASE_URL to the browser.
create table if not exists public.workshop_registrations (
  id text primary key,
  public_code text not null unique,
  workshop_id text not null,
  participant_name text not null,
  email text not null,
  phone text not null,
  status text not null check (status in ('pending', 'paid', 'reserved_cash', 'cash_paid', 'cancelled', 'expired')),
  payment_method text not null check (payment_method in ('paypal', 'cash')),
  cash_payment_status text check (cash_payment_status in ('pending', 'paid')),
  deposit_amount numeric(10,2) not null default 0,
  deposit_status text check (deposit_status in ('pending', 'paid')),
  reservation_expires_at bigint,
  created_at bigint not null,
  updated_at bigint not null,
  payment_approved_at bigint,
  reservation_email_sent_at bigint,
  confirmation_email_sent_at bigint,
  cash_payment_email_sent_at bigint,
  deposit_email_sent_at bigint,
  paypal_order_id text,
  paypal_capture_id text,
  transaction_id text,
  attendance_status text check (attendance_status in ('present', 'absent')),
  attendee_check_in_at bigint,
  currency text not null default 'EUR',
  amount numeric(10,2) not null default 0
);

create index if not exists workshop_registrations_workshop_status_idx
  on public.workshop_registrations (workshop_id, status);
create index if not exists workshop_registrations_created_at_idx
  on public.workshop_registrations (created_at desc);

-- The application connects with the database password, not the browser-facing
-- Supabase key. Keep RLS enabled and do not add public policies.
alter table public.workshop_registrations enable row level security;
