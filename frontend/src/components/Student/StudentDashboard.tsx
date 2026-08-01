import React from 'react';
import { useApp } from '../../context/AppContext';
import { getStageBadge } from '../Applications/ApplicationsListView';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  Briefcase, 
  ChevronRight,
  Award,
  PhoneCall
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    navigateTo, 
    openDocumentViewer,
    openModal,
    showToast,
    uploadDocumentToApplication,
    usersList
  } = useApp();

  if (!currentUser) {
    return <div className="p-6 text-center text-xs text-slate-500">Loading student profile...</div>;
  }

  const myApps = applications.filter(a => 
    a.studentId === currentUser.id || 
    (currentUser.email && a.studentEmail === currentUser.email) || 
    (currentUser.name && a.studentName === currentUser.name)
  );
  const activeApp = myApps.find(a => a.stage === 'approved') || myApps[0];

  const pendingCount = myApps.filter(a => a.stage !== 'approved' && a.stage !== 'rejected').length;
  const approvedCount = myApps.filter(a => a.stage === 'approved').length;

  const nocDoc = activeApp?.documents.find(d => d.type === 'NOC');
  const isNocIssued = !!nocDoc;

  const downloadDoc = (doc: any) => {
    const docName = doc.name || 'Document.pdf';
    const docText = `==================================================
DOCUMENT RECORD: ${docName}
TYPE: ${doc.type || 'Official Record'}
SIZE: ${doc.size || '1.2 MB'}
STATUS: ${doc.status || 'Verified'}
DATE: ${doc.uploadDate || new Date().toLocaleDateString()}
==================================================

AUTHENTICATED DOCUMENT SUMMARY:
This is an official document stored in the Internship Tracker Portal.

Content Reference ID: ${doc.id || 'DOC-001'}
System Digital Stamp: Verified by Academic Directorate.
`;
    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docName.replace(/\.pdf$/i, '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download Started', `Downloaded ${docName}`, 'success');
  };

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

  const expectedDocs = activeApp ? [
    {
      type: 'Offer Letter',
      displayName: 'Internship Offer Letter',
      doc: activeApp.documents.find(d => d.type === 'Offer Letter'),
      canUpload: true
    },
    {
      type: 'Resume',
      displayName: 'Student Curriculum Vitae (Resume)',
      doc: activeApp.documents.find(d => d.type === 'Resume'),
      canUpload: true
    },
    {
      type: 'NOC',
      displayName: 'No Objection Certificate (NOC)',
      doc: activeApp.documents.find(d => d.type === 'NOC'),
      canUpload: false
    }
  ] : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* TOP MODULES SECTION */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Module 1: Student Profile Card */}
        <div className="lg:col-span-12 bg-[#18181b] text-white rounded-2xl p-5 shadow-xl border border-slate-800">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column (9 cols): Profile Photo & Primary Details */}
            <div className="md:col-span-9 flex gap-4 items-start">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-3xl tracking-wide shrink-0 uppercase ring-2 ring-indigo-500/30">
                {currentUser.name ? currentUser.name.charAt(0) : '?'}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight uppercase leading-snug">
                  {currentUser.name}
                </h2>
                <p className="text-sm font-bold text-slate-200 tracking-wide">
                  {currentUser.studentId || currentUser.id}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  SEMESTER - V | {currentUser.department || 'Academic Department'}
                </p>
                <div className="pt-1">
                  <span className="inline-block text-sm font-extrabold text-[#7c4dff] tracking-wider uppercase">
                    ACTIVE STUDENT
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (3 cols): Academic Mentor & Special Lab (Reduced width) */}
            <div className="md:col-span-3 space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 h-full flex flex-col justify-center">
              <p className="font-bold text-slate-200 tracking-wide uppercase">
                {currentUser.title || 'B.Tech. - INFORMATION TECHNOLOGY'}
              </p>
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <span>Mentor: RAGHUNATH M ( MC10412 )</span>
                <a href="tel:1234567890" className="text-blue-400 hover:text-blue-300 transition-colors ml-1" title="Call Mentor">
                  <PhoneCall className="w-3.5 h-3.5 inline fill-blue-500/20" />
                </a>
              </div>
              <p className="text-slate-300 font-semibold">
                Special Lab: <span className="text-slate-200 font-bold">DATA SCIENCE</span> | <span className="text-slate-200">KARTHIGA M</span>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Action Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Internship Portal Quick Actions</h3>
          <p className="text-xs text-slate-500">Track logs, view guidelines, or apply for new positions</p>
        </div>

        <div className="flex items-center gap-3">
          {activeApp && activeApp.stage === 'approved' && isNocIssued && (
            <button
              onClick={() => {
                navigateTo('student-dashboard', activeApp.id);
                openModal('noc_generator');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Official NOC</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('reports')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Upload Weekly Log</span>
          </button>

          <button
            onClick={() => navigateTo('new-application')}
            className="px-4 py-2.5 bg-[#7c4dff] hover:bg-[#6b3bf0] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for Internship</span>
          </button>
        </div>
      </div>

      {/* Official NOC Certificate Status Banner (Visible only for fully approved student) */}
      {activeApp && activeApp.stage === 'approved' && (
        isNocIssued ? (
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-700/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/20 mb-1">
                  Official NOC Issued
                </div>
                <h4 className="text-sm font-bold text-white">No Objection Certificate Ready for Download</h4>
                <p className="text-xs text-slate-300">
                  Issued to <strong>{currentUser.name}</strong> ({currentUser.studentId || currentUser.id}) for <strong>{activeApp.companyName}</strong> • Date: {nocDoc?.uploadDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  navigateTo('student-dashboard', activeApp.id);
                  openModal('noc_generator');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View NOC</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white p-5 rounded-2xl border border-amber-700/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/20 mb-1">
                  NOC Issuance Pending
                </div>
                <h4 className="text-sm font-bold text-white">Application Approved - Awaiting Placement Cell NOC Issuance</h4>
                <p className="text-xs text-slate-300">
                  Your internship request has been approved by the department. The Placement cell will review and issue your official NOC shortly.
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* 4 Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{myApps.length}</span>
            <span className="text-xs font-semibold text-emerald-600">+2 this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approval</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">0{pendingCount}</span>
            <span className="text-xs text-slate-400 font-medium">Under Review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ongoing Internships</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">0{approvedCount}</span>
            <span className="text-xs font-semibold text-emerald-600">Active Duty</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reward Points</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{currentUser.rewardPoints || 1150} pts</span>
            <span className="text-xs font-semibold text-purple-600">Top 5%</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Active Internship & Tracker */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Internship Banner Card */}
          {activeApp && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={activeApp.companyLogo}
                    alt={activeApp.companyName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/40 bg-white"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{activeApp.companyName}</h2>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active Internship</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{activeApp.roleTitle} • {activeApp.workMode}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Faculty Mentor</span>
                    <span className="font-semibold text-slate-800">{activeApp.assignedMentorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Duration</span>
                    <span className="font-semibold text-slate-800">{activeApp.startDate} to {activeApp.endDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Monthly Stipend</span>
                    <span className="font-semibold text-emerald-600">${activeApp.stipendAmount} / mo</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Internship Completion Progress</span>
                    <span className="text-indigo-600">65% Completed (Week 18 of 24)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7c4dff] to-emerald-500 rounded-full w-[65%]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications List & Live Status Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Application Progress Tracker</h2>
              <button 
                onClick={() => navigateTo('new-application')}
                className="text-xs font-bold text-[#7c4dff] hover:text-[#6b3bf0] flex items-center gap-1 cursor-pointer"
              >
                + Submit New Application
              </button>
            </div>

            <div className="space-y-3">
              {myApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => navigateTo('application-detail', app.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {app.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">{app.id}</span>
                        <span className="text-xs font-semibold text-slate-700">• {app.companyName}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{app.roleTitle} ({app.workMode})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStageBadge(app.stage)}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Documents & Additional Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Documents & Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Internship Documents</h3>

            {!activeApp ? (
              <div className="text-xs text-slate-400 py-3 text-center">No active application. Submit an application to view documents.</div>
            ) : (
              <div className="space-y-3">
                {expectedDocs.map(slot => (
                  <div key={slot.type} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{slot.displayName}</h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {slot.doc ? `${slot.doc.name} • ${slot.doc.size}` : slot.type === 'NOC' ? 'Pending Placement Issuance' : 'Not Uploaded Yet'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {slot.doc ? (
                        <>
                          <button
                            onClick={() => {
                              if (slot.type === 'NOC') {
                                navigateTo('student-dashboard', activeApp.id);
                                openModal('noc_generator');
                              } else {
                                openDocumentViewer(slot.doc);
                              }
                            }}
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 rounded-lg transition-colors cursor-pointer"
                            title={`Preview ${slot.type}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (slot.type === 'NOC') {
                                downloadNoc(activeApp);
                              } else {
                                downloadDoc(slot.doc);
                              }
                            }}
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 rounded-lg transition-colors cursor-pointer"
                            title={`Download ${slot.type}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        slot.canUpload ? (
                          <label className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors cursor-pointer border border-indigo-200 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadDocumentToApplication(activeApp.id, {
                                    name: file.name,
                                    type: slot.type,
                                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <span className="text-[10px] text-amber-600 bg-amber-50 font-bold px-2 py-0.5 rounded border border-amber-200">
                            Awaiting
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
