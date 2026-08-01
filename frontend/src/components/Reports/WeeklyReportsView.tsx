import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Clock, FileText, Send, PlusCircle } from 'lucide-react';

export const WeeklyReportsView: React.FC = () => {
  const { weeklyReports, addWeeklyReport, reviewWeeklyReport, currentRole, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [hours, setHours] = useState(40);
  const [weekNum, setWeekNum] = useState(19);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    addWeeklyReport({
      title,
      summary,
      hoursLogged: Number(hours),
      weekNumber: Number(weekNum),
      companyName: 'CloudCore Systems'
    });

    setTitle('');
    setSummary('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Weekly Internship Journals & Logbook</h1>
          <p className="text-xs text-slate-500">Track Weekly Activity, Hour Logs & Faculty Mentor Sign-offs</p>
        </div>
      </div>

      {currentRole === 'student' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Submit New Weekly Activity Journal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Week Number *</label>
                <input
                  type="number"
                  value={weekNum}
                  onChange={e => setWeekNum(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hours Worked This Week *</label>
                <input
                  type="number"
                  value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Focus Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Migration of UI Components to React 19"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Logbook Summary *</label>
              <textarea
                rows={3}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Describe key engineering deliverables, meetings attended, and technical accomplishments..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Weekly Journal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logbook List */}
      <div className="space-y-4">
        {weeklyReports
          .filter(rep => currentRole !== 'student' || rep.studentId === currentUser.id || rep.studentName === currentUser.name)
          .map(rep => (
          <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                  W#{rep.weekNumber}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rep.title}</h3>
                  <p className="text-xs text-slate-500">{rep.studentName} • {rep.companyName} ({rep.hoursLogged} Hours Logged)</p>
                </div>
              </div>

              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-center ${
                rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {rep.status}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {rep.summary}
            </p>

            {rep.mentorFeedback && (
              <div className="text-xs text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 italic">
                <strong>Mentor Feedback:</strong> "{rep.mentorFeedback}"
              </div>
            )}

            {currentRole !== 'student' && rep.status === 'Pending Review' && (
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => reviewWeeklyReport(rep.id, 'Revision Requested', undefined, 'Please elaborate on unit test coverage.')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => reviewWeeklyReport(rep.id, 'Approved', 9.8, 'Great work on component migration!')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Logbook</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
