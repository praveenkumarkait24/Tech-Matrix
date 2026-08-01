import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  Building, 
  ChevronDown,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Menu
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { 
    currentRole, 
    currentUser, 
    switchRole, 
    applications, 
    navigateTo, 
    openModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Application Under Mentor Review',
      message: 'PRAVEEN KUMAR K A (APP-2024-0842) submitted Vercel Inc offer letter.',
      time: '12 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Weekly Logbook Approved',
      message: 'Your Week #18 logs for CloudCore Systems were approved.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Official NOC Issued',
      message: 'Placement officer Ranjith Kumar issued your official NOC.',
      time: '2 hours ago',
      read: false
    }
  ]);

  const filteredApps = searchQuery.trim()
    ? applications.filter(a => 
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const rolesList: { role: UserRole; name: string; label: string; avatar: string }[] = [
    { role: 'student', name: 'PRAVEEN KUMAR K A', label: 'Student (IT Dept)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { role: 'mentor', name: 'Ragunath M', label: 'Academic Mentor (IT)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
    { role: 'hod', name: 'Dr. Selvakumar T', label: 'HOD (IT Dept)', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
    { role: 'placement', name: 'Ranjith Kumar', label: 'Placement Officer', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100' },
    { role: 'admin', name: 'Palanisamy', label: 'Overall System Admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { role: 'public', name: 'Login Screen', label: 'Authentication View', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100' }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar & Auto-Suggest */}
        <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications (e.g. APP-2024-0842, Vercel)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto p-2">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Matching Applications ({filteredApps.length})
            </div>
            {filteredApps.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">No matching applications or companies found.</div>
            ) : (
              filteredApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    navigateTo('application-detail', app.id);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 hover:bg-indigo-50/60 rounded-lg flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">{app.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">{app.companyName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{app.studentName} • {app.roleTitle}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
      </div>



      {/* Right Controls */}
      <div className="flex items-center gap-2">


        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 select-none">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(notif =>
                        notif.id === n.id ? { ...notif, read: true } : notif
                      ));
                    }}
                    className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      n.read ? 'hover:bg-slate-50 text-slate-400' : 'bg-indigo-50/50 border border-indigo-100 font-medium text-slate-800'
                    }`}
                  >
                    <p className="font-bold">{n.title}</p>
                    <p className="text-[11px] mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        {currentRole !== 'student' && (
          <button
            onClick={() => openModal('ai_assistant')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
