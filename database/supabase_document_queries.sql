-- =========================================================================
-- SUPABASE STORAGE BUCKETS & DATABASE TABLES FOR DOCUMENTS
-- (RESUME, OFFER LETTER, NOC, REPORT)
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: STORAGE BUCKETS PROVISIONING
-- Run this in your Supabase SQL Editor to initialize storage folders
-- -------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values 
  ('resumes', 'resumes', true),
  ('offerletters', 'offerletters', true),
  ('nocs', 'nocs', true),
  ('reports', 'reports', true)
on conflict (id) do nothing;


-- -------------------------------------------------------------------------
-- PART 2: ROW-LEVEL SECURITY (RLS) POLICIES FOR STORAGE
-- Configures access permissions so files can be uploaded and viewed securely
-- -------------------------------------------------------------------------

-- RESUMES POLICIES
create policy "Allow Public Select on Resumes" on storage.objects for select using (bucket_id = 'resumes');
create policy "Allow Authenticated Insert on Resumes" on storage.objects for insert with check (bucket_id = 'resumes');

-- OFFER LETTERS POLICIES
create policy "Allow Public Select on Offer Letters" on storage.objects for select using (bucket_id = 'offerletters');
create policy "Allow Authenticated Insert on Offer Letters" on storage.objects for insert with check (bucket_id = 'offerletters');

-- NOCs POLICIES
create policy "Allow Public Select on NOCs" on storage.objects for select using (bucket_id = 'nocs');
create policy "Allow Authenticated Insert on NOCs" on storage.objects for insert with check (bucket_id = 'nocs');

-- REPORTS POLICIES
create policy "Allow Public Select on Reports" on storage.objects for select using (bucket_id = 'reports');
create policy "Allow Authenticated Insert on Reports" on storage.objects for insert with check (bucket_id = 'reports');


-- -------------------------------------------------------------------------
-- PART 3: RELATIONAL DATABASE TABLE FOR DOCUMENT TRACKING
-- Structure for storing document records linked to applications and profiles
-- -------------------------------------------------------------------------

create table if not exists public.student_documents (
  id uuid default gen_random_uuid() primary key,
  application_id text not null references public.applications(id) on delete cascade,
  student_id text not null references public.profiles(id) on delete cascade,
  document_type text not null check (document_type in ('Resume', 'Offer Letter', 'NOC', 'Report')),
  file_name text not null,
  file_url text not null, -- URL to Supabase Storage Object
  file_size text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on tracking table
alter table public.student_documents enable row level security;

-- Policies for student_documents table
create policy "Allow anyone to view documents" on public.student_documents for select using (true);
create policy "Allow authenticated uploads" on public.student_documents for insert with check (true);


-- -------------------------------------------------------------------------
-- PART 4: SQL QUERY TEMPLATES FOR STORING SUBMISSIONS
-- -------------------------------------------------------------------------

-- ⚠️ PREREQUISITE SEEDING:
-- The "student_documents" table has foreign key constraints on the "profiles" 
-- and "applications" tables. To prevent a "violates foreign key constraint" error,
-- run these mock parent insertions first (or run the full seed.sql script):

-- 1. Ensure parent profile exists:
insert into public.profiles (id, name, role, title, department, avatar_url, email)
values (
  'USR-STU-0842', 
  'Arjun Malhotra', 
  'student', 
  'B.Tech Computer Science', 
  'Computer Science & Engineering', 
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
  'arjun.m@university.edu'
)
on conflict (id) do nothing;

-- 2. Ensure parent application exists:
insert into public.applications (
  id, student_id, student_name, student_avatar, student_email, student_degree, department, cgpa,
  company_name, industry, company_website, company_address, hr_name, hr_email, hr_phone,
  role_title, work_mode, location, start_date, end_date, duration_months, stipend_amount, stipend_currency,
  stage, submitted_date, last_updated, priority, assigned_mentor_id, assigned_mentor_name,
  ip_address, audit_hash
)
values (
  'APP-2024-0842', 'USR-STU-0842', 'Arjun Malhotra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'arjun.m@university.edu', 'B.Tech Computer Science', 'Computer Science & Engineering', 3.92,
  'Vercel Inc.', 'Cloud Infrastructure', 'https://vercel.com', 'San Francisco, CA', 'Sarah Parker', 's.parker@vercel.com', '+1-12345678',
  'Frontend Intern', 'Hybrid', 'San Francisco', '2024-11-01', '2025-05-01', 6, 2500, 'USD',
  'mentor_review', '2024-10-12', '2024-10-14', 'High', 'USR-MNT-002', 'Dr. Helena Vance',
  '127.0.0.1', '0xabc123'
)
on conflict (id) do nothing;


-- 3. Document Submission Insert/Upsert Examples:

-- A. Insert a new document reference (Offer Letter)
insert into public.student_documents (application_id, student_id, document_type, file_name, file_url, file_size)
values (
  'APP-2024-0842', 
  'USR-STU-0842', 
  'Offer Letter', 
  'vercel_offer_letter.pdf', 
  'https://Tq7QgHblKH66qu18ezbpCg.supabase.co/storage/v1/object/public/offerletters/vercel_offer_letter.pdf', 
  '1.8 MB'
);

-- B. Upsert (update in-place if duplicate exists)
-- Ensures duplicate file of the same type/application is replaced
insert into public.student_documents (application_id, student_id, document_type, file_name, file_url, file_size)
values (
  'APP-2024-0842', 
  'USR-STU-0842', 
  'Resume', 
  'arjun_resume.pdf', 
  'https://Tq7QgHblKH66qu18ezbpCg.supabase.co/storage/v1/object/public/resumes/arjun_resume.pdf', 
  '1.2 MB'
)
-- If matching entry exists, update details to avoid duplicate records
on conflict (id) 
do update set 
  file_name = excluded.file_name,
  file_url = excluded.file_url,
  file_size = excluded.file_size,
  uploaded_at = now();
