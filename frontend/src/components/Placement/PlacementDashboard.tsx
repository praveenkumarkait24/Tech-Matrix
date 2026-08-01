import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Users, 
  FileCheck2, 
  Download, 
  PlusCircle, 
  TrendingUp, 
  BarChart2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const PlacementDashboard: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    partnerCompanies, 
    navigateTo, 
    approveApplication, 
    openModal, 
    showToast,
    trackerSubmissions,
    reportSubmissions,
    approveReportSubmission,
    rejectReportSubmission,
    issueNoc,
    usersList,
    openDocumentViewer
  } = useApp();

  if (!currentUser) {
    return <div className="p-6 text-center text-xs text-slate-500">Loading placement profile...</div>;
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

  const [dateRange, setDateRange] = useState('Academic Year 2024-25');

  const pendingPlacementQueue = applications.filter(a => a.stage === 'placement_review' || a.stage === 'hod_review' || a.stage === 'mentor_review');

  const trendData = [
    { month: 'Jan', y2024: 120, y2023: 95 },
    { month: 'Mar', y2024: 280, y2023: 210 },
    { month: 'May', y2024: 450, y2023: 380 },
    { month: 'Jul', y2024: 620, y2023: 510 },
    { month: 'Sep', y2024: 780, y2023: 690 },
    { month: 'Nov', y2024: 856, y2023: 740 }
  ];

  const deptData = [
    { name: 'Computer Science & Eng', value: 45, color: '#4f46e5' },
    { name: 'Data Science & AI', value: 25, color: '#7c3aed' },
    { name: 'Commerce & Analytics', value: 30, color: '#10b981' }
  ];

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Application ID,Student Name,Company,Role,Stipend,Status\n" +
      applications.map(e => `${e.id},${e.studentName},${e.companyName},${e.roleTitle},${e.stipendAmount},${e.stage}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `InternFlow_Placement_Report_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Downloaded complete placement ledger as CSV.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded-full uppercase border border-indigo-500/30">Central Placement Directorate</span>
          <h1 className="text-2xl font-extrabold mt-1">Placement Directorate Overview</h1>
          <p className="text-xs text-slate-300 mt-0.5">Managing Director: {currentUser.name} • Central University Campus</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => openModal('new_partner')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Partner Company</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards (Matching Image #2 & #9) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Eligible Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">2,480</span>
            <span className="text-xs font-bold text-emerald-600">+12% YoY</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Partner Companies</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{partnerCompanies.length + 138}</span>
            <span className="text-xs font-semibold text-purple-600">+4 New This Month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Internships</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">856</span>
            <span className="text-xs font-bold text-emerald-600">Stable Pace</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Final Endorsement</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingPlacementQueue.length}</span>
            <span className="text-xs font-bold text-rose-600">Critical Priority</span>
          </div>
        </div>
      </div>

      {/* Charts Row: Line Trend vs Department Distribution (Matching Image #2) */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Internship Placement Growth Trends</h2>
              <p className="text-xs text-slate-500">Comparing 2024 active placements vs 2023 baseline</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-600"></span> 2024</span>
              <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-300"></span> 2023</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="color2024" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="y2024" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#color2024)" />
                <Area type="monotone" dataKey="y2023" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Dept. Placement Distribution</h2>
            <p className="text-xs text-slate-500">85% overall placement rate across faculties</p>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {deptData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="truncate max-w-[160px]">{d.name}</span>
                </div>
                <span className="font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Pending Verifications Table & Corporate Partners List */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Verification Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Placement Cell Final Verification Queue</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
              {pendingPlacementQueue.length} Ready for Sign-off
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Company & Role</th>
                  <th className="pb-3">Stipend</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPlacementQueue.map(app => (
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

                    <td className="py-3">
                      <div className="font-bold text-slate-800">{app.companyName}</div>
                      <div className="text-[10px] text-slate-500">{app.roleTitle}</div>
                    </td>

                    <td className="py-3 font-bold text-emerald-600">
                      ${app.stipendAmount}/mo
                    </td>

                    <td className="py-3">
                      <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {app.stage}
                      </span>
                    </td>

                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => navigateTo('application-detail', app.id)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => approveApplication(app.id, 'Placement Directorate Final Endorsement Granted.')}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Endorse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fully Approved Students & Issued NOC Certificates (Placement View) */}
        <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Approved Students & Issued NOC Directory</h3>
              <p className="text-xs text-slate-500">NOC certificates issued strictly upon 100% faculty and placement clearance</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1 rounded-full">
              {applications.filter(a => a.stage === 'approved').length} Issued NOCs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Approved Student</th>
                  <th className="pb-3">Roll / Reg No</th>
                  <th className="pb-3">Company & Role</th>
                  <th className="pb-3">NOC Issued Date</th>
                  <th className="pb-3 text-right">NOC Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.filter(a => a.stage === 'approved').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">No fully approved NOC certificates issued yet.</td>
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
                                  navigateTo('placement-dashboard', app.id);
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

        {/* Corporate Partners List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate Partners</h3>
            <button 
              onClick={() => openModal('new_partner')}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {partnerCompanies.map(c => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover bg-white ring-1 ring-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                    <p className="text-[10px] text-slate-500">{c.industry} • {c.avgStipend}</p>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Internship Tracker Logs & Report Verification Panel */}
      <div className="grid lg:grid-cols-12 gap-6 border-t border-slate-200 pt-6">
        
        {/* Trackers list (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Student Daily Work Logs</span>
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
            <span>Internship Reports Verification (Placement Stage)</span>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {reportSubmissions.filter(r => r.stage === 'hod_review').length} Actionable
            </span>
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {reportSubmissions.filter(r => r.stage === 'hod_review').map(item => (
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
                    onClick={() => rejectReportSubmission(item.id, 'Placement clearance deferred')}
                    className="px-2.5 py-1 hover:bg-rose-100 text-rose-600 font-bold rounded text-[10px] cursor-pointer"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => approveReportSubmission(item.id, 'Placement clearance approved')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] cursor-pointer"
                  >
                    Verify & Approve
                  </button>
                </div>
              </div>
            ))}
            {reportSubmissions.filter(r => r.stage === 'hod_review').length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No reports pending Placement verification.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
