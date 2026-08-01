import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Briefcase, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { WorkMode } from '../../types';

export const NewApplicationStepper: React.FC = () => {
  const { submitNewApplication, navigateTo, showToast } = useApp();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: 'Vercel Inc.',
    industry: 'Cloud & Web Infrastructure',
    companyWebsite: 'https://vercel.com',
    companyAddress: '340 S Lemon Ave #4133, Walnut, CA 91789',
    hrName: 'Sarah Parker',
    hrEmail: 's.parker@vercel.com',
    hrPhone: '+1 (415) 890-3411',

    roleTitle: 'Senior Frontend Engineering Intern',
    workMode: 'Hybrid' as WorkMode,
    location: 'San Francisco, CA / Remote',
    startDate: '2024-11-01',
    endDate: '2025-05-01',
    durationMonths: 6,
    stipendAmount: 2500,
    stipendCurrency: 'USD',

    offerLetterFileName: '',
    resumeFileName: '',
    termsAccepted: false,
    referredBy: 'Prof. Helena Vance',
    sdgGoal: 'SDG 8: Decent Work & Economic Growth',
    aicteInternship: 'No',
    workingDays: 120,
    industrySector: 'Technology'
  });

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      showToast('Declaration Required', 'Please check the student declaration box before submitting.', 'warning');
      return;
    }

    const created = submitNewApplication({
      companyName: formData.companyName,
      industry: formData.industry,
      companyWebsite: formData.companyWebsite,
      companyAddress: formData.companyAddress,
      hrName: formData.hrName,
      hrEmail: formData.hrEmail,
      hrPhone: formData.hrPhone,
      roleTitle: formData.roleTitle,
      workMode: formData.workMode,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      durationMonths: formData.durationMonths,
      stipendAmount: formData.stipendAmount,
      stipendCurrency: formData.stipendCurrency,
      documents: [
        {
          id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
          name: formData.offerLetterFileName,
          type: 'Offer Letter',
          size: '1.2 MB',
          uploadDate: new Date().toLocaleDateString(),
          url: '#',
          status: 'Verified'
        },
        {
          id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
          name: formData.resumeFileName,
          type: 'Resume',
          size: '1.5 MB',
          uploadDate: new Date().toLocaleDateString(),
          url: '#',
          status: 'Verified'
        }
      ]
    });

    navigateTo('application-detail', created.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('student-dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-bold text-slate-500">
          New Internship Application Portal
        </span>
      </div>

      {/* Stepper Header (4 Steps) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: 'Company Info', icon: Building2 },
            { num: 2, label: 'Internship Details', icon: Briefcase },
            { num: 3, label: 'Upload Vault', icon: Upload },
            { num: 4, label: 'Verification & Submit', icon: CheckCircle2 }
          ].map(s => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;

            return (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isDone ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? '✓' : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                    Step {s.num}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Step 1: Company Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 1: Company & Recruiter Information</h2>
              <span className="text-xs text-indigo-600 font-semibold">1 of 4 Steps</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry Sector *</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                >
                  <option>Cloud & Web Infrastructure</option>
                  <option>AI & Machine Learning</option>
                  <option>Fintech & Quantitative Trading</option>
                  <option>Digital Media & UX</option>
                  <option>Enterprise SaaS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Website *</label>
                <input
                  type="text"
                  value={formData.companyWebsite}
                  onChange={e => setFormData({ ...formData, companyWebsite: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Physical Address</label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={e => setFormData({ ...formData, companyAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HR Contact Full Name *</label>
                <input
                  type="text"
                  value={formData.hrName}
                  onChange={e => setFormData({ ...formData, hrName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HR Official Work Email *</label>
                <input
                  type="email"
                  value={formData.hrEmail}
                  onChange={e => setFormData({ ...formData, hrEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry Sector *</label>
                <input
                  type="text"
                  value={formData.industrySector}
                  onChange={e => setFormData({ ...formData, industrySector: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SDG Goal *</label>
                <select
                  value={formData.sdgGoal}
                  onChange={e => setFormData({ ...formData, sdgGoal: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                >
                  <option>SDG 8: Decent Work & Economic Growth</option>
                  <option>SDG 9: Industry, Innovation & Infrastructure</option>
                  <option>SDG 4: Quality Education</option>
                  <option>Other / None</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referred By</label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={e => setFormData({ ...formData, referredBy: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">AICTE Approved Internship?</label>
                <select
                  value={formData.aicteInternship}
                  onChange={e => setFormData({ ...formData, aicteInternship: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Number of Working Days *</label>
                <input
                  type="number"
                  value={formData.workingDays}
                  onChange={e => setFormData({ ...formData, workingDays: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Next: Internship Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Internship Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 2: Role, Mode & Compensation</h2>
              <span className="text-xs text-indigo-600 font-semibold">2 of 4 Steps</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internship Role Title *</label>
                <input
                  type="text"
                  value={formData.roleTitle}
                  onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Mode *</label>
                <select
                  value={formData.workMode}
                  onChange={e => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                >
                  <option value="Hybrid">Hybrid Remote</option>
                  <option value="Remote">100% Remote</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend ($ USD) *</label>
                <input
                  type="number"
                  value={formData.stipendAmount}
                  onChange={e => setFormData({ ...formData, stipendAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Next: Upload Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Vault */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 3: Document Vault Upload</h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* Offer Letter Drag Drop */}
              <label className="block p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-2xl text-center space-y-2 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
                <h3 className="font-bold text-slate-800">Upload Offer Letter (PDF) *</h3>
                <p className="text-[11px] text-slate-500">Must show company letterhead, stipend, and HR signature</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700">
                    {formData.offerLetterFileName ? `Selected: ${formData.offerLetterFileName}` : 'Choose file...'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, offerLetterFileName: file.name });
                    }
                  }}
                />
              </label>

              {/* Resume Drag Drop */}
              <label className="block p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 rounded-2xl text-center space-y-2 cursor-pointer transition-colors">
                <FileText className="w-8 h-8 text-indigo-600 mx-auto" />
                <h3 className="font-bold text-slate-800">Upload Updated CV / Resume (PDF) *</h3>
                <p className="text-[11px] text-slate-500">Select your latest professional resume</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700">
                    {formData.resumeFileName ? `Selected: ${formData.resumeFileName}` : 'Choose file...'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, resumeFileName: file.name });
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!formData.offerLetterFileName) {
                    showToast('Offer Letter Required', 'Please upload your internship Offer Letter to proceed.', 'error');
                    return;
                  }
                  if (!formData.resumeFileName) {
                    showToast('Resume Required', 'Please upload your CV / Resume to proceed.', 'error');
                    return;
                  }
                  setStep(4);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Next: Final Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Final Review & Submit */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 4: Summary Verification & Pledge</h2>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verification Ready
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Company Name</span>
                  <span className="font-bold text-slate-900">{formData.companyName} ({formData.industry})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Role Title</span>
                  <span className="font-bold text-slate-900">{formData.roleTitle} ({formData.workMode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Stipend & Duration</span>
                  <span className="font-bold text-emerald-600">${formData.stipendAmount}/mo • 6 Months</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HR Official Contact</span>
                  <span className="font-semibold text-slate-800">{formData.hrName} ({formData.hrEmail})</span>
                </div>
              </div>
            </div>

            {/* Student Pledge Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={e => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>
                I hereby declare that all details provided in this internship application and offer letter are true and accurate. I pledge to adhere to university academic standards and submit weekly logbooks diligently.
              </span>
            </label>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Application for Mentor Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
