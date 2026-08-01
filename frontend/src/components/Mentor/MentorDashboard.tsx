import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    weeklyReports, 
    navigateTo, 
    approveApplication, 
    requestChangesApplication,
    reviewWeeklyReport,
    showToast,
    trackerSubmissions,
    reportSubmissions,
    approveReportSubmission,
    rejectReportSubmission,
    openDocumentViewer
  } = useApp();

  if (!currentUser) {
    return <div className="p-6 text-center text-xs text-slate-500">Loading mentor profile...</div>;
  }

  const pendingApps = applications.filter(a => a.stage === 'mentor_review' || a.assignedMentorName === currentUser.name);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded-full uppercase border border-indigo-500/30">Academic Mentor Portal</span>
          <h1 className="text-2xl font-extrabold mt-1">Faculty Advisor Overview • {currentUser.name}</h1>
          <p className="text-xs text-slate-300 mt-0.5">{currentUser.department} • 42 Mentees Assigned</p>
        </div>

        <button
          onClick={() => navigateTo('reports')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <FileCheck className="w-4 h-4" />
          <span>Review Pending Logbooks</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
            <span>Pending Applications</span>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingApps.length + 24}</span>
            <span className="text-xs font-bold text-rose-600">+3 High Priority</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
            <span>Unread Weekly Logs</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{weeklyReports.filter(r => r.status === 'Pending Review').length + 12}</span>
            <span className="text-xs font-semibold text-amber-600">8 Due Today</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
            <span>Assigned Mentees</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">42 / 45</span>
            <span className="text-xs text-slate-400">Near Capacity</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
            <span>Avg Review Turnaround</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1.4 Days</span>
            <span className="text-xs font-bold text-emerald-600">Exceeds Target</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Table vs Mentees Progress */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Applications Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Pending Student Approval Queue</h2>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full">
                {pendingApps.length} Actionable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Company & Role</th>
                    <th className="pb-3">Stipend</th>
                    <th className="pb-3">Submitted</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {app.studentName ? app.studentName.charAt(0) : '?'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{app.studentName}</div>
                            <div className="text-[10px] text-slate-400">{app.studentDegree}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-bold text-slate-800">{app.companyName}</div>
                        <div className="text-[10px] text-slate-500">{app.roleTitle}</div>
                      </td>

                      <td className="py-3 font-bold text-emerald-600">
                        ${app.stipendAmount}/mo
                      </td>

                      <td className="py-3 text-slate-500 text-[11px]">
                        {app.submittedDate}
                      </td>

                      <td className="py-3 text-right space-x-1">
                        <button
                          onClick={() => navigateTo('application-detail', app.id)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => approveApplication(app.id, 'Verified coursework prerequisites and offer letter.')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Mentees Progress */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Active Mentee Progression
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', company: 'Nexus Tech', progress: 82, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
                { name: 'Alex Rivera', company: 'CloudCore', progress: 65, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                { name: 'David O\'Reilly', company: 'Vanguard', progress: 24, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
                { name: 'Elena Rodriguez', company: 'Elysian Media', progress: 100, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }
              ].map(m => (
                <div key={m.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                        {m.name ? m.name.charAt(0) : '?'}
                      </div>
                      <span className="font-bold text-slate-800">{m.name}</span>
                    </div>
                    <span className="font-bold text-indigo-600 text-[11px]">{m.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${m.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Internship Tracker Logs & Report Verification Panel */}
      <div className="grid lg:grid-cols-12 gap-6 border-t border-slate-200 pt-6">
        
        {/* Trackers list (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Mentees' Active Daily Work Logs</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{trackerSubmissions.length} Logs</span>
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {trackerSubmissions.map(item => (
              <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-indigo-600">
                  <span>{item.studentName} ({item.id})</span>
                  <span className="text-[10px] text-slate-400">{item.logDate}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Daily Progress Activity</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{item.dailyProgress}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
                  <span>Attendance: {item.attendance}</span>
                  <span className="text-indigo-600">{item.hoursWorked} hrs worked</span>
                </div>
              </div>
            ))}
            {trackerSubmissions.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No active trackers logged yet.</p>
            )}
          </div>
        </div>

        {/* Reports Verification (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Internship Reports Verification (Mentor Stage)</span>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {reportSubmissions.filter(r => r.stage === 'submitted').length} Actionable
            </span>
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {reportSubmissions.filter(r => r.stage === 'submitted').map(item => (
              <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.studentName}</span>
                  <span className="text-[10px] text-slate-400">Submitted {item.submittedDate}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div><strong>Company:</strong> {item.companyName}</div>
                  <div><strong>Sector:</strong> {item.sector}</div>
                </div>
                <div className="flex items-center gap-3 text-[10px] bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50 mt-1.5 font-sans">
                  <span className="font-semibold text-slate-600">Report Files:</span>
                  <button
                    onClick={() => openDocumentViewer({ name: item.reportFile, type: 'Internship Report', size: '2.4 MB', uploadDate: item.submittedDate, status: 'Verified' })}
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
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
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                  >
                    Download
                  </button>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => rejectReportSubmission(item.id, 'Incomplete details')}
                    className="px-2.5 py-1 hover:bg-rose-100 text-rose-600 font-bold rounded text-[10px] cursor-pointer"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => approveReportSubmission(item.id, 'Mentor Verified')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] cursor-pointer"
                  >
                    Verify & Approve
                  </button>
                </div>
              </div>
            ))}
            {reportSubmissions.filter(r => r.stage === 'submitted').length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No reports pending mentor verification.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
