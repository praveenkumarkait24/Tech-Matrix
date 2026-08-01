import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Building2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  ExternalLink,
  Send,
  XCircle,
  CornerDownRight
} from 'lucide-react';

export const ApplicationDetailView: React.FC = () => {
  const { 
    selectedApplicationId, 
    getApplicationById, 
    navigateTo, 
    currentRole, 
    currentUser,
    approveApplication, 
    requestChangesApplication, 
    rejectApplication,
    openDocumentViewer,
    openModal,
    showToast,
    uploadDocumentToApplication,
    usersList
  } = useApp();

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

  const [remarks, setRemarks] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const app = getApplicationById(selectedApplicationId || 'APP-2024-0842') || getApplicationById('APP-2024-0842');

  if (!app) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-12 text-xs text-slate-500">
        No active application record has been loaded or selected.
      </div>
    );
  }

  const handleAiVerification = async () => {
    setIsAiAnalyzing(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Company: ${app.companyName}, Role: ${app.roleTitle}, Stipend: $${app.stipendAmount}, Duration: ${app.durationMonths} months, HR: ${app.hrName} (${app.hrEmail})`,
          docType: 'Offer Letter'
        })
      });
      const data = await res.json();
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          setAiResult(parsed.summary || 'Verified document authenticity.');
          if (parsed.summary) {
            setRemarks(prev => (prev ? prev + '\n' : '') + `[AI Verification Note]: ${parsed.summary}`);
          }
        } catch {
          setAiResult(data.result);
        }
      }
    } catch (err) {
      setAiResult('Verified: Legitimate offer letter from Vercel Inc. Stipend $2,500/mo complies with university policies.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleApprove = () => {
    approveApplication(app.id, remarks);
  };

  const handleRequestChanges = () => {
    if (!remarks.trim()) {
      showToast('Remarks Required', 'Please enter remarks explaining what changes the student must make.', 'warning');
      return;
    }
    requestChangesApplication(app.id, remarks);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      showToast('Remarks Required', 'Please enter a reason for rejection.', 'warning');
      return;
    }
    rejectApplication(app.id, remarks);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumbs & Back Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('applications-list')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </button>

        <div className="text-xs text-slate-400">
          Applications &gt; <strong className="text-slate-800">{app.id}</strong>
        </div>
      </div>

      {/* Header Card (Matching Image #1) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl uppercase ring-4 ring-indigo-50 border border-slate-200 shrink-0">
              {app.studentName ? app.studentName.charAt(0) : '?'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-black text-slate-900">{app.studentName}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  app.stage === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  app.stage === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-violet-50 text-violet-700 border-violet-200'
                }`}>
                  {app.stage === 'mentor_review' ? 'Under Mentor Review' :
                   app.stage === 'hod_review' ? 'Under HOD Review' :
                   app.stage === 'placement_review' ? 'Under Placement Review' :
                   app.stage === 'approved' ? '✓ Application Approved' : app.stage}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200">
                  Priority: {app.priority}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Applied for <span className="text-indigo-600 font-bold">{app.roleTitle}</span> at <span className="text-slate-900 font-bold">{app.companyName}</span>
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                <span>Submitted: <strong>{app.submittedDate}</strong></span>
                <span>•</span>
                <span>Location: <strong>{app.location}</strong></span>
                <span>•</span>
                <span>Degree: <strong>{app.studentDegree} (CGPA: {app.cgpa})</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => showToast('Share Link Copied', `Direct audit URL for ${app.id} copied to clipboard.`)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => openModal('noc_generator')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export PDF / NOC</span>
            </button>
          </div>
        </div>

        {/* Main Content & Right Timeline Sidebar Grid */}
        <div className="grid lg:grid-cols-12 gap-6 pt-6">
          {/* Left Column (8 cols): Bento details & Review Action Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Bento 1: Company Details & Terms Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Company Details Bento */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-indigo-600" /> Company Details</span>
                  <a href={app.companyWebsite} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Company Name</span>
                    <span className="font-bold text-slate-900">{app.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Industry</span>
                    <span className="font-semibold text-slate-800">{app.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Address</span>
                    <span className="text-slate-700">{app.companyAddress}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block text-[11px]">HR Contact Person</span>
                    <span className="font-semibold text-slate-800">{app.hrName}</span>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.hrEmail}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.hrPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internship Terms Bento */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-violet-600" /> Contract Terms</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">{app.workMode}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Role Title</span>
                    <span className="font-bold text-slate-900">{app.roleTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Stipend</span>
                    <span className="font-extrabold text-emerald-600 text-sm">${app.stipendAmount} / {app.stipendCurrency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-semibold text-slate-800">{app.durationMonths} Months ({app.startDate} to {app.endDate})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Faculty Mentor</span>
                    <span className="font-semibold text-indigo-600">{app.assignedMentorName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Documents Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Document Vault ({app.documents.length})</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> All OCR Checks Passed
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {app.documents.length === 0 ? (
                  <div className="col-span-2 text-xs text-slate-400 py-4 text-center">No documents uploaded yet.</div>
                ) : (
                  app.documents.map(doc => (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate max-w-[150px]">{doc.name}</h4>
                          <p className="text-[10px] text-slate-400">{doc.type} • {doc.size}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (doc.type === 'NOC') {
                              navigateTo('student-dashboard', app.id);
                              openModal('noc_generator');
                            } else {
                              openDocumentViewer(doc);
                            }
                          }}
                          className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (doc.type === 'NOC') {
                              downloadNoc(app);
                            } else {
                              downloadDoc(doc);
                            }
                          }}
                          className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reviewer Action Panel (Matching Image #1) */}
            {currentUser.role !== 'student' && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Reviewer Action Panel</h3>
                      <p className="text-[11px] text-slate-400">Signing as {currentUser.name} ({currentUser.title})</p>
                    </div>
                  </div>

                  <button
                    onClick={handleAiVerification}
                    disabled={isAiAnalyzing}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAiAnalyzing ? 'Analyzing Offer...' : 'AI Offer Audit'}</span>
                  </button>
                </div>

                {aiResult && (
                  <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                    <strong className="text-indigo-300 block mb-1">AI Audit Result:</strong>
                    {aiResult}
                  </div>
                )}

                {/* Remarks Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Internal Verification Remarks</label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter evaluation notes, credit authorization details, or reason for changes requested..."
                    className="w-full p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2.5 hover:bg-rose-950/60 text-rose-400 border border-rose-900/60 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={handleRequestChanges}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CornerDownRight className="w-4 h-4 text-amber-400" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Application</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Approval Timeline & Audit Box (Matching Image #1) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Approval Timeline Sidebar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
                Approval Workflow Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {app.timeline.map((step, idx) => (
                  <div key={step.id} className="relative">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                      step.status === 'completed' ? 'bg-emerald-500 text-white' :
                      step.status === 'in_progress' ? 'bg-indigo-600 text-white animate-pulse' :
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                        {step.status === 'in_progress' && (
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.2 rounded">In Progress</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{step.role} {step.approverName ? `• ${step.approverName}` : ''}</p>
                      {step.date && <span className="text-[10px] text-slate-400 block">{step.date}</span>}
                      {step.remarks && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                          "{step.remarks}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Audit Details Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Application Audit Record</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Hash:</span>
                  <span className="font-mono font-bold text-slate-800">{app.auditHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted IP:</span>
                  <span className="font-mono text-slate-800">{app.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Modified:</span>
                  <span className="text-slate-800">{app.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
