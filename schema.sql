-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  job_role text,
  skills jsonb default '[]'::jsonb,
  skill_embeddings vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- INTERVIEWS TABLE
create table interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  target_role text not null,
  transcript jsonb default '[]'::jsonb,
  score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Interviews
alter table interviews enable row level security;
create policy "Users can view own interviews." on interviews for select using (auth.uid() = user_id);
create policy "Users can insert own interviews." on interviews for insert with check (auth.uid() = user_id);
create policy "Users can update own interviews." on interviews for update using (auth.uid() = user_id);

-- JOBS TABLE
create table jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  requirements jsonb default '[]'::jsonb,
  req_embeddings vector(768),
  source text default 'internal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Jobs (Viewable by all, editable by admins/service role only)
alter table jobs enable row level security;
create policy "Jobs are viewable by everyone." on jobs for select using (true);

-- APPLICATIONS TABLE
create table applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  job_id uuid references jobs on delete cascade not null,
  status text default 'pending',
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- Enable RLS for Applications
alter table applications enable row level security;
create policy "Users can view own applications." on applications for select using (auth.uid() = user_id);
create policy "Users can insert own applications." on applications for insert with check (auth.uid() = user_id);

-- Automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
