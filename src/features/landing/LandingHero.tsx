import React from 'react';
import { Sparkles, ArrowRight, FileSpreadsheet, Clock } from 'lucide-react';

interface LandingHeroProps {
  onNav: (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNav }) => {
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-background to-background pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>EduPulse Institutional Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight">
            Next-Generation School Operating System
          </h1>

          <p className="text-muted-foreground text-base sm:text-xl max-w-2xl leading-relaxed">
            Multi-branch academic governance, PIN-verified staff kiosk attendance, automated payroll calculations, and real-time student performance analytics.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              id="landing-portal-login-btn"
              onClick={() => onNav('auth')}
              className="px-6 py-3.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <span>Access Management Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-admission-form-btn"
              onClick={() => onNav('admission')}
              className="px-6 py-3.5 rounded-lg bg-surface hover:bg-surface-2 text-foreground border border-border font-semibold text-sm transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-secondary-foreground" />
              <span>Online Student Admission</span>
            </button>

            <button
              id="landing-kiosk-btn"
              onClick={() => onNav('kiosk')}
              className="px-6 py-3.5 rounded-lg bg-surface hover:bg-surface-2 text-foreground border border-border font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Staff Attendance Kiosk</span>
            </button>
          </div>

          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl border-t border-border">
            <div className="p-4 bg-surface/80 rounded-xl border border-border text-center">
              <div className="text-2xl font-extrabold text-primary">2 Campuses</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Multi-Branch System</div>
            </div>
            <div className="p-4 bg-surface/80 rounded-xl border border-border text-center">
              <div className="text-2xl font-extrabold text-emerald-600">100% JWT Auth</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Robust Role Guards</div>
            </div>
            <div className="p-4 bg-surface/80 rounded-xl border border-border text-center">
              <div className="text-2xl font-extrabold text-purple-600">PIN Kiosk</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Instant Staff Check-In</div>
            </div>
            <div className="p-4 bg-surface/80 rounded-xl border border-border text-center">
              <div className="text-2xl font-extrabold text-amber-600">Modular Architecture</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">RTK Query + Features</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
