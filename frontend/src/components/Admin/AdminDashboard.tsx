import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Building2, 
  FileText, 
  Trash2, 
  Plus, 
  ShieldAlert, 
  Database,
  Search,
  CheckCircle,
  Clock,
  Briefcase,
  AlertTriangle,
  Download,
  FileCheck2
} from 'lucide-react';
import { UserRole } from '../../types';

interface AdminDashboardProps {
  view: 'dashboard' | 'users' | 'departments' | 'logs';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ view }) => {
  const { 
    usersList, 
    departments, 
    auditLogs, 
    addUser, 
    deleteUser, 
    addDepartment,
    applications,
    navigateTo,
    openModal,
    issueNoc,
    showToast,
    reportSubmissions,
    openDocumentViewer,
    currentUser
  } = useApp();

  if (!currentUser) {
    return <div className="p-6 text-center text-xs text-slate-500">Loading admin profile...</div>;
  }

  const downloadNoc = (app: any) => {
    const issueDate = app.documents.find(d => d.type === 'NOC')?.uploadDate || new Date().toLocaleDateString();
    const studentProfile = usersList.find(u => u.id === app.studentId || u.email === app.studentEmail);
    const studentRollNo = studentProfile?.studentId || app.studentId || 'N/A';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NOC_${app.studentName}_${studentRollNo}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background: white; color: #0f172a; }
    .card { background: white; max-width: 680px; margin: 0 auto; padding: 40px; border-radius: 16px; border: 1px solid #cbd5e1; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; color: #1e1b4b; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
    .header p { font-size: 12px; color: #475569; margin: 4px 0 0 0; font-weight: bold; }
    .ref-line { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 20px; }
    .title { text-align: center; font-size: 15px; font-weight: 800; color: #4338ca; text-decoration: underline; margin-bottom: 20px; letter-spacing: 2px; }
    .content p { font-size: 13px; line-height: 1.8; margin-bottom: 16px; text-align: justify; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 10px; font-size: 12px; margin: 20px 0; }
    .box div { margin-bottom: 6px; }
    .footer { display: flex; justify-content: space-between; margin-top: 48px; border-top: 1px solid #cbd5e1; padding-top: 20px; font-size: 12px; font-weight: 700; }
    @media print {
      body { padding: 0; background: white; }
      .card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>CENTRAL UNIVERSITY OF TECHNOLOGY</h1>
      <p>Directorate of Academic Affairs & Training</p>
      <p style="font-size: 10px; color: #64748b;">University Campus, Innovation Drive • Email: placement@university.edu</p>
    </div>
    <div class="ref-line">
      <span>Ref No: CUT/NOC/2024/${app.id}</span>
      <span>Issued Date: ${issueDate}</span>
    </div>
    <div class="title">OFFICIAL NO OBJECTION CERTIFICATE (NOC)</div>
    <div class="content">
      <p>This is to certify that <strong>${app.studentName}</strong> (Student Roll / Reg. ID: <strong>${studentRollNo}</strong>) is a bona fide student of <strong>${app.studentDegree}</strong> in the Department of <strong>${app.department}</strong> with CGPA <strong>${app.cgpa}</strong>.</p>
      <p>The Academic Directorate and University Placement Cell have <strong>NO OBJECTION</strong> to the student pursuing an official industry internship with <strong>${app.companyName}</strong> as <strong>${app.roleTitle}</strong> from <strong>${app.startDate}</strong> to <strong>${app.endDate}</strong> (${app.durationMonths} Months) in ${app.workMode} mode.</p>
      <div class="box">
        <div>• <strong>Student Name:</strong> ${app.studentName}</div>
        <div>• <strong>Student Roll No:</strong> ${studentRollNo}</div>
        <div>• <strong>Approved Stipend:</strong> $${app.stipendAmount} / Month (${app.stipendCurrency})</div>
        <div>• <strong>NOC Issued Date:</strong> ${issueDate}</div>
        <div>• <strong>Verification Reference:</strong> ${app.id}</div>
      </div>
      <p style="font-style: italic; color: #64748b; font-size: 11px;">This certificate is digitally authenticated by the Placement Cell & Directorate of Academic Affairs and is legally valid for official corporate onboarding.</p>
    </div>
    <div class="footer">
      <div>
        <div>Dr. Selvakumar T</div>
        <div style="font-size: 10px; color: #64748b; font-weight: normal;">Head of Department (IT)</div>
      </div>
      <div style="text-align: right;">
        <div>Ranjith Kumar</div>
        <div style="font-size: 10px; color: #64748b; font-weight: normal;">Director, Placement Directorate</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      showToast('PDF Export Active', 'Open PDF / Print Dialog initiated.', 'success');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add User Modal/Form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userStudentId, setUserStudentId] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userTitle, setUserTitle] = useState('');
  const [userDept, setUserDept] = useState('Information Technology');

  // Add Department Form states
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHod, setDeptHod] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const isStudent = userRole === 'student';
    addUser({
      name: userName,
      email: userEmail,
      role: userRole,
      title: userTitle || (isStudent ? 'B.Tech Student' : 'Staff Member'),
      department: userDept,
      studentId: isStudent ? (userStudentId || `7376242IT${Math.floor(100 + Math.random() * 900)}`) : undefined,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      cgpa: isStudent ? 3.5 : undefined,
      totalCredits: isStudent ? 120 : undefined,
      rewardPoints: isStudent ? 500 : undefined
    });
    setUserName('');
    setUserEmail('');
    setUserStudentId('');
    setUserTitle('');
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment({
      name: deptName,
      code: deptCode,
      hodName: deptHod
    });
    setDeptName('');
    setDeptCode('');
    setDeptHod('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
            <Database className="w-3.5 h-3.5" /> Portal Administration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {view === 'dashboard' ? 'System Statistics' :
             view === 'users' ? 'User Identity Directory' :
             view === 'departments' ? 'Academic Department Registries' : 'System Security Audit Logs'}
          </h1>
          <p className="text-xs text-slate-300">
            Manage roles, departments, user profiles, and view real-time portal audit logs.
          </p>
        </div>
      </div>

      {/* View 1: System Statistics / Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Users</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{usersList.length}</span>
                <span className="text-xs block text-slate-400 font-medium">Registered student & staff accounts</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Departments</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{departments.length}</span>
                <span className="text-xs block text-slate-400 font-medium">Active academic departments</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{applications.length}</span>
                <span className="text-xs block text-slate-400 font-medium">Stage 1 application requests</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Logs</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{auditLogs.length}</span>
                <span className="text-xs block text-purple-600 font-semibold">Real-time threat auditing active</span>
              </div>
            </div>
          </div>

          {/* Issued NOC Registry & Approved Students Table (Admin View) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Admin Issued NOC Registry</h3>
                <p className="text-xs text-slate-500 font-medium">Individual NOC certificates issued to 100% approved students</p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 font-bold px-2.5 py-1 rounded-full">
                {applications.filter(a => a.stage === 'approved').length} Active NOC Certificates
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Approved Student</th>
                    <th className="pb-3">Student Roll ID</th>
                    <th className="pb-3">Company & Role</th>
                    <th className="pb-3">Issued Date</th>
                    <th className="pb-3 text-right">NOC Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.filter(a => a.stage === 'approved').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">No fully approved NOC certificates issued in the system yet.</td>
                    </tr>
                  ) : (
                  applications.filter(a => a.stage === 'approved').map(app => {
                    const studentProfile = usersList.find(u => u.id === app.studentId || u.email === app.studentEmail);
                    const studentRollNo = studentProfile?.studentId || app.studentId || 'N/A';
                    const nocDoc = app.documents.find(d => d.type === 'NOC');
                    const isNocIssued = !!nocDoc;

                    return (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {app.studentName ? app.studentName.charAt(0) : '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{app.studentName}</div>
                              <div className="text-[10px] text-slate-400">{app.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-bold text-purple-900">
                          {studentRollNo}
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-slate-800">{app.companyName}</div>
                          <div className="text-[10px] text-slate-500">{app.roleTitle}</div>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          {isNocIssued ? nocDoc.uploadDate : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              Awaiting Issuance
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          {!isNocIssued ? (
                            <button
                              onClick={() => issueNoc(app.id)}
                              className="px-3 py-1.5 bg-[#7c4dff] hover:bg-[#6b3bf0] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>Issue NOC</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  navigateTo('admin-dashboard', app.id);
                                  openModal('noc_generator');
                                }}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                              >
                                View NOC
                              </button>
                              <button
                                onClick={() => downloadNoc(app)}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick overview of logs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity Logs</h3>
              <div className="space-y-3">
                {auditLogs.slice(0, 4).map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.action}</span>
                      <span className="text-[10px] text-slate-500">{item.user} • IP: {item.ip}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick overview of departments */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department Listings</h3>
              <div className="space-y-3">
                {departments.map(dept => (
                  <div key={dept.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900 block">{dept.name} ({dept.code})</span>
                      <span className="text-[10px] text-slate-500">HOD: {dept.hodName}</span>
                    </div>
                    <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">{dept.activeStudents} Students</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports Registry */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reports Registry</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {reportSubmissions.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate max-w-[100px]">{item.studentName}</span>
                      <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 uppercase">{item.stage}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Company: {item.companyName}</p>
                    
                    <div className="flex gap-2 text-[10px] font-bold pt-1 border-t border-slate-200/60 font-sans">
                      <button
                        onClick={() => openDocumentViewer({ name: item.reportFile, type: 'Internship Report', size: '2.4 MB', uploadDate: item.submittedDate, status: 'Verified' })}
                        className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        View Report
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => {
                          const docText = `INTERNSHIP REPORT FILE: ${item.reportFile}\nSTUDENT: ${item.studentName}\nCOMPANY: ${item.companyName}\nTITLE: ${item.projectTitle || 'Internship Work Product'}`;
                          const blob = new Blob([docText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = item.reportFile.replace(/\.pdf$/i, '.txt');
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
                {reportSubmissions.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No report submissions recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: User Management */}
      {view === 'users' && (
        <div className="grid lg:grid-cols-12 gap-6 text-xs">
          
          {/* Add User Form (Left 4 Cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Portal User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Dr. Thomas Sterling"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="e.g. t.sterling@university.edu"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Permission</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                >
                  <option value="student">Student</option>
                  <option value="mentor">Faculty Mentor</option>
                  <option value="hod">HOD Office</option>
                  <option value="placement">Placement Cell</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {userRole === 'student' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Roll / Reg. ID</label>
                  <input
                    type="text"
                    value={userStudentId}
                    onChange={e => setUserStudentId(e.target.value)}
                    placeholder="e.g. 7376242IT999"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-semibold text-purple-900"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation / Degree Title</label>
                <input
                  type="text"
                  value={userTitle}
                  onChange={e => setUserTitle(e.target.value)}
                  placeholder="e.g. Assoc. Professor CSE"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={userDept}
                  onChange={e => setUserDept(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" /> Add User Account
              </button>
            </form>
          </div>

          {/* Users List Table (Right 8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">User Identity Directory</h3>
              <div className="relative w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {usersList.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                    <tr key={u.id}>
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name ? u.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase">{u.role}</span>
                      </td>
                      <td className="py-3">{u.department}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* View 3: Department Management */}
      {view === 'departments' && (
        <div className="grid lg:grid-cols-12 gap-6 text-xs">
          
          {/* Add Dept Form (Left 4 Cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Academic Department</h3>
            
            <form onSubmit={handleAddDept} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  placeholder="e.g. Electrical Engineering"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={e => setDeptCode(e.target.value)}
                  placeholder="e.g. EE"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HOD Name</label>
                <input
                  type="text"
                  value={deptHod}
                  onChange={e => setDeptHod(e.target.value)}
                  placeholder="e.g. Dr. Arthur Miller"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </form>
          </div>

          {/* Dept List Table (Right 8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Academic Department Registries</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Head of Department</th>
                    <th className="pb-3 text-right">Active Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {departments.map(d => (
                    <tr key={d.id}>
                      <td className="py-3 font-bold text-slate-900">{d.name}</td>
                      <td className="py-3 text-slate-500">{d.code}</td>
                      <td className="py-3 text-slate-700">{d.hodName}</td>
                      <td className="py-3 text-right text-indigo-600 font-bold">{d.activeStudents} active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* View 4: Audit Logs */}
      {view === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">System Security Audit Trail</h3>
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Encrypted Hash logs active
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Identity</th>
                  <th className="pb-3">Operation Action</th>
                  <th className="pb-3">Record ID</th>
                  <th className="pb-3">Target details</th>
                  <th className="pb-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {auditLogs.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 text-slate-400">{item.timestamp}</td>
                    <td className="py-3 text-slate-950 font-bold">{item.user}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase">{item.action}</span>
                    </td>
                    <td className="py-3 font-mono text-indigo-600">{item.targetId}</td>
                    <td className="py-3 text-slate-500 max-w-xs truncate" title={item.details}>{item.details}</td>
                    <td className="py-3 text-right font-mono text-slate-400">{item.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Confirm Deletion</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">This action cannot be undone. The user will be permanently deleted from the portal database.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const idToDelete = deleteConfirmId;
                  setDeleteConfirmId(null);
                  await deleteUser(idToDelete);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
