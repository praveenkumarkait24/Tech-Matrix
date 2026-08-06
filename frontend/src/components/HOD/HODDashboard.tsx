import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  Users, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const HODDashboard: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    navigateTo, 
    approveApplication, 
    showToast,
    trackerSubmissions,
    reportSubmissions,
    approveReportSubmission,
    rejectReportSubmission,
    openDocumentViewer
  } = useApp();

  if (!currentUser) {
    return <div className="p-6 text-center text-xs text-slate-500">Loading HOD profile...</div>;
  }

  const hodQueue = applications.filter(a => a.stage === 'hod_review' || a.stage === 'mentor_review');

  const industryData = [
    { name: 'Software & Cloud', value: 45, color: '#4f46e5' },
    { name: 'Fintech & Trading', value: 30, color: '#7c3aed' },
    { name: 'AI & Data Science', value: 25, color: '#10b981' }
  ];

  const handleBatchApprove = () => {
    hodQueue.forEach(app => approveApplication(app.id, 'HOD Department Clearance Granted.'));
    showToast('Batch Approval Complete', `Cleared ${hodQueue.length} applications for Placement Cell final sign-off.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-full uppercase border border-purple-500/30">Head of Department Office</span>
          <h1 className="text-2xl font-extrabold mt-1">Department Overview • {currentUser.name}</h1>
          <p className="text-xs text-slate-300 mt-0.5">{currentUser.department} • Academic Year 2024-25</p>
        </div>

        <button
          onClick={handleBatchApprove}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Batch Approve All ({hodQueue.length})</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total CSE Students</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">240</span>
            <span className="text-xs font-bold text-emerald-600">+12% YoY</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Internships</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">185</span>
            <span className="text-xs font-semibold text-emerald-600">77% Placed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending HOD Sign-off</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{hodQueue.length}</span>
            <span className="text-xs font-bold text-purple-600">Action Required</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Avg CGPA</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">3.88</span>
            <span className="text-xs text-slate-400">Department Score</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Approval Queue vs Leaderboard */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Approval Queue Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">HOD Clearance Queue</h2>
              <span className="text-xs text-slate-400 font-medium">Department Sign-off Required</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Work Mode</th>
                    <th className="pb-3 text-right">Clearance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hodQueue.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        <div>{app.studentName}</div>
                        <div className="text-[10px] text-slate-400">CGPA: {app.cgpa}</div>
                      </td>

                      <td className="py-3">
                        <div className="font-bold text-slate-800">{app.companyName}</div>
                        <div className="text-[10px] text-slate-500">{app.roleTitle}</div>
                      </td>

                      <td className="py-3">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px]">
                          {app.workMode}
                        </span>
                      </td>

                      <td className="py-3 text-right space-x-1">
                        <button
                          onClick={() => navigateTo('application-detail', app.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => approveApplication(app.id, 'HOD Approved.')}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Sign-off
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Leaderboard & Industry Chart */}
        <div className="lg:col-span-4 space-y-6">
          {/* Industry Distribution Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Internships by Industry
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs">
              {industryData.map(i => (
                <div key={i.name} className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i.color }}></span>
                    <span>{i.name}</span>
                  </div>
                  <span className="font-bold">{i.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Department Top Performers
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Aditi Rao', pts: '1,240 pts', role: 'Google Cloud Intern' },
                { name: 'Rohan Das', pts: '1,180 pts', role: 'NVIDIA AI Research' },
                { name: 'Sanya Malhotra', pts: '1,150 pts', role: 'Vercel Frontend' },
                { name: 'Vikram Seth', pts: '1,095 pts', role: 'Tesla Embedded Systems' }
              ].map((p, idx) => (
                <div key={p.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.role}</div>
                    </div>
                  </div>
                  <span className="font-bold text-purple-600 text-xs">{p.pts}</span>
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
            <span>Department Student Daily Work Logs</span>
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
            <span>Internship Reports Verification (HOD Stage)</span>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {reportSubmissions.filter(r => r.stage === 'mentor_review').length} Actionable
            </span>
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {reportSubmissions.filter(r => r.stage === 'mentor_review').map(item => (
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
                    onClick={() => rejectReportSubmission(item.id, 'HOD clearance deferred')}
                    className="px-2.5 py-1 hover:bg-rose-100 text-rose-600 font-bold rounded text-[10px] cursor-pointer"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => approveReportSubmission(item.id, 'HOD clearance approved')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] cursor-pointer"
                  >
                    Verify & Approve
                  </button>
                </div>
              </div>
            ))}
            {reportSubmissions.filter(r => r.stage === 'mentor_review').length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No reports pending HOD verification.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
