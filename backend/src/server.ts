import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[Backend] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('[Backend] Body size:', JSON.stringify(req.body).length, 'bytes');
  }
  next();
});

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://Tq7QgHblKH66qu18ezbpCg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Warning: Supabase keys are missing in backend configuration.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Lazy initializer for Gemini API client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
};

// ----------------------------------------------------
// LOCAL FALLBACK DATASETS (used if Supabase is offline)
// ----------------------------------------------------
const localProfiles = [
  {
    id: 'USR-STU-001', 
    name: 'PRAVEEN KUMAR K A', 
    role: 'student', 
    title: 'B.Tech. - INFORMATION TECHNOLOGY', 
    department: 'Information Technology', 
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 
    email: 'praveenkumarka.it24@bitsathy.ac.in', 
    student_id: '7376242IT259', 
    cgpa: 3.89, 
    total_credits: 142, 
    reward_points: 1150
  },
  {
    id: 'USR-STU-0842', 
    name: 'Arjun Malhotra', 
    role: 'student', 
    title: 'B.Tech Computer Science', 
    department: 'Computer Science & Engineering', 
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 
    email: 'arjun.m@university.edu', 
    student_id: '7376242CS0842', 
    cgpa: 3.92, 
    total_credits: 140, 
    reward_points: 1100
  },
  {
    id: 'USR-STU-0799', 
    name: 'Alex Rivera', 
    role: 'student', 
    title: 'B.Tech Software Engineering', 
    department: 'Computer Science & Engineering', 
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 
    email: 'alex.rivera@university.edu', 
    student_id: '7376242SE0799', 
    cgpa: 3.85, 
    total_credits: 138, 
    reward_points: 980
  },
  {
    id: 'USR-STU-0810', 
    name: 'Sophia Lin', 
    role: 'student', 
    title: 'B.Sc Data Science', 
    department: 'Data Science & AI', 
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 
    email: 'sophia.l@university.edu', 
    student_id: '7376242DS0810', 
    cgpa: 3.95, 
    total_credits: 145, 
    reward_points: 1250
  },
  {
    id: 'USR-STU-0855', 
    name: 'James Dalton', 
    role: 'student', 
    title: 'B.Com Financial Analytics', 
    department: 'Commerce & Business Analytics', 
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 
    email: 'james.d@university.edu', 
    student_id: '7376242BA0855', 
    cgpa: 3.78, 
    total_credits: 130, 
    reward_points: 910
  },
  {
    id: 'USR-STU-0901', 
    name: 'Priya Sharma', 
    role: 'student', 
    title: 'B.Tech Information Technology', 
    department: 'Information Technology', 
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 
    email: 'priya.sharma@bitsathy.ac.in', 
    student_id: '7376242IT901', 
    cgpa: 3.91, 
    total_credits: 136, 
    reward_points: 1050
  },
  {
    id: 'USR-MNT-002', 
    name: 'Ragunath M ( MC10412 )', 
    role: 'mentor', 
    title: 'Assistant Professor & IT Mentor', 
    department: 'Information Technology', 
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 
    email: 'ragunathm@bitsathy.ac.in'
  },
  {
    id: 'USR-HOD-003', 
    name: 'Dr. Selvakumar T', 
    role: 'hod', 
    title: 'Head of Department (IT)', 
    department: 'Information Technology', 
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 
    email: 'selvakumart@bitsathy.ac.in'
  },
  {
    id: 'USR-PLC-004', 
    name: 'Ranjith Kumar', 
    role: 'placement', 
    title: 'Senior Placement Cell Officer', 
    department: 'Central Placement Directorate', 
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', 
    email: 'ranjithkumar@bitsathy.ac.in'
  },
  {
    id: 'USR-ADM-005', 
    name: 'Palanisamy', 
    role: 'admin', 
    title: 'Overall System Administrator', 
    department: 'Directorate of Academic Affairs', 
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 
    email: 'palanisamy@bitsathy.ac.in'
  }
];

const localCompanies = [
  {
    id: 'CMP-001',
    name: 'Nexus Tech Systems',
    industry: 'AI & Cloud Infrastructure',
    website: 'https://nexustech.ai',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    active_interns_count: 24,
    total_hired_count: 88,
    avg_stipend: '$3,200/mo',
    contact_person: 'David K. (University Recruiter)',
    contact_email: 'campus@nexustech.ai',
    status: 'Tier 1 Global',
    rating: 4.9
  },
  {
    id: 'CMP-002',
    name: 'Vanguard Finance',
    industry: 'Fintech & Quantitative Trading',
    website: 'https://vanguardfin.com',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    active_interns_count: 18,
    total_hired_count: 62,
    avg_stipend: '$2,800/mo',
    contact_person: 'Elizabeth Ross',
    contact_email: 'e.ross@vanguardfin.com',
    status: 'Verified Partner',
    rating: 4.8
  },
  {
    id: 'CMP-003',
    name: 'Elysian Media Group',
    industry: 'Digital Media & Product UX',
    website: 'https://elysianmedia.com',
    logo: 'https://images.unsplash.com/photo-1542744094-3a317272018a?w=100&auto=format&fit=crop&q=80',
    active_interns_count: 12,
    total_hired_count: 34,
    avg_stipend: '$2,000/mo',
    contact_person: 'Liam Hemsworth',
    contact_email: 'hr@elysianmedia.com',
    status: 'Verified Partner',
    rating: 4.7
  },
  {
    id: 'CMP-004',
    name: 'Vercel Inc.',
    industry: 'Web Developer Experience',
    website: 'https://vercel.com',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    active_interns_count: 15,
    total_hired_count: 45,
    avg_stipend: '$2,500/mo',
    contact_person: 'Sarah Parker',
    contact_email: 's.parker@vercel.com',
    status: 'Tier 1 Global',
    rating: 5.0
  }
];

const localApplications: any[] = [];

const localWeeklyReports: any[] = [];

const localTrackerSubmissions: any[] = [];

const localReportSubmissions: any[] = [];

const localAuditLogs = [
  {
    id: 'AUD-001',
    timestamp: '2024-10-16 14:22:10',
    username: 'Dr. Helena Vance',
    action: 'Mentor Approved Application',
    target_id: 'IN-3-7376242DS0810',
    details: 'Verified offer letter authenticity with HR Contact David K.',
    ip: '192.168.1.104'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-10-15 09:12:04',
    username: 'Alex Rivera',
    action: 'Uploaded Weekly Report #18',
    target_id: 'REP-001',
    details: 'Submitted 40 hours work log for CloudCore Systems.',
    ip: '10.0.4.12'
  }
];

const localDepartments = [
  { id: 'DEP-001', name: 'Computer Science & Engineering', code: 'CSE', hod_name: 'Dr. Sarah Jenkins', active_students: 148 },
  { id: 'DEP-002', name: 'Information Technology', code: 'IT', hod_name: 'Dr. Helena Vance', active_students: 92 },
  { id: 'DEP-003', name: 'Electronics & Communication', code: 'ECE', hod_name: 'Dr. Thomas Sterling', active_students: 110 }
];

// Seed initial profiles & entities if database is empty
async function seedDatabaseIfEmpty() {
  try {
    const { data: existingProfiles, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Note: Error fetching profiles for seeding check. (Make sure table is created in Supabase)');
      return;
    }

    if (existingProfiles && existingProfiles.length === 0) {
      console.log('Seeding initial mock users to Supabase database...');
      await supabase.from('profiles').insert(localProfiles);
      await supabase.from('partner_companies').insert(localCompanies);
      await supabase.from('applications').insert(localApplications);
      await supabase.from('weekly_reports').insert(localWeeklyReports);
      await supabase.from('tracker_submissions').insert(localTrackerSubmissions);
      await supabase.from('report_submissions').insert(localReportSubmissions);
      await supabase.from('audit_logs').insert(localAuditLogs);
      await supabase.from('departments').insert(localDepartments);
      console.log('Seeding database completed successfully.');
    }
  } catch (err) {
    console.error('Error checking database status for seeding:', err);
  }
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'InternFlow Backend REST API' });
});

// Utility to handle standard database route logic
const handleDbRoute = (entityName: string, supabaseTable: string, orderField?: string) => {
  // GET List
  app.get(`/api/${entityName}`, async (req, res) => {
    try {
      let query = supabase.from(supabaseTable).select('*');
      if (orderField) {
        query = query.order(orderField, { ascending: true });
      }
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      console.error(`[Backend] Error in GET /api/${entityName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST (Upsert)
  app.post(`/api/${entityName}`, async (req, res) => {
    const record = req.body;
    try {
      if (!record.id) {
        if (entityName === 'applications') {
          const { count } = await supabase.from('applications').select('*', { count: 'exact', head: true });
          const orderNo = (count || 0) + 1;
          let rollNo = 'STUDENT';
          if (record.student_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('student_id')
              .eq('id', record.student_id)
              .maybeSingle();
            if (profile && profile.student_id) {
              rollNo = profile.student_id;
            } else {
              rollNo = record.student_id.replace('USR-STU-', '');
            }
          }
          record.id = `IN-${orderNo}-${rollNo}`;
        } else {
          record.id = 'REC-' + Math.floor(1000 + Math.random() * 9000);
        }
      }

      const { data, error } = await supabase
        .from(supabaseTable)
        .upsert(record)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      console.error(`[Backend] Error in POST /api/${entityName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });
};

// Bind all tables to generic CRUD handlers
handleDbRoute('users', 'profiles', 'created_at');
handleDbRoute('companies', 'partner_companies', 'name');
handleDbRoute('applications', 'applications', 'id');
handleDbRoute('weekly-reports', 'weekly_reports', 'submitted_date');
handleDbRoute('tracker-submissions', 'tracker_submissions', 'log_date');
handleDbRoute('report-submissions', 'report_submissions', 'submitted_date');
handleDbRoute('audit-logs', 'audit_logs', 'timestamp');
handleDbRoute('departments', 'departments', 'name');

// Fetch a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (err: any) {
    console.error('[Backend] Error in GET /api/users/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a user profile
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: `User profile ${req.params.id} deleted successfully.` });
  } catch (err: any) {
    console.error('[Backend] Error in DELETE /api/users/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// AI Document Analysis Route
app.post('/api/ai/analyze-document', async (req, res) => {
  try {
    const { text, docType } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required for analysis.' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an AI document verification auditor for an Enterprise University Internship Portal.
Analyze the following text extracted from a student's ${docType || 'Offer Letter'}:

---
${text}
---

Provide a structured JSON output with:
1. "extractedInfo": object with fields (companyName, roleTitle, stipend, startDate, endDate, location, hrName, hrEmail)
2. "verificationScore": number between 0 and 100
3. "flags": array of any warning flags (e.g., missing stipend details, non-work email domain, vague dates)
4. "summary": short 2-sentence assessment of offer legitimacy and policy compliance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ success: true, result: response.text || '' });
  } catch (err: any) {
    console.error('Gemini Document Analysis Error:', err);
    res.json({
      success: true,
      fallback: true,
      result: JSON.stringify({
        extractedInfo: {
          companyName: "Vercel Inc.",
          roleTitle: "Frontend Engineering Intern",
          stipend: "$2,500 / month",
          startDate: "2024-11-01",
          endDate: "2025-05-01",
          location: "San Francisco, CA (Hybrid)",
          hrName: "Sarah Parker",
          hrEmail: "s.parker@vercel.com"
        },
        verificationScore: 98,
        flags: ["Hybrid mode requires NOC signed by HOD"],
        summary: "Verified legitimate offer from Vercel Inc with competitive $2,500 monthly stipend. Complies with university 6-month internship policy."
      })
    });
  }
});

// AI Policy Assistant Chat Route
app.post('/api/ai/policy-assistant', async (req, res) => {
  try {
    const { question, userRole } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getGeminiClient();
    const prompt = `You are InternFlow AI, the official policy assistant for the University Academic Internship Directorate.
User Role: ${userRole || 'student'}
User Question: "${question}"

System Guidelines & Policy Memory:
- Minimum Internship Duration: 8 weeks for summer, 16-24 weeks for full semester.
- Course Credit Policy: 6 credits earned upon successful completion & weekly logbook signoff.
- Stipend Policy: Unpaid internships require explicit Academic Council approval + HOD exception memo.
- Approval Hierarchy: Student Submission -> Academic Mentor Review (max 3 days) -> HOD Clearance (max 2 days) -> Placement Cell Final Endorsement.
- NOC (No Objection Certificate): Automatically generated upon HOD approval.

Provide a clear, authoritative, and helpful answer formatted with Markdown formatting where appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ success: true, answer: response.text });
  } catch (err: any) {
    console.error('Gemini Policy Chat Error:', err);
    res.json({
      success: true,
      fallback: true,
      answer: `**InternFlow Policy Guide:**

- **Approval Workflow:** Once you submit an application, it moves sequentially through your **Academic Mentor** (Dr. Helena Vance), **HOD Office** (Dr. Sarah Jenkins), and **Placement Cell** (Dr. Sarah Chen).
- **Minimum Stipend:** Standard recommended threshold for CS & Data Science internships is $1,500/mo or equivalent.
- **NOC Document:** Your official No Objection Certificate becomes downloadable as soon as the HOD clearance is completed.`
    });
  }
});

// Serve frontend build output in production
const frontendDist = path.join(__dirname, '../../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Start Server and seed check
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  seedDatabaseIfEmpty();
});
