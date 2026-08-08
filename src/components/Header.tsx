import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  BookOpen,
  UserCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Bell,
  CheckCircle2,
  Home,
  FileSpreadsheet,
  Clock,
  LogOut,
} from 'lucide-react';
import { User, Role } from '../types';

interface HeaderProps {
  currentUser: User | null;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  onResetData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateView: (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => void;
  currentView: string;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers = [],
  onSelectUser,
  onLogout,
  onResetData,
  activeTab,
  setActiveTab,
  onNavigateView,
  currentView,
  isResetting,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const roleIcons: Record<string, React.ReactNode> = {
    admin: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
    principal: <Building2 className="w-3.5 h-3.5 text-amber-600" />,
    teacher: <BookOpen className="w-3.5 h-3.5 text-blue-600" />,
    student: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
    staff: <UserCheck className="w-3.5 h-3.5 text-slate-600" />,
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    principal: 'bg-amber-100 text-amber-800 border-amber-200',
    teacher: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    staff: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigateView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">EduPulse</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  School OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Institutional Governance</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onNavigateView('landing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'landing'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigateView('admission')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'admission'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admission</span>
            </button>

            <button
              onClick={() => onNavigateView('kiosk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'kiosk'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Kiosk Terminal</span>
            </button>

            {currentUser && currentView === 'portal' && (
              <>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Timetable
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'announcements'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Announcements
                </button>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            
            {/* Database Reset */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset shared database to default seed state"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1 text-xs font-medium border border-slate-800"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-blue-400' : ''}`} />
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            {currentUser ? (
              /* User Profile & Persona Switcher */
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white leading-none">
                        {currentUser.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span
                        className={`inline-flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.2 rounded border capitalize ${
                          roleColors[currentUser.role] || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {roleIcons[currentUser.role]}
                        <span>{currentUser.role}</span>
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Active Account / Persona
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Select account to test role permissions
                      </p>
                    </div>

                    <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                      {(allUsers || []).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSelectUser(u);
                            setShowRoleDropdown(false);
                            onNavigateView('portal');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="text-xs font-bold leading-snug">{u.name}</p>
                              <p className="text-[10px] text-slate-400">{u.email}</p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                              roleColors[u.role] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 mt-2">
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out (Clear JWT)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login CTA when not logged in */
              <button
                onClick={() => onNavigateView('auth')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
              >
                Sign In
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
