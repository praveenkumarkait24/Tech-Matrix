import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Calendar, 
  Upload, 
  Lock,
  Building,
  User,
  GraduationCap,
  Globe,
  DollarSign,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export const ReportSubmissionView: React.FC = () => {
  const { currentUser, applications, reportSubmissions, submitInternshipReport, showToast } = useApp();

  const [student, setStudent] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [specialLab, setSpecialLab] = useState('');
  const [sector, setSector] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [stipend, setStipend] = useState('');
  const [aicte, setAicte] = useState('');
  const [sdg, setSdg] = useState('');

  // Proof files
  const [reportFileName, setReportFileName] = useState('');
  const [originalCertName, setOriginalCertName] = useState('');
  const [attestedCertName, setAttestedCertName] = useState('');

  const activeApp = applications.find(a => 
    (a.studentId === currentUser.id || (currentUser.email && a.studentEmail === currentUser.email) || (currentUser.name && a.studentName === currentUser.name)) && 
    a.stage === 'approved'
  ) || applications.find(a => 
    a.studentId === currentUser.id || (currentUser.email && a.studentEmail === currentUser.email) || (currentUser.name && a.studentName === currentUser.name)
  );

  // Set default fields from active application
  useEffect(() => {
    if (activeApp) {
      setStudent(activeApp.studentName);
      setAddressLine1(activeApp.companyAddress);
      setWebsite(activeApp.companyWebsite);
      setContactDetails(`${activeApp.hrName} (${activeApp.hrEmail})`);
      setStipend(`$${activeApp.stipendAmount}`);
    }
  }, [activeApp]);

  // AUTOMATION RULE: Lock Report submission before official End Date
  const currentDate = new Date('2026-07-31');
  const isLocked = activeApp ? currentDate < new Date(activeApp.endDate) : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;
    if (isLocked) {
      showToast('Action Blocked', 'Report submission is locked until the internship end date.', 'error');
      return;
    }
    if (!reportFileName || !originalCertName || !attestedCertName) {
      showToast('Validation Error', 'Please upload all required certificate proofs.', 'warning');
      return;
    }

    submitInternshipReport({
      applicationId: activeApp.id,
      companyName: activeApp.companyName,
      industry: activeApp.companyName,
      sector,
      companyWebsite: website,
      companyAddress: `${addressLine1} ${addressLine2}`,
      startDate: activeApp.startDate,
      endDate: activeApp.endDate,
      durationMonths: activeApp.durationMonths,
      stipendAmount: activeApp.stipendAmount,
      projectTitle: 'Internship Work Product',
      projectDescription: 'Completed deliverables for active training duration.',
      technologiesUsed: 'HTML, CSS, JS',
      skillsLearned: 'Lifecycle integration workflows',
      learningOutcomes: 'Practical application of coursework knowledge.',
      responsibilities: 'Associate Intern duties.',
      challengesFaced: 'Onboarding latency.',
      solutions: 'Diligently reviewing documentation.',
      experienceSummary: 'Enriching learning path.',
      studentFeedback: 'Great culture.',
      companyFeedback: 'Outstanding project contribution.',
      reportFile: reportFileName,
      completionCertFile: originalCertName,
      originalCertFile: originalCertName,
      attestedCertFile: attestedCertName
    });

    setReportFileName('');
    setOriginalCertName('');
    setAttestedCertName('');
  };

  if (currentUser.role !== 'student') {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center gap-4 text-slate-800">
          <ShieldAlert className="w-10 h-10 shrink-0 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm">Access Restricted</h3>
            <p className="text-xs mt-1 text-slate-500 font-medium">Only student users are authorized to create or submit internship reports. Staff members may view submitted reports from their respective dashboards.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeApp) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center gap-4 text-amber-800">
          <Lock className="w-10 h-10 shrink-0 text-amber-600 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">Report Submission Locked</h3>
            <p className="text-xs mt-1">You must have an approved, active internship application to configure final project reports.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-xs text-slate-700">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
            <FileCheck2 className="w-3.5 h-3.5" /> Stage 3: Internship Report
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Create Internship Report</h1>
          <p className="text-xs text-slate-300">
            Approved Industry: {activeApp.companyName} • {activeApp.roleTitle}
          </p>
        </div>
      </div>

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-[11px]">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Automation Rule Applied:</strong> The final evaluation report is locked until the internship end date ({activeApp.endDate}).</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Form panel (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Internship Project Report details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Student *</label>
                <select
                  value={student}
                  onChange={e => setStudent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                >
                  <option value={activeApp.studentName}>{activeApp.studentName}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Year of Study *</label>
                <select
                  value={yearOfStudy}
                  onChange={e => setYearOfStudy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                >
                  <option value="">Choose an option</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year (Final Year)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Special Lab *</label>
                <select
                  value={specialLab}
                  onChange={e => setSpecialLab(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                >
                  <option value="">Click to choose</option>
                  <option value="aiml">AI & ML Specialization Lab</option>
                  <option value="cloud">Cloud Native Computing Lab</option>
                  <option value="ds">Data Science & Analytics Lab</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Sector *</label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                >
                  <option value="">Choose an option</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="Finance">Fintech / Quant</option>
                  <option value="Mech">Core Mechanical</option>
                  <option value="Research">Research & Development</option>
                </select>
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-3">
              <span className="font-bold text-slate-500 block">Industry Address details</span>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={e => setAddressLine1(e.target.value)}
                    placeholder="Industry Address Line 1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={e => setAddressLine2(e.target.value)}
                    placeholder="Industry Address Line 2"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="State"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Country *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Industry Website *</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="Industry Website"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Industry Contact Details *</label>
                <input
                  type="text"
                  value={contactDetails}
                  onChange={e => setContactDetails(e.target.value)}
                  placeholder="Industry Contact Details"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Referred By *</label>
                <select
                  value={referredBy}
                  onChange={e => setReferredBy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="">Choose</option>
                  <option value="Placement">Placement Cell</option>
                  <option value="HOD">HOD Recommendation</option>
                  <option value="Direct">Direct / Self</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Stipend Amount *</label>
                <select
                  value={stipend}
                  onChange={e => setStipend(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="">Choose</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="1500">$1,500 / month</option>
                  <option value="2500">$2,500 / month</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Is it through AICTE? *</label>
                <select
                  value={aicte}
                  onChange={e => setAicte(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="">Choose</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">SDG Goals *</label>
                <select
                  value={sdg}
                  onChange={e => setSdg(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="">Choose</option>
                  <option value="Goal 8">SDG 8: Decent Work</option>
                  <option value="Goal 9">SDG 9: Industry</option>
                  <option value="None">None / Other</option>
                </select>
              </div>
            </div>

            {/* Upload Vaults */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-500 block">Certificate & Document Upload Vault</span>

              {/* Full Document Proof */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-600">Full Document Proof *</label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <span className="block text-[11px] font-bold text-slate-700">Drop file or click to choose</span>
                  <input
                    type="file"
                    onChange={e => setReportFileName(e.target.files?.[0]?.name || '')}
                    className="hidden"
                    id="report-proof-input"
                  />
                  <label htmlFor="report-proof-input" className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 text-[10px]">
                    Choose File
                  </label>
                  <span className="block text-[10px] text-slate-400">
                    {reportFileName ? `Selected: ${reportFileName}` : 'No file chosen'}
                  </span>
                </div>
                <ul className="text-[10px] text-slate-500 list-disc pl-4">
                  <li>Please find the Internship Report Format here</li>
                  <li>Please specify the Proof name only in the following format: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">201CS111-IR-08.06.2021</span></li>
                </ul>
              </div>

              {/* Original Certificate Proof */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-600">Original Certificate Proof *</label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <span className="block text-[11px] font-bold text-slate-700">Drop file or click to choose</span>
                  <input
                    type="file"
                    onChange={e => setOriginalCertName(e.target.files?.[0]?.name || '')}
                    className="hidden"
                    id="original-cert-input"
                  />
                  <label htmlFor="original-cert-input" className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 text-[10px]">
                    Choose File
                  </label>
                  <span className="block text-[10px] text-slate-400">
                    {originalCertName ? `Selected: ${originalCertName}` : 'No file chosen'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  * Please specify the Proof name only in the following format: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">201CS111-IRO-08.06.2024</span>
                </p>
              </div>

              {/* Attested Certificate */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-600">Attested Certificate *</label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <span className="block text-[11px] font-bold text-slate-700">Drop file or click to choose</span>
                  <input
                    type="file"
                    onChange={e => setAttestedCertName(e.target.files?.[0]?.name || '')}
                    className="hidden"
                    id="attested-cert-input"
                  />
                  <label htmlFor="attested-cert-input" className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 text-[10px]">
                    Choose File
                  </label>
                  <span className="block text-[10px] text-slate-400">
                    {attestedCertName ? `Selected: ${attestedCertName}` : 'No file chosen'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  * Please specify the Proof name only in the following format: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">201CS111-IRX-08.06.2024</span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
            >
              Submit Report Evaluation Files
            </button>
          </form>
        </div>

        {/* Right side status (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Submissions</h3>
            <div className="space-y-3">
              {reportSubmissions.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1 font-bold text-[10px] text-slate-400">
                    <span>{item.id}</span>
                    <span>{item.submittedDate}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Sector / Industry</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.sector} • {item.companyName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Stage 4 Approval status</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
                      item.stage === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {item.stage === 'completed' ? '✓ Fully Verified' : `Pending: ${item.stage}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
