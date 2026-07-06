-- Pivot from RAG (vector search over chunks) to full-context routing.
-- Drops the RAG stack; adds a feedback table for unknown-question capture.

drop function if exists match_chunks(vector, uuid, int);
drop index if exists chunks_embedding_idx;
drop index if exists chunks_course_id_idx;
drop table if exists chunks;
drop extension if exists vector;

create table if not exists feedback (
  id bigserial primary key,
  course_id uuid not null references courses(id) on delete cascade,
  question text not null,
  category text,
  session_id text,
  occurred_at timestamptz not null default now()
);

create index if not exists feedback_course_idx on feedback (course_id, occurred_at);

grant all on feedback to service_role;
grant all on sequence feedback_id_seq to service_role;
