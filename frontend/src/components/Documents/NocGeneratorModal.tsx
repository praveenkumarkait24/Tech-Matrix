import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, ShieldCheck, FileCheck2 } from 'lucide-react';

export const NocGeneratorModal: React.FC = () => {
  const { activeModal, closeModal, currentUser, selectedApplicationId, getApplicationById, showToast, usersList } = useApp();

  if (activeModal !== 'noc_generator') return null;

  const app = (selectedApplicationId && getApplicationById(selectedApplicationId)) || 
              getApplicationById('IN-2-7376242IT259') || 
              getApplicationById('IN-1-7376242CS0842');

  if (!app) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-3">
          <h3 className="text-sm font-bold text-slate-800">No Approved Application Found</h3>
          <p className="text-xs text-slate-500">NOC certificates are only issued to fully approved internship applications.</p>
          <button onClick={closeModal} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl">Close</button>
        </div>
      </div>
    );
  }

  const studentProfile = usersList.find(u => u.id === app.studentId || u.email === app.studentEmail);
  const studentRollNo = studentProfile?.studentId || app.studentId || 'N/A';
  const nocDoc = app.documents.find(d => d.type === 'NOC');
  const issueDate = nocDoc ? nocDoc.uploadDate : (app.lastUpdated || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

  const handlePrint = () => {
    window.print();
    showToast('Printing NOC', 'Sent No Objection Certificate to printer.', 'success');
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NOC_${app.studentName}_${studentRollNo}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background: #f8fafc; color: #0f172a; }
    .card { background: white; max-width: 680px; margin: 0 auto; padding: 40px; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; color: #1e1b4b; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
    .header p { font-size: 12px; color: #475569; margin: 4px 0 0 0; font-weight: bold; }
    .ref-line { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 20px; }
    .title { text-align: center; font-size: 15px; font-weight: 800; color: #4338ca; text-decoration: underline; margin-bottom: 20px; letter-spacing: 2px; }
    .content p { font-size: 13px; line-height: 1.8; margin-bottom: 16px; text-align: justify; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 10px; font-size: 12px; margin: 20px 0; }
    .box div { margin-bottom: 6px; }
    .footer { display: flex; justify-content: space-between; margin-top: 48px; border-top: 1px solid #cbd5e1; padding-top: 20px; font-size: 12px; font-weight: 700; }
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
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOC_${app.studentName.replace(/\s+/g, '_')}_${studentRollNo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('NOC Downloaded', `Downloaded NOC certificate for ${app.studentName} (${studentRollNo}).`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Official No Objection Certificate (NOC)</h3>
              <p className="text-[10px] text-slate-400">Academic Directorate • Verification Hash: {app.auditHash}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Print NOC"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Download NOC Certificate"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8 bg-slate-100 overflow-y-auto flex-1 flex justify-center">
          <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-lg border border-slate-200 text-slate-800 space-y-6 text-xs leading-relaxed font-serif relative">
            {/* Stamp Background */}
            <div className="absolute right-8 top-12 opacity-10 pointer-events-none">
              <ShieldCheck className="w-40 h-40 text-indigo-900" />
            </div>

            {/* University Letterhead Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1 font-sans">
              <h1 className="font-black text-lg tracking-wider text-indigo-950 uppercase">CENTRAL UNIVERSITY OF TECHNOLOGY</h1>
              <p className="text-[11px] font-bold text-slate-700">Directorate of Academic Affairs & Training</p>
              <p className="text-[9px] text-slate-500">University Campus, Innovation Drive • Email: placement@university.edu</p>
            </div>

            <div className="space-y-4 font-sans">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>Ref No: CUT/NOC/2024/{app.id}</span>
                <span>Date: {issueDate}</span>
              </div>

              <div className="text-center pt-2">
                <span className="font-extrabold text-sm text-slate-900 uppercase border-b-2 border-indigo-600 pb-1 tracking-widest">
                  NO OBJECTION CERTIFICATE
                </span>
              </div>

              <p className="text-justify leading-relaxed">
                This is to certify that <strong>{app.studentName}</strong> (Student Roll No: <strong>{studentRollNo}</strong>) is a bona fide student of <strong>{app.studentDegree}</strong> in the Department of <strong>{app.department}</strong> with a cumulative GPA of <strong>{app.cgpa}</strong>.
              </p>

              <p className="text-justify leading-relaxed">
                The Department of {app.department} and the University Placement Directorate have <strong>NO OBJECTION</strong> to the student pursuing an official industry internship with <strong>{app.companyName}</strong> as <strong>{app.roleTitle}</strong> from <strong>{app.startDate}</strong> to <strong>{app.endDate}</strong> ({app.durationMonths} Months) in {app.workMode} mode.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                <div>• <strong>Approved Stipend:</strong> ${app.stipendAmount} / Month ({app.stipendCurrency})</div>
                <div>• <strong>Academic Credits Allocated:</strong> 6 Credits upon logbook submission</div>
                <div>• <strong>Verification Reference:</strong> {app.id}</div>
              </div>

              <p className="text-slate-600 italic text-[11px]">
                This certificate is digitally authenticated and valid for official onboard processing with {app.companyName}.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-8 grid grid-cols-2 gap-4 font-sans border-t border-slate-200 items-end">
              <div>
                <p className="font-bold text-slate-900">Dr. Selvakumar T</p>
                <p className="text-[10px] text-slate-500">Head of Department ({app.department === 'Information Technology' ? 'IT' : 'CSE'})</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900">Ranjith Kumar</p>
                <p className="text-[10px] text-slate-500">Director, Placement Directorate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
