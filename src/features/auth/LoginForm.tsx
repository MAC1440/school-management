import React, { useState } from 'react';
import { Mail, Key, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  loading: boolean;
  onSubmit: (email: string, password?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loading, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="email"
            placeholder="e.g. s.jenkins@edupulse.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
          Password / Token Key
        </label>
        <div className="relative">
          <Key className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
      >
        {loading ? 'Authenticating & Generating JWT...' : 'Authenticate & Sign In'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
