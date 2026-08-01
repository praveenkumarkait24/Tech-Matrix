import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Building2, 
  FileCheck2, 
  LogOut,
  PlusCircle,
  Award,
  X,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    currentRole, 
    currentUser, 
    currentView, 
    navigateTo, 
    switchRole, 
    applications,
    weeklyReports,
    openModal 
  } = useApp();

  const handleNavClick = (viewId: string, appId?: string) => {
    navigateTo(viewId, appId);
    onClose();
  };

  const pendingCount = applications.filter(a => {
    if (currentRole === 'mentor') return a.stage === 'mentor_review';
    if (currentRole === 'hod') return a.stage === 'hod_review';
    if (currentRole === 'placement') return a.stage === 'placement_review';
    return false;
  }).length;

  const pendingReportsCount = weeklyReports.filter(r => r.status === 'Pending Review').length;

  const getNavItems = () => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'new-application', label: 'Apply Internship', icon: PlusCircle },
          { id: 'applications-list', label: 'My Applications', icon: FileText },
          { id: 'tracker', label: 'Internship Tracker', icon: Clock },
          { id: 'report-submission', label: 'Report Submission', icon: FileCheck2 },
          { id: 'reports', label: 'Weekly Journals', icon: Award }
        ];
      case 'mentor':
        return [
          { id: 'mentor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'applications-list', label: 'Assigned Students', icon: Users },
          { id: 'reports', label: 'Reports & Reviews', icon: Award, badge: pendingReportsCount > 0 ? `${pendingReportsCount}` : undefined, badgeColor: 'bg-amber-500 text-white' }
        ];
      case 'hod':
        return [
          { id: 'hod-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'applications-list', label: 'Department Students', icon: Users },
          { id: 'reports', label: 'Reports & Reviews', icon: Award }
        ];
      case 'placement':
        return [
          { id: 'placement-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'companies', label: 'Company Directory', icon: Building2 },
          { id: 'applications-list', label: 'Applications Queue', icon: FileText, badge: pendingCount > 0 ? `${pendingCount}` : undefined, badgeColor: 'bg-[#7c4dff] text-white' },
          { id: 'reports', label: 'Reports Directory', icon: Award }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'admin-users', label: 'User Management', icon: Users },
          { id: 'admin-departments', label: 'Department Management', icon: Building2 },
          { id: 'companies', label: 'Company Management', icon: Briefcase },
          { id: 'admin-audit-logs', label: 'Audit Logs', icon: FileText }
        ];
      default:
        return [];
    }
  };

  const filteredNavItems = getNavItems();

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-white text-slate-800 border-r border-slate-200/80 flex flex-col h-screen select-none transition-transform duration-300 z-50 
        lg:translate-x-0 lg:sticky lg:top-0 lg:flex shrink-0 shadow-2xs
        ${isOpen ? 'fixed inset-y-0 left-0 translate-x-0 shadow-xl' : 'fixed inset-y-0 left-0 -translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-9 h-9 rounded-xl bg-[#7D53F6] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 2.97 1.62 5.56 4 6.93V20c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-3.07c2.38-1.37 4-3.96 4-6.93 0-4.42-3.58-8-8-8zm-1.5 5h3v1.5h-3V7zm-2 2.5h1.5V11H8.5V9.5zm7 0H17V11h-1.5V9.5zm-5 3.5h5V13h-5v-1z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                Internship Tracker
              </h1>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Navigation List */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'applications-list' && (currentView === 'application-detail' || currentView === 'new-application'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-50 text-[#7c4dff] border border-purple-200/80 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7c4dff]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}


        </div>

        {/* Role Switcher & User Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">


          <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm tracking-wide shrink-0 uppercase ring-2 ring-purple-500/30">
              {currentUser?.name ? currentUser.name.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || 'Loading...'}</h2>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.title || ''}</p>
            </div>
            <button
              onClick={() => {
                switchRole('public');
                onClose();
              }}
              title="Switch Portal Role or Sign Out"
              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
