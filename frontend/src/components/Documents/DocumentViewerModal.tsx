import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, ShieldCheck, FileText, Printer } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { activeModal, selectedDocument, closeModal, showToast, applications, selectedApplicationId, getApplicationById, usersList } = useApp();

  if (activeModal !== 'doc_viewer' || !selectedDocument) return null;

  const app = (selectedApplicationId && getApplicationById(selectedApplicationId)) ||
              applications.find(a => a.documents.some(d => d.id === selectedDocument.id)) ||
              applications[0];

  const isResume = selectedDocument.type?.toLowerCase().includes('resume') || selectedDocument.name?.toLowerCase().includes('resume');
  const isOfferLetter = selectedDocument.type?.toLowerCase().includes('offer') || selectedDocument.name?.toLowerCase().includes('offer');

  const handleDownload = () => {
    const docName = selectedDocument.name || 'Document.pdf';
    const studentProfile = app ? usersList.find(u => u.id === app.studentId || u.email === app.studentEmail) : null;
    const studentRollNo = studentProfile?.studentId || app?.studentId || 'N/A';

    let docText = '';

    if (isResume) {
      docText = `==================================================
STUDENT RESUME RECORD: ${app?.studentName || 'Student'}
ROLL NUMBER: ${studentRollNo}
DEGREE: ${app?.studentDegree || 'B.Tech'}
DEPARTMENT: ${app?.department || 'Information Technology'}
CGPA: ${app?.cgpa || '3.5'}
==================================================

AUTHENTICATED DOCUMENT SUMMARY:
This is a student CV/Resume stored in the Internship Tracker Portal.
`;
    } else {
      docText = `==================================================
OFFER LETTER: ${app?.companyName || 'Corporate Partner'}
STUDENT NAME: ${app?.studentName || 'Student'}
ROLL NUMBER: ${studentRollNo}
ROLE: ${app?.roleTitle || 'Intern'}
STIPEND: $${app?.stipendAmount || '2000'} / Month
DURATION: ${app?.durationMonths || '6'} Months
START DATE: ${app?.startDate || 'N/A'}
==================================================

AUTHENTICATED DOCUMENT SUMMARY:
This is an official offer letter submitted to the Internship Tracker Portal.
`;
    }

    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docName.replace(/\.pdf$/i, '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Document Downloaded', `Downloaded ${docName}`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
              PDF
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{selectedDocument.name || 'Verified Document.pdf'}</h3>
              <p className="text-[10px] text-slate-400">{selectedDocument.type || 'Official Record'} • Verified OCR</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Printed Document', 'Sent document to printer buffer.')}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Download File"
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

        {/* Modal Content Preview */}
        <div className="p-8 bg-slate-100 overflow-y-auto flex-1 flex justify-center">
          <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-lg border border-slate-200 text-slate-800 space-y-6 text-xs font-serif leading-relaxed">
            
            {isResume ? (
              <>
                {/* Resume Letterhead */}
                <div className="text-center border-b border-slate-200 pb-4 space-y-1 font-sans">
                  <div className="font-black text-lg tracking-wider uppercase text-slate-900">{app?.studentName || 'Student Resume'}</div>
                  <p className="text-[10px] text-slate-500">{app?.studentEmail || 'student@university.edu'} • GPA: {app?.cgpa || '3.5'} • B.Tech Student</p>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs border-b border-slate-200 pb-1 mb-2 uppercase">Academic Qualifications</h4>
                    <p><strong>Central University of Technology</strong><br />{app?.studentDegree || 'B.Tech'}<br />Department of {app?.department || 'Engineering'}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs border-b border-slate-200 pb-1 mb-2 uppercase">Applied Position / Role</h4>
                    <p>Currently applying for: <strong>{app?.roleTitle || 'Software Engineer Intern'}</strong> at <strong>{app?.companyName || 'Corporate Partner'}</strong></p>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs border-b border-slate-200 pb-1 mb-2 uppercase">Key Technical Proficiencies</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL Database', 'Git Version Control'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[9px] font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Offer Letter Letterhead */}
                <div className="text-center border-b border-slate-200 pb-4 space-y-1 font-sans">
                  <div className="font-black text-lg tracking-wider uppercase text-slate-900">{app?.companyName.toUpperCase() || 'OFFER LETTER'}</div>
                  <p className="text-[10px] text-slate-500">{app?.companyAddress || 'Corporate HQ'} • Contact: {app?.hrEmail || 'hr@company.com'}</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Date: {app?.submittedDate || 'Today'}</span>
                    <span>Ref: OFF-INT-${app?.id || '2024'}</span>
                  </div>

                  <p><strong>To: {app?.studentName || 'Bona fide Student'}</strong><br />{app?.studentDegree || 'B.Tech Student'}<br />Student Profile ID: {app?.studentId || 'USR-STU-001'}</p>

                  <p className="font-extrabold text-indigo-950 text-sm border-b border-indigo-100 pb-1 uppercase tracking-wide">RE: OFFER OF {app?.roleTitle.toUpperCase() || 'INTERNSHIP'}</p>

                  <p className="text-justify leading-relaxed">
                    We are pleased to offer you the position of <strong>{app?.roleTitle || 'Intern'}</strong> at <strong>{app?.companyName || 'our company'}</strong>. This position is in a <strong>{app?.workMode || 'Hybrid'}</strong> work setup in <strong>{app?.location || 'Office'}</strong> starting <strong>{app?.startDate || 'November 01, 2024'}</strong> through <strong>{app?.endDate || 'May 01, 2025'}</strong> ({app?.durationMonths || 6} Months).
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div>• <strong>Monthly Compensation:</strong> ${app?.stipendAmount || 2000} {app?.stipendCurrency || 'USD'} / Month</div>
                    <div>• <strong>Work Hours:</strong> 40 Hours / Week (Full-time)</div>
                    <div>• <strong>Reporting HR Manager:</strong> {app?.hrName || 'HR Coordinator'} ({app?.hrEmail || 'hr@company.com'})</div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    This offer is contingent upon official No Objection Certificate (NOC) clearance from your Academic Directorate.
                  </p>
                </div>

                {/* Signature */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-end font-sans">
                  <div>
                    <p className="font-bold text-slate-900">{app?.hrName || 'Sarah Parker'}</p>
                    <p className="text-[10px] text-slate-500">Corporate Hiring Lead, {app?.companyName || 'Vercel Inc.'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[9px] rounded-lg border border-emerald-200">
                      ✓ Digitally Verified Signature
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
