-- ==========================================
-- SUPABASE STORAGE CONFIGURATION & RLS POLICIES
-- ==========================================
-- Run this in your Supabase SQL Editor to provision buckets 
-- for PDFs (documents/reports) and profile pictures (avatars),
-- along with security policies for reading and writing files.

-- 1. Create Buckets
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('documents', 'documents', true),
  ('reports', 'reports', true)
on conflict (id) do nothing;

-- 2. Security Policies for 'avatars' (Profile Pictures)
create policy "Allow Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Allow Authenticated Uploads to Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Allow Owners to Delete Avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' );

-- 3. Security Policies for 'documents' (Offer Letters, Resumes, NOCs)
create policy "Allow Public Access to Documents"
  on storage.objects for select
  using ( bucket_id = 'documents' );

create policy "Allow Authenticated Uploads to Documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' );

create policy "Allow Authenticated Deletions to Documents"
  on storage.objects for delete
  using ( bucket_id = 'documents' );

-- 4. Security Policies for 'reports' (Internship Journal PDFs, Slides)
create policy "Allow Public Access to Reports"
  on storage.objects for select
  using ( bucket_id = 'reports' );

create policy "Allow Authenticated Uploads to Reports"
  on storage.objects for insert
  with check ( bucket_id = 'reports' );

create policy "Allow Authenticated Deletions to Reports"
  on storage.objects for delete
  using ( bucket_id = 'reports' );
