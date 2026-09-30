-- Safely add columns if they weren't added in the initial setup
alter table profiles add column if not exists university text;
alter table profiles add column if not exists degree text;
alter table profiles add column if not exists expected_graduation_year int;
alter table profiles add column if not exists core_capabilities text;
alter table profiles add column if not exists resume_url text;
alter table profiles add column if not exists skills_extracted text[];
alter table profiles add column if not exists career_recommendations jsonb;

-- Force the Supabase schema cache to reload
NOTIFY pgrst, 'reload schema';

-- Create a storage bucket for resumes (ignores if it already exists)
insert into storage.buckets (id, name, public) 
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Safely recreate storage policies
drop policy if exists "Users can upload their own resumes" on storage.objects;
drop policy if exists "Users can view their own resumes" on storage.objects;

create policy "Users can upload their own resumes"
  on storage.objects for insert
  with check ( bucket_id = 'resumes' and auth.uid() = owner );

create policy "Users can view their own resumes"
  on storage.objects for select
  using ( bucket_id = 'resumes' and auth.uid() = owner );
