import React from 'react';
import { Building2, Clock, GraduationCap, ClipboardList, ArrowRight } from 'lucide-react';
import { Branch, User } from '../../types';
import { LandingHero } from './LandingHero';
import { LandingCampuses } from './LandingCampuses';
import { LandingFooter } from './LandingFooter';

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingHero onNav={handleNav} />

      {/* Feature Highlights */}
      <div className="py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Core Capabilities</h2>
            <p className="text-3xl font-bold text-foreground mt-2">Engineered for Educational Excellence</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Unified control for school administrators, faculty teachers, enrolled students, and prospective applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Multi-Branch Administration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Manage branches, classrooms, capacity, staff payroll calculations based on working days, and approve pending student admissions.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-foreground mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Dedicated Kiosk Portal</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Branch-specific tablet kiosk interface allowing faculty and staff to check in daily using a secure 4-digit PIN code.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-emerald-500/50 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Teacher & Student Portals</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Track topic coverage vs plans, calculate salary adjustments, view upcoming exams and papers, submit leave applications, and view GPA metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      <LandingCampuses branches={branches} onNav={handleNav} />

      {/* Online Admission Callout */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-2 border border-border rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Admissions Season Open
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Looking to Enroll Your Child?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submit an online admission form directly to our administration office. Your application will enter our digital admissions queue and receive instant status tracking.
              </p>
            </div>
            <button
              onClick={() => handleNav('admission')}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md whitespace-nowrap transition-all flex items-center gap-2"
            >
              <span>Fill Online Admission Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <LandingFooter onNav={handleNav} />
    </div>
  );
};
