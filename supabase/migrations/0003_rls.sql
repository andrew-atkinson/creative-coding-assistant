-- Lock down the tables. No anon policies → anon key requests are denied.
-- All server-side code uses the service_role key, which bypasses RLS.
-- This addresses Supabase's "RLS Disabled in Public" and "Sensitive Columns
-- Exposed" security advisories on the hosted project.

alter table users enable row level security;
alter table courses enable row level security;
alter table videos enable row level security;
alter table usage_events enable row level security;
alter table feedback enable row level security;
