import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, PlusCircle, ExternalLink, Users, Award, Star } from 'lucide-react';

export const PartnerCompaniesView: React.FC = () => {
  const { partnerCompanies, openModal } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Corporate Partner Companies</h1>
          <p className="text-xs text-slate-500">Verified Corporate Recruitment Partners & Hiring Statistics</p>
        </div>

        <button
          onClick={() => openModal('new_partner')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Corporate Partner</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnerCompanies.map(comp => (
          <div key={comp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 bg-white" />
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                {comp.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{comp.industry}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Interns</span>
                <span className="font-bold text-slate-800">{comp.activeInternsCount} Students</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Average Stipend</span>
                <span className="font-bold text-emerald-600">{comp.avgStipend}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
              <span>Recruiter: <strong className="text-slate-800">{comp.contactPerson}</strong></span>
              <a href={comp.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold">
                Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
