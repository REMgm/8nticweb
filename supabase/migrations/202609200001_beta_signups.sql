-- Prepared migration, not applied to a remote project by this repository.
begin;

create table public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  email_normalized text generated always as (lower(btrim(email))) stored not null unique,
  status text not null default 'eligible' check (status in ('eligible', 'unsubscribed', 'suppressed')),
  consent_scope text not null check (consent_scope = '8ntic_beta_news_and_research_updates'),
  consent_version text not null,
  consent_at timestamptz not null,
  source text not null check (source = '8ntic_web_beta'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  suppressed_at timestamptz,
  suppression_reason text check (suppression_reason in ('complaint', 'hard_bounce', 'do_not_contact')),
  email_verified_at timestamptz,
  constraint beta_withdrawal_state check ((status = 'unsubscribed') = (unsubscribed_at is not null)),
  constraint beta_suppression_state check ((status = 'suppressed') = (suppressed_at is not null)),
  constraint beta_suppression_reason check ((status = 'suppressed') = (suppression_reason is not null))
);

create table public.beta_rate_limits (
  key text not null check (key ~ '^[a-f0-9]{64}$'),
  window_start bigint not null,
  attempts integer not null check (attempts >= 1),
  expires_at bigint not null,
  primary key (key, window_start)
);
create index beta_rate_limits_expiry on public.beta_rate_limits(expires_at);

alter table public.beta_signups enable row level security;
alter table public.beta_rate_limits enable row level security;
revoke all on public.beta_signups, public.beta_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.beta_signups, public.beta_rate_limits to service_role;
-- Deliberately no browser/anonymous/authenticated row policies.

create function public.beta_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.beta_touch_updated_at() from public, anon, authenticated;
create trigger beta_signups_touch_updated_at before update on public.beta_signups
for each row when (old is distinct from new) execute function public.beta_touch_updated_at();

create function public.submit_beta_signup(
  p_name text, p_email text, p_consent_version text, p_ip_key text, p_email_key text
)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  current_seconds bigint := floor(extract(epoch from now()))::bigint;
  ip_start bigint;
  email_start bigint;
  ip_attempts integer;
  email_attempts integer;
  retry_after integer := 0;
begin
  if p_name is null or char_length(btrim(p_name)) not between 1 and 100
     or p_email is null or char_length(btrim(p_email)) not between 3 and 254
     or p_email !~ '^[^[:space:]@<>]+@[^[:space:]@<>]+\.[^[:space:]@<>]+$'
     or p_consent_version is distinct from 'beta-research-updates-v1'
     or p_ip_key is null or p_ip_key !~ '^[a-f0-9]{64}$'
     or p_email_key is null or p_email_key !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid beta signup' using errcode = '22023';
  end if;

  ip_start := (current_seconds / 600) * 600;
  email_start := (current_seconds / 3600) * 3600;
  delete from public.beta_rate_limits where expires_at <= current_seconds;

  insert into public.beta_rate_limits(key, window_start, attempts, expires_at)
  values (p_ip_key, ip_start, 1, ip_start + 600)
  on conflict (key, window_start) do update
    set attempts = least(public.beta_rate_limits.attempts + 1, 100000)
  returning attempts into ip_attempts;

  insert into public.beta_rate_limits(key, window_start, attempts, expires_at)
  values (p_email_key, email_start, 1, email_start + 3600)
  on conflict (key, window_start) do update
    set attempts = least(public.beta_rate_limits.attempts + 1, 100000)
  returning attempts into email_attempts;

  if ip_attempts > 5 then retry_after := (ip_start + 600 - current_seconds)::integer; end if;
  if email_attempts > 3 then retry_after := greatest(retry_after, (email_start + 3600 - current_seconds)::integer); end if;
  if retry_after > 0 then
    -- Return rather than raise so counters commit even when the attempt is limited.
    return jsonb_build_object('outcome', 'rate_limited', 'retryAfter', retry_after);
  end if;

  insert into public.beta_signups(name, email, consent_scope, consent_version, consent_at, source)
  values (btrim(p_name), btrim(p_email), '8ntic_beta_news_and_research_updates', p_consent_version, now(), '8ntic_web_beta')
  on conflict (email_normalized) do nothing;
  -- New and existing records receive the exact same public result. No resubscription here.
  return jsonb_build_object('outcome', 'received');
end;
$$;
revoke all on function public.submit_beta_signup(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_beta_signup(text, text, text, text, text) to service_role;

commit;
