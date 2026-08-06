import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  InternshipApplication, 
  PartnerCompany, 
  WeeklyReport, 
  AuditLog,
  ApplicationStage,
  InternshipTrackerSubmission,
  InternshipReportSubmission,
  DepartmentRecord
} from '../types';
import { 
  CURRENT_USERS, 
  INITIAL_REGISTERED_USERS,
  INITIAL_APPLICATIONS, 
  INITIAL_PARTNER_COMPANIES, 
  INITIAL_WEEKLY_REPORTS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPARTMENTS,
  INITIAL_TRACKER_SUBMISSIONS,
  INITIAL_REPORT_SUBMISSIONS
} from '../mockData';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  title: string;
  desc?: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  currentRole: UserRole;
  currentUser: UserProfile;
  currentView: string;
  selectedApplicationId: string | null;
  applications: InternshipApplication[];
  partnerCompanies: PartnerCompany[];
  weeklyReports: WeeklyReport[];
  auditLogs: AuditLog[];
  activeModal: 'noc_generator' | 'doc_viewer' | 'ai_assistant' | 'new_partner' | null;
  selectedDocument: any | null;
  toasts: ToastInfo[];
  
  // Extended States
  departments: DepartmentRecord[];
  trackerSubmissions: InternshipTrackerSubmission[];
  reportSubmissions: InternshipReportSubmission[];
  usersList: UserProfile[];
  
  // Actions
  switchRole: (role: UserRole, specificUser?: UserProfile) => void;
  loginAsUser: (user: UserProfile) => void;
  navigateTo: (view: string, appId?: string) => void;
  getApplicationById: (id: string) => InternshipApplication | undefined;
  approveApplication: (id: string, remarks?: string) => void;
  requestChangesApplication: (id: string, remarks: string) => void;
  rejectApplication: (id: string, remarks: string) => void;
  submitNewApplication: (newApp: Partial<InternshipApplication>) => InternshipApplication;
  addPartnerCompany: (company: Partial<PartnerCompany>) => void;
  addWeeklyReport: (report: Partial<WeeklyReport>) => void;
  reviewWeeklyReport: (reportId: string, status: 'Approved' | 'Revision Requested', score?: number, feedback?: string) => void;
  openDocumentViewer: (doc: any) => void;
  openModal: (modalName: 'noc_generator' | 'doc_viewer' | 'ai_assistant' | 'new_partner') => void;
  closeModal: () => void;
  showToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;

  // New Lifecycle Actions
  submitTrackerLog: (log: Partial<InternshipTrackerSubmission>) => void;
  submitInternshipReport: (report: Partial<InternshipReportSubmission>) => void;
  approveReportSubmission: (reportId: string, remarks?: string) => void;
  rejectReportSubmission: (reportId: string, remarks?: string) => void;
  addUser: (user: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  addDepartment: (dept: Partial<DepartmentRecord>) => void;
  issueNoc: (appId: string) => void;
  uploadDocumentToApplication: (appId: string, document: { name: string; type: string; size: string }, file?: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('currentRole');
    return (saved as UserRole) || 'public';
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : CURRENT_USERS.student;
  });
  const [currentView, setCurrentView] = useState<string>(() => {
    const saved = localStorage.getItem('currentView');
    return saved || 'landing';
  });
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(() => {
    return localStorage.getItem('selectedApplicationId') || 'IN-1-7376242CS0842';
  });

  useEffect(() => {
    localStorage.setItem('currentRole', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedApplicationId) {
      localStorage.setItem('selectedApplicationId', selectedApplicationId);
    } else {
      localStorage.removeItem('selectedApplicationId');
    }
  }, [selectedApplicationId]);
  
  const [applications, setApplications] = useState<InternshipApplication[]>(INITIAL_APPLICATIONS);
  const [partnerCompanies, setPartnerCompanies] = useState<PartnerCompany[]>(INITIAL_PARTNER_COMPANIES);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(INITIAL_WEEKLY_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  // Extended States
  const [departments, setDepartments] = useState<DepartmentRecord[]>(INITIAL_DEPARTMENTS);
  const [trackerSubmissions, setTrackerSubmissions] = useState<InternshipTrackerSubmission[]>(INITIAL_TRACKER_SUBMISSIONS);
  const [reportSubmissions, setReportSubmissions] = useState<InternshipReportSubmission[]>(INITIAL_REPORT_SUBMISSIONS);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Helper mapping functions
        const mapDbToApp = (a: any): InternshipApplication => ({
          id: a.id,
          studentId: a.student_id,
          studentName: a.student_name,
          studentAvatar: a.student_avatar,
          studentEmail: a.student_email,
          studentDegree: a.student_degree,
          department: a.department,
          cgpa: a.cgpa ? parseFloat(a.cgpa) : 0,
          companyName: a.company_name,
          companyLogo: a.company_logo,
          industry: a.industry,
          companyWebsite: a.company_website,
          companyAddress: a.company_address,
          hrName: a.hr_name,
          hrEmail: a.hr_email,
          hrPhone: a.hr_phone,
          roleTitle: a.role_title,
          workMode: a.work_mode,
          location: a.location,
          startDate: a.start_date,
          endDate: a.end_date,
          durationMonths: a.duration_months,
          stipendAmount: a.stipend_amount,
          stipendCurrency: a.stipend_currency,
          stage: a.stage,
          submittedDate: a.submitted_date,
          lastUpdated: a.last_updated,
          priority: a.priority,
          assignedMentorId: a.assigned_mentor_id,
          assignedMentorName: a.assigned_mentor_name,
          documents: a.documents || [],
          timeline: a.timeline || [],
          internalRemarks: a.internal_remarks,
          ipAddress: a.ip_address,
          auditHash: a.audit_hash
        });

        const mapDbToCompany = (c: any): PartnerCompany => ({
          id: c.id,
          name: c.name,
          industry: c.industry,
          website: c.website,
          logo: c.logo,
          activeInternsCount: c.active_interns_count,
          totalHiredCount: c.total_hired_count,
          avgStipend: c.avg_stipend,
          contactPerson: c.contact_person,
          contactEmail: c.contact_email,
          status: c.status,
          rating: c.rating ? parseFloat(c.rating) : 5.0
        });

        const mapDbToWeeklyReport = (r: any): WeeklyReport => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          companyName: r.company_name,
          weekNumber: r.week_number,
          title: r.title,
          summary: r.summary,
          hoursLogged: r.hours_logged,
          submittedDate: r.submitted_date,
          status: r.status,
          mentorFeedback: r.mentor_feedback || '',
          score: r.score || undefined
        });

        const mapDbToTracker = (t: any): InternshipTrackerSubmission => ({
          id: t.id,
          applicationId: t.application_id,
          studentId: t.student_id,
          studentName: t.student_name,
          logDate: t.log_date,
          dailyProgress: t.daily_progress,
          weeklyProgress: t.weekly_progress,
          tasksCompleted: t.tasks_completed,
          hoursWorked: t.hours_worked,
          learningOutcomes: t.learning_outcomes,
          skillsLearned: t.skills_learned,
          attendance: t.attendance,
          mentorRemarks: t.mentor_remarks,
          progressPercentage: t.progress_percentage,
          screenshotUrl: t.screenshot_url,
          fileUrl: t.file_url
        });

        const mapDbToReportSubmission = (r: any): InternshipReportSubmission => ({
          id: r.id,
          applicationId: r.application_id,
          studentId: r.student_id,
          studentName: r.student_name,
          companyName: r.company_name,
          industry: r.industry,
          sector: r.sector,
          companyWebsite: r.company_website,
          companyAddress: r.company_address,
          startDate: r.start_date,
          endDate: r.end_date,
          durationMonths: r.duration_months,
          stipendAmount: r.stipend_amount,
          projectTitle: r.project_title,
          projectDescription: r.project_description,
          technologiesUsed: r.technologies_used,
          skillsLearned: r.skills_learned,
          learningOutcomes: r.learning_outcomes,
          responsibilities: r.responsibilities,
          challengesFaced: r.challenges_faced,
          solutions: r.solutions,
          experienceSummary: r.experience_summary,
          studentFeedback: r.student_feedback,
          companyFeedback: r.company_feedback,
          reportFile: r.report_file,
          completionCertFile: r.completion_cert_file,
          originalCertFile: r.original_cert_file,
          attestedCertFile: r.attested_cert_file,
          presentationFile: r.presentation_file,
          additionalDocFile: r.additional_doc_file,
          stage: r.stage,
          submittedDate: r.submitted_date,
          mentorRemarks: r.mentor_remarks,
          hodRemarks: r.hod_remarks,
          placementRemarks: r.placement_remarks
        });

        const mapDbToAuditLog = (l: any): AuditLog => ({
          id: l.id,
          timestamp: l.timestamp,
          user: l.username,
          action: l.action,
          targetId: l.target_id,
          details: l.details,
          ip: l.ip
        });

        const mapDbToDept = (d: any): DepartmentRecord => ({
          id: d.id,
          name: d.name,
          code: d.code,
          hodName: d.hod_name,
          activeStudents: d.active_students
        });

        // 1. Fetch Users
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const data = await usersRes.json();
          const mappedUsers = data.map((u: any) => ({
            id: u.id,
            name: u.name,
            role: u.role,
            title: u.title,
            department: u.department,
            avatarUrl: u.avatar_url,
            email: u.email,
            studentId: u.student_id || undefined,
            cgpa: u.cgpa ? parseFloat(u.cgpa) : undefined,
            totalCredits: u.total_credits || undefined,
            rewardPoints: u.reward_points || undefined
          }));
          setUsersList(mappedUsers);
          const savedUserStr = localStorage.getItem('currentUser');
          let restoredUser: UserProfile | undefined;
          if (savedUserStr) {
            try {
              const parsed = JSON.parse(savedUserStr);
              restoredUser = mappedUsers.find((u: any) => u.id === parsed.id || u.email === parsed.email);
            } catch (e) {}
          }
          const userToSet = restoredUser || mappedUsers.find((u: any) => u.role === currentRole);
          if (userToSet) {
            setCurrentUser(userToSet);
          }
        } else {
          setUsersList(INITIAL_REGISTERED_USERS);
        }

        // 2. Fetch Companies
        const companiesRes = await fetch('/api/companies');
        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setPartnerCompanies(data.map(mapDbToCompany));
        } else {
          setPartnerCompanies(INITIAL_PARTNER_COMPANIES);
        }

        // 3. Fetch Applications
        const appsRes = await fetch('/api/applications');
        if (appsRes.ok) {
          const data = await appsRes.json();
          setApplications(data.map(mapDbToApp));
        } else {
          setApplications(INITIAL_APPLICATIONS);
        }

        // 4. Fetch Weekly Reports
        const reportsRes = await fetch('/api/weekly-reports');
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setWeeklyReports(data.map(mapDbToWeeklyReport));
        } else {
          setWeeklyReports(INITIAL_WEEKLY_REPORTS);
        }

        // 5. Fetch Tracker Submissions
        const trackerRes = await fetch('/api/tracker-submissions');
        if (trackerRes.ok) {
          const data = await trackerRes.json();
          setTrackerSubmissions(data.map(mapDbToTracker));
        } else {
          setTrackerSubmissions(INITIAL_TRACKER_SUBMISSIONS);
        }

        // 6. Fetch Report Submissions
        const repSubsRes = await fetch('/api/report-submissions');
        if (repSubsRes.ok) {
          const data = await repSubsRes.json();
          setReportSubmissions(data.map(mapDbToReportSubmission));
        } else {
          setReportSubmissions(INITIAL_REPORT_SUBMISSIONS);
        }

        // 7. Fetch Audit Logs
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const data = await logsRes.json();
          setAuditLogs(data.map(mapDbToAuditLog));
        } else {
          setAuditLogs(INITIAL_AUDIT_LOGS);
        }

        // 8. Fetch Departments
        const deptsRes = await fetch('/api/departments');
        if (deptsRes.ok) {
          const data = await deptsRes.json();
          setDepartments(data.map(mapDbToDept));
        } else {
          setDepartments(INITIAL_DEPARTMENTS);
        }

      } catch (err) {
        console.error('Error fetching data from backend, falling back to mock datasets:', err);
        setApplications(INITIAL_APPLICATIONS);
        setPartnerCompanies(INITIAL_PARTNER_COMPANIES);
        setWeeklyReports(INITIAL_WEEKLY_REPORTS);
        setAuditLogs(INITIAL_AUDIT_LOGS);
        setDepartments(INITIAL_DEPARTMENTS);
        setTrackerSubmissions(INITIAL_TRACKER_SUBMISSIONS);
        setReportSubmissions(INITIAL_REPORT_SUBMISSIONS);
        setUsersList(INITIAL_REGISTERED_USERS);
      }
    };
    loadAllData();
  }, [currentRole]);

  const [activeModal, setActiveModal] = useState<'noc_generator' | 'doc_viewer' | 'ai_assistant' | 'new_partner' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (title: string, desc?: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loginAsUser = (user: UserProfile) => {
    setCurrentRole(user.role);
    setCurrentUser(user);
    const targetView = user.role === 'student' ? 'student-dashboard' :
                       user.role === 'mentor' ? 'mentor-dashboard' :
                       user.role === 'hod' ? 'hod-dashboard' :
                       user.role === 'placement' ? 'placement-dashboard' :
                       user.role === 'admin' ? 'admin-dashboard' : 'landing';
    setCurrentView(targetView);
    showToast(`Welcome Back, ${user.name}!`, `Authenticated as ${user.title || user.role.toUpperCase()}`, 'success');
  };

  const switchRole = (role: UserRole, specificUser?: UserProfile) => {
    setCurrentRole(role);
    const user = specificUser || 
                 usersList.find(u => u.id === currentUser.id && u.role === role) || 
                 usersList.find(u => u.role === role) || 
                 INITIAL_REGISTERED_USERS.find(u => u.role === role) || 
                 CURRENT_USERS.student;
    setCurrentUser(user);

    switch (role) {
      case 'student':
        setCurrentView('student-dashboard');
        showToast(`Switched to Student Portal`, `Logged in as ${user.name}`);
        break;
      case 'mentor':
        setCurrentView('mentor-dashboard');
        showToast(`Switched to Mentor Portal`, `Logged in as ${user.name}`);
        break;
      case 'hod':
        setCurrentView('hod-dashboard');
        showToast(`Switched to HOD Office Portal`, `Logged in as ${user.name}`);
        break;
      case 'placement':
        setCurrentView('placement-dashboard');
        showToast(`Switched to Placement Cell Portal`, `Logged in as ${user.name}`);
        break;
      case 'admin':
        setCurrentView('admin-dashboard');
        showToast(`Switched to Administrator Portal`, `Logged in as ${user.name}`);
        break;
    }
  };

  const navigateTo = (view: string, appId?: string) => {
    setCurrentView(view);
    if (appId) {
      setSelectedApplicationId(appId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getApplicationById = (id: string) => {
    return applications.find(a => a.id === id);
  };

  const saveApplicationToBackend = async (app: InternshipApplication) => {
    try {
      const dbApp = {
        id: app.id,
        student_id: app.studentId,
        student_name: app.studentName,
        student_avatar: app.studentAvatar,
        student_email: app.studentEmail,
        student_degree: app.studentDegree,
        department: app.department,
        cgpa: app.cgpa,
        company_name: app.companyName,
        company_logo: app.companyLogo,
        industry: app.industry,
        company_website: app.companyWebsite,
        company_address: app.companyAddress,
        hr_name: app.hrName,
        hr_email: app.hrEmail,
        hr_phone: app.hrPhone,
        role_title: app.roleTitle,
        work_mode: app.workMode,
        location: app.location,
        start_date: app.startDate,
        end_date: app.endDate,
        duration_months: app.durationMonths,
        stipend_amount: app.stipendAmount,
        stipend_currency: app.stipendCurrency,
        stage: app.stage,
        submitted_date: app.submittedDate,
        last_updated: app.lastUpdated,
        priority: app.priority,
        assigned_mentor_id: app.assignedMentorId,
        assigned_mentor_name: app.assignedMentorName,
        documents: app.documents,
        timeline: app.timeline,
        internal_remarks: app.internalRemarks,
        ip_address: app.ipAddress,
        audit_hash: app.auditHash
      };
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbApp)
      });
    } catch (err) {
      console.error('Failed to sync application state to backend:', err);
    }
  };

  const saveAuditLogToBackend = async (log: AuditLog) => {
    try {
      const dbLog = {
        id: log.id,
        timestamp: log.timestamp,
        username: log.user,
        action: log.action,
        target_id: log.targetId,
        details: log.details,
        ip: log.ip
      };
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbLog)
      });
    } catch (err) {
      console.error('Failed to sync audit log to backend:', err);
    }
  };

  const approveApplication = async (id: string, remarks?: string) => {
    let updatedApp: InternshipApplication | null = null;
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;

      let nextStage: ApplicationStage = app.stage;
      let stepRoleToComplete: string = '';

      if (app.stage === 'mentor_review' || currentRole === 'mentor') {
        nextStage = 'hod_review';
        stepRoleToComplete = 'Academic Mentor';
      } else if (app.stage === 'hod_review' || currentRole === 'hod') {
        nextStage = 'placement_review';
        stepRoleToComplete = 'HOD Office';
      } else if (app.stage === 'placement_review' || currentRole === 'placement') {
        nextStage = 'approved';
        stepRoleToComplete = 'Placement Cell';
      } else {
        nextStage = 'approved';
      }

      // Update timeline
      const updatedTimeline = app.timeline.map(tl => {
        if (tl.role === stepRoleToComplete) {
          return {
            ...tl,
            status: 'completed' as const,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            approverName: currentUser.name,
            remarks: remarks || `Approved by ${currentUser.name} (${currentUser.title})`
          };
        }
        if (nextStage === 'hod_review' && tl.role === 'HOD Office') {
          return { ...tl, status: 'in_progress' as const, date: 'Active' };
        }
        if (nextStage === 'placement_review' && tl.role === 'Placement Cell') {
          return { ...tl, status: 'in_progress' as const, date: 'Active' };
        }
        return tl;
      });

      updatedApp = {
        ...app,
        stage: nextStage,
        internalRemarks: remarks ? `${app.internalRemarks || ''}\n[${currentUser.name}]: ${remarks}` : app.internalRemarks,
        lastUpdated: new Date().toLocaleDateString(),
        timeline: updatedTimeline
      };
      return updatedApp;
    }));

    // Add Audit Log
    const log: AuditLog = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      action: `Approved Application (${currentRole.toUpperCase()})`,
      targetId: id,
      details: remarks || 'Approved internship application details and contract terms.',
      ip: '192.168.1.' + Math.floor(10 + Math.random() * 90)
    };
    setAuditLogs(prev => [log, ...prev]);

    if (updatedApp) {
      await saveApplicationToBackend(updatedApp);
    }
    await saveAuditLogToBackend(log);

    // Trigger confetti!
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore if canvas not supported
    }

    showToast('Application Approved', `Application ${id} moved to next approval tier.`, 'success');
  };

  const requestChangesApplication = async (id: string, remarks: string) => {
    let updatedApp: InternshipApplication | null = null;
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      updatedApp = {
        ...app,
        stage: 'changes_requested',
        internalRemarks: `${app.internalRemarks || ''}\n[Changes Requested by ${currentUser.name}]: ${remarks}`,
        lastUpdated: new Date().toLocaleDateString()
      };
      return updatedApp;
    }));

    if (updatedApp) {
      await saveApplicationToBackend(updatedApp);
    }

    showToast('Changes Requested', `Application ${id} sent back to student for revisions.`, 'warning');
  };

  const rejectApplication = async (id: string, remarks: string) => {
    let updatedApp: InternshipApplication | null = null;
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      updatedApp = {
        ...app,
        stage: 'rejected',
        internalRemarks: `${app.internalRemarks || ''}\n[REJECTED by ${currentUser.name}]: ${remarks}`,
        lastUpdated: new Date().toLocaleDateString()
      };
      return updatedApp;
    }));

    if (updatedApp) {
      await saveApplicationToBackend(updatedApp);
    }

    showToast('Application Rejected', `Application ${id} has been marked as rejected.`, 'error');
  };

  const submitNewApplication = (newAppData: Partial<InternshipApplication>): InternshipApplication => {
    const orderNo = applications.length + 1;
    const rollNo = currentUser.studentId || newAppData.studentId || currentUser.id || 'STUDENT';
    const id = `IN-${orderNo}-${rollNo}`;

    const defaultMentor = usersList.find(u => u.role === 'mentor') || {
      id: 'USR-MNT-002',
      name: 'Dr. Helena Vance'
    };

    const fullApp: InternshipApplication = {
      id,
      studentId: currentUser.id || 'USR-STU-001',
      studentName: currentUser.name || 'Alex Rivera',
      studentAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      studentEmail: currentUser.email || 'alex.rivera@university.edu',
      studentDegree: currentUser.title || 'B.Tech Software Engineering',
      department: currentUser.department || 'Computer Science & Engineering',
      cgpa: currentUser.cgpa || 3.89,

      companyName: newAppData.companyName || 'Tech Startup',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
      industry: newAppData.industry || 'Technology',
      companyWebsite: newAppData.companyWebsite || 'https://company.com',
      companyAddress: newAppData.companyAddress || 'Silicon Valley, CA',
      hrName: newAppData.hrName || 'HR Coordinator',
      hrEmail: newAppData.hrEmail || 'hr@company.com',
      hrPhone: newAppData.hrPhone || '+1 (555) 019-2831',

      roleTitle: newAppData.roleTitle || 'Software Engineering Intern',
      workMode: newAppData.workMode || 'Remote',
      location: newAppData.location || 'Remote',
      startDate: newAppData.startDate || '2024-11-01',
      endDate: newAppData.endDate || '2025-05-01',
      durationMonths: newAppData.durationMonths || 6,
      stipendAmount: newAppData.stipendAmount || 2000,
      stipendCurrency: newAppData.stipendCurrency || 'USD',

      stage: 'mentor_review',
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUpdated: 'Just now',
      priority: 'Normal',

      assignedMentorId: defaultMentor.id,
      assignedMentorName: defaultMentor.name,

      documents: newAppData.documents || [
        {
          id: 'DOC-' + Math.floor(100 + Math.random() * 900),
          name: `${newAppData.companyName || 'Company'}_OfferLetter.pdf`,
          type: 'Offer Letter',
          size: '1.2 MB',
          uploadDate: new Date().toLocaleDateString(),
          url: '#',
          status: 'Verified'
        }
      ],

      timeline: [
        {
          id: 'TL-N1',
          title: 'Application Submitted',
          role: 'Student',
          approverName: currentUser.name,
          status: 'completed',
          date: 'Just now',
          remarks: 'Offer letter & credentials submitted successfully.'
        },
        {
          id: 'TL-N2',
          title: 'Academic Mentor Review',
          role: 'Academic Mentor',
          approverName: 'Dr. Helena Vance',
          status: 'in_progress',
          date: 'Active'
        },
        {
          id: 'TL-N3',
          title: 'HOD Clearance & Sign-off',
          role: 'HOD Office',
          approverName: 'Dr. Sarah Jenkins',
          status: 'upcoming'
        },
        {
          id: 'TL-N4',
          title: 'Placement Cell Final Endorsement',
          role: 'Placement Cell',
          approverName: 'Dr. Sarah Chen',
          status: 'upcoming'
        }
      ],

      internalRemarks: 'New student submission. Awaiting initial mentor coursework review.',
      ipAddress: '192.168.1.15',
      auditHash: '0x' + Math.random().toString(16).substring(2, 10)
    };

    setApplications(prev => [fullApp, ...prev]);
    saveApplicationToBackend(fullApp);
    showToast('Application Submitted!', `Application ${id} is now under Mentor Review.`, 'success');
    return fullApp;
  };

  const addPartnerCompany = async (company: Partial<PartnerCompany>) => {
    const newCompany: PartnerCompany = {
      id: 'CMP-' + Math.floor(100 + Math.random() * 900),
      name: company.name || 'New Enterprise Partner',
      industry: company.industry || 'Technology',
      website: company.website || 'https://company.com',
      logo: company.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',
      activeInternsCount: company.activeInternsCount || 0,
      totalHiredCount: company.totalHiredCount || 0,
      avgStipend: company.avgStipend || '$2,500/mo',
      contactPerson: company.contactPerson || 'HR Contact',
      contactEmail: company.contactEmail || 'contact@company.com',
      status: company.status || 'Verified Partner',
      rating: company.rating || 4.8
    };
    setPartnerCompanies(prev => [newCompany, ...prev]);

    try {
      const dbCompany = {
        id: newCompany.id,
        name: newCompany.name,
        industry: newCompany.industry,
        website: newCompany.website,
        logo: newCompany.logo,
        active_interns_count: newCompany.activeInternsCount,
        total_hired_count: newCompany.totalHiredCount,
        avg_stipend: newCompany.avgStipend,
        contact_person: newCompany.contactPerson,
        contact_email: newCompany.contactEmail,
        status: newCompany.status,
        rating: newCompany.rating
      };
      await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbCompany)
      });
    } catch (err) {
      console.error('Failed to sync company to backend:', err);
    }
    showToast('Partner Added', `${newCompany.name} is now listed in the Corporate Directory.`, 'success');
  };

  const addWeeklyReport = async (reportData: Partial<WeeklyReport>) => {
    const newReport: WeeklyReport = {
      id: 'REP-' + Math.floor(100 + Math.random() * 900),
      studentId: currentUser.id,
      studentName: currentUser.name,
      companyName: reportData.companyName || 'CloudCore Systems',
      weekNumber: reportData.weekNumber || 1,
      title: reportData.title || 'Weekly Internship Activity Log',
      summary: reportData.summary || 'Logged work hours and completed sprint tasks.',
      hoursLogged: reportData.hoursLogged || 40,
      submittedDate: new Date().toLocaleDateString(),
      status: 'Pending Review'
    };
    setWeeklyReports(prev => [newReport, ...prev]);

    try {
      const dbReport = {
        id: newReport.id,
        student_id: newReport.studentId,
        student_name: newReport.studentName,
        company_name: newReport.companyName,
        week_number: newReport.weekNumber,
        title: newReport.title,
        summary: newReport.summary,
        hours_logged: newReport.hoursLogged,
        submitted_date: newReport.submittedDate,
        status: newReport.status,
        mentor_feedback: newReport.mentorFeedback || '',
        score: newReport.score || null
      };
      await fetch('/api/weekly-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbReport)
      });
    } catch (err) {
      console.error('Failed to sync weekly report to backend:', err);
    }
    showToast('Report Submitted', `Week #${newReport.weekNumber} report sent to your mentor.`, 'success');
  };

  const reviewWeeklyReport = async (reportId: string, status: 'Approved' | 'Revision Requested', score?: number, feedback?: string) => {
    let updatedReport: WeeklyReport | null = null;
    setWeeklyReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      updatedReport = {
        ...rep,
        status,
        score: score || rep.score,
        mentorFeedback: feedback || rep.mentorFeedback
      };
      return updatedReport;
    }));

    if (updatedReport) {
      try {
        const dbReport = {
          id: (updatedReport as WeeklyReport).id,
          student_id: (updatedReport as WeeklyReport).studentId,
          student_name: (updatedReport as WeeklyReport).studentName,
          company_name: (updatedReport as WeeklyReport).companyName,
          week_number: (updatedReport as WeeklyReport).weekNumber,
          title: (updatedReport as WeeklyReport).title,
          summary: (updatedReport as WeeklyReport).summary,
          hours_logged: (updatedReport as WeeklyReport).hoursLogged,
          submitted_date: (updatedReport as WeeklyReport).submittedDate,
          status: (updatedReport as WeeklyReport).status,
          mentor_feedback: (updatedReport as WeeklyReport).mentorFeedback || '',
          score: (updatedReport as WeeklyReport).score || null
        };
        await fetch('/api/weekly-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbReport)
        });
      } catch (err) {
        console.error('Failed to sync weekly report review to backend:', err);
      }
    }
    showToast('Report Reviewed', `Status updated to ${status}.`, 'success');
  };

  const openDocumentViewer = (doc: any) => {
    if (doc.url && doc.url !== '#' && doc.url.startsWith('http')) {
      window.open(doc.url, '_blank');
      return;
    }
    setSelectedDocument(doc);
    setActiveModal('doc_viewer');
  };

  const openModal = (modalName: 'noc_generator' | 'doc_viewer' | 'ai_assistant' | 'new_partner') => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const submitTrackerLog = async (log: Partial<InternshipTrackerSubmission>) => {
    const newLog: InternshipTrackerSubmission = {
      id: 'TRK-' + Math.floor(1000 + Math.random() * 9000),
      applicationId: log.applicationId || 'IN-1-7376242CS0842',
      studentId: currentUser.id,
      studentName: currentUser.name,
      logDate: new Date().toISOString().substring(0, 10),
      dailyProgress: log.dailyProgress || '',
      weeklyProgress: log.weeklyProgress || '',
      tasksCompleted: log.tasksCompleted || '',
      hoursWorked: log.hoursWorked || 0,
      learningOutcomes: log.learningOutcomes || '',
      skillsLearned: log.skillsLearned || '',
      attendance: log.attendance || 'Present',
      progressPercentage: log.progressPercentage || 0,
      screenshotUrl: log.screenshotUrl,
      fileUrl: log.fileUrl,
    };
    setTrackerSubmissions(prev => [newLog, ...prev]);

    try {
      const dbTracker = {
        id: newLog.id,
        application_id: newLog.applicationId,
        student_id: newLog.studentId,
        student_name: newLog.studentName,
        log_date: newLog.logDate,
        daily_progress: newLog.dailyProgress,
        weekly_progress: newLog.weeklyProgress,
        tasks_completed: newLog.tasksCompleted,
        hours_worked: newLog.hoursWorked,
        learning_outcomes: newLog.learningOutcomes,
        skills_learned: newLog.skillsLearned,
        attendance: newLog.attendance,
        mentor_remarks: newLog.mentorRemarks || null,
        progress_percentage: newLog.progressPercentage,
        screenshot_url: newLog.screenshotUrl || null,
        file_url: newLog.fileUrl || null
      };
      await fetch('/api/tracker-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbTracker)
      });
    } catch (err) {
      console.error('Failed to sync tracker log to backend:', err);
    }
    showToast('Progress Submitted', 'Your daily/weekly progress log was saved successfully.', 'success');
  };

  const submitInternshipReport = async (report: Partial<InternshipReportSubmission>) => {
    const newReport: InternshipReportSubmission = {
      id: 'REP-SUB-' + Math.floor(1000 + Math.random() * 9000),
      applicationId: report.applicationId || 'IN-1-7376242CS0842',
      studentId: currentUser.id,
      studentName: currentUser.name,
      companyName: report.companyName || '',
      industry: report.industry || '',
      sector: report.sector || '',
      companyWebsite: report.companyWebsite || '',
      companyAddress: report.companyAddress || '',
      startDate: report.startDate || '',
      endDate: report.endDate || '',
      durationMonths: report.durationMonths || 0,
      stipendAmount: report.stipendAmount || 0,
      projectTitle: report.projectTitle || '',
      projectDescription: report.projectDescription || '',
      technologiesUsed: report.technologiesUsed || '',
      skillsLearned: report.skillsLearned || '',
      learningOutcomes: report.learningOutcomes || '',
      responsibilities: report.responsibilities || '',
      challengesFaced: report.challengesFaced || '',
      solutions: report.solutions || '',
      experienceSummary: report.experienceSummary || '',
      studentFeedback: report.studentFeedback || '',
      companyFeedback: report.companyFeedback || '',
      reportFile: report.reportFile,
      completionCertFile: report.completionCertFile,
      originalCertFile: report.originalCertFile,
      attestedCertFile: report.attestedCertFile,
      presentationFile: report.presentationFile,
      additionalDocFile: report.additionalDocFile,
      stage: 'submitted',
      submittedDate: new Date().toISOString().substring(0, 10),
    };
    setReportSubmissions(prev => [newReport, ...prev]);

    try {
      const dbReportSub = {
        id: newReport.id,
        application_id: newReport.applicationId,
        student_id: newReport.studentId,
        student_name: newReport.studentName,
        company_name: newReport.companyName,
        industry: newReport.industry,
        sector: newReport.sector,
        company_website: newReport.companyWebsite,
        company_address: newReport.companyAddress,
        start_date: newReport.startDate,
        end_date: newReport.endDate,
        duration_months: newReport.durationMonths,
        stipend_amount: newReport.stipendAmount,
        project_title: newReport.projectTitle,
        project_description: newReport.projectDescription,
        technologies_used: newReport.technologiesUsed,
        skills_learned: newReport.skillsLearned,
        learning_outcomes: newReport.learningOutcomes,
        responsibilities: newReport.responsibilities,
        challenges_faced: newReport.challengesFaced,
        solutions: newReport.solutions,
        experience_summary: newReport.experienceSummary,
        student_feedback: newReport.studentFeedback,
        company_feedback: newReport.companyFeedback,
        report_file: newReport.reportFile || null,
        completion_cert_file: newReport.completionCertFile || null,
        original_cert_file: newReport.originalCertFile || null,
        attested_cert_file: newReport.attestedCertFile || null,
        presentation_file: newReport.presentationFile || null,
        additional_doc_file: newReport.additionalDocFile || null,
        stage: newReport.stage,
        submitted_date: newReport.submittedDate,
        mentor_remarks: newReport.mentorRemarks || null,
        hod_remarks: newReport.hodRemarks || null,
        placement_remarks: newReport.placementRemarks || null
      };
      await fetch('/api/report-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbReportSub)
      });
    } catch (err) {
      console.error('Failed to sync report submission to backend:', err);
    }
    showToast('Report Submitted', 'Your internship final report has been submitted for review.', 'success');
  };

  const approveReportSubmission = async (reportId: string, remarks?: string) => {
    let updatedReport: InternshipReportSubmission | null = null;
    setReportSubmissions(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      let nextStage: any = rep.stage;
      if (rep.stage === 'submitted') {
        nextStage = 'mentor_review';
      } else if (rep.stage === 'mentor_review') {
        nextStage = 'hod_review';
      } else if (rep.stage === 'hod_review') {
        nextStage = 'placement_review';
      } else if (rep.stage === 'placement_review') {
        nextStage = 'completed';
      }
      updatedReport = {
        ...rep,
        stage: nextStage,
        mentorRemarks: rep.stage === 'submitted' ? remarks : rep.mentorRemarks,
        hodRemarks: rep.stage === 'mentor_review' ? remarks : rep.hodRemarks,
        placementRemarks: rep.stage === 'hod_review' ? remarks : rep.placementRemarks,
      };
      return updatedReport;
    }));

    if (updatedReport) {
      try {
        const dbReportSub = {
          id: (updatedReport as InternshipReportSubmission).id,
          application_id: (updatedReport as InternshipReportSubmission).applicationId,
          student_id: (updatedReport as InternshipReportSubmission).studentId,
          student_name: (updatedReport as InternshipReportSubmission).studentName,
          company_name: (updatedReport as InternshipReportSubmission).companyName,
          industry: (updatedReport as InternshipReportSubmission).industry,
          sector: (updatedReport as InternshipReportSubmission).sector,
          company_website: (updatedReport as InternshipReportSubmission).companyWebsite,
          company_address: (updatedReport as InternshipReportSubmission).companyAddress,
          start_date: (updatedReport as InternshipReportSubmission).startDate,
          end_date: (updatedReport as InternshipReportSubmission).endDate,
          duration_months: (updatedReport as InternshipReportSubmission).durationMonths,
          stipend_amount: (updatedReport as InternshipReportSubmission).stipendAmount,
          project_title: (updatedReport as InternshipReportSubmission).projectTitle,
          project_description: (updatedReport as InternshipReportSubmission).projectDescription,
          technologies_used: (updatedReport as InternshipReportSubmission).technologiesUsed,
          skills_learned: (updatedReport as InternshipReportSubmission).skillsLearned,
          learning_outcomes: (updatedReport as InternshipReportSubmission).learningOutcomes,
          responsibilities: (updatedReport as InternshipReportSubmission).responsibilities,
          challenges_faced: (updatedReport as InternshipReportSubmission).challengesFaced,
          solutions: (updatedReport as InternshipReportSubmission).solutions,
          experience_summary: (updatedReport as InternshipReportSubmission).experienceSummary,
          student_feedback: (updatedReport as InternshipReportSubmission).studentFeedback,
          company_feedback: (updatedReport as InternshipReportSubmission).companyFeedback,
          report_file: (updatedReport as InternshipReportSubmission).reportFile || null,
          completion_cert_file: (updatedReport as InternshipReportSubmission).completionCertFile || null,
          original_cert_file: (updatedReport as InternshipReportSubmission).originalCertFile || null,
          attested_cert_file: (updatedReport as InternshipReportSubmission).attestedCertFile || null,
          presentation_file: (updatedReport as InternshipReportSubmission).presentationFile || null,
          additional_doc_file: (updatedReport as InternshipReportSubmission).additionalDocFile || null,
          stage: (updatedReport as InternshipReportSubmission).stage,
          submitted_date: (updatedReport as InternshipReportSubmission).submittedDate,
          mentor_remarks: (updatedReport as InternshipReportSubmission).mentorRemarks || null,
          hod_remarks: (updatedReport as InternshipReportSubmission).hodRemarks || null,
          placement_remarks: (updatedReport as InternshipReportSubmission).placementRemarks || null
        };
        await fetch('/api/report-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbReportSub)
        });
      } catch (err) {
        console.error('Failed to sync report approval to backend:', err);
      }
    }
    showToast('Report Approved', 'Report moved to next approval tier.', 'success');
  };

  const rejectReportSubmission = async (reportId: string, remarks?: string) => {
    let updatedReport: InternshipReportSubmission | null = null;
    setReportSubmissions(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      updatedReport = { ...rep, stage: 'rejected', mentorRemarks: remarks };
      return updatedReport;
    }));

    if (updatedReport) {
      try {
        const dbReportSub = {
          id: (updatedReport as InternshipReportSubmission).id,
          application_id: (updatedReport as InternshipReportSubmission).applicationId,
          student_id: (updatedReport as InternshipReportSubmission).studentId,
          student_name: (updatedReport as InternshipReportSubmission).studentName,
          company_name: (updatedReport as InternshipReportSubmission).companyName,
          industry: (updatedReport as InternshipReportSubmission).industry,
          sector: (updatedReport as InternshipReportSubmission).sector,
          company_website: (updatedReport as InternshipReportSubmission).companyWebsite,
          company_address: (updatedReport as InternshipReportSubmission).companyAddress,
          start_date: (updatedReport as InternshipReportSubmission).startDate,
          end_date: (updatedReport as InternshipReportSubmission).endDate,
          duration_months: (updatedReport as InternshipReportSubmission).durationMonths,
          stipend_amount: (updatedReport as InternshipReportSubmission).stipendAmount,
          project_title: (updatedReport as InternshipReportSubmission).projectTitle,
          project_description: (updatedReport as InternshipReportSubmission).projectDescription,
          technologies_used: (updatedReport as InternshipReportSubmission).technologiesUsed,
          skills_learned: (updatedReport as InternshipReportSubmission).skillsLearned,
          learning_outcomes: (updatedReport as InternshipReportSubmission).learningOutcomes,
          responsibilities: (updatedReport as InternshipReportSubmission).responsibilities,
          challenges_faced: (updatedReport as InternshipReportSubmission).challengesFaced,
          solutions: (updatedReport as InternshipReportSubmission).solutions,
          experience_summary: (updatedReport as InternshipReportSubmission).experienceSummary,
          student_feedback: (updatedReport as InternshipReportSubmission).studentFeedback,
          company_feedback: (updatedReport as InternshipReportSubmission).companyFeedback,
          report_file: (updatedReport as InternshipReportSubmission).reportFile || null,
          completion_cert_file: (updatedReport as InternshipReportSubmission).completionCertFile || null,
          original_cert_file: (updatedReport as InternshipReportSubmission).originalCertFile || null,
          attested_cert_file: (updatedReport as InternshipReportSubmission).attestedCertFile || null,
          presentation_file: (updatedReport as InternshipReportSubmission).presentationFile || null,
          additional_doc_file: (updatedReport as InternshipReportSubmission).additionalDocFile || null,
          stage: (updatedReport as InternshipReportSubmission).stage,
          submitted_date: (updatedReport as InternshipReportSubmission).submittedDate,
          mentor_remarks: (updatedReport as InternshipReportSubmission).mentorRemarks || null,
          hod_remarks: (updatedReport as InternshipReportSubmission).hodRemarks || null,
          placement_remarks: (updatedReport as InternshipReportSubmission).placementRemarks || null
        };
        await fetch('/api/report-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbReportSub)
        });
      } catch (err) {
        console.error('Failed to sync report rejection to backend:', err);
      }
    }
    showToast('Report Rejected', 'Report status set to rejected.', 'error');
  };

  const addUser = async (user: Partial<UserProfile>) => {
    try {
      const newUserBody = {
        name: user.name || 'New User',
        role: user.role || 'student',
        title: user.title || 'Student Profile',
        department: user.department || 'Computer Science & Engineering',
        avatar_url: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        email: user.email || 'user@university.edu',
        student_id: user.studentId || null,
        cgpa: user.cgpa || null,
        total_credits: user.totalCredits || null,
        reward_points: user.rewardPoints || null,
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserBody)
      });

      if (res.ok) {
        const savedUser = await res.json();
        const mappedUser: UserProfile = {
          id: savedUser.id,
          name: savedUser.name,
          role: savedUser.role,
          title: savedUser.title,
          department: savedUser.department,
          avatarUrl: savedUser.avatar_url,
          email: savedUser.email,
          studentId: savedUser.student_id || undefined,
          cgpa: savedUser.cgpa ? parseFloat(savedUser.cgpa) : undefined,
          totalCredits: savedUser.total_credits || undefined,
          rewardPoints: savedUser.reward_points || undefined
        };
        setUsersList(prev => [...prev, mappedUser]);
        showToast('User Created', 'A new user was added to the portal.', 'success');
      } else {
        const errData = await res.json();
        showToast('Creation Failed', errData.error || 'Failed to create user on backend.', 'error');
      }
    } catch (err: any) {
      console.error('Add user error:', err);
      showToast('Error', 'Network or server error during user creation.', 'error');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== id));
        showToast('User Deleted', 'User has been removed from the portal database.', 'warning');
      } else {
        const errData = await res.json();
        showToast('Delete Failed', errData.error || 'Failed to delete user on backend.', 'error');
      }
    } catch (err: any) {
      console.error('Delete user error:', err);
      showToast('Error', 'Network or server error during user deletion.', 'error');
    }
  };

  const addDepartment = async (dept: Partial<DepartmentRecord>) => {
    const newDept: DepartmentRecord = {
      id: 'DEP-' + Math.floor(1000 + Math.random() * 9000),
      name: dept.name || 'New Department',
      code: dept.code || 'CODE',
      hodName: dept.hodName || 'Dr. Unknown',
      activeStudents: 0,
    };
    setDepartments(prev => [...prev, newDept]);

    try {
      const dbDept = {
        id: newDept.id,
        name: newDept.name,
        code: newDept.code,
        hod_name: newDept.hodName,
        active_students: newDept.activeStudents
      };
      await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbDept)
      });
    } catch (err) {
      console.error('Failed to sync department to backend:', err);
    }
    showToast('Department Added', 'New academic department registered.', 'success');
  };

  const issueNoc = async (appId: string) => {
    let updatedApp: InternshipApplication | null = null;
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp) return;

    const studentProfile = usersList.find(u => u.id === targetApp.studentId || u.email === targetApp.studentEmail);
    const studentRollNo = studentProfile?.studentId || targetApp.studentId || 'N/A';

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const existingNoc = app.documents.find(d => d.type === 'NOC');
      if (existingNoc) return app;

      const newDoc = {
        id: 'DOC-NOC-' + Math.floor(1000 + Math.random() * 9000),
        name: `NOC_${app.studentName.replace(/\s+/g, '_')}_${studentRollNo}.pdf`,
        type: 'NOC',
        size: '1.2 MB',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: '#',
        status: 'Verified'
      };

      updatedApp = {
        ...app,
        documents: [...(app.documents || []), newDoc],
        lastUpdated: new Date().toLocaleDateString()
      };
      return updatedApp;
    }));

    if (updatedApp) {
      await saveApplicationToBackend(updatedApp);
      const log: AuditLog = {
        id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        action: 'Issued NOC Certificate',
        targetId: appId,
        details: `Issued Official No Objection Certificate for ${targetApp.studentName}.`,
        ip: '192.168.1.' + Math.floor(10 + Math.random() * 90)
      };
      setAuditLogs(prev => [log, ...prev]);
      await saveAuditLogToBackend(log);
      showToast('NOC Issued Successfully', `NOC created for ${targetApp.studentName}.`, 'success');
    }
  };

  const uploadDocumentToApplication = async (
    appId: string, 
    documentData: { name: string; type: string; size: string },
    file?: File
  ) => {
    let publicUrl = '#';
    if (file) {
      try {
        const { supabase } = await import('../utils/supabase');
        const filePath = `${appId}/${documentData.type.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        
        const { error } = await supabase.storage
          .from('internship-docs')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('internship-docs')
          .getPublicUrl(filePath);

        publicUrl = urlData.publicUrl;
      } catch (err) {
        console.error('Supabase Storage upload failed, falling back to local demo URL:', err);
        publicUrl = URL.createObjectURL(file);
      }
    }

    let updatedApp: InternshipApplication | null = null;
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      // Filter out duplicate files by name or type
      const filteredDocs = (app.documents || []).filter(d =>
        d.type.toLowerCase() !== documentData.type.toLowerCase() &&
        d.name.toLowerCase() !== documentData.name.toLowerCase()
      );

      const newDoc = {
        id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
        name: documentData.name,
        type: documentData.type,
        size: documentData.size,
        uploadDate: new Date().toLocaleDateString(),
        url: publicUrl,
        status: 'Verified'
      };

      updatedApp = {
        ...app,
        documents: [...filteredDocs, newDoc],
        lastUpdated: new Date().toLocaleDateString()
      };
      return updatedApp;
    }));

    if (updatedApp) {
      await saveApplicationToBackend(updatedApp);
      const log: AuditLog = {
        id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        action: 'Uploaded Document',
        targetId: appId,
        details: `Uploaded ${documentData.type}: ${documentData.name}`,
        ip: '192.168.1.' + Math.floor(10 + Math.random() * 90)
      };
      setAuditLogs(prev => [log, ...prev]);
      await saveAuditLogToBackend(log);
      showToast('Document Uploaded', `Successfully added ${documentData.name} to application vault.`, 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        currentView,
        selectedApplicationId,
        applications,
        partnerCompanies,
        weeklyReports,
        auditLogs,
        activeModal,
        selectedDocument,
        toasts,
        departments,
        trackerSubmissions,
        reportSubmissions,
        usersList,
        switchRole,
        loginAsUser,
        navigateTo,
        getApplicationById,
        approveApplication,
        requestChangesApplication,
        rejectApplication,
        submitNewApplication,
        addPartnerCompany,
        addWeeklyReport,
        reviewWeeklyReport,
        openDocumentViewer,
        openModal,
        closeModal,
        showToast,
        removeToast,
        submitTrackerLog,
        submitInternshipReport,
        approveReportSubmission,
        rejectReportSubmission,
        addUser,
        deleteUser,
        addDepartment,
        issueNoc,
        uploadDocumentToApplication
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
