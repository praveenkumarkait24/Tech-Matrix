import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, PlusCircle, ChevronRight, Eye, ShieldCheck, Building2 } from 'lucide-react';

export const getStageBadge = (stage: string) => {
  switch (stage) {
    case 'approved':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-emerald-600">✓ Fully Approved</span>;
    case 'mentor_review':
    case 'submitted':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-amber-600">Awaiting Mentor</span>;
    case 'hod_review':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-blue-600">Mentor Approved</span>;
    case 'placement_review':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-purple-600">HOD Approved</span>;
    case 'changes_requested':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-orange-600">Revision Requested</span>;
    case 'rejected':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-rose-600">Rejected</span>;
    case 'mentor_rejected':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-rose-700">Mentor Rejected</span>;
    case 'hod_rejected':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-red-700">HOD Rejected</span>;
    case 'placed_rejected':
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-red-800">Placement Rejected</span>;
    default:
      return <span className="text-[10px] font-bold px-3 py-1 rounded-full text-white bg-indigo-600">{stage}</span>;
  }
};

export const ApplicationsListView: React.FC = () => {
  const { applications, navigateTo, currentRole, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredApps = applications.filter(app => {
    // If student role, restrict view strictly to their own applications
    if (currentRole === 'student') {
      const isMine = app.studentId === currentUser.id || 
                     (currentUser.email && app.studentEmail === currentUser.email) ||
                     (currentUser.name && app.studentName === currentUser.name);
      if (!isMine) return false;
    }

    const matchesSearch = 
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStage = stageFilter === 'all' || app.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">All Internship Applications</h1>
          <p className="text-xs text-slate-500">Central Ledger of University Internship Submissions</p>
        </div>

        {currentRole === 'student' && (
          <button
            onClick={() => navigateTo('new-application')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Application</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student, company, ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 text-slate-700 font-semibold"
          >
            <option value="all">All Stages</option>
            <option value="mentor_review">Under Mentor Review</option>
            <option value="hod_review">Under HOD Review</option>
            <option value="placement_review">Under Placement Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>APP ID</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>STUDENT NAME</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>COMPANY & ROLE</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>WORK MODE</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>STIPEND</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>APPROVAL STAGE</span>
                    <Filter className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredApps.map(app => (
                <tr 
                  key={app.id} 
                  onClick={() => navigateTo('application-detail', app.id)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                    <span>{app.id}</span>
                  </td>

                  <td className="p-4 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {app.studentName ? app.studentName.charAt(0) : '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{app.studentName}</div>
                        <div className="text-[10px] text-slate-400">{app.department}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900">{app.companyName}</div>
                    <div className="text-[10px] text-slate-500">{app.roleTitle}</div>
                  </td>

                  <td className="p-4">
                    <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {app.workMode}
                    </span>
                  </td>

                  <td className="p-4 font-extrabold text-slate-800">
                    ${app.stipendAmount}/mo
                  </td>

                  <td className="p-4">
                    {getStageBadge(app.stage)}
                  </td>

                  <td className="p-4 text-right">
                    <button className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
