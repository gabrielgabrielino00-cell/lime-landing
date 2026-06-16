-- LimeForge · Supabase schema
-- Run in Supabase SQL editor when deploying for real

create type user_plan as enum ('free', 'pro', 'team');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  avatar_url text,
  plan user_plan not null default 'free',
  requests_used int not null default 0,
  requests_limit int not null default 50,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  model_id text not null default 'claude-sonnet-4-6',
  output text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  language text not null default 'lua',
  content text not null default '',
  sort_order int not null default 0
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model_id text,
  created_at timestamptz not null default now()
);

create table if not exists project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  prompt_used text not null,
  model_id text not null,
  output_snapshot text not null,
  label text,
  created_at timestamptz not null default now()
);

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  key_hash text not null unique,
  key_prefix text not null,
  label text not null default 'Default',
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists idx_projects_user on projects(user_id);
create index if not exists idx_messages_project on messages(project_id);
create index if not exists idx_versions_project on project_versions(project_id);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table messages enable row level security;
alter table project_versions enable row level security;
alter table api_keys enable row level security;