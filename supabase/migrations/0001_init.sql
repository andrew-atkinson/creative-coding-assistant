-- TutorGen M1 initial schema.
-- Vector dim = 384 (sentence-transformers/all-MiniLM-L6-v2, the transcriber's default).
-- RLS intentionally disabled in M1 (single educator, server-side access only).

create extension if not exists vector;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  slug text unique not null,
  title text not null,
  theme_color text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  llm_provider text not null default 'gemini' check (llm_provider in ('gemini', 'huggingface', 'groq')),
  llm_model_id text not null default 'gemini-2.5-flash',
  temperature real not null default 0.2,
  system_prompt text,
  monthly_request_budget int not null default 1000,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  ordinal int not null,
  title text not null,
  url text not null,
  duration_seconds int,
  created_at timestamptz not null default now(),
  unique (course_id, ordinal)
);

create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  chunk_id text not null,
  start_seconds int not null,
  end_seconds int not null,
  text text not null,
  embedding vector(384) not null,
  created_at timestamptz not null default now(),
  unique (video_id, chunk_id)
);

create index if not exists chunks_course_id_idx on chunks (course_id);

create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create table if not exists usage_events (
  id bigserial primary key,
  course_id uuid not null references courses(id) on delete cascade,
  kind text not null check (kind in ('chat_request', 'embedding')),
  provider text,
  input_tokens int,
  output_tokens int,
  occurred_at timestamptz not null default now()
);

create index if not exists usage_events_course_month_idx
  on usage_events (course_id, occurred_at);

-- Grants: service_role bypasses RLS but still needs table-level privileges.
-- Applied to existing objects here and via default privileges for anything
-- created later in the public schema.
grant usage on schema public to service_role, anon, authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on functions to service_role;

-- Similarity search RPC. Called from /api/chat as supabase.rpc('match_chunks', ...).
create or replace function match_chunks(
  query_embedding vector(384),
  course uuid,
  match_count int default 6
) returns table (
  video_id uuid,
  start_seconds int,
  end_seconds int,
  text text,
  similarity real
) language sql stable as $$
  select
    video_id, start_seconds, end_seconds, text,
    1 - (embedding <=> query_embedding) as similarity
  from chunks
  where course_id = course
  order by embedding <=> query_embedding
  limit match_count;
$$;
