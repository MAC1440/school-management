import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  BookOpen,
  GraduationCap,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types';
import { loginWithCredentials } from '../lib/api';

interface AuthScreenProps {
  allUsers: User[];
  onLoginSuccess: (user: User, token: string) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ allUsers = [], onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginWithCredentials({ email });
      localStorage.setItem('edupulse_jwt', res.token);
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: User) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithCredentials({ userId: user.id });
      localStorage.setItem('edupulse_jwt', res.token);
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roleBadgeStyle: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    principal: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    staff: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      
      {/* Back Button */}
      <div className="max-w-md mx-auto w-full mb-6">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Institutional Landing Page</span>
        </button>
      </div>

      <div className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Institutional Authentication</h1>
          <p className="text-xs text-slate-400">
            JWT Secured Access Control & Role Guards
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Custom Email Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                placeholder="e.g. s.jenkins@edupulse.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password / Token Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating & Generating JWT...' : 'Authenticate & Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Selector */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              One-Click Test Personas
            </span>
            <span className="text-[10px] text-blue-400 font-mono">Auto JWT Sign</span>
          </div>

          <div className="space-y-2">
            {(allUsers || []).map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                disabled={loading}
                className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${roleBadgeStyle[user.role]}`}>
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
