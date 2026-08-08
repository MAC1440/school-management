import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LandingFooterProps {
  onNav: (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNav }) => {
  return (
    <footer className="border-t border-border bg-sidebar py-8 text-xs text-sidebar-foreground/80 text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sidebar-foreground">EduPulse Academic OS</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onNav('kiosk')} className="hover:text-sidebar-foreground transition-colors">Attendance Kiosk</button>
          <button onClick={() => onNav('admission')} className="hover:text-sidebar-foreground transition-colors">Online Admission</button>
          <button onClick={() => onNav('auth')} className="hover:text-sidebar-foreground transition-colors">Portal Login</button>
        </div>
      </div>
    </footer>
  );
};
