import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building, 
  UserCog,
  ShieldCheck,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

export const LandingPage: React.FC = () => {
  const { loginAsUser, usersList, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const rolePasswords: Record<UserRole, string> = {
    student: 'student',
    mentor: 'mentor',
    hod: 'hod',
    placement: 'placement',
    admin: 'admin',
    public: 'public'
  };

  // Filter users by selected role
  const availableUsers = usersList.filter(u => u.role === role);

  useEffect(() => {
    if (availableUsers.length > 0) {
      const defaultUser = availableUsers[0];
      setSelectedUserId(defaultUser.id);
      setEmail(defaultUser.email || defaultUser.studentId || '');
    } else {
      setSelectedUserId('');
      setEmail('');
    }
  }, [role, usersList]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const target = usersList.find(u => u.id === userId);
    if (target) {
      setEmail(target.email || target.studentId || '');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Login Failed', 'Please select or enter your email / Student ID.', 'error');
      return;
    }

    // Strict validation: Only users in the admin portal system can log in
    const inputClean = email.trim().toLowerCase();
    const matchedUser = usersList.find(u => 
      u.role === role && (
        (u.email && u.email.toLowerCase() === inputClean) ||
        (u.studentId && u.studentId.toLowerCase() === inputClean) ||
        (u.id && u.id.toLowerCase() === inputClean) ||
        (u.name && u.name.toLowerCase() === inputClean)
      )
    ) || usersList.find(u => u.id === selectedUserId);

    if (!matchedUser) {
      showToast('Access Denied', 'This account is not registered in the System Admin directory. Only Admin-approved users can log in.', 'error');
      return;
    }

    const expectedPassword = rolePasswords[role];
    if (password.trim() && password.trim() !== expectedPassword) {
      showToast('Incorrect Password', `Invalid password for ${matchedUser.name}. Default password is "${expectedPassword}".`, 'error');
      return;
    }

    loginAsUser(matchedUser);
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[460px]">
        {/* Main Login Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/80 space-y-5">
          
          {/* Logo & Portal Name */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7D53F6] text-white flex items-center justify-center shadow-md shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 2.97 1.62 5.56 4 6.93V20c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-3.07c2.38-1.37 4-3.96 4-6.93 0-4.42-3.58-8-8-8zm-1.5 5h3v1.5h-3V7zm-2 2.5h1.5V11H8.5V9.5zm7 0H17V11h-1.5V9.5zm-5 3.5h5V13h-5v-1z"/>
              </svg>
            </div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Internship Tracker
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-1">
            <h2 className="text-[#7c4dff] font-bold text-base sm:text-lg tracking-tight">
              Individual User Authentication
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Only Admin-registered student & staff profiles can access the portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Select Portal Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#f0f3f8] border border-slate-200/80 focus:bg-white focus:border-[#7c4dff] focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="student">Student Portal (Individual Logins)</option>
                <option value="mentor">Academic Mentor Portal</option>
                <option value="hod">HOD Office Portal</option>
                <option value="placement">Placement Cell Portal</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            {/* Select Registered Account */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 block">Registered User Identity</label>
                <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Verified
                </span>
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="w-full bg-[#f0f3f8] border border-slate-200/80 focus:bg-white focus:border-[#7c4dff] focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none transition-all cursor-pointer font-semibold text-purple-900"
              >
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.studentId ? `(${u.studentId})` : u.title ? `(${u.title})` : ''} - {u.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Username / Email input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Email or Student ID</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or Student ID"
                  className="w-full bg-[#f0f3f8] border border-slate-200/80 focus:bg-white focus:border-[#7c4dff] focus:ring-2 focus:ring-purple-100 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 block">Password</label>
                <span className="text-[10px] text-slate-400 font-medium">Default: <code className="text-[#7D53F6] font-bold">{rolePasswords[role]}</code></span>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Enter password (${rolePasswords[role]})`}
                  className="w-full bg-[#f0f3f8] border border-slate-200/80 focus:bg-white focus:border-[#7c4dff] focus:ring-2 focus:ring-purple-100 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7c4dff] hover:bg-[#6b3bf0] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer mt-1"
            >
              Sign In to {role.toUpperCase()} Portal
            </button>
          </form>

          {/* Registered Students Grid Quick Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Admin Directory Profiles ({availableUsers.length})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {availableUsers.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(item.id);
                    setEmail(item.email || item.studentId || '');
                    loginAsUser(item);
                  }}
                  className={`p-2.5 border rounded-xl flex items-center gap-2.5 text-left group cursor-pointer transition-all ${
                    selectedUserId === item.id 
                      ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100' 
                      : 'bg-[#f8fafc] hover:bg-purple-50/50 border-slate-200/80 hover:border-purple-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-white shadow-2xs">
                    {item.name ? item.name.charAt(0) : '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-800 truncate leading-tight group-hover:text-purple-700">
                      {item.name}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {item.studentId || item.title || item.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

