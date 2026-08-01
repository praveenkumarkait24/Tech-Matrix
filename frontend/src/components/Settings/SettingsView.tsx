import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, UserCheck, Bell, Database, Lock } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentRole, currentUser, switchRole } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Portal Settings & Configuration</h1>
        <p className="text-xs text-slate-500">Manage Persona Credentials, Audit Policies & System Preferences</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl uppercase ring-2 ring-indigo-500 shrink-0">
            {currentUser.name ? currentUser.name.charAt(0) : '?'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500">{currentUser.title} • {currentUser.department}</p>
            <span className="inline-block mt-1 bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded border border-indigo-200 uppercase">
              Role: {currentRole}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">System Status</h3>
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">University Academic Year:</span>
              <strong className="text-slate-900">2024 - 2025</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Gemini AI OCR Service:</span>
              <strong className="text-emerald-600">Operational</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Audit Ledger Protocol:</span>
              <strong className="text-indigo-600">SHA-256 Verified</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
