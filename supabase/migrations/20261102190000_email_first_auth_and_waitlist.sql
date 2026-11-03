-- Email-first funnel. Apply by hand after review. Do not run this from CI.
-- The app renders if these columns and the waitlist table are missing.

alter table public.users
  add column if not exists auth_user_id uuid,
  add column if not exists entry_point text,
  add column if not exists first_skill text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists referrer text,
  add column if not exists landing_path text,
  add column if not exists hr_function text,
  add column if not exists company_size text,
  add column if not exists wants_to_build text,
  add column if not exists program_interest boolean,
  add column if not exists welcome_completed_at timestamptz;

-- Multiple nulls are allowed, so existing rows stay valid until they sign in.
create unique index if not exists users_auth_user_id_key
  on public.users (auth_user_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_auth_user_id_fkey'
  ) then
    alter table public.users
      add constraint users_auth_user_id_fkey
      foreign key (auth_user_id) references auth.users (id) on delete set null;
  end if;
end $$;

create table if not exists public.program_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  first_name text not null,
  job_title text,
  hr_function text not null,
  company_size text,
  ai_tools text,
  build_first text,
  who_pays text,
  interest text not null,
  founding boolean not null default false
);

create unique index if not exists program_waitlist_email_lower_idx
  on public.program_waitlist (lower(email));

alter table public.program_waitlist enable row level security;

-- No policies. The Data API (anon and authenticated) cannot read or write.
-- The app uses the service role, which bypasses RLS.
revoke all on table public.program_waitlist from anon, authenticated;

comment on table public.program_waitlist is
  'People Builders waitlist. founding = true for the unlisted founding cohort form.';
