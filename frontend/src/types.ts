export type UserRole = 'student' | 'mentor' | 'hod' | 'placement' | 'admin' | 'public';

export type ApplicationStage = 
  | 'draft'
  | 'submitted' 
  | 'mentor_review' 
  | 'hod_review' 
  | 'placement_review' 
  | 'approved' 
  | 'changes_requested' 
  | 'rejected';

export type WorkMode = 'Onsite' | 'Remote' | 'Hybrid';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatarUrl: string;
  email: string;
  studentId?: string;
  cgpa?: number;
  totalCredits?: number;
  rewardPoints?: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'Resume' | 'Offer Letter' | 'NOC Document' | 'Weekly Report' | 'Midterm Evaluation';
  size: string;
  uploadDate: string;
  url: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  parsedData?: {
    companyName?: string;
    stipend?: string;
    duration?: string;
    startDate?: string;
    hrContact?: string;
  };
}

export interface ApprovalStep {
  id: string;
  title: string;
  role: 'Student' | 'Academic Mentor' | 'HOD Office' | 'Placement Cell';
  approverName?: string;
  status: 'completed' | 'in_progress' | 'upcoming' | 'rejected' | 'changes_requested';
  date?: string;
  remarks?: string;
}

export interface InternshipApplication {
  id: string; // e.g. APP-2024-0842
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  studentDegree: string;
  department: string;
  cgpa: number;
  
  companyName: string;
  companyLogo?: string;
  industry: string;
  companyWebsite: string;
  companyAddress: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;

  roleTitle: string;
  workMode: WorkMode;
  location: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  stipendAmount: number;
  stipendCurrency: string;
  
  stage: ApplicationStage;
  submittedDate: string;
  lastUpdated: string;
  priority: 'Normal' | 'High' | 'Urgent';
  
  assignedMentorId: string;
  assignedMentorName: string;
  
  documents: DocumentFile[];
  timeline: ApprovalStep[];
  internalRemarks?: string;
  ipAddress: string;
  auditHash: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  weekNumber: number;
  title: string;
  summary: string;
  hoursLogged: number;
  submittedDate: string;
  status: 'Pending Review' | 'Approved' | 'Revision Requested';
  mentorFeedback?: string;
  score?: number; // 1-10
}

export interface PartnerCompany {
  id: string;
  name: string;
  industry: string;
  website: string;
  logo: string;
  activeInternsCount: number;
  totalHiredCount: number;
  avgStipend: string;
  contactPerson: string;
  contactEmail: string;
  status: 'Verified Partner' | 'Pending Audit' | 'Tier 1 Global';
  rating: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  targetId: string;
  details: string;
  ip: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  badge?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet';
}

export interface InternshipTrackerSubmission {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  logDate: string;
  dailyProgress: string;
  weeklyProgress: string;
  tasksCompleted: string;
  hoursWorked: number;
  learningOutcomes: string;
  skillsLearned: string;
  attendance: 'Present' | 'Absent' | 'Leave';
  mentorRemarks?: string;
  progressPercentage: number;
  screenshotUrl?: string;
  fileUrl?: string;
}

export interface InternshipReportSubmission {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  
  // Read-only fetched
  companyName: string;
  industry: string;
  sector: string;
  companyWebsite: string;
  companyAddress: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  stipendAmount: number;

  // Student filled
  projectTitle: string;
  projectDescription: string;
  technologiesUsed: string;
  skillsLearned: string;
  learningOutcomes: string;
  responsibilities: string;
  challengesFaced: string;
  solutions: string;
  experienceSummary: string;
  studentFeedback: string;
  companyFeedback: string;

  // Uploads
  reportFile?: string;
  completionCertFile?: string;
  originalCertFile?: string;
  attestedCertFile?: string;
  presentationFile?: string;
  additionalDocFile?: string;

  stage: 'submitted' | 'mentor_review' | 'hod_review' | 'placement_review' | 'completed' | 'rejected';
  submittedDate: string;
  mentorApprovedDate?: string;
  hodApprovedDate?: string;
  placementApprovedDate?: string;
  mentorRemarks?: string;
  hodRemarks?: string;
  placementRemarks?: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  hodName: string;
  activeStudents: number;
}

