-- Drop tables if they exist (to allow clean re-run)
drop table if exists public.audit_logs;
drop table if exists public.departments;
drop table if exists public.report_submissions;
drop table if exists public.tracker_submissions;
drop table if exists public.weekly_reports;
drop table if exists public.applications;
drop table if exists public.partner_companies;
drop table if exists public.profiles;

-- 1. Profiles (User Profiles)
create table public.profiles (
  id text primary key, -- e.g., USR-STU-001
  name text not null,
  role text not null check (role in ('student', 'mentor', 'hod', 'placement', 'admin')),
  title text not null,
  department text not null,
  avatar_url text not null,
  email text unique not null,
  student_id text, -- null for non-students
  cgpa numeric(3, 2), -- null for non-students
  total_credits integer, -- null for non-students
  reward_points integer, -- null for non-students
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Partner Companies
create table public.partner_companies (
  id text primary key, -- e.g., CMP-001
  name text not null,
  industry text not null,
  website text not null,
  logo text not null,
  active_interns_count integer default 0 not null,
  total_hired_count integer default 0 not null,
  avg_stipend text not null,
  contact_person text not null,
  contact_email text not null,
  status text not null,
  rating numeric(3, 2) default 5.0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Applications
create table public.applications (
  id text primary key, -- e.g., APP-2024-0842
  student_id text not null,
  student_name text not null,
  student_avatar text not null,
  student_email text not null,
  student_degree text not null,
  department text not null,
  cgpa numeric(3, 2) not null,
  company_name text not null,
  company_logo text,
  industry text not null,
  company_website text not null,
  company_address text not null,
  hr_name text not null,
  hr_email text not null,
  hr_phone text not null,
  role_title text not null,
  work_mode text not null,
  location text not null,
  start_date text not null,
  end_date text not null,
  duration_months integer not null,
  stipend_amount integer not null,
  stipend_currency text not null,
  stage text not null,
  submitted_date text not null,
  last_updated text not null,
  priority text not null,
  assigned_mentor_id text not null,
  assigned_mentor_name text not null,
  documents jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  internal_remarks text,
  ip_address text not null,
  audit_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Weekly Reports
create table public.weekly_reports (
  id text primary key, -- e.g., REP-001
  student_id text not null,
  student_name text not null,
  company_name text not null,
  week_number integer not null,
  title text not null,
  summary text not null,
  hours_logged integer not null,
  submitted_date text not null,
  status text not null,
  mentor_feedback text,
  score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tracker Submissions (Attendance & Daily Logs)
create table public.tracker_submissions (
  id text primary key, -- e.g., TRK-001
  application_id text not null,
  student_id text not null,
  student_name text not null,
  log_date text not null,
  daily_progress text not null,
  weekly_progress text not null,
  tasks_completed text not null,
  hours_worked integer not null,
  learning_outcomes text not null,
  skills_learned text not null,
  attendance text not null,
  mentor_remarks text,
  progress_percentage integer not null,
  screenshot_url text,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Report Submissions (Final Internship Reports)
create table public.report_submissions (
  id text primary key, -- e.g., REP-SUB-001
  application_id text not null,
  student_id text not null,
  student_name text not null,
  company_name text not null,
  industry text not null,
  sector text not null,
  company_website text not null,
  company_address text not null,
  start_date text not null,
  end_date text not null,
  duration_months integer not null,
  stipend_amount integer not null,
  project_title text not null,
  project_description text not null,
  technologies_used text not null,
  skills_learned text not null,
  learning_outcomes text not null,
  responsibilities text not null,
  challenges_faced text not null,
  solutions text not null,
  experience_summary text not null,
  student_feedback text not null,
  company_feedback text not null,
  report_file text,
  completion_cert_file text,
  original_cert_file text,
  attested_cert_file text,
  presentation_file text,
  additional_doc_file text,
  stage text not null,
  submitted_date text not null,
  mentor_remarks text,
  hod_remarks text,
  placement_remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Audit Logs
create table public.audit_logs (
  id text primary key, -- e.g., AUD-001
  timestamp text not null,
  username text not null, -- mappings from user parameter in AuditLog TS interface
  action text not null,
  target_id text not null,
  details text not null,
  ip text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Departments
create table public.departments (
  id text primary key, -- e.g., DEP-001
  name text not null,
  code text not null,
  hod_name text not null,
  active_students integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.partner_companies enable row level security;
alter table public.applications enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.tracker_submissions enable row level security;
alter table public.report_submissions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.departments enable row level security;

-- Create public read-only policies
create policy "Allow public read profiles" on public.profiles for select using (true);
create policy "Allow public read partner_companies" on public.partner_companies for select using (true);
create policy "Allow public read applications" on public.applications for select using (true);
create policy "Allow public read weekly_reports" on public.weekly_reports for select using (true);
create policy "Allow public read tracker_submissions" on public.tracker_submissions for select using (true);
create policy "Allow public read report_submissions" on public.report_submissions for select using (true);
create policy "Allow public read audit_logs" on public.audit_logs for select using (true);
create policy "Allow public read departments" on public.departments for select using (true);
