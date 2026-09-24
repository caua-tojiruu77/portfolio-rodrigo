-- Run in Supabase SQL Editor for existing production databases.
alter table public.workshop_registrations
  add column if not exists admin_notification_email_sent_at bigint;
