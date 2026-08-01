import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, PlusCircle } from 'lucide-react';

export const NewPartnerModal: React.FC = () => {
  const { activeModal, closeModal, addPartnerCompany } = useApp();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [website, setWebsite] = useState('');
  const [avgStipend, setAvgStipend] = useState('$2,500/mo');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (activeModal !== 'new_partner') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPartnerCompany({
      name,
      industry,
      website: website || 'https://company.com',
      avgStipend,
      contactPerson,
      contactEmail,
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',
      activeInternsCount: 0,
      totalHiredCount: 0,
      status: 'Verified Partner'
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Add Corporate Partner
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Google Cloud, NVIDIA"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. AI & Cloud Infrastructure"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Website</label>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://company.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Recruiter Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              placeholder="e.g. Sarah Parker (University Hiring Manager)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-md cursor-pointer"
            >
              Add Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
