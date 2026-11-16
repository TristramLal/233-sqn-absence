-- Run in a new Supabase project's SQL Editor, after organisational approval.
create table if not exists public.staff_users (
 user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.attendance (
 id uuid primary key default gen_random_uuid(),
 rank text not null check (rank in ('CDT','LCDT','CCPL','CSGT','CFSGT','CWOFF','CUO')),
 cadet_name text not null check (char_length(trim(cadet_name)) between 3 and 100),
 flight text not null check (flight in ('1 Flight','2 Flight','3 Flight')),
 status text not null check (status in ('Present','Late','Away - no leave request','Away - leave request received')),
 source text not null check (source in ('cadet','staff')),
 parade_date date not null,
 created_at timestamptz not null default now(),
 check (source <> 'cadet' or status = 'Present')
);
alter table public.staff_users enable row level security;
alter table public.attendance enable row level security;
revoke all on public.staff_users from anon, authenticated;
revoke all on public.attendance from anon, authenticated;
grant select on public.staff_users to authenticated;
grant select,insert on public.attendance to authenticated;
grant insert on public.attendance to anon;
create policy "Staff can check their own membership" on public.staff_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Staff can view roll" on public.attendance for select to authenticated using (exists(select 1 from public.staff_users s where s.user_id = (select auth.uid())));
create policy "Staff can add roll records" on public.attendance for insert to authenticated with check (exists(select 1 from public.staff_users s where s.user_id = (select auth.uid())));
create policy "Public can sign in present only" on public.attendance for insert to anon with check (source = 'cadet' and status = 'Present' and parade_date = (now() at time zone 'Australia/Brisbane')::date);
-- Provision staff through Supabase Auth, then approve an existing auth user ID:
-- insert into public.staff_users(user_id) values ('USER-UUID-HERE');
-- Public insert is inherently vulnerable to spam/impersonation. Add server-side
-- rate limiting, CAPTCHA and a verified nominal-roll workflow before real use.
