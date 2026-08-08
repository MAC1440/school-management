import React from 'react';
import { School, ArrowRight } from 'lucide-react';
import { Branch } from '../../types';

interface LandingCampusesProps {
  branches: Branch[];
  onNav: (view: 'landing' | 'auth' | 'admission' | 'kiosk' | 'portal') => void;
}

export const LandingCampuses: React.FC<LandingCampusesProps> = ({ branches, onNav }) => {
  return (
    <div className="py-16 bg-surface/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Network</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">Academic Campuses</h2>
          </div>
          <button
            onClick={() => onNav('admission')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(branches || []).map((b) => (
            <div key={b.id} className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 text-primary font-bold">{b.code}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-muted-foreground" />
                    Active Campus
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{b.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{b.address}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Principal: <strong className="text-foreground">{b.principalName}</strong></span>
                <span>Contact: <strong className="text-foreground">{b.phone}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
