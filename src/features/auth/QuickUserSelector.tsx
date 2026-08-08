import React from 'react';
import { User } from '../../types';

interface QuickUserSelectorProps {
  allUsers: User[];
  loading: boolean;
  onQuickLogin: (user: User) => void;
  roleBadgeStyle: Record<string, string>;
}

export const QuickUserSelector: React.FC<QuickUserSelectorProps> = ({
  allUsers,
  loading,
  onQuickLogin,
  roleBadgeStyle,
}) => {
  return (
    <div className="pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          One-Click Test Personas
        </span>
        <span className="text-[10px] text-primary font-mono">Auto JWT Sign</span>
      </div>

      <div className="space-y-2">
        {(allUsers || []).map((user) => (
          <button
            key={user.id}
            onClick={() => onQuickLogin(user)}
            disabled={loading}
            className="w-full p-2.5 rounded-xl bg-surface hover:bg-surface-2 border border-border transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-border group-hover:border-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${roleBadgeStyle[user.role] || 'bg-surface-2 text-foreground border-border'}`}>
              {user.role}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
