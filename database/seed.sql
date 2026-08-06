-- 1. Seed Profiles
insert into public.profiles (id, name, role, title, department, avatar_url, email, student_id, cgpa, total_credits, reward_points)
values
  ('USR-STU-001', 'PRAVEEN KUMAR K A', 'student', 'B.Tech. - INFORMATION TECHNOLOGY', 'Information Technology', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'praveenkumarka.it24@bitsathy.ac.in', '7376242IT259', 3.89, 142, 1150),
  ('USR-STU-0842', 'Arjun Malhotra', 'student', 'B.Tech Computer Science', 'Computer Science & Engineering', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'arjun.m@university.edu', '7376242CS0842', 3.92, 140, 1100),
  ('USR-STU-0799', 'Alex Rivera', 'student', 'B.Tech Software Engineering', 'Computer Science & Engineering', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 'alex.rivera@university.edu', '7376242SE0799', 3.85, 138, 980),
  ('USR-STU-0810', 'Sophia Lin', 'student', 'B.Sc Data Science', 'Data Science & AI', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'sophia.l@university.edu', '7376242DS0810', 3.95, 145, 1250),
  ('USR-STU-0855', 'James Dalton', 'student', 'B.Com Financial Analytics', 'Commerce & Business Analytics', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'james.d@university.edu', '7376242BA0855', 3.78, 130, 910),
  ('USR-STU-0901', 'Priya Sharma', 'student', 'B.Tech Information Technology', 'Information Technology', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'priya.sharma@bitsathy.ac.in', '7376242IT901', 3.91, 136, 1050),
  ('USR-MNT-002', 'Ragunath M ( MC10412 )', 'mentor', 'Assistant Professor & IT Mentor', 'Information Technology', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'ragunathm@bitsathy.ac.in', null, null, null, null),
  ('USR-HOD-003', 'Dr. Selvakumar T', 'hod', 'Head of Department (IT)', 'Information Technology', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'selvakumart@bitsathy.ac.in', null, null, null, null),
  ('USR-PLC-004', 'Ranjith Kumar', 'placement', 'Senior Placement Cell Officer', 'Central Placement Directorate', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', 'ranjithkumar@bitsathy.ac.in', null, null, null, null),
  ('USR-ADM-005', 'Palanisamy', 'admin', 'Overall System Administrator', 'Directorate of Academic Affairs', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'palanisamy@bitsathy.ac.in', null, null, null, null)
on conflict (id) do nothing;

-- 2. Seed Partner Companies
insert into public.partner_companies (id, name, industry, website, logo, active_interns_count, total_hired_count, avg_stipend, contact_person, contact_email, status, rating)
values
  ('CMP-001', 'Nexus Tech Systems', 'AI & Cloud Infrastructure', 'https://nexustech.ai', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80', 24, 88, '$3,200/mo', 'David K. (University Recruiter)', 'campus@nexustech.ai', 'Tier 1 Global', 4.9),
  ('CMP-002', 'Vanguard Finance', 'Fintech & Quantitative Trading', 'https://vanguardfin.com', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80', 18, 62, '$2,800/mo', 'Elizabeth Ross', 'e.ross@vanguardfin.com', 'Verified Partner', 4.8),
  ('CMP-003', 'Elysian Media Group', 'Digital Media & Product UX', 'https://elysianmedia.com', 'https://images.unsplash.com/photo-1542744094-3a317272018a?w=100&auto=format&fit=crop&q=80', 12, 34, '$2,000/mo', 'Liam Hemsworth', 'hr@elysianmedia.com', 'Verified Partner', 4.7),
  ('CMP-004', 'Vercel Inc.', 'Web Developer Experience', 'https://vercel.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 15, 45, '$2,500/mo', 'Sarah Parker', 's.parker@vercel.com', 'Tier 1 Global', 5.0)
on conflict (id) do nothing;

-- 3. Seed Applications
insert into public.applications (
  id, student_id, student_name, student_avatar, student_email, student_degree, department, cgpa,
  company_name, company_logo, industry, company_website, company_address, hr_name, hr_email, hr_phone,
  role_title, work_mode, location, start_date, end_date, duration_months, stipend_amount, stipend_currency,
  stage, submitted_date, last_updated, priority, assigned_mentor_id, assigned_mentor_name,
  documents, timeline, internal_remarks, ip_address, audit_hash
)
values
  (
    'IN-1-7376242CS0842', 'USR-STU-0842', 'Arjun Malhotra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'arjun.m@university.edu', 'B.Tech Computer Science', 'Computer Science & Engineering', 3.92,
    'Vercel Inc.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Cloud & Web Infrastructure', 'https://vercel.com', '340 S Lemon Ave #4133, Walnut, CA 91789, USA', 'Sarah Parker', 's.parker@vercel.com', '+1 (415) 890-3411',
    'Senior Frontend Engineering Intern', 'Hybrid', 'San Francisco, CA / Remote', '2024-11-01', '2025-05-01', 6, 2500, 'USD',
    'mentor_review', '2024-10-12', '2024-10-14 10:30 AM', 'High', 'USR-MNT-002', 'Dr. Helena Vance',
    $$[
      {"id": "DOC-001", "name": "Arjun_Malhotra_OfferLetter_Vercel.pdf", "type": "Offer Letter", "size": "1.4 MB", "uploadDate": "2024-10-12", "url": "#", "status": "Verified", "parsedData": {"companyName": "Vercel Inc.", "stipend": "$2,500 / month", "duration": "6 Months (Nov 2024 - May 2025)", "startDate": "2024-11-01", "hrContact": "Sarah Parker (s.parker@vercel.com)"}},
      {"id": "DOC-002", "name": "Arjun_Malhotra_Resume_v4.pdf", "type": "Resume", "size": "890 KB", "uploadDate": "2024-10-12", "url": "#", "status": "Verified"},
      {"id": "DOC-003", "name": "Dept_NOC_Verification_Signed.pdf", "type": "NOC Document", "size": "1.1 MB", "uploadDate": "2024-10-13", "url": "#", "status": "Verified"}
    ]$$::jsonb,
    $$[
      {"id": "TL-1", "title": "Application Submitted", "role": "Student", "approverName": "Arjun Malhotra", "status": "completed", "date": "Oct 12, 2024 • 09:15 AM", "remarks": "Submitted complete offer letter & signed student pledge."},
      {"id": "TL-2", "title": "Academic Mentor Review", "role": "Academic Mentor", "approverName": "Dr. Helena Vance", "status": "in_progress", "date": "Oct 13, 2024 • Active", "remarks": "Verification in progress. Coursework credits verified."},
      {"id": "TL-3", "title": "HOD Clearance & Sign-off", "role": "HOD Office", "approverName": "Dr. Sarah Jenkins", "status": "upcoming"},
      {"id": "TL-4", "title": "Placement Cell Final Endorsement", "role": "Placement Cell", "approverName": "Dr. Sarah Chen", "status": "upcoming"}
    ]$$::jsonb,
    'Strong academic record (3.92 CGPA). Offer letter verified against HR contact. Recommend quick approval before project onboarding.',
    '192.168.1.104', '0x8f2a...91ce'
  ),
  (
    'IN-2-7376242IT259', 'USR-STU-001', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'alex.rivera@university.edu', 'B.Tech Software Engineering', 'Computer Science & Engineering', 3.89,
    'CloudCore Systems', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80', 'Enterprise SaaS', 'https://cloudcore.io', '100 Silicon Way, Austin, TX 78701', 'Marcus Vance', 'marcus@cloudcore.io', '+1 (512) 440-1920',
    'Junior Frontend Developer Intern', 'Remote', 'Austin, TX / Remote', '2024-06-01', '2024-12-01', 6, 2200, 'USD',
    'approved', '2024-05-15', '2024-05-20', 'Normal', 'USR-MNT-002', 'Dr. Helena Vance',
    $$[{"id": "DOC-101", "name": "Alex_Rivera_CloudCore_Offer.pdf", "type": "Offer Letter", "size": "1.2 MB", "uploadDate": "2024-05-15", "url": "#", "status": "Verified"}]$$::jsonb,
    $$[
      {"id": "TL-101", "title": "Application Submitted", "role": "Student", "approverName": "Alex Rivera", "status": "completed", "date": "May 15, 2024"},
      {"id": "TL-102", "title": "Academic Mentor Review", "role": "Academic Mentor", "approverName": "Dr. Helena Vance", "status": "completed", "date": "May 16, 2024"},
      {"id": "TL-103", "title": "HOD Clearance & Sign-off", "role": "HOD Office", "approverName": "Dr. Sarah Jenkins", "status": "completed", "date": "May 18, 2024"},
      {"id": "TL-104", "title": "Placement Cell Endorsement", "role": "Placement Cell", "approverName": "Dr. Sarah Chen", "status": "completed", "date": "May 20, 2024"}
    ]$$::jsonb,
    null, '10.0.4.12', '0x3c11...88ab'
  ),
  (
    'IN-3-7376242DS0810', 'USR-STU-0850', 'Sarah Parker', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'sarah.p@university.edu', 'B.Tech Data Science', 'Computer Science & Engineering', 3.95,
    'Nexus Tech Systems', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80', 'AI & Machine Learning', 'https://nexustech.ai', 'Innovation Tower, Seattle, WA', 'David K.', 'careers@nexustech.ai', '+1 (206) 555-0199',
    'ML Research Intern', 'Onsite', 'Seattle, WA', '2024-11-15', '2025-05-15', 6, 3200, 'USD',
    'hod_review', '2024-10-14', '2024-10-15', 'Urgent', 'USR-MNT-002', 'Dr. Julian Thorne',
    '[]'::jsonb,
    $$[
      {"id": "TL-201", "title": "Application Submitted", "role": "Student", "approverName": "Sarah Parker", "status": "completed", "date": "Oct 14, 2024"},
      {"id": "TL-202", "title": "Academic Mentor Review", "role": "Academic Mentor", "approverName": "Dr. Julian Thorne", "status": "completed", "date": "Oct 15, 2024"},
      {"id": "TL-203", "title": "HOD Clearance & Sign-off", "role": "HOD Office", "approverName": "Dr. Sarah Jenkins", "status": "in_progress", "date": "Oct 15, 2024 • Active"},
      {"id": "TL-204", "title": "Placement Cell Endorsement", "role": "Placement Cell", "approverName": "Dr. Sarah Chen", "status": "upcoming"}
    ]$$::jsonb,
    null, '172.16.0.42', '0x99dd...01cc'
  ),
  (
    'IN-4-7376242BA0855', 'USR-STU-0855', 'James Dalton', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'james.d@university.edu', 'B.Com Financial Analytics', 'Commerce & Business Analytics', 3.78,
    'Vanguard Finance', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80', 'Fintech & Quantitative Trading', 'https://vanguardfin.com', 'Wall Street Plaza, New York, NY', 'Elizabeth Ross', 'e.ross@vanguardfin.com', '+1 (212) 800-4490',
    'Quantitative Risk Intern', 'Hybrid', 'New York, NY', '2024-12-01', '2025-06-01', 6, 2800, 'USD',
    'placement_review', '2024-10-10', '2024-10-16', 'Normal', 'USR-MNT-002', 'Prof. Alan Vance',
    '[]'::jsonb,
    $$[
      {"id": "TL-301", "title": "Application Submitted", "role": "Student", "approverName": "James Dalton", "status": "completed", "date": "Oct 10, 2024"},
      {"id": "TL-302", "title": "Academic Mentor Review", "role": "Academic Mentor", "approverName": "Prof. Alan Vance", "status": "completed", "date": "Oct 12, 2024"},
      {"id": "TL-303", "title": "HOD Clearance & Sign-off", "role": "HOD Office", "approverName": "Dr. Michael Chang", "status": "completed", "date": "Oct 14, 2024"},
      {"id": "TL-304", "title": "Placement Cell Endorsement", "role": "Placement Cell", "approverName": "Dr. Sarah Chen", "status": "in_progress", "date": "Oct 16, 2024 • Active"}
    ]$$::jsonb,
    null, '192.168.3.88', '0x44aa...77ff'
  )
on conflict (id) do nothing;

-- 4. Seed Weekly Reports
insert into public.weekly_reports (id, student_id, student_name, company_name, week_number, title, summary, hours_logged, submitted_date, status, mentor_feedback, score)
values
  ('REP-001', 'USR-STU-001', 'Alex Rivera', 'CloudCore Systems', 18, 'Migrated Component Library to React 19 & Tailwind v4', 'Successfully refactored 24 legacy React UI components. Implemented optimistic UI updates for dashboard tables and optimized canvas rendering by 35%. Conducted code review with Lead Engineer.', 40, '2024-10-18', 'Pending Review', '', null),
  ('REP-002', 'USR-STU-0842', 'Arjun Malhotra', 'Vercel Inc.', 1, 'Orientation & Next.js Edge Runtime Setup', 'Completed onboarding, setup local dev environment, built baseline test pipeline for edge middleware.', 38, '2024-10-14', 'Approved', 'Excellently documented report. Good job setting up edge middleware early.', 9.5)
on conflict (id) do nothing;

-- 5. Seed Tracker Submissions
insert into public.tracker_submissions (
  id, application_id, student_id, student_name, log_date, daily_progress, weekly_progress, tasks_completed,
  hours_worked, learning_outcomes, skills_learned, attendance, mentor_remarks, progress_percentage, screenshot_url, file_url
)
values
  (
    'TRK-001', 'IN-1-7376242CS0842', 'USR-STU-0842', 'Arjun Malhotra', '2026-07-30',
    'Designed state machines for approval stage transitions and built backend API route wrappers.',
    'Completed core logic for report generation workflows and successfully ran end-to-end integration tests.',
    'Stage 1 application schema migration, Express router endpoints for PDF generators.',
    8, 'Understood edge runtime constraints and optimized database querying logic.',
    'React 19, TypeScript, TailwindCSS v4', 'Present', 'Great progress. Ensure database indexes are set correctly.', 65,
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', null
  )
on conflict (id) do nothing;

-- 6. Seed Report Submissions
insert into public.report_submissions (
  id, application_id, student_id, student_name, company_name, industry, sector, company_website, company_address,
  start_date, end_date, duration_months, stipend_amount, project_title, project_description, technologies_used,
  skills_learned, learning_outcomes, responsibilities, challenges_faced, solutions, experience_summary,
  student_feedback, company_feedback, report_file, completion_cert_file, original_cert_file, attested_cert_file,
  presentation_file, additional_doc_file, stage, submitted_date, mentor_remarks, hod_remarks, placement_remarks
)
values
  (
    'REP-SUB-001', 'IN-1-7376242CS0842', 'USR-STU-0842', 'Arjun Malhotra', 'Vercel Inc.', 'Cloud & Web Infrastructure', 'Technology', 'https://vercel.com', '340 S Lemon Ave #4133, Walnut, CA 91789, USA',
    '2026-06-01', '2026-07-31', 2, 2500, 'Edge Analytics Dashboard Integrations',
    'Developed full stack dashboard tracking real-time web telemetry and cache hit ratios for Next.js app host deployments.',
    'Next.js, Tailwind v4, React 19, Express, PostgreSQL',
    'Cloud systems architecture, telemetry streaming, multi-tier approvals',
    'Acquired production experience in edge networking and performance auditing.',
    'Lead Frontend Developer for telemetry metrics charts module.',
    'Network latency during high throughput stream ingestion.',
    'Implemented client-side request batching and debounced polling.',
    'Excellent learning experience working under senior developers.',
    'Extremely supportive workspace with great learning resources.',
    'Arjun has done a phenomenal job building stable charting dashboards.',
    'Arjun_Vercel_Internship_Report.pdf', 'Arjun_Vercel_Completion_Certificate.pdf',
    null, null, null, null, 'completed', '2026-07-31', null, null, null
  )
on conflict (id) do nothing;

-- 7. Seed Audit Logs
insert into public.audit_logs (id, timestamp, username, action, target_id, details, ip)
values
  ('AUD-001', '2024-10-16 14:22:10', 'Dr. Helena Vance', 'Mentor Approved Application', 'IN-3-7376242DS0810', 'Verified offer letter authenticity with HR Contact David K.', '192.168.1.104'),
  ('AUD-002', '2024-10-15 09:12:04', 'Alex Rivera', 'Uploaded Weekly Report #18', 'REP-001', 'Submitted 40 hours work log for CloudCore Systems.', '10.0.4.12')
on conflict (id) do nothing;

-- 8. Seed Departments
insert into public.departments (id, name, code, hod_name, active_students)
values
  ('DEP-001', 'Computer Science & Engineering', 'CSE', 'Dr. Sarah Jenkins', 148),
  ('DEP-002', 'Information Technology', 'IT', 'Dr. Helena Vance', 92),
  ('DEP-003', 'Electronics & Communication', 'ECE', 'Dr. Thomas Sterling', 110)
on conflict (id) do nothing;
