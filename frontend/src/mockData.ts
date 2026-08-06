import { 
  UserProfile, 
  InternshipApplication, 
  PartnerCompany, 
  WeeklyReport, 
  AuditLog,
  DepartmentRecord,
  InternshipTrackerSubmission,
  InternshipReportSubmission 
} from './types';

export const CURRENT_USERS: Record<string, UserProfile> = {
  student: {
    id: 'USR-STU-001',
    name: 'PRAVEEN KUMAR K A',
    role: 'student',
    title: 'B.Tech. - INFORMATION TECHNOLOGY',
    department: 'Information Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'praveenkumarka.it24@bitsathy.ac.in',
    studentId: '7376242IT259',
    cgpa: 3.89,
    totalCredits: 142,
    rewardPoints: 1150
  },
  mentor: {
    id: 'USR-MNT-002',
    name: 'Ragunath M ( MC10412 )',
    role: 'mentor',
    title: 'Assistant Professor & IT Mentor',
    department: 'Information Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'ragunathm@bitsathy.ac.in'
  },
  hod: {
    id: 'USR-HOD-003',
    name: 'Dr. Selvakumar T',
    role: 'hod',
    title: 'Head of Department (IT)',
    department: 'Information Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'selvakumart@bitsathy.ac.in'
  },
  placement: {
    id: 'USR-PLC-004',
    name: 'Ranjith Kumar',
    role: 'placement',
    title: 'Senior Placement Cell Officer',
    department: 'Central Placement Directorate',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    email: 'ranjithkumar@bitsathy.ac.in'
  },
  admin: {
    id: 'USR-ADM-005',
    name: 'Palanisamy',
    role: 'admin',
    title: 'Overall System Administrator',
    department: 'Directorate of Academic Affairs',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'palanisamy@bitsathy.ac.in'
  }
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  CURRENT_USERS.student,
  {
    id: 'USR-STU-0842',
    name: 'Arjun Malhotra',
    role: 'student',
    title: 'B.Tech Computer Science',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'arjun.m@university.edu',
    studentId: '7376242CS0842',
    cgpa: 3.92,
    totalCredits: 140,
    rewardPoints: 1100
  },
  {
    id: 'USR-STU-0799',
    name: 'Alex Rivera',
    role: 'student',
    title: 'B.Tech Software Engineering',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'alex.rivera@university.edu',
    studentId: '7376242SE0799',
    cgpa: 3.85,
    totalCredits: 138,
    rewardPoints: 980
  },
  {
    id: 'USR-STU-0810',
    name: 'Sophia Lin',
    role: 'student',
    title: 'B.Sc Data Science',
    department: 'Data Science & AI',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'sophia.l@university.edu',
    studentId: '7376242DS0810',
    cgpa: 3.95,
    totalCredits: 145,
    rewardPoints: 1250
  },
  {
    id: 'USR-STU-0855',
    name: 'James Dalton',
    role: 'student',
    title: 'B.Com Financial Analytics',
    department: 'Commerce & Business Analytics',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'james.d@university.edu',
    studentId: '7376242BA0855',
    cgpa: 3.78,
    totalCredits: 130,
    rewardPoints: 910
  },
  {
    id: 'USR-STU-0901',
    name: 'Priya Sharma',
    role: 'student',
    title: 'B.Tech Information Technology',
    department: 'Information Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'priya.sharma@bitsathy.ac.in',
    studentId: '7376242IT901',
    cgpa: 3.91,
    totalCredits: 136,
    rewardPoints: 1050
  },
  CURRENT_USERS.mentor,
  CURRENT_USERS.hod,
  CURRENT_USERS.placement,
  CURRENT_USERS.admin
];

export const INITIAL_APPLICATIONS: InternshipApplication[] = [];

export const INITIAL_PARTNER_COMPANIES: PartnerCompany[] = [
  {
    id: 'CMP-001',
    name: 'Nexus Tech Systems',
    industry: 'AI & Cloud Infrastructure',
    website: 'https://nexustech.ai',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    activeInternsCount: 24,
    totalHiredCount: 88,
    avgStipend: '$3,200/mo',
    contactPerson: 'David K. (University Recruiter)',
    contactEmail: 'campus@nexustech.ai',
    status: 'Tier 1 Global',
    rating: 4.9
  },
  {
    id: 'CMP-002',
    name: 'Vanguard Finance',
    industry: 'Fintech & Quantitative Trading',
    website: 'https://vanguardfin.com',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    activeInternsCount: 18,
    totalHiredCount: 62,
    avgStipend: '$2,800/mo',
    contactPerson: 'Elizabeth Ross',
    contactEmail: 'e.ross@vanguardfin.com',
    status: 'Verified Partner',
    rating: 4.8
  },
  {
    id: 'CMP-003',
    name: 'Elysian Media Group',
    industry: 'Digital Media & Product UX',
    website: 'https://elysianmedia.com',
    logo: 'https://images.unsplash.com/photo-1542744094-3a317272018a?w=100&auto=format&fit=crop&q=80',
    activeInternsCount: 12,
    totalHiredCount: 34,
    avgStipend: '$2,000/mo',
    contactPerson: 'Liam Hemsworth',
    contactEmail: 'hr@elysianmedia.com',
    status: 'Verified Partner',
    rating: 4.7
  },
  {
    id: 'CMP-004',
    name: 'Vercel Inc.',
    industry: 'Web Developer Experience',
    website: 'https://vercel.com',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    activeInternsCount: 15,
    totalHiredCount: 45,
    avgStipend: '$2,500/mo',
    contactPerson: 'Sarah Parker',
    contactEmail: 's.parker@vercel.com',
    status: 'Tier 1 Global',
    rating: 5.0
  }
];

export const INITIAL_WEEKLY_REPORTS: WeeklyReport[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2024-10-16 14:22:10',
    user: 'Dr. Helena Vance',
    action: 'Mentor Approved Application',
    targetId: 'IN-3-7376242DS0810',
    details: 'Verified offer letter authenticity with HR Contact David K.',
    ip: '192.168.1.104'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-10-15 09:12:04',
    user: 'Alex Rivera',
    action: 'Uploaded Weekly Report #18',
    targetId: 'REP-001',
    details: 'Submitted 40 hours work log for CloudCore Systems.',
    ip: '10.0.4.12'
  }
];

export const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'DEP-001', name: 'Computer Science & Engineering', code: 'CSE', hodName: 'Dr. Sarah Jenkins', activeStudents: 148 },
  { id: 'DEP-002', name: 'Information Technology', code: 'IT', hodName: 'Dr. Helena Vance', activeStudents: 92 },
  { id: 'DEP-003', name: 'Electronics & Communication', code: 'ECE', hodName: 'Dr. Thomas Sterling', activeStudents: 110 }
];

export const INITIAL_TRACKER_SUBMISSIONS: InternshipTrackerSubmission[] = [];

export const INITIAL_REPORT_SUBMISSIONS: InternshipReportSubmission[] = [];
