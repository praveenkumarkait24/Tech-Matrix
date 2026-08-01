import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Calendar, 
  Upload, 
  Lock,
  Building,
  CheckCircle,
  FileText,
  User
} from 'lucide-react';

export const TrackerView: React.FC = () => {
  const { currentUser, applications, trackerSubmissions, submitTrackerLog, showToast } = useApp();

  const [student, setStudent] = useState('');
  const [industry, setIndustry] = useState('');
  const [startDate, setStartDate] = useState('2026-07-31');
  const [endDate, setEndDate] = useState('2026-07-31');
  const [duration, setDuration] = useState(1);
  const [aimFile, setAimFile] = useState<File | null>(null);
  const [aimFileName, setAimFileName] = useState('');
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [offerFileName, setOfferFileName] = useState('');
  const [withInternship, setWithInternship] = useState('');

  // Daily log entry form (what they done daily in their internship)
  const [dailyProgress, setDailyProgress] = useState('');
  const [hoursWorked, setHoursWorked] = useState(8);

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
      setIndustry(activeApp.companyName);
      setStartDate(activeApp.startDate);
      setEndDate(activeApp.endDate);
      
      const start = new Date(activeApp.startDate);
      const end = new Date(activeApp.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDuration(diffDays);
    }
  }, [activeApp]);

  // Lock status: Must be approved to access
  const isApproved = activeApp?.stage === 'approved';

  const handleCreateTracker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved) {
      showToast('Blocked', 'Your application must be approved by Mentor, HOD, and Placement Cell first.', 'error');
      return;
    }
    if (!aimFileName || !offerFileName) {
      showToast('Validation Error', 'Please upload all required files.', 'warning');
      return;
    }
    showToast('Tracker Activated', 'Internship Tracker has been successfully configured and activated.', 'success');
  };

  const handleLogDailyWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved) return;
    submitTrackerLog({
      applicationId: activeApp?.id,
      dailyProgress,
      hoursWorked,
      weeklyProgress: 'Logged via daily work tracker.',
      tasksCompleted: 'Daily tasks',
      attendance: 'Present',
      progressPercentage: 50
    });
    setDailyProgress('');
  };

  if (!activeApp) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center gap-4 text-amber-800">
          <Lock className="w-10 h-10 shrink-0 text-amber-600 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">Internship Tracker Locked</h3>
            <p className="text-xs mt-1">Your internship application must be fully approved by Mentor, HOD, and Placement Cell before you can configure the tracker.</p>
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
            <Clock className="w-3.5 h-3.5" /> Stage 2: Internship Tracker
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Active Internship Logbook</h1>
          <p className="text-xs text-slate-300">
            Student: {activeApp.studentName} ({activeApp.studentId})
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create/Configure Tracker (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Create Internship Tracker</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Initialize your work logging tracker for this academic year.</p>
          </div>

          <form onSubmit={handleCreateTracker} className="space-y-4">
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Student *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <select
                    value={student}
                    onChange={e => setStudent(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value={activeApp.studentName}>{activeApp.studentName}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Industry *</label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3" />
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value={activeApp.companyName}>{activeApp.companyName}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Duration in days</label>
                <input
                  type="number"
                  value={duration}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500"
                />
              </div>
            </div>

            {/* Aim & Objective Document */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-600">Aim & Objective *</label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="block text-[11px] font-bold text-slate-700">Drop file or click to choose</span>
                <input
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAimFile(file);
                      setAimFileName(file.name);
                    }
                  }}
                  className="hidden"
                  id="aim-file-input"
                />
                <label htmlFor="aim-file-input" className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 text-[10px]">
                  Choose File
                </label>
                <span className="block text-[10px] text-slate-400">
                  {aimFileName ? `Selected: ${aimFileName}` : 'No file chosen'}
                </span>
              </div>
              <ul className="text-[10px] text-slate-500 list-disc pl-4 space-y-0.5">
                <li>Please find the Aim & Objective Format here</li>
                <li>Please specify the Proof name only in the following format: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">201CS111-ITI-08.06.2025</span></li>
              </ul>
            </div>

            {/* Offer Letter Document */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-600">Offer Letter *</label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="block text-[11px] font-bold text-slate-700">Drop file or click to choose</span>
                <input
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setOfferFile(file);
                      setOfferFileName(file.name);
                    }
                  }}
                  className="hidden"
                  id="offer-file-input"
                />
                <label htmlFor="offer-file-input" className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 text-[10px]">
                  Choose File
                </label>
                <span className="block text-[10px] text-slate-400">
                  {offerFileName ? `Selected: ${offerFileName}` : 'No file chosen'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                * Please specify the Proof name only in the following format: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">201CS111-ITO-08.06.2025</span>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">With Internship *</label>
              <select
                value={withInternship}
                onChange={e => setWithInternship(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              >
                <option value="">Choose an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Configure Tracker Setup
            </button>
          </form>
        </div>

        {/* Right Side: Log Daily Work (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Log Daily Work Progress</h3>
            
            <form onSubmit={handleLogDailyWork} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Today's Daily Progress Log *</label>
                <textarea
                  value={dailyProgress}
                  onChange={e => setDailyProgress(e.target.value)}
                  placeholder="e.g. Developed Next.js dashboard charts and updated CSS alignment rules..."
                  rows={4}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Hours Logged</label>
                <input
                  type="number"
                  value={hoursWorked}
                  onChange={e => setHoursWorked(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-50 text-white font-bold rounded-lg cursor-pointer transition-colors"
              >
                Log Today's Work
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Active Logs</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {trackerSubmissions.filter(t => t.studentId === currentUser.id || t.studentName === currentUser.name).length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center">No logs recorded for this student yet.</div>
              ) : (
                trackerSubmissions.filter(t => t.studentId === currentUser.id || t.studentName === currentUser.name).map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1 font-bold text-[10px] text-slate-400">
                      <span>{item.id}</span>
                      <span>{item.logDate}</span>
                    </div>
                    <p className="text-slate-700">{item.dailyProgress}</p>
                    <span className="text-[10px] text-indigo-600 font-bold block">{item.hoursWorked} hours logged</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
