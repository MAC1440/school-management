import React from 'react';
import {
  GraduationCap,
  Users,
  Building2,
  Clock,
  FileSpreadsheet,
  Brain,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  School,
  ClipboardList,
} from 'lucide-react';
import { Branch, User } from '../types';

interface LandingPageProps {
  branches?: Branch[];
  onNavigate?: (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => void;
  onGoToAuth?: () => void;
  onGoToAdmission?: () => void;
  onGoToKiosk?: () => void;
  onGoToPortal?: (user?: User | null) => void;
  currentUser?: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  branches = [],
  onNavigate,
  onGoToAuth,
  onGoToAdmission,
  onGoToKiosk,
  onGoToPortal,
  currentUser,
}) => {
  const handleNav = (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'auth' && onGoToAuth) onGoToAuth();
      else if (view === 'admission' && onGoToAdmission) onGoToAdmission();
      else if (view === 'kiosk' && onGoToKiosk) onGoToKiosk();
      else if (view === 'portal' && onGoToPortal) onGoToPortal(currentUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-12 pb-20">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>EduPulse Institutional Management System</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
              Next-Generation School Operating System
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-base sm:text-xl max-w-2xl leading-relaxed">
              Multi-branch academic governance, PIN-verified staff kiosk attendance, automated payroll calculations, and real-time student performance analytics.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                id="landing-portal-login-btn"
                onClick={() => handleNav('auth')}
                className="px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
              >
                <span>Access Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="landing-admission-form-btn"
                onClick={() => handleNav('admission')}
                className="px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Online Student Admission</span>
              </button>

              <button
                id="landing-kiosk-btn"
                onClick={() => handleNav('kiosk')}
                className="px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Staff Attendance Kiosk</span>
              </button>
            </div>

            {/* Stat Counters Row */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl border-t border-slate-800/80">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-extrabold text-blue-400">2 Campuses</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Multi-Branch System</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-extrabold text-emerald-400">100% JWT Auth</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Robust Role Guards</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-extrabold text-purple-400">PIN Kiosk</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Instant Staff Check-In</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-extrabold text-amber-400">AI Powered</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Lesson & Insights Engine</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Core Capabilities</h2>
            <p className="text-3xl font-bold text-white mt-2">Engineered for Educational Excellence</p>
            <p className="text-slate-400 mt-2 text-sm">
              Unified control for school administrators, faculty teachers, enrolled students, and prospective applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Branch Administration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Manage branches, classrooms, capacity, staff payroll calculations based on working days, and approve pending student admissions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dedicated Kiosk Portal</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Branch-specific tablet kiosk interface allowing faculty and staff to check in daily using a secure 4-digit PIN code.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Teacher & Student Portals</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track topic coverage vs plans, calculate salary adjustments, view upcoming exams and papers, submit leave applications, and view GPA metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="py-16 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Our Network</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Academic Campuses</h2>
            </div>
            <button
              onClick={() => handleNav('admission')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(branches || []).map((b) => (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-blue-400 font-bold">{b.code}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      Active Campus
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{b.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{b.address}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Principal: <strong className="text-slate-200">{b.principalName}</strong></span>
                  <span>Contact: <strong className="text-slate-200">{b.phone}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Admission Callout */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Admissions Season Open
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Looking to Enroll Your Child?</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Submit an online admission form directly to our administration office. Your application will enter our digital admissions queue and receive instant status tracking.
              </p>
            </div>
            <button
              onClick={() => handleNav('admission')}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 whitespace-nowrap transition-all flex items-center gap-2"
            >
              <span>Fill Online Admission Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-300">EduPulse Academic OS</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleNav('kiosk')} className="hover:text-slate-300">Attendance Kiosk</button>
            <button onClick={() => handleNav('admission')} className="hover:text-slate-300">Online Admission</button>
            <button onClick={() => handleNav('auth')} className="hover:text-slate-300">Portal Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
